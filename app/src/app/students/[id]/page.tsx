import { getServerSession } from 'next-auth'
import { authOptions } from '@/authOptions'
import { StudentCurriculum } from '@/components/StudentCurriculum'
import { UploadedWorkList } from '@/components/UploadedWorkList'
import { getDb } from '@/db'
import { teacherStudents } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export default async function StudentProgressPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!userId) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Student Progress</h1>
        <p>Please sign in to view progress.</p>
      </div>
    )
  }
  const { id } = await params
  const db = getDb()
  const [row] = await db
    .select({ dagId: teacherStudents.topicDagId })
    .from(teacherStudents)
    .where(and(eq(teacherStudents.teacherId, userId), eq(teacherStudents.studentId, id)))
  const dagId = row?.dagId || ''
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Student Progress</h1>
      <StudentCurriculum studentId={id} />
      <UploadedWorkList studentId={id} topicDagId={dagId} />
    </div>
  )
}
