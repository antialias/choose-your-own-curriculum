'use client'
import Mermaid from 'react-mermaid2'

export function TopicDAGView({ graph }: { graph: string }) {
  return (
    <div style={{ marginTop: '2rem', textAlign: 'left' as const }}>
      <Mermaid chart={graph} />
    </div>
  )
}
