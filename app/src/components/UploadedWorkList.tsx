'use client'
import { SummaryWithMath } from '@/components/SummaryWithMath'
import { useEffect, useState } from 'react'
import { UploadForm } from './UploadForm'
import { TagPill } from './TagPill'

interface Tag {
  text: string
  vector: number[]
}

interface Work {
  id: string
  studentId: string
  summary: string | null
  dateUploaded: string
  dateCompleted: string | null
  tags: Tag[]
}

interface Props {
  studentId?: string
}

export function UploadedWorkList({ studentId: propStudentId }: Props) {
  const [groups, setGroups] = useState<Record<string, Work[]>>({})
  const [students, setStudents] = useState<{ id: string; name: string }[]>([])
  const [groupBy, setGroupBy] = useState('')
  const [filterStudent, setFilterStudent] = useState(propStudentId ?? '')
  const [filterDay, setFilterDay] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [error, setError] = useState<string | null>(null)

  const loadStudents = async () => {
    const res = await fetch('/api/students')
    if (res.ok) {
      const data = (await res.json()) as { students: { id: string; name: string }[] }
      setStudents(data.students)
    }
  }

  const loadWorks = async () => {
    try {
      const params = new URLSearchParams()
      if (groupBy) params.set('group', groupBy)
      if (propStudentId) {
        params.set('studentId', propStudentId)
      } else if (filterStudent) {
        params.set('studentId', filterStudent)
      }
      if (filterDay) params.set('day', filterDay)
      if (filterTag) params.set('tag', filterTag)
      const url = `/api/upload-work${params.size ? `?${params.toString()}` : ''}`
      const res = await fetch(url)
      if (!res.ok) throw new Error('load error')
      const data = (await res.json()) as { groups: Record<string, Work[]> }
      setGroups(data.groups)
    } catch {
      setError('Failed to load uploads')
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

  useEffect(() => {
    loadWorks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupBy, filterStudent, filterDay, filterTag, propStudentId])

  const handleStart = () => {
    setError(null)
  }

  const handleSuccess = () => {
    loadWorks()
  }

  const handleError = () => {
    setError('Upload failed')
  }

  return (
    <div>
      <UploadForm
        onUploadStart={handleStart}
        onSuccess={handleSuccess}
        onError={handleError}
      />
      <div style={{ margin: '1rem 0', display: 'flex', gap: '0.5rem' }}>
        <label>
          Group by
          <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
            <option value="">None</option>
            <option value="student">Student</option>
            <option value="day">Day</option>
            <option value="tag">Tag</option>
          </select>
        </label>
        {!propStudentId && (
          <label>
            Student
            <select
              value={filterStudent}
              onChange={(e) => setFilterStudent(e.target.value)}
            >
              <option value="">All</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <label>
          Day
          <input
            type="date"
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
          />
        </label>
        <label>
          Tag
          <input
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
          />
        </label>
      </div>
      {error && <p>{error}</p>}
      {Object.entries(groups).map(([key, works]) => (
        <div key={key} style={{ marginBottom: '1rem' }}>
          {groupBy && <h3>{
            groupBy === 'student'
              ? students.find((s) => s.id === key)?.name || key
              : key
          }</h3>}
          <ul>
            {works.map((w) => (
              <li key={w.id} style={{ marginBottom: '1rem' }}>
                <strong>
                  {new Date(w.dateCompleted || w.dateUploaded).toDateString()}
                </strong>
                <SummaryWithMath text={w.summary ?? ''} />
                {w.tags.length > 0 && (
                  <div>
                    {w.tags.map((t) => (
                      <TagPill key={t.text} text={t.text} vector={t.vector} />
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
