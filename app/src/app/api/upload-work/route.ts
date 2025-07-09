import { NextRequest, NextResponse } from 'next/server';
import { getDb, getSqlite } from '@/db';

const db = getDb();
const sqlite = getSqlite();
import { uploadedWork, teacherStudents } from '@/db/schema';
import {
  upsertWorkEmbeddings,
  searchTagsForWork,
  getTagVector,
} from '@/db/embeddings';
import crypto from 'node:crypto';
import { eq, and } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/authOptions';
import OpenAI from 'openai';
import sharp from 'sharp';
import { promises as fs } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { uploadWorkFieldsSchema, uploadWorkServerSchema } from '@/forms/uploadWork';

const execFileP = promisify(execFile);

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const form = await req.formData();
  const file = form.get('file');
  const note = form.get('note');
  const fields = uploadWorkFieldsSchema.parse({
    studentId: form.get('studentId'),
    dateCompleted: form.get('dateCompleted'),
    note: typeof note === 'string' ? note : undefined,
  });
  const { studentId, dateCompleted } = fields;
  const link = await db
    .select()
    .from(teacherStudents)
    .where(
      and(
        eq(teacherStudents.teacherId, userId as string),
        eq(teacherStudents.studentId, studentId)
      )
    );
  if (link.length === 0) {
    return NextResponse.json({ error: 'invalid student' }, { status: 400 });
  }
  if (!(file instanceof File) && !fields.note) {
    return NextResponse.json({ error: 'file required' }, { status: 400 });
  }
  uploadWorkServerSchema.parse({ ...fields, file: file instanceof File ? file : undefined });
  let buffer: Buffer | null = null;
  let thumbnail: Buffer | null = null;
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
  const isImage = file instanceof File && file.type.startsWith('image/');
  const isPdf = file instanceof File && file.type === 'application/pdf';
  if (file instanceof File) {
    buffer = Buffer.from(await file.arrayBuffer());
  }
  if (isImage && buffer) {
    try {
      thumbnail = await sharp(buffer)
        .resize({ width: 144, height: 144, fit: 'inside' })
        .png()
        .toBuffer();
    } catch (err) {
      console.error('thumbnail error', err);
    }
  } else if (isPdf && buffer) {
    const tmpBase = `/tmp/${crypto.randomUUID()}`;
    const pdfPath = `${tmpBase}.pdf`;
    const imgPath = `${tmpBase}.png`;
    try {
      await fs.writeFile(pdfPath, buffer);
      await execFileP('pdftoppm', ['-png', '-singlefile', '-f', '1', '-l', '1', pdfPath, tmpBase]);
      const png = await fs.readFile(imgPath);
      const svg = `<svg width="144" height="144"><rect width="100%" height="100%" fill="rgba(0,0,0,0.3)"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="48" font-weight="bold" fill="white">PDF</text></svg>`;
      thumbnail = await sharp(png)
        .resize({ width: 144, height: 144, fit: 'inside' })
        .composite([{ input: Buffer.from(svg) }])
        .png()
        .toBuffer();
    } catch (err) {
      console.error('pdf thumbnail error', err);
    } finally {
      try { await fs.unlink(pdfPath); } catch {}
      try { await fs.unlink(imgPath); } catch {}
    }
  }

  let summary = '';

  if (file instanceof File) {
    if (isImage && buffer) {
      const base64 = buffer.toString('base64');
      try {
        const chat = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'user', content: [{ type: 'text', text: 'Summarize this work' }, { type: 'image_url', image_url: { url: `data:${file.type};base64,${base64}` } }] },
          ],
        });
        summary = chat.choices[0].message.content || '';
      } catch (err) {
        console.error('summary error', err);
      }
    } else if (isPdf && buffer) {
      const tmpPdf = `/tmp/${crypto.randomUUID()}.pdf`;
      try {
        await fs.writeFile(tmpPdf, buffer);
        const { stdout } = await execFileP('pdftotext', ['-q', tmpPdf, '-']);
        const chat = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: `Summarize this work: ${stdout}` }],
        });
        summary = chat.choices[0].message.content || '';
      } catch (err) {
        console.error('summary error', err);
      } finally {
        try { await fs.unlink(tmpPdf); } catch {}
      }
    } else if (buffer) {
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
  } else if (fields.note) {
    summary = fields.note;
  }
  const workId = crypto.randomUUID();
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
  await db.insert(uploadedWork).values({
    id: workId,
    userId: userId as string,
    studentId,
    dateUploaded: new Date(),
    dateCompleted: dateCompleted ? new Date(dateCompleted) : null,
    summary,
    note: fields.note || null,
    originalDocument: buffer,
    originalFilename: file instanceof File ? file.name : null,
    originalMimeType: file instanceof File ? file.type : null,
    thumbnail,
    thumbnailMimeType: thumbnail ? 'image/png' : null,
  } as typeof uploadedWork.$inferInsert);
  if (vector.length) {
    upsertWorkEmbeddings([{ workId, vector }]);
  }
  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const n = parseInt(req.nextUrl.searchParams.get('n') || '3', 10);
  const group = req.nextUrl.searchParams.get('group');
  const studentId = req.nextUrl.searchParams.get('studentId');
  const day = req.nextUrl.searchParams.get('day');
  const tag = req.nextUrl.searchParams.get('tag');
  const works = await db
    .select()
    .from(uploadedWork)
    .where(eq(uploadedWork.userId, userId));

  const tagStmt = sqlite.prepare('SELECT text FROM tag WHERE id = ?');
  let workWithTags = works.map((w) => {
    const tags = searchTagsForWork(w.id, n)
      .map((r) => {
        const textRow = tagStmt.get(r.id) as { text: string } | undefined;
        const vector = getTagVector(r.id) || [];
        if (!textRow) return undefined;
        return { text: textRow.text, vector };
      })
      .filter((t): t is { text: string; vector: number[] } => Boolean(t));
    return { ...w, tags, hasThumbnail: !!w.thumbnail };
  });
  if (studentId) {
    workWithTags = workWithTags.filter((w) => w.studentId === studentId);
  }
  if (day) {
    workWithTags = workWithTags.filter((w) => {
      const d = new Date(w.dateCompleted || w.dateUploaded)
        .toISOString()
        .slice(0, 10);
      return d === day;
    });
  }
  if (tag) {
    workWithTags = workWithTags.filter((w) =>
      w.tags.some((t) => t.text === tag)
    );
  }

  const groups: Record<string, typeof workWithTags> = {};
  const push = (key: string, w: (typeof workWithTags)[number]) => {
    if (!groups[key]) groups[key] = [];
    groups[key].push(w);
  };

  switch (group) {
    case 'student':
      for (const w of workWithTags) {
        push(w.studentId, w);
      }
      break;
    case 'day':
      for (const w of workWithTags) {
        const key = new Date(w.dateCompleted || w.dateUploaded)
          .toISOString()
          .slice(0, 10);
        push(key, w);
      }
      break;
    case 'tag':
      for (const w of workWithTags) {
        if (w.tags.length === 0) {
          push('untagged', w);
        }
        for (const t of w.tags) {
          push(t.text, w);
        }
      }
      break;
    default:
      groups.all = workWithTags;
  }

  return NextResponse.json({ groups });
}
