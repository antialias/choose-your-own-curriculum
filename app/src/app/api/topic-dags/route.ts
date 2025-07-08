import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db';
import { topicDags } from '@/db/schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/authOptions';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

const db = getDb();

const postSchema = z.object({ topics: z.array(z.string()), graph: z.string() });

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
    graph: data.graph,
    createdAt: new Date(),
  });
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
  return NextResponse.json({ dags: rows });
}
