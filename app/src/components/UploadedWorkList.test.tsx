import { render, screen } from '@testing-library/react'
import { UploadedWorkList } from './UploadedWorkList'
import type { Mock } from 'vitest'

vi.stubGlobal('fetch', vi.fn())

const mockFetch = fetch as unknown as Mock

interface Work {
  id: string
  summary: string
  dateUploaded: string
  dateCompleted: string | null
  tags: string[]
}

function mockGet(works: Work[]) {
  mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ works }) })
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
        tags: ['t1'],
      },
    ])
    render(<UploadedWorkList />)
    expect(mockFetch).toHaveBeenNthCalledWith(1, '/api/students')
    expect(mockFetch).toHaveBeenNthCalledWith(2, '/api/upload-work')
    expect(await screen.findByText('sum')).toBeInTheDocument()
    expect(await screen.findByText('Tags: t1')).toBeInTheDocument()
  })

})
