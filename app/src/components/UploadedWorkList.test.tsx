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
  studentId: string
  summary: string
  dateUploaded: string
  dateCompleted: string | null
  tags: Tag[]
  thumbnailUrl: string | null
  fileUrl: string
}

function mockGet(works: Work[]) {
  mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ groups: { all: works } }) })
}


describe('UploadedWorkList', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('loads works on mount', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ students: [] }) })
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ students: [] }) })
    mockGet([
      {
        id: '1',
        studentId: 's1',
        summary: 'sum',
        dateUploaded: new Date().toISOString(),
        dateCompleted: null,
        tags: [{ text: 't1', vector: [0, 0, 0] }],
        thumbnailUrl: '/thumb',
        fileUrl: '/file',
      },
    ])
    render(<UploadedWorkList />)
    expect(mockFetch).toHaveBeenNthCalledWith(1, '/api/students')
    expect(mockFetch).toHaveBeenNthCalledWith(2, '/api/students')
    expect(mockFetch).toHaveBeenNthCalledWith(3, '/api/upload-work')
    expect(await screen.findByText('sum')).toBeInTheDocument()
    expect(await screen.findByText('t1')).toBeInTheDocument()
  })

})
