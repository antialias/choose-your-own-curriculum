import { describe, it, expect, vi, type Mock } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as createStudent } from '@/app/api/students/route';
import { getServerSession } from 'next-auth';

vi.mock('next-auth', () => ({ getServerSession: vi.fn() }));
vi.mock('@/authOptions', () => ({ authOptions: {} }));
vi.mock('@/db', () => {
  const where = vi.fn().mockResolvedValue([]);
  const from = vi.fn(() => ({ where }));
  const select = vi.fn(() => ({ from }));
  const returning = vi.fn().mockResolvedValue([{ id: 's1' }]);
  const values = vi.fn(() => ({ returning }));
  const insert = vi.fn(() => ({ values }));
  const db = { select, insert };
  return { getDb: () => db };
});

describe('students API', () => {
  it('creates a student', async () => {
    (getServerSession as unknown as Mock).mockResolvedValue({ user: { id: 'u1' } });
    const req = new NextRequest(new Request('http://localhost/api/students', {
      method: 'POST',
      body: JSON.stringify({ name: 'Alice', email: '' }),
      headers: { 'content-type': 'application/json' }
    }));
    const res = await createStudent(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.id).toBe('s1');
  });
});
