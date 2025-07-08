import { render, fireEvent, screen } from '@testing-library/react'
import { StudentForm } from './StudentForm'
import I18nProvider from './I18nProvider'
import '@testing-library/jest-dom'

vi.mock('next/navigation', () => ({ useRouter: () => ({}) }))

describe('StudentForm', () => {
  it('shows validation errors', async () => {
    render(
      <I18nProvider>
        <StudentForm />
      </I18nProvider>
    )
    fireEvent.submit(screen.getByRole('button'))
    expect(await screen.findByText('Name is required')).toBeInTheDocument()
  })
})
