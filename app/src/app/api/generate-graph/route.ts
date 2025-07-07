import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import mermaid from 'mermaid';
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
  const schema = z.object({
    graph: z.string().optional(),
    errorReason: z.string().optional(),
  });
  const prompt = `Create a mermaid DAG showing a progression from kindergarten math to these topics: ${topics.join(', ')}. Include prerequisite links.`;
  const result = await client.chat(prompt, {
    systemPrompt: 'You are an expert math curriculum planner.',
    schema,
  });

  if (result.error || !result.response) {
    console.error('LLM chat failed', result.error);
    return NextResponse.json(
      { error: result.error?.message || 'error' },
      { status: 500 },
    );
  }

  const { graph, errorReason } = result.response;
  if (errorReason) {
    return NextResponse.json({ error: errorReason }, { status: 400 });
  }
  if (!graph) {
    return NextResponse.json({ error: 'No graph provided' }, { status: 400 });
  }

  try {
    mermaid.parse(graph);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Invalid mermaid code';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ graph });
}
