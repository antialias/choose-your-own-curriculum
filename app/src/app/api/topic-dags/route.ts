import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db';
import { topicDags } from '@/db/schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/authOptions';
import { z } from 'zod';
import { GraphSchema } from '@/graphSchema';
import { eq } from 'drizzle-orm';
import { embedTagsForGraph } from '@/jobs/embedTags';

const db = getDb();

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
  // kick off background embedding job without blocking response
  embedTagsForGraph(data.graph).catch((err) =>
    console.error('embedTagsForGraph failed', err)
  );
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
