'use client'
import { CurriculumGraphProvider } from './CurriculumGraphContext'
import { StudentCurriculum } from './StudentCurriculum'
import { UploadedWorkList } from './UploadedWorkList'

export function StudentProgressClient({ studentId }: { studentId: string }) {
  return (
    <CurriculumGraphProvider>
      <StudentCurriculum studentId={studentId} />
      <UploadedWorkList studentId={studentId} />
    </CurriculumGraphProvider>
  )
}
