vi.mock('react-mermaid2', () => ({ default: () => <div data-testid="mermaid" /> }))
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StudentCurriculum } from './StudentCurriculum'
import I18nProvider from './I18nProvider'
import type { Mock } from 'vitest'

vi.stubGlobal('fetch', vi.fn())
const mockFetch = fetch as unknown as Mock
const user = userEvent.setup()

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

function mockCoverage() {
  mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ coverage: {} }) })
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
    mockCoverage()
    render(
      <I18nProvider lng="en">
        <StudentCurriculum studentId="s1" />
      </I18nProvider>
    )
    expect(await screen.findByText('Curriculum')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })

  it('shows graph when curriculum set', async () => {
    mockStudent('d1')
    mockDags()
    mockCoverage()
    render(
      <I18nProvider lng="en">
        <StudentCurriculum studentId="s1" />
      </I18nProvider>
    )
    expect(await screen.findByText('A, B')).toBeInTheDocument()
  })

  it('allows changing curriculum', async () => {
    mockStudent('d1')
    mockDags()
    mockCoverage()
    render(
      <I18nProvider lng="en">
        <StudentCurriculum studentId="s1" />
      </I18nProvider>
    )
    expect(await screen.findByText('A, B')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Change curriculum' }))
    expect(await screen.findByRole('button', { name: 'Save' })).toBeDisabled()
  })
})
