import { getServerSession } from 'next-auth'
import { authOptions } from '@/authOptions'
import { StudentCurriculum } from '@/components/StudentCurriculum'
import { UploadedWorkList } from '@/components/UploadedWorkList'

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
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Student Progress</h1>
      <StudentCurriculum studentId={id} />
      <UploadedWorkList studentId={id} />
    </div>
  )
}
