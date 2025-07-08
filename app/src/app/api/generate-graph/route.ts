import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { LLMClient } from '@/llm/client';

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
  const prompt = `Create a mermaid DAG flowing from left to right showing a progression from kindergarten math to these topics: ${topics.join(', ')}. Respond only with valid mermaid code.`;
  const stream = await client.streamChat(prompt, {
    systemPrompt: 'You are an expert math curriculum planner.',
  });
  return new NextResponse(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
