import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/authOptions'
import { db } from '@/db'
import { students, studentTeachers, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { studentServerSchema } from '@/forms/student'

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop() as string
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const data = studentServerSchema.parse(await req.json())
  let studentUserId: string | null = null
  if (data.email) {
    const [u] = await db.select().from(users).where(eq(users.email, data.email))
    if (u) studentUserId = u.id
  }
  await db
    .update(students)
    .set({ name: data.name, userId: studentUserId || null })
    .where(eq(students.id, id))
  await db
    .insert(studentTeachers)
    .values({ studentId: id, teacherId: userId })
    .onConflictDoNothing()
  return NextResponse.json({ ok: true })
}
