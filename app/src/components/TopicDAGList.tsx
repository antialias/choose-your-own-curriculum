'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
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
  const { data } = useQuery<{ dags: Dag[] }>({ queryKey: ['/topic-dags'] })
  const dags = data?.dags ?? []
  const [expanded, setExpanded] = useState<string | null>(null)

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
