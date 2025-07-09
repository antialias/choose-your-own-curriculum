import { describe, it, expect, vi, type Mock } from 'vitest';
import { GET as getStudents } from '@/app/api/students/route';
import { getServerSession } from 'next-auth';

vi.mock('next-auth', () => ({ getServerSession: vi.fn() }));
vi.mock('@/authOptions', () => ({ authOptions: {} }));
vi.mock('@/db', () => {
  const where = vi.fn().mockResolvedValue([{ id: '1', name: 'Alice', email: 'a@example.com' }]);
  const innerJoin = vi.fn(() => ({ where }));
  const from = vi.fn(() => ({ innerJoin, where }));
  const select = vi.fn(() => ({ from }));
  const db = { select };
  const sqlite = { prepare: vi.fn(), transaction: vi.fn() };
  return { getDb: () => db, getSqlite: () => sqlite };
});

describe('students API', () => {
  it('rejects unauthenticated users', async () => {
    (getServerSession as unknown as Mock).mockResolvedValue(null);
    const res = await getStudents();
    expect(res.status).toBe(401);
  });

  it('returns student list when authenticated', async () => {
    (getServerSession as unknown as Mock).mockResolvedValue({ user: { id: 'u1' } });
    const res = await getStudents();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.students[0].id).toBe('1');
  });
});
