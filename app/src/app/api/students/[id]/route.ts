import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/db'
import { students, teacherStudents, users, topicDags } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/authOptions'
import { studentFieldsSchema } from '@/forms/student'
import { z } from 'zod'

const db = getDb()

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  const session = await getServerSession(authOptions)
  const teacherId = (session?.user as { id?: string } | undefined)?.id
  if (!teacherId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const { id } = params
  const [row] = await db
    .select({
      id: students.id,
      name: students.name,
      email: students.email,
      topicDagId: teacherStudents.topicDagId,
      coverageMasteryThreshold: teacherStudents.coverageMasteryThreshold,
      topics: topicDags.topics,
      graph: topicDags.graph,
    })
    .from(teacherStudents)
    .innerJoin(students, eq(students.id, teacherStudents.studentId))
    .leftJoin(topicDags, eq(topicDags.id, teacherStudents.topicDagId))
    .where(and(eq(teacherStudents.teacherId, teacherId), eq(teacherStudents.studentId, id)))

  if (!row) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  return NextResponse.json({
    student: {
      id: row.id,
      name: row.name,
      email: row.email,
      topicDagId: row.topicDagId,
      coverageMasteryThreshold: row.coverageMasteryThreshold,
      topics: row.topics ? JSON.parse(row.topics) : null,
      graph: row.graph ? JSON.parse(row.graph) : null,
    },
  })
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  const session = await getServerSession(authOptions)
  const teacherId = (session?.user as { id?: string } | undefined)?.id
  if (!teacherId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const { id } = params
  const link = await db
    .select()
    .from(teacherStudents)
    .where(and(eq(teacherStudents.teacherId, teacherId), eq(teacherStudents.studentId, id)))
  if (link.length === 0) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const updateSchema = studentFieldsSchema
    .partial()
    .extend({
      topicDagId: z.string().nullable().optional(),
      coverageMasteryThreshold: z.number().optional(),
    })
  const data = updateSchema.parse(await req.json())
  const { name, email, topicDagId, coverageMasteryThreshold } = data
  const studentValues: {
    name?: string
    email?: string | null
    accountUserId?: string | null
  } = {}
  if (name !== undefined) {
    studentValues.name = name
  }
  if (email !== undefined) {
    studentValues.email = email || null
    const [u] = await db.select().from(users).where(eq(users.email, email))
    if (u) {
      studentValues.accountUserId = u.id
    } else {
      studentValues.accountUserId = null
    }
  }
  if (Object.keys(studentValues).length > 0) {
    await db.update(students).set(studentValues).where(eq(students.id, id))
  }
  if (topicDagId !== undefined) {
    await db
      .update(teacherStudents)
      .set({ topicDagId: topicDagId || null })
      .where(and(eq(teacherStudents.teacherId, teacherId), eq(teacherStudents.studentId, id)))
  }
  if (coverageMasteryThreshold !== undefined) {
    await db
      .update(teacherStudents)
      .set({ coverageMasteryThreshold })
      .where(and(eq(teacherStudents.teacherId, teacherId), eq(teacherStudents.studentId, id)))
  }
  return NextResponse.json({ ok: true })
}
