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
    systemPrompt:
      'You are an expert math curriculum planner. Return a JSON object with a "graph" field containing mermaid code or an "errorReason" explaining why a graph cannot be produced.',
    schema,
  });
  if (result.error || !result.response) {
    console.error('LLM chat failed', result.error);
    return NextResponse.json({ error: result.error?.message || 'error' }, { status: 500 });
  }
  const { graph, errorReason } = result.response;
  if (errorReason) {
    console.error('LLM returned error reason', errorReason);
    return NextResponse.json({ error: errorReason }, { status: 400 });
  }
  if (!graph) {
    return NextResponse.json({ error: 'No graph returned' }, { status: 500 });
  }
  try {
    mermaid.parse(graph);
  } catch (err: unknown) {
    const message =
      typeof err === 'object' && err && 'str' in err
        ? String((err as { str?: unknown }).str)
        : String(err);
    console.error('Invalid mermaid code', message);
    return NextResponse.json({ error: `Invalid mermaid diagram: ${message}` }, { status: 400 });
  }
  return NextResponse.json({ graph });
}
