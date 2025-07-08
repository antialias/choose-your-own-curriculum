import { TopicDAGList } from '@/components/TopicDAGList'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/authOptions'

export default async function TopicDAGsPage() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!userId) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>My Curriculums</h1>
        <p>Please sign in to view your DAGs.</p>
      </div>
    )
  }
  return (
    <div style={{ padding: '2rem' }}>
      <h1>My Curriculums</h1>
      <p style={{ marginBottom: '1rem' }}>
        <Link href="/curriculum-generator">New Curriculum</Link>
      </p>
      <TopicDAGList />
    </div>
  )
}
