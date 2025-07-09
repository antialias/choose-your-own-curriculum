'use client'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Graph } from '@/graphSchema'
import { GraphWithTooltips } from './GraphWithTooltips'

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
  const [editing, setEditing] = useState(false)
  const [coverage, setCoverage] = useState<Record<string, number> | null>(null)
  const { t } = useTranslation()

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

  const loadCoverage = async () => {
    if (!data?.topicDagId) return
    const res = await fetch(`/api/students/${studentId}/curriculum-coverage`)
    if (res.ok) {
      const json = (await res.json()) as { coverage: Record<string, number> }
      setCoverage(json.coverage)
    }
  }

  const save = async () => {
    await fetch(`/api/students/${studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicDagId: selected }),
    })
    setEditing(false)
    load()
  }

  useEffect(() => {
    load()
    loadDags()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId])

  useEffect(() => {
    loadCoverage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.topicDagId, studentId])

  if (!data) return null

  if (!data.topicDagId || editing) {
    return (
      <div style={{ marginBottom: '1rem' }}>
        <label>
          {t('curriculum')}
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">{t('select')}</option>
            {dags.map((d) => (
              <option key={d.id} value={d.id}>
                {JSON.parse(d.topics).join(', ')}
              </option>
            ))}
          </select>
        </label>
        <button onClick={save} disabled={!selected} style={{ marginLeft: '0.5rem' }}>
          {t('save')}
        </button>
        {data.topicDagId && (
          <button
            onClick={() => {
              setEditing(false)
              setSelected(data.topicDagId || '')
            }}
            style={{ marginLeft: '0.5rem' }}
          >
            {t('cancel')}
          </button>
        )}
      </div>
    )
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h2>{t('curriculum')}</h2>
      <div>{data.topics.join(', ')}</div>
      {data.graph && (
        <div style={{ marginTop: '1rem' }}>
          <GraphWithTooltips
            graph={{
              ...data.graph,
              nodes: data.graph.nodes.map((n) => ({
                ...n,
                label:
                  coverage && n.id in coverage
                    ? `${n.label} (${coverage[n.id]}%)`
                    : n.label,
              })),
            }}
          />
        </div>
      )}
      <div style={{ marginTop: '0.5rem' }}>
        <button
          onClick={() => {
            setSelected('')
            setEditing(true)
          }}
        >
          {t('change')}
        </button>
      </div>
    </div>
  )
}
