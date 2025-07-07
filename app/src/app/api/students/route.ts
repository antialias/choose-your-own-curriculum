import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/authOptions'
import { db } from '@/db'
import { students, studentTeachers, users } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { studentServerSchema } from '@/forms/student'

export async function GET() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!userId) return NextResponse.json({ students: [] })
  const rows = await db
    .select({ id: students.id, name: students.name, email: users.email })
    .from(students)
    .leftJoin(users, eq(students.userId, users.id))
    .innerJoin(studentTeachers, eq(students.id, studentTeachers.studentId))
    .where(eq(studentTeachers.teacherId, userId))
  return NextResponse.json({ students: rows })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const data = studentServerSchema.parse(await req.json())
  let studentUserId: string | null = null
  if (data.email) {
    const [u] = await db.select().from(users).where(eq(users.email, data.email))
    if (u) studentUserId = u.id
  }
  let existing
  if (studentUserId) {
    ;[existing] = await db
      .select()
      .from(students)
      .where(and(eq(students.name, data.name), eq(students.userId, studentUserId)))
  } else {
    ;[existing] = await db.select().from(students).where(eq(students.name, data.name))
  }
  const studentId = existing?.id ||
    (await db
      .insert(students)
      .values({ name: data.name, userId: studentUserId || null })
      .returning({ id: students.id }))[0].id
  await db.insert(studentTeachers).values({ studentId, teacherId: userId }).onConflictDoNothing()
  return NextResponse.json({ id: studentId })
}
