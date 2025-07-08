import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/db'
import { students, teacherStudents, users } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/authOptions'
import { studentFieldsSchema } from '@/forms/student'

const db = getDb()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(req: NextRequest, context: any) {
  const { params } = context as { params: { id: string } }
  const session = await getServerSession(authOptions)
  const teacherId = (session?.user as { id?: string } | undefined)?.id
  if (!teacherId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const id = params.id
  const link = await db
    .select()
    .from(teacherStudents)
    .where(and(eq(teacherStudents.teacherId, teacherId), eq(teacherStudents.studentId, id)))
  if (link.length === 0) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const data = studentFieldsSchema.parse(await req.json())
  const { name, email } = data
  let accountUserId: string | null = null
  if (email) {
    const [u] = await db.select().from(users).where(eq(users.email, email))
    if (u) accountUserId = u.id
  }
  await db
    .update(students)
    .set({ name, email: email || null, accountUserId })
    .where(eq(students.id, id))
  return NextResponse.json({ ok: true })
}
