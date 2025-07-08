import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as generateGraph } from '@/app/api/generate-graph/route';

vi.mock('@/llm/client', () => {
  return {
    LLMClient: vi.fn().mockImplementation(() => ({
      streamChat: vi.fn(
        async () =>
          new ReadableStream({
            start(controller) {
              controller.enqueue(new TextEncoder().encode('test-graph'));
              controller.close();
            },
          }),
      ),
    })),
  };
});

describe('generate-graph API', () => {
  it('returns graph text', async () => {
    const req = new NextRequest(new Request('http://localhost/api/generate-graph', {
      method: 'POST',
      body: JSON.stringify({ topics: ['algebra'] }),
      headers: { 'content-type': 'application/json' }
    }));
    const res = await generateGraph(req);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toBe('test-graph');
  });
});
