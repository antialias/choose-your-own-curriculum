import { css } from '@/styled-system/css'
import { useMemo } from 'react'
import type { Graph } from '@/graphSchema'
import { Tooltip } from './Tooltip'
import type { FontSizeToken } from '@/styled-system/tokens'

export type TagPillProps = {
  text: string
  vector: number[]
  score?: number
  graph?: Graph | null
}

function vectorToColor(v: number[]): string {
  if (v.length < 3) return '#999'
  const hue = ((v[0] + 1) / 2) * 360
  const sat = 60 + ((v[1] + 1) / 2) * 40
  const light = 35 + ((v[2] + 1) / 2) * 30
  return `hsl(${Math.floor(hue) % 360}, ${Math.floor(sat)}%, ${Math.floor(light)}%)`
}

export function TagPill({ text, vector, score = 0, graph }: TagPillProps) {
  const color = vectorToColor(vector)
  const sizes: FontSizeToken[] = ['sm', 'md', 'lg', 'xl']
  const idx = Math.round(Math.max(0, Math.min(1, score)) * (sizes.length - 1))
  const fontSize = sizes[idx]
  const info = useMemo(() => {
    if (!graph) return null
    const matches = graph.nodes.filter((n) => n.tags.includes(text))
    if (matches.length === 0) return null
    return matches.map((node) => {
      const fromIds = graph.edges.filter((e) => e[1] === node.id).map((e) => e[0])
      const toIds = graph.edges.filter((e) => e[0] === node.id).map((e) => e[1])
      return {
        node,
        from: graph.nodes.filter((n) => fromIds.includes(n.id)),
        to: graph.nodes.filter((n) => toIds.includes(n.id)),
      }
    })
  }, [graph, text])

  const pill = (
    <span
      className={css({
        display: 'inline-block',
        paddingX: '2',
        paddingY: '1',
        borderRadius: 'full',
        color: 'white',
        fontSize,
        marginRight: '1',
        marginTop: '3',
      })}
      style={{ backgroundColor: color }}
    >
      {text}
    </span>
  )

  if (!info) return pill

  return (
    <Tooltip
      content={
        <div>
          {info.map(({ node, from, to }) => (
            <div key={node.id} className={css({ mb: '2' })}>
              <div className={css({ fontWeight: 'bold' })}>{node.label}</div>
              {from.length > 0 && (
                <div>
                  from: {from.map((f) => f.label).join(', ')}
                </div>
              )}
              {to.length > 0 && (
                <div>
                  to: {to.map((t) => t.label).join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      }
    >
      {pill}
    </Tooltip>
  )
}
