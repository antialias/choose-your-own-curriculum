import { describe, it, expect, vi, type Mock } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as uploadWork, GET as getWorks } from '@/app/api/upload-work/route';
import { getServerSession } from 'next-auth';

vi.mock('next-auth', () => ({ getServerSession: vi.fn() }));
vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: { completions: { create: vi.fn().mockResolvedValue({ choices: [{ message: { content: 'sum' } }] }) } },
    embeddings: { create: vi.fn().mockResolvedValue({ data: [] }) }
  }))
}));
vi.mock('@/authOptions', () => ({ authOptions: {} }));
vi.mock('@/db', () => ({
  db: {
    select: vi.fn(() => ({ from: vi.fn(() => ({ where: vi.fn().mockResolvedValue([]) })) })),
    insert: vi.fn(() => ({ values: vi.fn().mockResolvedValue({ lastInsertRowid: 1 }) }))
  }
}));
vi.mock('@/db/vectors', () => ({ upsertUploadedWorkVector: vi.fn() }));

describe('upload-work API', () => {
  it('rejects unauthenticated users', async () => {
    (getServerSession as unknown as Mock).mockResolvedValue(null);
    const form = new FormData();
    form.set('file', new File(['hello'], 'hello.txt'));
    form.set('studentId', '1');
    const req = new NextRequest(new Request('http://localhost/api/upload-work', { method: 'POST', body: form }));
    const res = await uploadWork(req);
    expect(res.status).toBe(401);
  });

  it('accepts valid data', async () => {
    (getServerSession as unknown as Mock).mockResolvedValue({ user: { id: 'u1' } });
    const form = new FormData();
    form.set('file', new File(['hello'], 'hello.txt'));
    form.set('studentId', '1');
    form.set('dateCompleted', '2024-01-01');
    const req = new NextRequest(new Request('http://localhost/api/upload-work', { method: 'POST', body: form }));
    const res = await uploadWork(req);
    expect(res.status).toBe(200);
  });

  it('requires auth for GET', async () => {
    (getServerSession as unknown as Mock).mockResolvedValue(null);
    const res = await getWorks();
    expect(res.status).toBe(401);
  });
});
