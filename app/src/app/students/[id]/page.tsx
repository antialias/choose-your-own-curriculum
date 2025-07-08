import { MermaidChart } from '@/components/MermaidChart'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/authOptions'
import { getDb } from '@/db'
import { teacherStudents, teacherStudentCurriculums, topicDags } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { UploadedWorkList } from '@/components/UploadedWorkList'


function CurriculumSelect({
  studentId,
  dags,
}: {
  studentId: string
  dags: { id: string; topics: string }[]
}) {
  'use client'
  const handleChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const dagId = formData.get('dagId') as string
    await fetch(`/api/students/${studentId}/curriculum`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dagId }),
    })
    location.reload()
  }
  return (
    <form onSubmit={handleChange} style={{ marginBottom: '1rem' }}>
      <label>
        Select curriculum
        <select name="dagId" defaultValue="">
          <option value="" disabled>
            Choose curriculum
          </option>
          {dags.map((d) => (
            <option key={d.id} value={d.id}>
              {JSON.parse(d.topics).join(', ')}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">Save</button>
    </form>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function StudentPage({ params }: any) {
  const session = await getServerSession(authOptions)
  const teacherId = (session?.user as { id?: string } | undefined)?.id
  if (!teacherId) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>Please sign in to view student.</p>
      </div>
    )
  }
  const db = getDb()
  const studentId = params.id
  const link = await db
    .select()
    .from(teacherStudents)
    .where(and(eq(teacherStudents.teacherId, teacherId), eq(teacherStudents.studentId, studentId)))
  if (link.length === 0) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>Student not found.</p>
      </div>
    )
  }
  const [mapping] = await db
    .select({
      dagId: teacherStudentCurriculums.dagId,
      topics: topicDags.topics,
      graph: topicDags.graph,
    })
    .from(teacherStudentCurriculums)
    .leftJoin(topicDags, eq(teacherStudentCurriculums.dagId, topicDags.id))
    .where(
      and(
        eq(teacherStudentCurriculums.teacherId, teacherId),
        eq(teacherStudentCurriculums.studentId, studentId)
      )
    )
  const dags = await db
    .select({ id: topicDags.id, topics: topicDags.topics })
    .from(topicDags)
    .where(eq(topicDags.userId, teacherId))
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Student Curriculum</h1>
      {mapping ? (
        <div style={{ marginBottom: '1rem' }}>
          <h3>Selected Topics: {JSON.parse(mapping.topics || '[]').join(', ')}</h3>
          <MermaidChart chart={mapping.graph || ''} />
        </div>
      ) : (
        <CurriculumSelect studentId={studentId} dags={dags} />
      )}
      <h2>Uploaded Work</h2>
      <UploadedWorkList studentId={studentId} />
    </div>
  )
}
