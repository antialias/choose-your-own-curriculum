import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat';

const bodySchema = z.object({ topics: z.array(z.string()) });

export async function POST(req: NextRequest) {
  const json = await req.json();
  const { topics } = bodySchema.parse(json);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('OPENAI_API_KEY environment variable is not defined');
    return NextResponse.json({ error: 'missing api key' }, { status: 500 });
  }
  const openai = new OpenAI({ apiKey });
  const messages: ChatCompletionMessageParam[] = [
    { role: 'system', content: 'You are an expert math curriculum planner.' },
    {
      role: 'user',
      content: `Create a mermaid DAG flowing from left to right showing a progression from kindergarten math to these topics: ${topics.join(', ')}. The diagram should be as granular as possible by topic and include prerequisite links. Respond only with valid mermaid code.`,
    },
  ];
  const completion = await openai.chat.completions.create({
    model: 'o4-mini',
    stream: true,
    messages,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for await (const chunk of completion) {
        const token = chunk.choices[0]?.delta?.content;
        if (token) {
          controller.enqueue(encoder.encode(token));
        }
      }
      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
