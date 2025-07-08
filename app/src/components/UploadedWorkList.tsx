'use client'
import { SummaryWithMath } from '@/components/SummaryWithMath';
import { useEffect, useState } from 'react';
import { UploadForm } from './UploadForm';

interface Work {
  id: string
  studentId: string
  summary: string | null
  dateUploaded: string
  dateCompleted: string | null
  tags: string[]
}

export function UploadedWorkList() {
  const [groups, setGroups] = useState<{ group: string; works: Work[] }[]>([])
  const [students, setStudents] = useState<{ id: string; name: string }[]>([])
  const [groupBy, setGroupBy] = useState('')
  const [filter, setFilter] = useState('')
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
      params.set('groupBy', groupBy)
      if (filter) {
        if (groupBy === 'student') params.set('studentId', filter)
        if (groupBy === 'day') params.set('date', filter)
        if (groupBy === 'tag') params.set('tag', filter)
      }
      const res = await fetch(`/api/upload-work?${params.toString()}`)
      if (!res.ok) throw new Error('load error')
      const data = (await res.json()) as { groups: { group: string; works: Work[] }[] }
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
  }, [groupBy, filter])

  const handleStart = () => {
    setError(null)
  }

  const handleSuccess = () => {
    loadWorks()
  }

  const handleError = () => {
    loadWorks()
    setError('Upload failed')
  }

  return (
    <div>
      <UploadForm
        onUploadStart={handleStart}
        onSuccess={handleSuccess}
        onError={handleError}
      />
      <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <select value={groupBy} onChange={(e) => { setGroupBy(e.target.value); setFilter('') }}>
          <option value="">None</option>
          <option value="student">Student</option>
          <option value="day">Day</option>
          <option value="tag">Tag</option>
        </select>
        {groupBy === 'student' && (
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All Students</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        )}
        {groupBy === 'day' && (
          <input type="date" value={filter} onChange={(e) => setFilter(e.target.value)} />
        )}
        {groupBy === 'tag' && (
          <input placeholder="Tag" value={filter} onChange={(e) => setFilter(e.target.value)} />
        )}
      </div>
      {error && <p>{error}</p>}
      {groups.map((g) => (
        <div key={g.group} style={{ marginBottom: '1rem' }}>
          {groupBy && <h3>{g.group || 'Ungrouped'}</h3>}
          <ul>
            {g.works.map((w) => (
              <li key={w.id} style={{ marginBottom: '1rem' }}>
                <strong>{new Date(w.dateCompleted || w.dateUploaded).toDateString()}</strong>
                <SummaryWithMath text={w.summary ?? ''} />
                {w.tags.length > 0 && (
                  <div>Tags: {w.tags.join(', ')}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
