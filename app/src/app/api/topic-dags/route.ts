import { NextRequest, NextResponse } from 'next/server';
import { getDb, getSqlite } from '@/db';
import { topicDags } from '@/db/schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/authOptions';
import { z } from 'zod';
import { GraphSchema } from '@/graphSchema';
import { eq } from 'drizzle-orm';
import { upsertTagEmbeddings, getTagVector } from '@/db/embeddings';
import OpenAI from 'openai';
import crypto from 'node:crypto';

const db = getDb();
const sqlite = getSqlite();

async function embedTagsForGraph(graph: z.infer<typeof GraphSchema>) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
  const model = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';
  const insertTag = sqlite.prepare(
    'INSERT OR IGNORE INTO tag(id, text) VALUES (?, ?)'
  );
  const selectTag = sqlite.prepare('SELECT id FROM tag WHERE text = ?');

  for (const node of graph.nodes) {
    for (const tag of node.tags) {
      const row = selectTag.get(tag) as { id: string } | undefined;
      let tagId = row?.id;
      if (!tagId) {
        tagId = crypto.randomUUID();
        insertTag.run(tagId, tag);
      }
      const existing = getTagVector(tagId);
      if (existing) continue;
      try {
        const emb = await openai.embeddings.create({ model, input: tag });
        const vector = emb.data[0]?.embedding;
        if (vector) {
          upsertTagEmbeddings([{ tagId, vector }]);
        }
      } catch (err) {
        console.error('tag embedding error', err);
      }
    }
  }
}

const postSchema = z.object({ topics: z.array(z.string()), graph: GraphSchema });

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const data = postSchema.parse(await req.json());
  await db.insert(topicDags).values({
    userId,
    topics: JSON.stringify(data.topics),
    graph: JSON.stringify(data.graph),
    createdAt: new Date(),
  });
  void embedTagsForGraph(data.graph);
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const rows = await db
    .select()
    .from(topicDags)
    .where(eq(topicDags.userId, userId));
  const dags = rows.map(r => ({ ...r, graph: JSON.parse(r.graph) }));
  return NextResponse.json({ dags });
}
