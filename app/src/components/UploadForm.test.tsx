import { render, fireEvent, screen } from '@testing-library/react'
import { UploadForm } from './UploadForm'
import I18nProvider from './I18nProvider'
import '@testing-library/jest-dom'

vi.mock('next/navigation', () => ({ useRouter: () => ({}) }))

describe('UploadForm', () => {
  it('shows validation errors', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ students: [] }) }) as unknown as typeof fetch
    render(
      <I18nProvider lng="en">
        <UploadForm />
      </I18nProvider>
    )
    fireEvent.submit(await screen.findByRole('button'))
    expect(await screen.findByText('File or note is required')).toBeInTheDocument()
    expect(await screen.findByText('Student ID is required')).toBeInTheDocument()
  })

})
