import { db } from '@/db'
import { topicDags } from '@/db/schema'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/authOptions'
import { eq, and } from 'drizzle-orm'
import { TopicDAGView } from '@/components/TopicDAGView'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function DagDetailPage({ params }: any) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!userId) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>My Curriculums</h1>
        <p>Please sign in to view this curriculum.</p>
      </div>
    )
  }
  const [dag] = await db
    .select()
    .from(topicDags)
    .where(and(eq(topicDags.userId, userId), eq(topicDags.id, params.id)))
  if (!dag) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>My Curriculums</h1>
        <p>Curriculum not found.</p>
      </div>
    )
  }
  return (
    <div style={{ padding: '2rem' }}>
      <h1>My Curriculums</h1>
      <strong>{new Date(dag.createdAt).toLocaleString()}</strong>
      <div>{JSON.parse(dag.topics).join(', ')}</div>
      <TopicDAGView graph={dag.graph} />
    </div>
  )
}
