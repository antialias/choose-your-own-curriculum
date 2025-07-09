'use client'
import { useEffect, useRef } from 'react'
import { createRoot, Root } from 'react-dom/client'
import Mermaid from 'react-mermaid2'
import type { Graph } from '@/graphSchema'
import { graphToMermaid } from '@/graphToMermaid'
import { Tooltip } from './Tooltip'

export function GraphWithTooltips({
  graph,
  styles = {},
}: {
  graph: Graph
  styles?: Record<string, string>
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return
    const spans = container.querySelectorAll<HTMLSpanElement>('.dag-node')
    const roots: Root[] = []
    spans.forEach((span) => {
      const tags = span.dataset.tags
      if (!tags) return
      const text = span.textContent || ''
      const root = createRoot(span)
      roots.push(root)
      root.render(
        <Tooltip content={tags.split(', ').join(', ')}>
          <span>{text}</span>
        </Tooltip>
      )
    })
    return () => {
      roots.forEach((r) => r.unmount())
    }
  }, [graph])

  const styleLines = Object.entries(styles)
    .map(([id, style]) => `style ${id} ${style}`)
    .join('\n')
  const chart = `${graphToMermaid(graph, { htmlLabels: true })}\n${styleLines}`

  return (
    <div ref={ref}>
      <Mermaid key={chart} chart={chart} config={{ securityLevel: 'loose' }} />
    </div>
  )
}
