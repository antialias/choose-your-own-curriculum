# LLM Client

This directory contains a lightweight wrapper around the OpenAI chat API. The client interpolates variables in the system and user prompts, enforces that responses conform to a Zod schema and automatically retries on validation errors.

## Usage

```ts
import { z } from 'zod';
import { LLMClient } from './client';

const client = new LLMClient(process.env.OPENAI_API_KEY!);

const schema = z.object({
  message: z.string(),
});

const result = await client.chat('Say hello to {{name}}', {
  schema,
  systemPrompt: 'You are a helpful assistant.',
  templateVars: { name: 'Ada' },
});

if (result.error) {
  console.error(result.error);
} else {
  console.log(result.response);
}
```

The client will try up to `maxRetries` times (default `3`) when the model returns output that cannot be parsed with the provided schema. On each retry it explains the validation error to the model via a system message.

By default, the client sends requests using the `o4-mini` model. You can override
the model and other OpenAI parameters via the `params` option passed to `chat`.
