'use client'
import { useEffect, useState } from 'react'
import Mermaid from 'react-mermaid2'
import { Graph } from '@/graphSchema'
import { graphToMermaid } from '@/graphToMermaid'

interface Dag {
  id: string
  topics: string
  graph: Graph
  createdAt: string
}

export function TopicDAGList() {
  const [dags, setDags] = useState<Dag[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)

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
        <li
          key={d.id}
          style={{ marginBottom: '1rem', cursor: 'pointer' }}
          onClick={() =>
            setExpanded((prev) => (prev === d.id ? null : d.id))
          }
        >
          <strong>{new Date(d.createdAt).toLocaleString()}</strong>
          <div>{JSON.parse(d.topics).join(', ')}</div>
          {expanded === d.id && (
            <div style={{ marginTop: '1rem' }}>
              <Mermaid chart={graphToMermaid(d.graph)} />
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
