'use client'
import { useEffect, useState } from 'react'

interface Dag {
  id: string
  topics: string[]
  graph: string
  dateCreated: string
}

export function DagList() {
  const [dags, setDags] = useState<Dag[]>([])
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      const res = await fetch('/api/dags')
      if (!res.ok) throw new Error('failed')
      const data = (await res.json()) as { dags: Dag[] }
      setDags(data.dags)
    } catch {
      setError('Failed to load DAGs')
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div>
      {error && <p>{error}</p>}
      <ul>
        {dags.map((d) => (
          <li key={d.id} style={{ marginBottom: '1rem' }}>
            <strong>{new Date(d.dateCreated).toLocaleDateString()}</strong>: {d.topics.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  )
}
