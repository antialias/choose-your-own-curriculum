import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { uploadedWork, students } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/authOptions';
import OpenAI from 'openai';
import { uploadWorkSchema } from '@/validations/uploadWork';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const form = await req.formData();
  const parsed = uploadWorkSchema.safeParse({
    file: form.get('file'),
    studentId: form.get('studentId'),
    dateCompleted: form.get('dateCompleted'),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  const { file, studentId, dateCompleted } = parsed.data;
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
  const completedDate = dateCompleted ? new Date(String(dateCompleted)) : null;
  const buffer = Buffer.from(await file.arrayBuffer());
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
  const isImage = file.type.startsWith('image/');

  let summary = '';
  let embeddingsJson = '';

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
    // Image embeddings are not yet supported in openai-node
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
    try {
      const emb = await openai.embeddings.create({
        model: 'multimodal-embedding-3-small',
        input: text,
      });
      embeddingsJson = JSON.stringify(emb.data);
    } catch (err) {
      console.error('embedding error', err);
    }
  }
  await db.insert(uploadedWork).values({
    userId: userId as string,
    studentId,
    dateUploaded: new Date(),
    dateCompleted: completedDate,
    summary,
    embeddings: embeddingsJson,
    originalDocument: buffer,
  } as typeof uploadedWork.$inferInsert);
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const works = await db.select().from(uploadedWork);
  return NextResponse.json({ works });
}
