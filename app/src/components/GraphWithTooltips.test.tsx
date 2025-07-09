vi.mock('react-mermaid2', () => ({ default: () => <div data-testid="mermaid" /> }))
import { render, screen } from '@testing-library/react'
import { GraphWithTooltips } from './GraphWithTooltips'
import type { Graph } from '@/graphSchema'

test('renders mermaid graph', () => {
  const graph: Graph = {
    nodes: [{ id: 'a', label: 'A', desc: '', prereq: [], tags: ['t1', 't2', 't3'] }],
    edges: [],
  }
  render(<GraphWithTooltips graph={graph} />)
  expect(screen.getByTestId('mermaid')).toBeInTheDocument()
})
