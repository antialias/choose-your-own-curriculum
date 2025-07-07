'use client'
import { SummaryWithMath } from '@/components/SummaryWithMath';
import { useEffect, useState } from 'react'
import { UploadForm } from './UploadForm'

interface Work {
  id: string
  summary: string | null
  dateUploaded: string
  dateCompleted: string | null
}

export function UploadedWorkList() {
  const [works, setWorks] = useState<Work[]>([])
  const [error, setError] = useState<string | null>(null)

  const loadWorks = async () => {
    try {
      const res = await fetch('/api/upload-work')
      if (!res.ok) throw new Error('load error')
      const data = (await res.json()) as { works: Work[] }
      setWorks(data.works)
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
          </li>
        ))}
      </ul>
    </div>
  )
}
