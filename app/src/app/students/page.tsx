import { StudentManager } from '@/components/StudentManager'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/authOptions'

export default async function StudentsPage() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!userId) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Students</h1>
        <p>Please sign in to manage students.</p>
      </div>
    )
  }
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Students</h1>
      <StudentManager />
    </div>
  )
}
