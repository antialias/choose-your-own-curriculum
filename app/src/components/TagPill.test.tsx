import { render, screen } from '@testing-library/react'
import { TagPill } from './TagPill'

test('renders tag text', () => {
  render(<TagPill text="t1" color="#123456" />)
  expect(screen.getByText('t1')).toBeInTheDocument()
})
