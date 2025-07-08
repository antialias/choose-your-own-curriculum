'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Dag {
  id: string
  topics: string
  graph: string
  createdAt: string
}

export function TopicDAGList() {
  const [dags, setDags] = useState<Dag[]>([])

  const load = async () => {
    const res = await fetch('/api/topic-dags')
    if (res.ok) {
      const data = (await res.json()) as { dags: Dag[] }
      setDags(data.dags)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <ul>
      {dags.map((d) => (
        <li key={d.id} style={{ marginBottom: '1rem' }}>
          <Link
            href={`/topic-dags/${d.id}`}
            style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
          >
            <strong>{new Date(d.createdAt).toLocaleString()}</strong>
            <div>{JSON.parse(d.topics).join(', ')}</div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
