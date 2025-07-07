import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as uploadWork } from '@/app/api/upload-work/route';
import { getServerSession } from 'next-auth';

vi.mock('next-auth', () => ({ getServerSession: vi.fn() }));
vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: { completions: { create: vi.fn().mockResolvedValue({ choices: [{ message: { content: 'sum' } }] }) } },
    embeddings: { create: vi.fn().mockResolvedValue({ data: [] }) }
  }))
}));

describe('upload-work API', () => {
  it('rejects unauthenticated users', async () => {
    (getServerSession as unknown as vi.Mock).mockResolvedValue(null);
    const form = new FormData();
    form.set('file', new File(['hello'], 'hello.txt'));
    form.set('studentId', '1');
    const req = new NextRequest(new Request('http://localhost/api/upload-work', { method: 'POST', body: form }));
    const res = await uploadWork(req);
    expect(res.status).toBe(401);
  });
});
