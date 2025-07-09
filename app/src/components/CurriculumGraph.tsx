'use client'
import { useEffect, useRef } from 'react'
import Mermaid from 'react-mermaid2'
import { createRoot } from 'react-dom/client'
import type { Graph } from '@/graphSchema'
import { graphToMermaid } from '@/graphToMermaid'
import { Tooltip } from './Tooltip'

export function CurriculumGraph({ graph }: { graph: Graph }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return
    const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]))
    const labels = container.querySelectorAll<HTMLSpanElement>('.node-label')
    labels.forEach((el) => {
      const id = el.dataset.nodeId
      if (!id || el.dataset.tooltipMounted) return
      const node = nodeMap.get(id)
      if (!node) return
      const root = createRoot(el)
      root.render(
        <Tooltip content={node.tags.join(', ')}>
          <span>{node.label}</span>
        </Tooltip>
      )
      el.dataset.tooltipMounted = 'true'
    })
  }, [graph])

  return (
    <div ref={ref}>
      <Mermaid chart={graphToMermaid(graph)} />
    </div>
  )
}

