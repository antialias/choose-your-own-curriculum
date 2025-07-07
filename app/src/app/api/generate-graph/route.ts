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
  const schema = z.object({ graph: z.string() });
  const prompt = `Create a mermaid DAG showing a progression from kindergarten math to these topics: ${topics.join(', ')}. Include prerequisite links.`;
  const result = await client.chat(prompt, {
    systemPrompt: 'You are an expert math curriculum planner.',
    schema,
  });
  if (result.error || !result.response) {
    console.error('LLM chat failed', result.error);
    return NextResponse.json({ error: result.error?.message || 'error' }, { status: 500 });
  }
  return NextResponse.json({ graph: result.response.graph });
}
