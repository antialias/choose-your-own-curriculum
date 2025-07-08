import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/db'
import { students, teacherStudents, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/authOptions'
import { studentFieldsSchema } from '@/forms/student'

const db = getDb()

export async function GET() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const rows = await db
    .select({ id: students.id, name: students.name, email: students.email })
    .from(teacherStudents)
    .innerJoin(students, eq(teacherStudents.studentId, students.id))
    .where(eq(teacherStudents.teacherId, userId))
  return NextResponse.json({ students: rows })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const teacherId = (session?.user as { id?: string } | undefined)?.id
  if (!teacherId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const data = studentFieldsSchema.parse(await req.json())
  const { name, email } = data
  let accountUserId: string | null = null
  if (email) {
    const [u] = await db.select().from(users).where(eq(users.email, email))
    if (u) {
      accountUserId = u.id
    }
  }
  const [{ id }] = await db
    .insert(students)
    .values({ name, email: email || null, accountUserId })
    .returning({ id: students.id })
  await db
    .insert(teacherStudents)
    .values({ teacherId, studentId: id })
  return NextResponse.json({ id })
}
