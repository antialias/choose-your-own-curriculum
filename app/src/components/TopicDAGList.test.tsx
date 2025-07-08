import { render, screen } from '@testing-library/react'
import { TopicDAGList } from './TopicDAGList'
import type { Mock } from 'vitest'

vi.stubGlobal('fetch', vi.fn())
const mockFetch = fetch as unknown as Mock

interface Dag { id: string; topics: string; graph: string; createdAt: string }

function mockGet(dags: Dag[]) {
  mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ dags }) })
}

beforeEach(() => {
  mockFetch.mockReset()
})

test('loads DAGs on mount', async () => {
  mockGet([{ id: '1', topics: JSON.stringify(['A', 'B']), graph: 'g', createdAt: new Date().toISOString() }])
  render(<TopicDAGList />)
  expect(mockFetch).toHaveBeenCalledWith('/api/topic-dags')
  const link = await screen.findByRole('link')
  expect(link).toHaveAttribute('href', '/topic-dags/1')
  expect(link).toHaveTextContent('A, B')
})
