import { describe, it, expect, vi, type Mock } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as uploadWork, GET as getWorks } from '@/app/api/upload-work/route';
import { getServerSession } from 'next-auth';

vi.mock('next-auth', () => ({ getServerSession: vi.fn() }));
vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    embeddings: { create: vi.fn().mockResolvedValue({ data: [] }) }
  }))
}));
vi.mock('@/llm/client', () => ({
  LLMClient: vi.fn().mockImplementation(() => ({
    chatMessages: vi.fn(async () => ({
      error: null,
      response: {
        summary: 'sum',
        grade: 'A',
        studentName: 'Test Student',
        dateOfWork: '2024-01-01',
        masteryPercent: 80,
        feedback: 'Great job'
      }
    }))
  }))
}));
vi.mock('@/authOptions', () => ({ authOptions: {} }));
vi.mock('@/db', () => {
  const where = vi
    .fn()
    .mockResolvedValueOnce([{ teacherId: 'u1', studentId: '1' }])
    .mockResolvedValueOnce([{ teacherId: 'u1', studentId: '1' }])
    .mockResolvedValueOnce([
      {
        id: 'w1',
        userId: 'u1',
        studentId: '1',
        dateUploaded: new Date(),
        dateCompleted: null,
        summary: 'sum',
        grade: 'A',
        extractedStudentName: 'Test Student',
        extractedDateOfWork: '2024-01-01',
        masteryPercent: 80,
        feedback: 'Great job',
        note: null,
        embeddings: null,
        originalDocument: null,
        originalFilename: null,
        originalMimeType: null,
        thumbnail: null,
        thumbnailMimeType: null
      }
    ]);
  const from = vi.fn(() => ({ where }));
  const select = vi.fn(() => ({ from }));
  const insert = vi.fn(() => ({ values: vi.fn().mockResolvedValue(undefined) }));
  const db = { select, insert };
  const sqlite = {
    prepare: vi.fn(() => ({ run: vi.fn(), all: vi.fn(() => []), get: vi.fn() })),
    transaction: vi.fn(() => vi.fn()),
  };
  return { getDb: () => db, getSqlite: () => sqlite };
});

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

  it('accepts note without file', async () => {
    (getServerSession as unknown as Mock).mockResolvedValue({ user: { id: 'u1' } });
    const form = new FormData();
    form.set('note', 'hello note');
    form.set('studentId', '1');
    const req = new NextRequest(new Request('http://localhost/api/upload-work', { method: 'POST', body: form }));
    const res = await uploadWork(req);
    expect(res.status).toBe(200);
  });

  it('requires auth for GET', async () => {
    (getServerSession as unknown as Mock).mockResolvedValue(null);
    const req = new NextRequest(new Request('http://localhost/api/upload-work'));
    const res = await getWorks(req);
    expect(res.status).toBe(401);
  });

  it('returns uploaded work with metadata', async () => {
    (getServerSession as unknown as Mock).mockResolvedValue({ user: { id: 'u1' } });
    const req = new NextRequest(new Request('http://localhost/api/upload-work'));
    const res = await getWorks(req);
    expect(res.status).toBe(200);
    const data = (await res.json()) as { groups: Record<string, any[]> };
    expect(data.groups.all[0].grade).toBe('A');
    expect(data.groups.all[0].masteryPercent).toBe(80);
  });
});
