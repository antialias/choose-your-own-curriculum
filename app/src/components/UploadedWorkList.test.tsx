import { render, screen } from '@testing-library/react'
import { UploadedWorkList } from './UploadedWorkList'
import type { Mock } from 'vitest'

vi.stubGlobal('fetch', vi.fn())

const mockFetch = fetch as unknown as Mock

interface Tag {
  text: string
  vector: number[]
}

interface Work {
  id: string
  summary: string
  dateUploaded: string
  dateCompleted: string | null
  tags: Tag[]
}

function mockGet(works: Work[]) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () =>
      Promise.resolve({ works, range: { min: [-1, -1, -1], max: [1, 1, 1] } }),
  })
}


describe('UploadedWorkList', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('loads works on mount', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ students: [] }) })
    mockGet([
      {
        id: '1',
        summary: 'sum',
        dateUploaded: new Date().toISOString(),
        dateCompleted: null,
        tags: [{ text: 't1', vector: [0, 0, 0] }],
      },
    ])
    render(<UploadedWorkList />)
    expect(mockFetch).toHaveBeenNthCalledWith(1, '/api/students')
    expect(mockFetch).toHaveBeenNthCalledWith(2, '/api/upload-work')
    expect(await screen.findByText('sum')).toBeInTheDocument()
    expect(await screen.findByText('t1')).toBeInTheDocument()
  })

})
