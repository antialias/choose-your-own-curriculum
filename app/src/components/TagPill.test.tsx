import { render, screen } from '@testing-library/react'
import { TagPill } from './TagPill'

describe('TagPill', () => {
  it('renders text', () => {
    render(<TagPill text="math" vector={[0.1, 0.2, 0.3]} />)
    expect(screen.getByText('math')).toBeInTheDocument()
  })
})
