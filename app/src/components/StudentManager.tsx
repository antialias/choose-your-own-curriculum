'use client'
import { useEffect, useState } from 'react'
import { StudentForm } from './StudentForm'

interface Student {
  id: string
  name: string
  email: string | null
}

export function StudentManager() {
  const [students, setStudents] = useState<Student[]>([])

  const load = async () => {
    const res = await fetch('/api/students')
    if (res.ok) {
      const data = (await res.json()) as { students: Student[] }
      setStudents(data.students)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div>
      <StudentForm onSuccess={load} />
      <ul>
        {students.map((s) => (
          <li key={s.id}>
            <StudentForm student={s} onSuccess={load} />
          </li>
        ))}
      </ul>
    </div>
  )
}
