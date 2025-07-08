import { render, screen } from '@testing-library/react'
import { TagPill } from './TagPill'

test('shows tag text', () => {
  render(<TagPill text="science" color="red" />)
  expect(screen.getByText('science')).toBeInTheDocument()
})
