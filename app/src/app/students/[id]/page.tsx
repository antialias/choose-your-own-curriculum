import { getServerSession } from 'next-auth'
import { authOptions } from '@/authOptions'
import { StudentCurriculum } from '@/components/StudentCurriculum'
import { UploadedWorkList } from '@/components/UploadedWorkList'
import { CoverageThresholdInput } from '@/components/CoverageThresholdInput'
import { getDb } from '@/db'
import { teacherStudents } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { initI18n } from '@/i18n'

export default async function StudentProgressPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const i18n = await initI18n('en')
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!userId) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>{i18n.t('studentProgress')}</h1>
        <p>{i18n.t('signInProgress')}</p>
      </div>
    )
  }
  const { id } = await params
  const db = getDb()
  const [row] = await db
    .select({ threshold: teacherStudents.coverageMasteryThreshold })
    .from(teacherStudents)
    .where(and(eq(teacherStudents.teacherId, userId), eq(teacherStudents.studentId, id)))
  const threshold = row?.threshold ?? 0
  return (
    <div style={{ padding: '2rem' }}>
      <h1>{i18n.t('studentProgress')}</h1>
      <CoverageThresholdInput studentId={id} initial={threshold} />
      <StudentCurriculum studentId={id} />
      <UploadedWorkList studentId={id} />
    </div>
  )
}
