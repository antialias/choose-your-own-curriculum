import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as generateGraph } from '@/app/api/generate-graph/route';

vi.mock('@/llm/client', () => {
  return {
    LLMClient: vi.fn().mockImplementation(() => ({
      chat: vi.fn(async () => ({
        error: null,
        response: { graph: { nodes: [{ id: 'a', label: 'A', desc: '', tags: ['t1', 't2', 't3'] }], edges: [] } }
      }))
    }))
  };
});

describe('generate-graph API', () => {
  it('returns graph json', async () => {
    const req = new NextRequest(new Request('http://localhost/api/generate-graph', {
      method: 'POST',
      body: JSON.stringify({ topics: ['algebra'] }),
      headers: { 'content-type': 'application/json' }
    }));
    const res = await generateGraph(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.graph.nodes[0].id).toBe('a');
  });
});
