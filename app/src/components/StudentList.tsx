'use client'
import { useEffect, useState } from 'react'
import { StudentForm } from './StudentForm'
import * as stylex from '@stylexjs/stylex'
import { StudentFields } from '@/forms/student'

interface Student extends StudentFields {
  id: string
}

const styles = stylex.create({
  list: { marginTop: '1rem' },
  item: { marginBottom: '0.5rem' },
})

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([])

  const load = async () => {
    const res = await fetch('/api/students')
    const data = await res.json()
    setStudents(data.students)
  }

  useEffect(() => {
    load()
  }, [])

  const handleAdd = async (data: StudentFields) => {
    await fetch('/api/students', { method: 'POST', body: JSON.stringify(data) })
    load()
  }

  return (
    <div>
      <StudentForm onSubmit={handleAdd} />
      <ul {...stylex.props(styles.list)}>
        {students.map((s) => (
          <li key={s.id} {...stylex.props(styles.item)}>
            {s.name} {s.email && <span>({s.email})</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}
