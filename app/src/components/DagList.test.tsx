import { render, screen } from '@testing-library/react'
import { DagList } from './DagList'
import type { Mock } from 'vitest'

vi.stubGlobal('fetch', vi.fn())
const mockFetch = fetch as unknown as Mock

const sample = [
  { id: '1', topics: JSON.stringify(['a','b']), graph: 'g', createdAt: new Date().toISOString() }
]

it('loads dags on mount', async () => {
  mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ dags: sample }) })
  render(<DagList />)
  expect(mockFetch).toHaveBeenCalledWith('/api/topic-dags')
  expect(await screen.findByText('a, b')).toBeInTheDocument()
})
