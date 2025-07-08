vi.mock('react-mermaid2', () => ({ default: () => <div data-testid="mermaid" /> }))
import { render, screen } from '@testing-library/react'
import { StudentCurriculum } from './StudentCurriculum'
import type { Mock } from 'vitest'

vi.stubGlobal('fetch', vi.fn())
const mockFetch = fetch as unknown as Mock

function mockStudent(topicDagId: string | null) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () =>
      Promise.resolve({
        student: {
          topicDagId,
          topics: topicDagId ? ['A', 'B'] : null,
          graph: topicDagId
            ? { nodes: [{ id: 'a', label: 'A', desc: '', tags: ['t1','t2','t3'] }], edges: [] }
            : null,
        },
      }),
  })
}

function mockDags() {
  mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ dags: [] }) })
}

describe('StudentCurriculum', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('shows selector when no curriculum', async () => {
    mockStudent(null)
    mockDags()
    render(<StudentCurriculum studentId="s1" />)
    expect(await screen.findByText('Curriculum')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })

  it('shows graph when curriculum set', async () => {
    mockStudent('d1')
    mockDags()
    render(<StudentCurriculum studentId="s1" />)
    expect(await screen.findByText('A, B')).toBeInTheDocument()
  })
})
