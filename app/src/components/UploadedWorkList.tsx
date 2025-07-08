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
  summary: string | null
  dateUploaded: string
  dateCompleted: string | null
  tags: Tag[]
}

interface Range {
  min: number[]
  max: number[]
}

export function UploadedWorkList() {
  const [works, setWorks] = useState<Work[]>([])
  const [range, setRange] = useState<Range | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadWorks = async () => {
    try {
      const res = await fetch('/api/upload-work')
      if (!res.ok) throw new Error('load error')
      const data = (await res.json()) as { works: Work[]; range?: Range }
      setWorks(data.works)
      if (data.range) setRange(data.range)
    } catch {
      setError('Failed to load uploads')
    }
  }

  useEffect(() => {
    loadWorks()
  }, [])

  const handleStart = () => {
    setWorks((prev) => [
      {
        id: 'pending',
        summary: 'Processing...',
        dateUploaded: new Date().toISOString(),
        dateCompleted: null,
        tags: [],
      },
      ...prev,
    ])
  }

  const handleSuccess = () => {
    loadWorks()
  }

  const handleError = () => {
    setWorks((prev) => prev.filter((w) => w.id !== 'pending'))
    setError('Upload failed')
  }

  return (
    <div>
      <UploadForm
        onUploadStart={handleStart}
        onSuccess={handleSuccess}
        onError={handleError}
      />
      {error && <p>{error}</p>}
      <ul>
        {works.map((w) => (
          <li key={w.id} style={{ marginBottom: '1rem' }}>
            <strong>{new Date(w.dateCompleted || w.dateUploaded).toDateString()}</strong>
            <SummaryWithMath text={w.summary ?? ''} />
            {w.tags.length > 0 && (
              <div>
                {w.tags.map((t) => (
                  <TagPill key={t.text} text={t.text} vector={t.vector} range={range ?? undefined} />
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
