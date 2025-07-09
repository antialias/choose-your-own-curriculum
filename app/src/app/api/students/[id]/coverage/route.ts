import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/authOptions';
import { getDb } from '@/db';
import { teacherStudents, topicDags } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { calculateCoverage } from '@/coverage/calculateCoverage';
import type { Graph } from '@/graphSchema';

const db = getDb();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const teacherId = (session?.user as { id?: string } | undefined)?.id;
  if (!teacherId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const [row] = await db
    .select({ topicDagId: teacherStudents.topicDagId, graph: topicDags.graph })
    .from(teacherStudents)
    .leftJoin(topicDags, eq(topicDags.id, teacherStudents.topicDagId))
    .where(and(eq(teacherStudents.teacherId, teacherId), eq(teacherStudents.studentId, id)));

  if (!row || !row.topicDagId || !row.graph) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }
  const dag = JSON.parse(row.graph) as Graph;
  const coverage = await calculateCoverage(id, dag);
  return NextResponse.json({ coverage });
}
