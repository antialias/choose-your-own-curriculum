import { render, fireEvent, screen } from '@testing-library/react'
import { StudentForm } from './StudentForm'
import QueryProvider from './QueryProvider'
import I18nProvider from './I18nProvider'
import '@testing-library/jest-dom'

vi.mock('next/navigation', () => ({ useRouter: () => ({}) }))

describe('StudentForm', () => {
  it('shows validation errors', async () => {
    render(
      <QueryProvider>
        <I18nProvider lng="en">
          <StudentForm />
        </I18nProvider>
      </QueryProvider>
    )
    fireEvent.submit(await screen.findByRole('button'))
    expect(await screen.findByText('Name is required')).toBeInTheDocument()
  })
})
