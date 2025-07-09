import { describe, it, expect, vi, type Mock } from 'vitest';
import { GET } from '@/app/api/students/route';
import { getServerSession } from 'next-auth';

vi.mock('next-auth', () => ({ getServerSession: vi.fn() }));
vi.mock('@/authOptions', () => ({ authOptions: {} }));
vi.mock('@/db', () => ({ getDb: vi.fn() }));

describe('students API', () => {
  it('requires auth for GET', async () => {
    (getServerSession as unknown as Mock).mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });
});
