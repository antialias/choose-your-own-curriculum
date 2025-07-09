import { render, screen, fireEvent } from '@testing-library/react'
import { UploadedWorkList } from './UploadedWorkList'
import QueryProvider from './QueryProvider'
import type { Mock } from 'vitest'

vi.stubGlobal('fetch', vi.fn())

const mockFetch = fetch as unknown as Mock

interface Tag {
  text: string
  vector: number[]
  score: number
}

interface Work {
  id: string
  studentId: string
  summary: string
  dateUploaded: string
  dateCompleted: string | null
  tags: Tag[]
  hasThumbnail: boolean
  originalMimeType: string | null
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
      tags: [{ text: 't1', vector: [0, 0, 0], score: 0.9 }],
      hasThumbnail: true,
      originalMimeType: 'image/png',
    },
  ])
    render(
      <QueryProvider>
        <UploadedWorkList />
      </QueryProvider>
    )
    expect(mockFetch).toHaveBeenNthCalledWith(1, '/api/students')
    expect(mockFetch).toHaveBeenNthCalledWith(2, '/api/students', undefined)
    expect(mockFetch).toHaveBeenNthCalledWith(3, '/api/upload-work')
    expect(await screen.findByText('sum')).toBeInTheDocument()
    expect(await screen.findByText('t1')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      '/api/upload-work/1?type=thumbnail'
    )
  })

  it('shows placeholder when thumbnail missing', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ students: [] }) })
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ students: [] }) })
    mockGet([
      {
        id: '2',
        studentId: 's1',
        summary: 'sum2',
        dateUploaded: new Date().toISOString(),
        dateCompleted: null,
        tags: [],
        hasThumbnail: false,
        originalMimeType: 'application/pdf',
      },
    ])
    render(
      <QueryProvider>
        <UploadedWorkList />
      </QueryProvider>
    )
    const placeholder = await screen.findByTestId('thumbnail-placeholder')
    expect(placeholder).toHaveTextContent('PDF')
  })

  it('handles actions', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ students: [] }) })
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ students: [] }) })
    mockGet([
      {
        id: '3',
        studentId: 's1',
        summary: 'sum3',
        dateUploaded: new Date().toISOString(),
        dateCompleted: null,
        tags: [],
        hasThumbnail: false,
        originalMimeType: null,
      },
    ])
    render(
      <QueryProvider>
        <UploadedWorkList />
      </QueryProvider>
    )
    const select = await screen.findByTestId('action-3')
    await fireEvent.change(select, { target: { value: 'delete' } })
    expect(mockFetch).toHaveBeenCalledWith('/api/upload-work/3', { method: 'DELETE' })
  })

})
