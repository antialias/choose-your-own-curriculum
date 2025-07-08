import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { LLMClient } from '@/llm/client';
import { GraphSchema } from '@/graphSchema';

const bodySchema = z.object({ topics: z.array(z.string()) });

export async function POST(req: NextRequest) {
  const json = await req.json();
  const { topics } = bodySchema.parse(json);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('OPENAI_API_KEY environment variable is not defined');
  } else {
    console.log('OPENAI_API_KEY loaded');
  }
  const client = new LLMClient(apiKey || '');
  const schema = z.object({ graph: GraphSchema });
  const prompt = `Create a topic dependency graph flowing from left to right starting at kindergarten math and covering these topics: ${topics.join(', ')}. Use granular nodes and include prerequisite links.`;
  const stream = await client.streamChat(prompt, {
    systemPrompt: 'You are an expert math curriculum planner.',
    schema,
    stream: true,
    params: { model: 'o4-mini', max_tokens: 800 },
  });
  return new NextResponse(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
