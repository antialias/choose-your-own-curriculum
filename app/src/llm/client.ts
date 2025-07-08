/**
 * Wrapper around the OpenAI chat API that enforces JSON schema validation on
 * the model's response. It retries failed validations and surfaces errors in a
 * consistent structure.
 */
import { OpenAI } from 'openai';
import { ZodSchema, ZodError } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

/** Default model used when none is provided */
const DEFAULT_MODEL = 'o4-mini';

/**
 * An error returned by the LLM client.
 * - `openai_error` indicates the request to the API failed.
 * - `validation_error` indicates the response did not match the schema.
 */
export type LLMError =
  | { type: 'openai_error'; message: string }
  | { type: 'validation_error'; message: string };

/**
 * Options used when sending a chat request.
 */
export interface LLMOptions<T> {
  /** Zod schema that the response must satisfy. */
  schema: ZodSchema<T>;
  /** Base system prompt. Template variables are interpolated. */
  systemPrompt: string;
  /** Variables available in both system and user prompts. */
  templateVars?: Record<string, string | number>;
  /** Number of validation retries. Defaults to 3. */
  maxRetries?: number;
  /** Additional OpenAI parameters. */
  params?: Omit<OpenAI.Chat.ChatCompletionCreateParams, 'messages'>;
}

/**
 * The resolved value returned by the client.
 */
export interface LLMResponse<T> {
  /** Error information when the request fails. */
  error: LLMError | null;
  /** Parsed response if successful. */
  response: T | null;
}

/**
 * Client instance used to send chat prompts to an OpenAI-compatible endpoint.
 */
export class LLMClient {
  private openai: OpenAI;

  /**
   * @param apiKey - API key used to authenticate with OpenAI.
   */
  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
    console.log('LLMClient initialized');
  }

  /**
   * Stream a chat completion and return a readable stream of tokens.
   *
   * @param prompt - The user prompt to send to the model.
   * @param options - Prompt details and OpenAI params.
   * @returns A ReadableStream of text tokens.
   */
  async streamChat(
    prompt: string,
    options: Omit<LLMOptions<unknown>, 'schema' | 'maxRetries'>,
  ): Promise<ReadableStream> {
    const { systemPrompt, templateVars = {}, params } = options;
    const interpolatedSystem = this.interpolate(systemPrompt, templateVars);
    const userPrompt = this.interpolate(prompt, templateVars);
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: interpolatedSystem },
      { role: 'user', content: userPrompt },
    ];
    const paramsWithModel = {
      ...(params ?? {}),
      model: params?.model ?? DEFAULT_MODEL,
    } as Omit<OpenAI.Chat.ChatCompletionCreateParams, 'messages'>;
    const stream = await this.openai.chat.completions.create({
      ...paramsWithModel,
      stream: true,
      messages,
    });
    const encoder = new TextEncoder();
    return new ReadableStream({
      async start(controller) {
        for await (const chunk of stream as AsyncIterable<{ choices: { delta?: { content?: string } }[] }>) {
          const token = chunk.choices?.[0]?.delta?.content;
          if (token) controller.enqueue(encoder.encode(token));
        }
        controller.close();
      },
      cancel() {
        stream.controller.abort();
      },
    });
  }

  /**
   * Replace `{{var}}` tokens in a template string.
   *
   * @param template - The template containing placeholders.
   * @param vars - Key/value pairs used for interpolation.
   * @returns The interpolated string.
   */
  private interpolate(template: string, vars: Record<string, string | number> = {}): string {
    return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
      const value = vars[key.trim()];
      return value !== undefined ? String(value) : '';
    });
  }

  /**
   * Send a chat prompt and validate the model's response.
   *
   * @param prompt - The user prompt to send to the model.
   * @param options - Options describing the schema and prompt details.
   * @returns The parsed response or an error.
   */
  async chat<T>(prompt: string, options: LLMOptions<T>): Promise<LLMResponse<T>> {
    const { schema, systemPrompt, templateVars = {}, maxRetries = 3, params } = options;
    const jsonSchema = JSON.stringify(zodToJsonSchema(schema), null, 2);
    const interpolatedSystem = this.interpolate(systemPrompt, templateVars);
    const systemTemplate = `${interpolatedSystem}\nRespond ONLY with JSON that matches this schema:\n${jsonSchema}`;
    const userPrompt = this.interpolate(prompt, templateVars);

    let lastError: LLMError | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      console.log(`Sending chat prompt (attempt ${attempt + 1})`);
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemTemplate },
        { role: 'user', content: userPrompt },
      ];
      if (lastError && lastError.type === 'validation_error') {
        messages.push({
          role: 'system',
          content: `Retry #${attempt + 1} because previous response failed validation: ${lastError.message}`,
        });
      }
      try {
        const paramsWithModel = {
          ...(params ?? {}),
          model: params?.model ?? DEFAULT_MODEL,
        } as Omit<OpenAI.Chat.ChatCompletionCreateParams, 'messages'>;
        const result = await this.openai.chat.completions.create({
          ...paramsWithModel,
          stream: false,
          messages,
        });
        const completion = result as OpenAI.Chat.ChatCompletion;
        const raw = completion.choices[0]?.message?.content ?? '';
        const content = raw.trim();
        try {
          let parsed: unknown;
          try {
            parsed = JSON.parse(content);
          } catch (err) {
            const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
            if (match) {
              parsed = JSON.parse(match[1]);
            } else {
              throw err;
            }
          }
          const data = schema.parse(parsed);
          return { error: null, response: data };
        } catch (e) {
          if (e instanceof SyntaxError) {
            console.error('Invalid JSON returned from LLM', e);
            lastError = {
              type: 'validation_error',
              message: `Invalid JSON: ${e.message}`,
            };
          } else if (e instanceof ZodError) {
            console.error('LLM response failed schema validation', e);
            lastError = {
              type: 'validation_error',
              message: e.errors.map(err => err.message).join(', '),
            };
          } else {
            lastError = { type: 'validation_error', message: 'Unknown validation error' };
          }
        }
      } catch (err: unknown) {
        const message =
          typeof err === 'object' && err && 'message' in err
            ? String((err as { message?: unknown }).message)
            : 'Unknown OpenAI error';
        console.error('OpenAI request failed', err);
        lastError = {
          type: 'openai_error',
          message,
        };
        break;
      }
    }
    return { error: lastError, response: null };
  }
}
