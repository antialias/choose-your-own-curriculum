import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CurriculumGraph } from './CurriculumGraph'
import type { Graph } from '@/graphSchema'

vi.mock('react-mermaid2', () => ({
  default: () => (
    <svg data-testid="mermaid">
      <g id="a"><rect width="40" height="20" /></g>
    </svg>
  ),
}))

vi.mock('@/graphToMermaid', () => ({ graphToMermaid: () => 'graph' }))

function rect(x: number, y: number, w: number, h: number) {
  return { x, y, width: w, height: h, top: y, left: x, right: x + w, bottom: y + h, toJSON: () => '' }
}

describe('CurriculumGraph', () => {
  it('shows tags on hover', async () => {
    const graph: Graph = { nodes: [{ id: 'a', label: 'A', desc: '', tags: ['t1','t2'], prereq: [], grade: undefined }], edges: [] }
    const { container } = render(<CurriculumGraph graph={graph} />)
    const g = container.querySelector('g#a') as SVGGraphicsElement
    const svg = container.querySelector('svg') as SVGSVGElement
    g.getBoundingClientRect = () => rect(0, 0, 40, 20)
    svg.getBoundingClientRect = () => rect(0, 0, 40, 20)
    await new Promise((r) => setTimeout(r))
    await userEvent.hover(container.querySelector('div[style]') as HTMLElement)
    expect((await screen.findAllByText('t1, t2')).length).toBeGreaterThan(0)
  })
})
