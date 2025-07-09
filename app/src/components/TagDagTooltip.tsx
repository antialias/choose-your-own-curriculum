'use client'
import { Graph, Node } from '@/graphSchema'
import { css } from '@/styled-system/css'

function neighbors(graph: Graph, node: Node) {
  const from = graph.edges
    .filter(e => e[1] === node.id)
    .map(e => graph.nodes.find(n => n.id === e[0])!)
    .filter(Boolean)
  const to = graph.edges
    .filter(e => e[0] === node.id)
    .map(e => graph.nodes.find(n => n.id === e[1])!)
    .filter(Boolean)
  return { from, to }
}

export function TagDagTooltip({ tag, graph }: { tag: string; graph: Graph }) {
  const nodes = graph.nodes.filter(n => n.tags.includes(tag))
  if (nodes.length === 0) return null
  return (
    <div className={css({ display: 'flex', flexDir: 'column', gap: '2' })}>
      {nodes.map(node => {
        const { from, to } = neighbors(graph, node)
        return (
          <div key={node.id} className={css({})}>
            <div className={css({ fontWeight: 'bold' })}>{node.label}</div>
            {from.length > 0 && (
              <div className={css({ fontSize: 'sm' })}>
                from: {from.map(f => f.label).join(', ')}
              </div>
            )}
            {to.length > 0 && (
              <div className={css({ fontSize: 'sm' })}>
                to: {to.map(t => t.label).join(', ')}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
