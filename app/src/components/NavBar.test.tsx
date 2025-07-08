import { render, screen } from '@testing-library/react'
import { NavBar } from './NavBar'
import type { Session } from 'next-auth'

const session: Session = {
  user: { name: 'a', email: 'a@example.com' },
  expires: '1',
}

test('shows sign in link when unauthenticated', () => {
  render(<NavBar session={null} />)
  expect(screen.getByText('Sign in')).toBeInTheDocument()
})

test('shows sign out when authenticated', () => {
  render(<NavBar session={session} />)
  expect(screen.getByText('Sign out')).toBeInTheDocument()
})

test('shows uploaded work link', () => {
  render(<NavBar session={null} />)
  expect(screen.getByText('Uploaded Work')).toBeInTheDocument()
})

test('shows saved dags link', () => {
  render(<NavBar session={null} />)
  expect(screen.getByText('My Curriculums')).toBeInTheDocument()
})
