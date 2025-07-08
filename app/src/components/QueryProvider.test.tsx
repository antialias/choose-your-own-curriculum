import { render, screen } from '@testing-library/react'
import QueryProvider from './QueryProvider'

test('renders children', () => {
  render(
    <QueryProvider>
      <span>child</span>
    </QueryProvider>
  )
  expect(screen.getByText('child')).toBeInTheDocument()
})
