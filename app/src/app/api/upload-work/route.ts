import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { workUploads } from '@/db/schema';
import { authOptions } from '@/auth/options';
import { getServerSession } from 'next-auth';
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!session || !userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const data = await req.formData();
  const file = data.get('file');
  const summary = data.get('summary') as string | null;
  const completedAt = data.get('completedAt') as string | null;
  const student = (data.get('student') as string | null) || '';
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'file required' }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const id = crypto.randomUUID();
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });
  const ext = path.extname(file.name);
  const filename = `${id}${ext}`;
  await fs.writeFile(path.join(uploadDir, filename), buffer);

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
  const embeddingRes = await openai.embeddings.create({
    model: 'multimodal-embedding-3-small',
    input: summary || '',
  });
  const embedding = JSON.stringify(embeddingRes.data[0]?.embedding || []);

  await db.insert(workUploads).values({
    id,
    userId,
    student,
    uploadedAt: new Date(),
    completedAt: completedAt ? new Date(completedAt) : null,
    summary: summary || '',
    embedding,
    file: filename,
    originalName: file.name,
  });

  return NextResponse.json({ success: true });
}
