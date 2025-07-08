'use client'
import { useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { StudentForm } from './StudentForm'

interface Student {
  id: string
  name: string
  email: string | null
}

export function StudentManager() {
  const queryClient = useQueryClient()
  const { data } = useQuery({ queryKey: ['/students'] })
  const students = (data as { students: Student[] } | undefined)?.students ?? []

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['/students'] })
  }, [queryClient])

  return (
    <div>
      <StudentForm onSuccess={invalidate} />
      <ul>
        {students.map((s) => (
          <li key={s.id}>
            <div style={{ marginBottom: '0.5rem' }}>
              <a href={`/students/${s.id}`}>{s.name}</a>
            </div>
            <StudentForm student={s} onSuccess={invalidate} />
          </li>
        ))}
      </ul>
    </div>
  )
}
