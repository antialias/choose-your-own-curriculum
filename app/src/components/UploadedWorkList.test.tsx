import { render, screen } from '@testing-library/react'
import { UploadedWorkList } from './UploadedWorkList'

vi.stubGlobal('fetch', vi.fn())

const mockFetch = fetch as unknown as vi.Mock

interface Work { id: string; summary: string; dateUploaded: string; dateCompleted: string | null }

function mockGet(works: Work[]) {
  mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ works }) })
}


describe('UploadedWorkList', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('loads works on mount', async () => {
    mockGet([{ id: '1', summary: 'sum', dateUploaded: new Date().toISOString(), dateCompleted: null }])
    render(<UploadedWorkList />)
    expect(mockFetch).toHaveBeenCalledWith('/api/upload-work')
    expect(await screen.findByText('sum')).toBeInTheDocument()
  })

})
