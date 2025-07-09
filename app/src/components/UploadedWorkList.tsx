'use client'
import { SummaryWithMath } from '@/components/SummaryWithMath'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { UploadForm } from './UploadForm'
import { TagPill } from './TagPill'
import type { Graph } from '@/graphSchema'
import { ThumbnailPlaceholder } from './ThumbnailPlaceholder'
import { useTranslation } from 'react-i18next'

interface Tag {
  text: string
  vector: number[]
  score: number
}

interface Work {
  id: string
  studentId: string
  summary: string | null
  grade: string | null
  extractedStudentName: string | null
  extractedDateOfWork: string | null
  masteryPercent: number | null
  feedback: string | null
  dateUploaded: string
  dateCompleted: string | null
  tags: Tag[]
  hasThumbnail: boolean
  originalMimeType: string | null
}

export function UploadedWorkList({ studentId = '' }: { studentId?: string } = {}) {
  const [groups, setGroups] = useState<Record<string, Work[]>>({})
  const { data: studentsData } = useQuery({ queryKey: ['/students'] })
  const students = (studentsData as { students: { id: string; name: string }[] } | undefined)?.students ?? []
  const [groupBy, setGroupBy] = useState('')
  const [filterStudent, setFilterStudent] = useState(studentId)
  const [filterDay, setFilterDay] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [graph, setGraph] = useState<Graph | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [thumbError, setThumbError] = useState<Record<string, boolean>>({})
  const { t } = useTranslation()

  useEffect(() => {
    setFilterStudent(studentId)
  }, [studentId])

  useEffect(() => {
    if (!filterStudent) {
      setGraph(null)
      return
    }
    const load = async () => {
      const res = await fetch(`/api/students/${filterStudent}`)
      if (res.ok) {
        const data = (await res.json()) as { student: { graph: Graph | null } }
        setGraph(data.student.graph)
      } else {
        setGraph(null)
      }
    }
    load()
  }, [filterStudent])


  const loadWorks = async () => {
    try {
      const params = new URLSearchParams()
      if (groupBy) params.set('group', groupBy)
      if (filterStudent) params.set('studentId', filterStudent)
      if (filterDay) params.set('day', filterDay)
      if (filterTag) params.set('tag', filterTag)
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
  }, [groupBy, filterStudent, filterDay, filterTag])

  const handleStart = () => {
    setError(null)
  }

  const handleSuccess = () => {
    loadWorks()
  }

  const handleError = () => {
    setError('uploadFailed')
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/upload-work/${id}`, { method: 'DELETE' })
    loadWorks()
  }

  const handleReevaluate = async (id: string) => {
    await fetch(`/api/upload-work/${id}/re-evaluate`, { method: 'POST' })
    loadWorks()
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
              <li
                key={w.id}
                style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}
              >
                {w.hasThumbnail && !thumbError[w.id] ? (
                  <img
                    src={`/api/upload-work/${w.id}?type=thumbnail`}
                    alt={t('thumbnailAlt')}
                    style={{ maxWidth: '1.5in', maxHeight: '1.5in' }}
                    onError={() => setThumbError((e) => ({ ...e, [w.id]: true }))}
                  />
                ) : (
                  <ThumbnailPlaceholder mime={w.originalMimeType} />
                )}
                <div>
                  <strong>
                    {new Date(w.dateCompleted || w.dateUploaded).toDateString()}
                  </strong>
                  <SummaryWithMath text={w.summary ?? ''} />
                  {w.grade && (
                    <div>
                      {t('grade')}: {w.grade}
                    </div>
                  )}
                  {w.masteryPercent !== null && (
                    <div>
                      {t('masteryPercent')}: {w.masteryPercent}%
                    </div>
                  )}
                  {w.extractedStudentName && (
                    <div>
                      {t('studentName')}: {w.extractedStudentName}
                    </div>
                  )}
                  {w.extractedDateOfWork && (
                    <div>
                      {t('dateOfWork')}:{' '}
                      {new Date(w.extractedDateOfWork).toDateString()}
                    </div>
                  )}
                  {w.feedback && (
                    <div>
                      {t('feedback')}: {w.feedback}
                    </div>
                  )}
                  {w.tags.length > 0 && (
                    <div>
                      {w.tags.map((t) => (
                        <TagPill
                          key={t.text}
                          text={t.text}
                          vector={t.vector}
                          score={t.score}
                          graph={graph}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <select
                  data-testid={`action-${w.id}`}
                  defaultValue=""
                  onChange={(e) => {
                    const val = e.target.value
                    e.target.value = ''
                    if (val === 'delete') handleDelete(w.id)
                    if (val === 're-evaluate') handleReevaluate(w.id)
                  }}
                >
                  <option value="" disabled>
                    {t('actions')}
                  </option>
                  <option value="re-evaluate">{t('reEvaluate')}</option>
                  <option value="delete">{t('delete')}</option>
                </select>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
