import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StudentForm } from './StudentForm'

test('submits student data', async () => {
  const user = userEvent.setup()
  const handleSubmit = vi.fn(async () => {})
  render(<StudentForm onSubmit={handleSubmit} />)
  await user.type(screen.getByPlaceholderText('Name'), 'Bob')
  await user.type(screen.getByPlaceholderText('Email'), 'bob@example.com')
  await user.click(screen.getByRole('button', { name: /save/i }))
  expect(handleSubmit).toHaveBeenCalledWith({ name: 'Bob', email: 'bob@example.com' })
})
