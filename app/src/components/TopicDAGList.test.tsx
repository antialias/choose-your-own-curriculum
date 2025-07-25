import { render, screen, fireEvent } from '@testing-library/react'
import { TopicDAGList } from './TopicDAGList'
import type { Mock } from 'vitest'
vi.mock('react-mermaid2', () => ({ default: () => <div data-testid="mermaid" /> }))

vi.stubGlobal('fetch', vi.fn())
const mockFetch = fetch as unknown as Mock

interface Dag { id: string; topics: string; graph: unknown; createdAt: string }

function mockGet(dags: Dag[]) {
  mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ dags }) })
}

beforeEach(() => {
  mockFetch.mockReset()
})

test('loads DAGs on mount', async () => {
  mockGet([{ id: '1', topics: JSON.stringify(['A', 'B']), graph: { nodes: [{ id: 'a', label: 'A', desc: '', tags: ['t1','t2','t3'] }], edges: [] }, createdAt: new Date().toISOString() }])
  render(<TopicDAGList />)
  expect(mockFetch).toHaveBeenCalledWith('/api/topic-dags')
  expect(await screen.findByText('A, B')).toBeInTheDocument()
})

test('shows graph when row clicked', async () => {
  const dag = { id: '1', topics: JSON.stringify(['A']), graph: { nodes: [{ id: 'a', label: 'A', desc: '', tags: ['t1','t2','t3'] }], edges: [] }, createdAt: new Date().toISOString() }
  mockGet([dag])
  render(<TopicDAGList />)
  const row = await screen.findByText('A')
  fireEvent.click(row)
  expect(await screen.findByTestId('mermaid')).toBeInTheDocument()
})
