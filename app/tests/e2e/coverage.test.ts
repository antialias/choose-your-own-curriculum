import { describe, it, expect, vi, type Mock } from 'vitest';
import { GET as getCoverage } from '@/app/api/students/[id]/coverage/route';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

vi.mock('next-auth', () => ({ getServerSession: vi.fn() }));
vi.mock('@/authOptions', () => ({ authOptions: {} }));
vi.mock('@/coverage/calculateCoverage', () => ({
  calculateCoverage: vi.fn().mockResolvedValue({ n1: 75 })
}));
vi.mock('@/db', () => {
  const where = vi.fn().mockResolvedValue([
    { topicDagId: 'd1', graph: JSON.stringify({ nodes: [], edges: [] }) }
  ]);
  const leftJoin = vi.fn(() => ({ where }));
  const innerJoin = vi.fn(() => ({ leftJoin }));
  const from = vi.fn(() => ({ innerJoin, leftJoin, where }));
  const select = vi.fn(() => ({ from }));
  const db = { select };
  const sqlite = { prepare: vi.fn(), transaction: vi.fn() };
  return { getDb: () => db, getSqlite: () => sqlite };
});

describe('student coverage API', () => {
  it('requires authentication', async () => {
    (getServerSession as unknown as Mock).mockResolvedValue(null);
    const req = new NextRequest(new Request('http://localhost'));
    const res = await getCoverage(req, { params: Promise.resolve({ id: 's1' }) });
    expect(res.status).toBe(401);
  });

  it('returns coverage data', async () => {
    (getServerSession as unknown as Mock).mockResolvedValue({ user: { id: 't1' } });
    const req = new NextRequest(new Request('http://localhost'));
    const res = await getCoverage(req, { params: Promise.resolve({ id: 's1' }) });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.coverage.n1).toBe(75);
  });
});
