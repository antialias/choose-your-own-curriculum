import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { students, teacherStudents, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/authOptions'
import { studentSchema } from '@/forms/student'

export async function GET() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
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
  if (!teacherId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const data = studentSchema.parse(await req.json())
  let accountId: string | null = null
  if (data.email) {
    const [user] = await db.select().from(users).where(eq(users.email, data.email))
    if (user) accountId = user.id
  }
  const [student] = await db
    .insert(students)
    .values({ name: data.name, email: data.email, accountId })
    .returning({ id: students.id })
  await db.insert(teacherStudents).values({ teacherId, studentId: student.id })
  return NextResponse.json({ student })
}
