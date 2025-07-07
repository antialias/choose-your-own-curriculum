'use client'
import { useEffect, useState } from 'react'

type Student = { id: string; name: string; email: string | null }

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([])
  useEffect(() => {
    fetch('/api/students')
      .then((r) => r.json())
      .then((d) => setStudents(d.students))
  }, [])
  return (
    <ul>
      {students.map((s) => (
        <li key={s.id}>{s.name} {s.email}</li>
      ))}
    </ul>
  )
}
