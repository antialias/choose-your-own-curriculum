import { fireEvent, screen } from '@testing-library/react'
import { renderWithI18n } from '@/test-utils'
import { StudentForm } from './StudentForm'
import '@testing-library/jest-dom'

vi.mock('next/navigation', () => ({ useRouter: () => ({}) }))

describe('StudentForm', () => {
  it('shows validation errors', async () => {
    await renderWithI18n(<StudentForm />)
    fireEvent.submit(screen.getByRole('button'))
    expect(await screen.findByText('Name is required')).toBeInTheDocument()
  })
})
