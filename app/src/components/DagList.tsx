'use client'
import { useEffect, useState } from 'react'

interface Dag {
  id: string
  topics: string
  graph: string
  createdAt: string
}

export function DagList() {
  const [dags, setDags] = useState<Dag[]>([])
  useEffect(() => {
    fetch('/api/topic-dags')
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data: { dags: Dag[] }) => setDags(data.dags))
      .catch(() => setDags([]))
  }, [])

  return (
    <ul>
      {dags.map((d) => (
        <li key={d.id} style={{ marginBottom: '1rem' }}>
          <strong>{new Date(d.createdAt).toLocaleString()}</strong>
          <div>{JSON.parse(d.topics).join(', ')}</div>
        </li>
      ))}
    </ul>
  )
}
