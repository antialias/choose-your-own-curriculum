import { render, screen } from '@testing-library/react'
import { UserProfile } from './UserProfile'

test('renders name and bio', () => {
  render(<UserProfile name="Alice" bio="Hello" />)
  expect(screen.getByText('Alice')).toBeInTheDocument()
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
