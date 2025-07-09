import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db';
import { uploadedWork } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/authOptions';
import { upsertWorkEmbeddings } from '@/db/embeddings';
import OpenAI from 'openai';
import { LLMClient } from '@/llm/client';
import { z } from 'zod';
import crypto from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { promises as fs } from 'node:fs';

const execFileP = promisify(execFile);
const db = getDb();

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const [row] = await db
    .select()
    .from(uploadedWork)
    .where(eq(uploadedWork.id, id));
  if (!row || row.userId !== userId) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }
  const buffer: Buffer | null = row.originalDocument ?? null;
  const mime = row.originalMimeType ?? '';
  const note = row.note ?? undefined;
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
  const llm = new LLMClient(process.env.OPENAI_API_KEY || '');
  const isImage = mime.startsWith('image/');
  const isPdf = mime === 'application/pdf';
  let pdfImage: Buffer | null = null;
  let pdfText = '';
  if (buffer && isPdf) {
    const tmpBase = `/tmp/${crypto.randomUUID()}`;
    const pdfPath = `${tmpBase}.pdf`;
    const imgPath = `${tmpBase}.png`;
    try {
      await fs.writeFile(pdfPath, buffer);
      await execFileP('pdftoppm', ['-png', '-singlefile', '-f', '1', '-l', '1', pdfPath, tmpBase]);
      pdfImage = await fs.readFile(imgPath);
      const { stdout } = await execFileP('pdftotext', ['-q', pdfPath, '-']);
      pdfText = stdout;
    } catch (err) {
      console.error('pdf parse error', err);
    } finally {
      try { await fs.unlink(pdfPath); } catch {}
      try { await fs.unlink(imgPath); } catch {}
    }
  }

  const summarySchema = z.object({
    summary: z.string(),
    grade: z.string().optional().nullable(),
    studentName: z.string().optional().nullable(),
    dateOfWork: z.string().optional().nullable(),
    masteryPercent: z.number().min(0).max(100),
    feedback: z.string().optional().nullable(),
  });

  const parts: OpenAI.Chat.ChatCompletionContentPart[] = [];
  if (note) parts.push({ type: 'text', text: note });
  if (buffer) {
    if (isImage) {
      parts.push({ type: 'image_url', image_url: { url: `data:${mime};base64,${buffer.toString('base64')}` } });
    } else if (isPdf) {
      if (pdfImage) {
        parts.push({ type: 'image_url', image_url: { url: `data:image/png;base64,${pdfImage.toString('base64')}` } });
      }
      if (pdfText) parts.push({ type: 'text', text: pdfText });
    } else {
      parts.push({ type: 'text', text: buffer.toString('utf-8') });
    }
  }

  let summary = '';
  let grade: string | null = null;
  let extractedStudentName: string | null = null;
  let extractedDateOfWork: string | null = null;
  let masteryPercent: number | null = null;
  let feedback: string | null = null;

  try {
    if (parts.length) {
      const res = await llm.chatMessages(
        [{ role: 'user', content: parts }],
        {
          systemPrompt:
            'You are an expert teacher analyzing student work. Provide a summary, optional grade, student name, date of work, REQUIRED mastery percent between 0 and 100, and optional feedback.',
          schema: summarySchema,
          params: { model: 'gpt-4o' },
        },
      );
      if (!res.error && res.response) {
        summary = res.response.summary;
        grade = res.response.grade ?? null;
        extractedStudentName = res.response.studentName ?? null;
        extractedDateOfWork = res.response.dateOfWork ?? null;
        masteryPercent = res.response.masteryPercent;
        feedback = res.response.feedback ?? null;
      }
    }
  } catch (err) {
    console.error('summary error', err);
  }

  if (!summary && note) summary = note;
  let vector: number[] = [];
  try {
    const emb = await openai.embeddings.create({
      model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
      input: summary,
    });
    vector = emb.data[0]?.embedding || [];
  } catch (err) {
    console.error('embedding error', err);
  }

  await db
    .update(uploadedWork)
    .set({
      summary,
      grade,
      extractedStudentName,
      extractedDateOfWork,
      masteryPercent,
      feedback,
      embeddings: null,
    })
    .where(eq(uploadedWork.id, id));
  if (vector.length) {
    upsertWorkEmbeddings([{ workId: id, vector }]);
  }
  return NextResponse.json({ ok: true });
}
