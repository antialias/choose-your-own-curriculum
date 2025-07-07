import { render, fireEvent, screen } from '@testing-library/react'
import { StudentForm } from './StudentForm'
import '@testing-library/jest-dom'

vi.mock('next/navigation', () => ({ useRouter: () => ({}) }))

describe('StudentForm', () => {
  it('shows validation errors', async () => {
    render(<StudentForm onSubmit={vi.fn()} />)
    fireEvent.submit(screen.getByRole('button'))
    expect(await screen.findByText('Name is required')).toBeInTheDocument()
  })
})
