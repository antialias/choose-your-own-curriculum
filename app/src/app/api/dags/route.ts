import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { topicDags } from '@/db/schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/authOptions';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

const dagSchema = z.object({
  topics: z.array(z.string()),
  graph: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const { topics, graph } = dagSchema.parse(await req.json());
  const [{ id }] = await db
    .insert(topicDags)
    .values({
      userId,
      topics: JSON.stringify(topics),
      graph,
      dateCreated: new Date(),
    })
    .returning({ id: topicDags.id });
  return NextResponse.json({ id });
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
  const dags = rows.map((d) => ({
    ...d,
    topics: JSON.parse(d.topics as string) as string[],
  }));
  return NextResponse.json({ dags });
}
