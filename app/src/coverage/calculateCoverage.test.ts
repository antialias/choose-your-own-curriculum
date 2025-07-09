import { describe, it, expect, vi } from "vitest";
import { calculateCoverage } from './calculateCoverage';
import type { Graph } from '@/graphSchema';

vi.mock('@/db', () => {
  const rows = [
    { id: 'w1', masteryPercent: 100 },
    { id: 'w2', masteryPercent: 50 },
  ];
  const from = vi.fn(() => ({ where: vi.fn().mockResolvedValue(rows) }));
  const select = vi.fn(() => ({ from }));
  const db = { select };
  const sqlite = {
    prepare: vi.fn(() => ({ get: vi.fn((t:string) => ({ id: t })) })),
    transaction: vi.fn(() => vi.fn()),
  };
  return { getDb: () => db, getSqlite: () => sqlite };
});

vi.mock('@/db/embeddings', () => ({
  getWorkVector: vi.fn((id: string) => (id === 'w1' ? [1,0] : [0,1])),
  getTagVector: vi.fn((id: string) =>
    id === 'a' ? [1,0] : id === 'b' ? [0,1] : [1,1]
  ),
}));

describe('calculateCoverage', () => {
  it('computes coverage from work vectors', async () => {
    const graph: Graph = {
      nodes: [
        { id: 'n1', label: 'N1', desc: '', tags: ['a'], prereq: [] },
        { id: 'n2', label: 'N2', desc: '', tags: ['b', 'c'], prereq: [] },
      ],
      edges: [],
    };
    const coverage = await calculateCoverage('s1', graph);
    expect(coverage.n1).toBe(100);
    expect(coverage.n2).toBe(50);
  });
});
