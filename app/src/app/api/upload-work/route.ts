import { NextRequest, NextResponse } from 'next/server';
import { db, sqlite } from '@/db';
import { uploadedWork, students } from '@/db/schema';
import { upsertEmbedding } from '@/db/vss';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/authOptions';
import OpenAI from 'openai';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const form = await req.formData();
  const file = form.get('file');
  const studentId = String(form.get('studentId'));
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, studentId));
  if (!student) {
    await db.insert(students).values({
      id: studentId,
      name: studentId,
      userId: userId as string,
    });
  }
  const dateCompleted = form.get('dateCompleted')
    ? new Date(String(form.get('dateCompleted'))).getTime()
    : null;
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'file required' }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
  const isImage = file.type.startsWith('image/');

  let summary = '';

  if (isImage) {
    const base64 = buffer.toString('base64');
    try {
      const chat = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Summarize this work' },
              {
                type: 'image_url',
                image_url: { url: `data:${file.type};base64,${base64}` },
              },
            ],
          },
        ],
      });
      summary = chat.choices[0].message.content || '';
    } catch (err) {
      console.error('summary error', err);
    }
  } else {
    const text = buffer.toString('utf-8');
    try {
      const chat = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: `Summarize this work: ${text}` }],
      });
      summary = chat.choices[0].message.content || '';
    } catch (err) {
      console.error('summary error', err);
    }
  }
  const id = crypto.randomUUID();
  try {
    const emb = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: summary,
    });
    const vector = emb.data[0]?.embedding ?? [];
    upsertEmbedding(sqlite, { id, embedding: vector });
  } catch (err) {
    console.error('embedding error', err);
  }
  await db.insert(uploadedWork).values({
    id,
    userId: userId as string,
    studentId,
    dateUploaded: new Date(),
    dateCompleted: dateCompleted ? new Date(dateCompleted) : null,
    summary,
    originalDocument: buffer,
  } as typeof uploadedWork.$inferInsert);
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const works = await db.select().from(uploadedWork);
  return NextResponse.json({ works });
}
