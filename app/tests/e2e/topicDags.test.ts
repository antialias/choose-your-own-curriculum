import { describe, it, expect, vi, type Mock } from 'vitest';
import { GET as getDags } from '@/app/api/topic-dags/route';
import { getServerSession } from 'next-auth';

vi.mock('next-auth', () => ({ getServerSession: vi.fn() }));
vi.mock('@/authOptions', () => ({ authOptions: {} }));
vi.mock('@/db', () => {
  const where = vi.fn().mockResolvedValue([
    {
      id: 'd1',
      userId: 'u1',
      topics: '[]',
      graph: JSON.stringify({ nodes: [{ id: 'n1', label: 'N1', desc: '', tags: ['t1','t2','t3'] }], edges: [] }),
      createdAt: new Date()
    }
  ]);
  const from = vi.fn(() => ({ where }));
  const select = vi.fn(() => ({ from }));
  const db = { select };
  const sqlite = { prepare: vi.fn(), transaction: vi.fn() };
  return { getDb: () => db, getSqlite: () => sqlite };
});

describe('topic-dags API', () => {
  it('rejects unauthenticated users', async () => {
    (getServerSession as unknown as Mock).mockResolvedValue(null);
    const res = await getDags();
    expect(res.status).toBe(401);
  });

  it('returns dag list when authenticated', async () => {
    (getServerSession as unknown as Mock).mockResolvedValue({ user: { id: 'u1' } });
    const res = await getDags();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.dags[0].id).toBe('d1');
  });
});
