'use client'
import { useEffect, useState, useRef } from 'react'
import { Graph } from '@/graphSchema'
import { GraphWithTooltips } from './GraphWithTooltips'

interface Dag {
  id: string
  topics: string
  graph: Graph
  createdAt: string
  tagEmbeddingStatus: string
  tagEmbeddingsTotal: number
  tagEmbeddingsComplete: number
}

export function TopicDAGList() {
  const [dags, setDags] = useState<Dag[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const load = async () => {
    const res = await fetch('/api/topic-dags')
    if (res.ok) {
      const data = (await res.json()) as { dags: Dag[] }
      setDags(data.dags)
      if (data.dags.some((d) => d.tagEmbeddingStatus !== 'complete') && !intervalRef.current) {
        intervalRef.current = setInterval(() => {
          load()
        }, 5000)
      }
      if (data.dags.every((d) => d.tagEmbeddingStatus === 'complete') && intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    const dag = dags.find((d) => d.id === expanded)
    if (!dag) return
    for (const node of dag.graph.nodes) {
      const el =
        document.getElementById(node.id) ||
        document.getElementById(`flowchart-${node.id}`)
      if (el && !el.querySelector('title')) {
        const title = document.createElement('title')
        title.textContent = node.tags.join(', ')
        el.appendChild(title)
      }
    }
  }, [expanded, dags])

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
          <div style={{ fontSize: '0.9rem' }}>
            {d.tagEmbeddingStatus === 'complete'
              ? 'Tags ready'
              : `Tag processing: ${d.tagEmbeddingsComplete}/${d.tagEmbeddingsTotal}`}
          </div>
          {expanded === d.id && (
            <div style={{ marginTop: '1rem' }}>
              <GraphWithTooltips graph={d.graph} />
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
