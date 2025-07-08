import { render, screen } from '@testing-library/react'
import { DagList } from './DagList'
import type { Mock } from 'vitest'

vi.stubGlobal('fetch', vi.fn())
const mockFetch = fetch as unknown as Mock

interface Dag { id: string; topics: string[]; graph: string; dateCreated: string }
function mockGet(dags: Dag[]) {
  mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ dags }) })
}

describe('DagList', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('loads dags on mount', async () => {
    mockGet([{ id: '1', topics: ['A'], graph: '', dateCreated: new Date().toISOString() }])
    render(<DagList />)
    expect(mockFetch).toHaveBeenCalledWith('/api/dags')
    expect(await screen.findByText((t) => t.includes('A'))).toBeInTheDocument()
  })
})
