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
  threshold: number
}

export function StudentCurriculum({ studentId }: { studentId: string }) {
  const [data, setData] = useState<StudentData | null>(null)
  const [dags, setDags] = useState<Dag[]>([])
  const [selected, setSelected] = useState('')
  const [editing, setEditing] = useState(false)
  const [coverage, setCoverage] = useState<Record<string, number> | null>(null)
  const [styles, setStyles] = useState<Record<string, string>>({})
  const [currentTopics, setCurrentTopics] = useState<string[]>([])
  const { t } = useTranslation()

  const load = async () => {
    const res = await fetch(`/api/students/${studentId}`)
    if (res.ok) {
      const json = (await res.json()) as {
        student: {
          topicDagId: string | null
          topics: string[] | null
          graph: Graph | null
          coverageMasteryThreshold: number
        }
      }
      const s = json.student
      setData({
        topicDagId: s.topicDagId,
        topics: s.topics || [],
        graph: s.graph,
        threshold: s.coverageMasteryThreshold ?? 0,
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

  useEffect(() => {
    const handler = () => {
      loadCoverage()
      load()
    }
    window.addEventListener('coverageThresholdChanged', handler)
    return () => window.removeEventListener('coverageThresholdChanged', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    if (!data?.graph || !coverage) return
    const threshold = data.threshold
    const mastered = new Set(
      data.graph.nodes
        .filter((n) => (coverage[n.id] ?? 0) >= threshold)
        .map((n) => n.id),
    )
    const current = new Set<string>()
    for (const [from, to] of data.graph.edges) {
      if (mastered.has(from) && !mastered.has(to)) current.add(to)
    }
    const future = new Set<string>()
    for (const [from, to] of data.graph.edges) {
      if (current.has(from) && !mastered.has(to) && !current.has(to)) {
        future.add(to)
      }
    }
    const styleMap: Record<string, string> = {}
    mastered.forEach((id) => (styleMap[id] = 'fill:#ffd700,color:#000'))
    current.forEach((id) => (styleMap[id] = 'fill:#38a169,color:#fff'))
    future.forEach((id) => (styleMap[id] = 'fill:#e53e3e,color:#fff'))
    setStyles(styleMap)
    setCurrentTopics(
      Array.from(current).map(
        (id) => data.graph!.nodes.find((n) => n.id === id)?.label || id,
      ),
    )
  }, [coverage, data?.graph, data?.threshold])

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
            styles={styles}
          />
        </div>
      )}
      {currentTopics.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          <strong>{t('currentTopics')}:</strong> {currentTopics.join(', ')}
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
