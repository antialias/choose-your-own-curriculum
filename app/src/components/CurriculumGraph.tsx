'use client'
import { useEffect, useRef, useState } from 'react'
import Mermaid from 'react-mermaid2'
import { css } from '@/styled-system/css'
import { graphToMermaid } from '@/graphToMermaid'
import type { Graph } from '@/graphSchema'
import { Tooltip } from './Tooltip'

type Overlay = { id: string; tags: string[]; left: number; top: number; width: number; height: number }

function getRects(container: HTMLDivElement, graph: Graph): Overlay[] {
  const svg = container.querySelector('svg')
  if (!svg) return []
  const containerRect = container.getBoundingClientRect()
  return graph.nodes.map((n) => {
    const el = svg.querySelector<SVGGElement>(`#${n.id}`)
    if (!el) return null
    const r = el.getBoundingClientRect()
    return {
      id: n.id,
      tags: n.tags,
      left: r.left - containerRect.left,
      top: r.top - containerRect.top,
      width: r.width,
      height: r.height,
    }
  }).filter(Boolean) as Overlay[]
}

export function CurriculumGraph({ graph }: { graph: Graph }) {
  const ref = useRef<HTMLDivElement>(null)
  const [overlays, setOverlays] = useState<Overlay[]>([])

  useEffect(() => {
    const container = ref.current
    if (!container) return
    const update = () => setOverlays(getRects(container, graph))
    const id = setTimeout(update, 0)
    window.addEventListener('resize', update)
    return () => {
      clearTimeout(id)
      window.removeEventListener('resize', update)
    }
  }, [graph])

  return (
    <div ref={ref} className={css({ position: 'relative' })}>
      <Mermaid chart={graphToMermaid(graph)} />
      {overlays.map((o) => (
        <Tooltip key={o.id} content={o.tags.join(', ')}>
          <div
            className={css({ position: 'absolute', bg: 'transparent' })}
            style={{ left: o.left, top: o.top, width: o.width, height: o.height }}
          />
        </Tooltip>
      ))}
    </div>
  )
}
