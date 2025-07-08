import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/db'
import { teacherStudentCurriculums, teacherStudents, topicDags } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/authOptions'
import { z } from 'zod'

const db = getDb()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(_req: NextRequest, context: any) {
  const { params } = context as { params: { id: string } }
  const session = await getServerSession(authOptions)
  const teacherId = (session?.user as { id?: string } | undefined)?.id
  if (!teacherId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const studentId = params.id
  const link = await db
    .select()
    .from(teacherStudents)
    .where(and(eq(teacherStudents.teacherId, teacherId), eq(teacherStudents.studentId, studentId)))
  if (link.length === 0) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const rows = await db
    .select({
      id: teacherStudentCurriculums.dagId,
      topics: topicDags.topics,
      graph: topicDags.graph,
      createdAt: topicDags.createdAt,
    })
    .from(teacherStudentCurriculums)
    .leftJoin(topicDags, eq(teacherStudentCurriculums.dagId, topicDags.id))
    .where(
      and(
        eq(teacherStudentCurriculums.teacherId, teacherId),
        eq(teacherStudentCurriculums.studentId, studentId)
      )
    )
  const dag = rows[0] ?? null
  return NextResponse.json({ dag })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(req: NextRequest, context: any) {
  const { params } = context as { params: { id: string } }
  const session = await getServerSession(authOptions)
  const teacherId = (session?.user as { id?: string } | undefined)?.id
  if (!teacherId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const studentId = params.id
  const link = await db
    .select()
    .from(teacherStudents)
    .where(and(eq(teacherStudents.teacherId, teacherId), eq(teacherStudents.studentId, studentId)))
  if (link.length === 0) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const body = z.object({ dagId: z.string() }).parse(await req.json())
  const dagId = body.dagId
  const [dag] = await db
    .select()
    .from(topicDags)
    .where(and(eq(topicDags.id, dagId), eq(topicDags.userId, teacherId)))
  if (!dag) {
    return NextResponse.json({ error: 'invalid dag' }, { status: 400 })
  }
  const existing = await db
    .select()
    .from(teacherStudentCurriculums)
    .where(and(eq(teacherStudentCurriculums.teacherId, teacherId), eq(teacherStudentCurriculums.studentId, studentId)))
  if (existing.length === 0) {
    await db.insert(teacherStudentCurriculums).values({ teacherId, studentId, dagId })
  } else {
    await db
      .update(teacherStudentCurriculums)
      .set({ dagId })
      .where(and(eq(teacherStudentCurriculums.teacherId, teacherId), eq(teacherStudentCurriculums.studentId, studentId)))
  }
  return NextResponse.json({ ok: true })
}
