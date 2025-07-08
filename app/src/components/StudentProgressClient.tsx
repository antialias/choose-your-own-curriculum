'use client'
import { useState } from 'react'
import { StudentCurriculum } from './StudentCurriculum'
import { UploadedWorkList } from './UploadedWorkList'

export function StudentProgressClient({ studentId }: { studentId: string }) {
  const [dagId, setDagId] = useState<string | null>(null)
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Student Progress</h1>
      <StudentCurriculum studentId={studentId} onChange={setDagId} />
      <UploadedWorkList studentId={studentId} topicDagId={dagId || undefined} />
    </div>
  )
}
