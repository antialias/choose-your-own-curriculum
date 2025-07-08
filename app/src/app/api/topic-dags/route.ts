import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { topicDags } from '@/db/schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/authOptions';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

const saveSchema = z.object({ topics: z.array(z.string()), graph: z.string() });

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const json = await req.json();
  const { topics, graph } = saveSchema.parse(json);
  await db.insert(topicDags).values({
    userId,
    topics: JSON.stringify(topics),
    graph,
    createdAt: new Date(),
  } as typeof topicDags.$inferInsert);
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const dags = await db
    .select()
    .from(topicDags)
    .where(eq(topicDags.userId, userId));
  return NextResponse.json({ dags });
}
