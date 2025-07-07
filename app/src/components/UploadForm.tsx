'use client'
import { useState } from 'react'

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    padding: '1rem',
  },
}

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return
    const formData = new FormData(e.currentTarget)
    formData.append('file', file)
    await fetch('/api/upload-work', { method: 'POST', body: formData })
    e.currentTarget.reset()
    setFile(null)
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} required />
      <input type="date" name="dateCompleted" />
      <input type="text" name="studentId" placeholder="Student ID" required />
      <button type="submit">Upload</button>
    </form>
  )
}
