import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { uploadedWork } from '@/db/schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/authOptions';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const form = await req.formData();
  const file = form.get('file');
  const studentId = String(form.get('studentId'));
  const dateCompleted = form.get('dateCompleted')
    ? new Date(String(form.get('dateCompleted'))).getTime()
    : null;
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'file required' }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString('base64');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
  let summary = '';
  try {
    const chat = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Provide a detailed summary of this work.' },
            {
              type: 'image_url',
              image_url: { url: `data:${file.type};base64,${base64}` },
            },
          ],
        },
      ],
    });
    summary = chat.choices[0].message?.content || '';
  } catch (err) {
    console.error('summary error', err);
  }
  let embeddingsJson = '';
  if (summary) {
    try {
      const emb = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: summary,
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
    dateCompleted: dateCompleted ? new Date(dateCompleted) : null,
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
