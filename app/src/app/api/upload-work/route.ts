import { NextRequest, NextResponse } from 'next/server';
import { getDb, getSqlite } from '@/db';

const db = getDb();
const sqlite = getSqlite();
import { uploadedWork, teacherStudents, topicDags } from '@/db/schema';
import {
  upsertWorkEmbeddings,
  searchTagsForWork,
  getTagVector,
  getWorkVector,
} from '@/db/embeddings';
import crypto from 'node:crypto';
import { eq, and } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/authOptions';
import OpenAI from 'openai';
import { uploadWorkFieldsSchema, uploadWorkServerSchema } from '@/forms/uploadWork';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const form = await req.formData();
  const file = form.get('file');
  const fields = uploadWorkFieldsSchema.parse({
    studentId: form.get('studentId'),
    dateCompleted: form.get('dateCompleted'),
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
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'file required' }, { status: 400 });
  }
  uploadWorkServerSchema.parse({ ...fields, file });
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
    originalDocument: buffer,
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
  const topicDagId = req.nextUrl.searchParams.get('topicDagId');
  const works = await db
    .select()
    .from(uploadedWork)
    .where(eq(uploadedWork.userId, userId));

  const tagStmt = sqlite.prepare('SELECT text FROM tag WHERE id = ?');
  const tagIdStmt = sqlite.prepare('SELECT id FROM tag WHERE text = ?');
  const nodeVectors: Record<string, { label: string; vector: number[] }> = {};
  if (topicDagId) {
    const row = await db
      .select({ graph: topicDags.graph })
      .from(topicDags)
      .where(eq(topicDags.id, topicDagId));
    if (row.length) {
      const graph = JSON.parse(row[0].graph) as import('@/graphSchema').Graph;
      for (const node of graph.nodes) {
        const vectors: number[][] = [];
        for (const t of node.tags) {
          const idRow = tagIdStmt.get(t) as { id: string } | undefined;
          if (!idRow) continue;
          const v = getTagVector(idRow.id);
          if (v) vectors.push(v);
        }
        if (vectors.length) {
          const avg = new Array(vectors[0].length).fill(0);
          for (const v of vectors) {
            for (let i = 0; i < v.length; i++) avg[i] += v[i];
          }
          for (let i = 0; i < avg.length; i++) avg[i] /= vectors.length;
          nodeVectors[node.id] = { label: node.label, vector: avg };
        }
      }
    }
  }
  let workWithTags = works.map((w) => {
    const tags = searchTagsForWork(w.id, n)
      .map((r) => {
        const textRow = tagStmt.get(r.id) as { text: string } | undefined;
        const vector = getTagVector(r.id) || [];
        if (!textRow) return undefined;
        return { text: textRow.text, vector };
      })
      .filter((t): t is { text: string; vector: number[] } => Boolean(t));
    let topics: { id: string; label: string; relevancy: number }[] = [];
    if (topicDagId) {
      const wv = getWorkVector(w.id) || [];
      if (wv.length) {
        topics = Object.entries(nodeVectors)
          .map(([id, { label, vector }]) => {
            let dot = 0,
              asq = 0,
              bsq = 0;
            for (let i = 0; i < Math.min(wv.length, vector.length); i++) {
              dot += wv[i] * vector[i];
              asq += wv[i] * wv[i];
              bsq += vector[i] * vector[i];
            }
            const sim = asq && bsq ? dot / Math.sqrt(asq * bsq) : 0;
            const relevancy = Math.round(((sim + 1) / 2) * 100);
            return { id, label, relevancy };
          })
          .sort((a, b) => b.relevancy - a.relevancy)
          .slice(0, 3);
      }
    }
    return { ...w, tags, topics };
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
