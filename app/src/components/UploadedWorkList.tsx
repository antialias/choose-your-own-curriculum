'use client'
import { useState } from 'react'
import { UploadForm, UploadFormCallbacks } from './UploadForm'
export type UploadedWork = {
  id: string
  dateUploaded: Date
  dateCompleted: Date | null
  summary: string | null
}

export function UploadedWorkList({ initialWorks }: { initialWorks: UploadedWork[] }) {
  const [works, setWorks] = useState<(UploadedWork & { processing?: boolean; error?: string })[]>(initialWorks)

  const handleUploadStart: UploadFormCallbacks['onUploadStart'] = (id, { dateCompleted }) => {
    setWorks((w) => [
      {
        id,
        dateUploaded: new Date(),
        dateCompleted: dateCompleted || null,
        summary: '',
        processing: true,
      },
      ...w,
    ])
  }

  const handleUploadComplete: UploadFormCallbacks['onUploadComplete'] = async (id) => {
    try {
      const res = await fetch('/api/upload-work')
      if (res.ok) {
        const data = (await res.json()) as { works: UploadedWork[] }
        setWorks(data.works)
        return
      }
      throw new Error('Failed to refresh')
    } catch {
      setWorks((w) => w.map((item) => (item.id === id ? { ...item, processing: false, error: 'Upload failed' } : item)))
    }
  }

  const handleUploadError: UploadFormCallbacks['onUploadError'] = (id, error) => {
    setWorks((w) => w.map((item) => (item.id === id ? { ...item, processing: false, error: error.message } : item)))
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Uploaded Work</h1>
      <UploadForm
        onUploadStart={handleUploadStart}
        onUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />
      <ul>
        {works.map((w) => (
          <li key={w.id} style={{ marginBottom: '1rem' }}>
            <strong>{new Date(w.dateCompleted || w.dateUploaded).toDateString()}</strong>
            {w.processing ? <p>Processing...</p> : <p>{w.summary}</p>}
            {w.error && <p style={{ color: 'red' }}>{w.error}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}
