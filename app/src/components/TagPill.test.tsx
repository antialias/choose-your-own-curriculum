import { render, screen } from '@testing-library/react'
import { TagPill } from './TagPill'
import userEvent from '@testing-library/user-event'
import type { Graph } from '@/graphSchema'

describe('TagPill', () => {
  it('renders text', () => {
    render(<TagPill text="math" vector={[0.1, 0.2, 0.3]} score={0} />)
    expect(screen.getByText('math')).toBeInTheDocument()
  })

  it('shows tooltip when tag matches graph', async () => {
    const graph: Graph = {
      nodes: [
        { id: 'a', label: 'A', desc: '', tags: ['math'], grade: undefined, prereq: [] },
        { id: 'b', label: 'B', desc: '', tags: ['b'], grade: undefined, prereq: ['a'] },
      ],
      edges: [['a', 'b']],
    }
    render(<TagPill text="math" vector={[0, 0, 0]} score={0.8} graph={graph} />)
    await userEvent.hover(screen.getByText('math'))
    expect((await screen.findAllByText('A')).length).toBeGreaterThan(0)
  })

  it('uses larger font for higher score', () => {
    render(<TagPill text="big" vector={[0, 0, 0]} score={1} />)
    const el = screen.getByText('big')
    expect(el.className).toContain('fs_xl')
  })
})
