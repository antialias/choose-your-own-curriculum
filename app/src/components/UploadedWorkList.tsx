'use client'
import { SummaryWithMath } from '@/components/SummaryWithMath'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { UploadForm } from './UploadForm'
import { TagPill } from './TagPill'
import { useTranslation } from 'react-i18next'

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
  nodes?: { id: string; label: string; relevancy: number }[]
}

export function UploadedWorkList({ studentId = '' }: { studentId?: string } = {}) {
  const [groups, setGroups] = useState<Record<string, Work[]>>({})
  const { data: studentsData } = useQuery({ queryKey: ['/students'] })
  const students = (studentsData as { students: { id: string; name: string }[] } | undefined)?.students ?? []
  const [groupBy, setGroupBy] = useState('')
  const [filterStudent, setFilterStudent] = useState(studentId)
  const [filterDay, setFilterDay] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [topicDagId, setTopicDagId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    setFilterStudent(studentId)
    if (studentId) {
      fetch(`/api/students/${studentId}`).then(async (res) => {
        if (res.ok) {
          const data = (await res.json()) as {
            student: { topicDagId: string | null }
          }
          setTopicDagId(data.student.topicDagId || '')
        }
      })
    } else {
      setTopicDagId('')
    }
  }, [studentId])


  const loadWorks = async () => {
    try {
      const params = new URLSearchParams()
      if (groupBy) params.set('group', groupBy)
      if (filterStudent) params.set('studentId', filterStudent)
      if (filterDay) params.set('day', filterDay)
      if (filterTag) params.set('tag', filterTag)
      if (topicDagId) params.set('topicDagId', topicDagId)
      const url = `/api/upload-work${params.size ? `?${params.toString()}` : ''}`
      const res = await fetch(url)
      if (!res.ok) throw new Error('load error')
      const data = (await res.json()) as { groups: Record<string, Work[]> }
      setGroups(data.groups)
    } catch {
      setError('failedLoad')
    }
  }


  useEffect(() => {
    loadWorks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupBy, filterStudent, filterDay, filterTag, topicDagId])

  const handleStart = () => {
    setError(null)
  }

  const handleSuccess = () => {
    loadWorks()
  }

  const handleError = () => {
    setError('uploadFailed')
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
          {t('groupBy')}
          <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
            <option value="">{t('none')}</option>
            <option value="student">{t('student')}</option>
            <option value="day">{t('day')}</option>
            <option value="tag">{t('tag')}</option>
          </select>
        </label>
        <label>
          {t('student')}
          <select
            value={filterStudent}
            onChange={(e) => setFilterStudent(e.target.value)}
          >
            <option value="">{t('all')}</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t('day')}
          <input
            type="date"
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
          />
        </label>
        <label>
          {t('tag')}
          <input
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
          />
        </label>
      </div>
      {error && <p>{t(error)}</p>}
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
                {w.nodes && w.nodes.length > 0 && (
                  <ul style={{ marginTop: '0.5rem' }}>
                    {w.nodes.map((n) => (
                      <li key={n.id}>
                        {n.label} - {n.relevancy}%
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
