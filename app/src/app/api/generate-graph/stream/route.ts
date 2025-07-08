import { NextRequest } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const bodySchema = z.object({ topics: z.array(z.string()) });

export async function POST(req: NextRequest) {
  const json = await req.json();
  const { topics } = bodySchema.parse(json);
  const apiKey = process.env.OPENAI_API_KEY || '';
  const openai = new OpenAI({ apiKey });
  const messages: ChatCompletionMessageParam[] = [
    { role: 'system', content: 'You are an expert math curriculum planner.' },
    {
      role: 'user',
      content: `Create a valid mermaid DAG in flowchart LR style starting from kindergarten math and covering these topics: ${topics.join(
        ', '
      )}. Include prerequisite links and respond only with the diagram.`,
    },
  ];
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    stream: true,
  });
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const part of stream) {
        const text = part.choices[0]?.delta?.content;
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });
  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
