'use client'
import { useEffect, useState } from 'react'
import Mermaid from 'react-mermaid2'
import { Graph } from '@/graphSchema'
import { graphToMermaid } from '@/graphToMermaid'

interface Dag {
  id: string
  topics: string
  graph: Graph
}

interface StudentData {
  topicDagId: string | null
  topics: string[]
  graph: Graph | null
}

export function StudentCurriculum({ studentId }: { studentId: string }) {
  const [data, setData] = useState<StudentData | null>(null)
  const [dags, setDags] = useState<Dag[]>([])
  const [selected, setSelected] = useState('')

  const load = async () => {
    const res = await fetch(`/api/students/${studentId}`)
    if (res.ok) {
      const json = (await res.json()) as {
        student: {
          topicDagId: string | null
          topics: string[] | null
          graph: Graph | null
        }
      }
      const s = json.student
      setData({
        topicDagId: s.topicDagId,
        topics: s.topics || [],
        graph: s.graph,
      })
      setSelected(s.topicDagId || '')
    }
  }

  const loadDags = async () => {
    const res = await fetch('/api/topic-dags')
    if (res.ok) {
      const json = (await res.json()) as { dags: Dag[] }
      setDags(json.dags)
    }
  }

  const save = async () => {
    await fetch(`/api/students/${studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicDagId: selected }),
    })
    load()
  }

  useEffect(() => {
    load()
    loadDags()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId])

  if (!data) return null

  if (!data.topicDagId) {
    return (
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Curriculum
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Select</option>
            {dags.map((d) => (
              <option key={d.id} value={d.id}>
                {JSON.parse(d.topics).join(', ')}
              </option>
            ))}
          </select>
        </label>
        <button onClick={save} disabled={!selected} style={{ marginLeft: '0.5rem' }}>
          Save
        </button>
      </div>
    )
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h2>Curriculum</h2>
      <div>{data.topics.join(', ')}</div>
      {data.graph && (
        <div style={{ marginTop: '1rem' }}>
          <Mermaid chart={graphToMermaid(data.graph)} />
        </div>
      )}
    </div>
  )
}
