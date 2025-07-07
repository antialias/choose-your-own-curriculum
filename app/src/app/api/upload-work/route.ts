import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/options';
import { db } from '@/db';
import { students, workUploads } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { OpenAI } from 'openai';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any)?.user?.id as string | undefined;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'File required' }, { status: 400 });
  }
  const summary = String(form.get('summary') || '');
  const completed = form.get('completedDate')
    ? new Date(String(form.get('completedDate')))
    : null;
  const studentName = String(form.get('studentName') || '');

  // Find or create student
  let studentId: string | undefined;
  const existing = await db
    .select()
    .from(students)
    .where(eq(students.name, studentName));
  if (existing.length > 0) {
    studentId = existing[0].id;
  } else {
    const inserted = await db
      .insert(students)
      .values({ name: studentName })
      .returning({ id: students.id });
    studentId = inserted[0].id;
  }

  const text = await file.text();
  let embeddingJson: string | null = null;
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
    const embedding = await openai.embeddings.create({
      model: 'multimodal-embedding-3-small',
      input: text,
    });
    embeddingJson = JSON.stringify(embedding);
  } catch (err) {
    console.error('embedding failed', err);
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  await db.insert(workUploads).values({
    studentId,
    uploadedById: userId,
    uploadedAt: Date.now(),
    completedAt: completed ? completed.getTime() : null,
    summary,
    embedding: embeddingJson,
    file: buffer,
  } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

  return NextResponse.json({ success: true });
}
