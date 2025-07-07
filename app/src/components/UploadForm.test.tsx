import { render, fireEvent, screen } from '@testing-library/react'
import { UploadForm } from './UploadForm'
import '@testing-library/jest-dom'

vi.mock('next/navigation', () => ({ useRouter: () => ({}) }))

describe('UploadForm', () => {
  it('shows validation errors', async () => {
    render(<UploadForm />)
    fireEvent.submit(screen.getByRole('button'))
    expect(await screen.findByText('File is required')).toBeInTheDocument()
    expect(await screen.findByText('Student ID is required')).toBeInTheDocument()
  })
})
