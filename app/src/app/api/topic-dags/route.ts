import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db';
import { topicDags, tags } from '@/db/schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/authOptions';
import { z } from 'zod';
import { GraphSchema } from '@/graphSchema';
import { eq, inArray } from 'drizzle-orm';
import OpenAI from 'openai';
import { upsertTagEmbeddings } from '@/db/embeddings';

const db = getDb();

const postSchema = z.object({ topics: z.array(z.string()), graph: GraphSchema });

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const data = postSchema.parse(await req.json());
  const [row] = await db
    .insert(topicDags)
    .values({
      userId,
      topics: JSON.stringify(data.topics),
      graph: JSON.stringify(data.graph),
      createdAt: new Date(),
    })
    .returning({ id: topicDags.id });
  void processTags(row.id, data.graph);
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

async function processTags(dagId: string, graph: z.infer<typeof GraphSchema>) {
  const unique = new Set<string>();
  for (const node of graph.nodes) {
    for (const tag of node.tags) unique.add(tag);
  }
  const tagList = Array.from(unique);
  await db
    .update(topicDags)
    .set({
      tagEmbeddingStatus: 'processing',
      tagEmbeddingsTotal: tagList.length,
      tagEmbeddingsComplete: 0,
    })
    .where(eq(topicDags.id, dagId));

  if (tagList.length === 0) {
    await db
      .update(topicDags)
      .set({ tagEmbeddingStatus: 'complete' })
      .where(eq(topicDags.id, dagId));
    return;
  }

  const existing = await db
    .select({ text: tags.text })
    .from(tags)
    .where(inArray(tags.text, tagList));
  const existingSet = new Set(existing.map(t => t.text));
  const toInsert = tagList.filter(t => !existingSet.has(t));
  for (const text of toInsert) {
    await db.insert(tags).values({ text }).onConflictDoNothing();
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
  const model = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';

  let complete = 0;
  for (const text of toInsert) {
    try {
      const [row] = await db
        .select({ id: tags.id })
        .from(tags)
        .where(eq(tags.text, text));
      if (!row) continue;
      const emb = await openai.embeddings.create({ model, input: text });
      const vector = emb.data[0]?.embedding;
      if (vector) {
        upsertTagEmbeddings([{ tagId: row.id, vector }]);
      }
    } catch (err) {
      console.error('embedding error', err);
    }
    complete++;
    await db
      .update(topicDags)
      .set({ tagEmbeddingsComplete: complete })
      .where(eq(topicDags.id, dagId));
  }

  await db
    .update(topicDags)
    .set({ tagEmbeddingStatus: 'complete' })
    .where(eq(topicDags.id, dagId));
}
