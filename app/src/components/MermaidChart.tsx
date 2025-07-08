'use client'
import Mermaid from 'react-mermaid2'

export function MermaidChart({ chart }: { chart: string }) {
  return <Mermaid chart={chart} />
}
