import { StudentForm } from '@/components/StudentForm'
import { StudentList } from '@/components/StudentList'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/authOptions'

export default async function StudentsPage() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!userId) {
    return <div style={{ padding: '2rem' }}>Please sign in</div>
  }
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Students</h1>
      <StudentList />
      <h2>Add Student</h2>
      <StudentForm onSubmit={async (data) => {
        await fetch('/api/students', { method: 'POST', body: JSON.stringify(data) })
      }} />
    </div>
  )
}
