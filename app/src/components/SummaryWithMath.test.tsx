import { render } from '@testing-library/react'
import { SummaryWithMath } from './SummaryWithMath'
import '@testing-library/jest-dom'

describe('SummaryWithMath', () => {
  it('renders inline math', () => {
    const { container } = render(
      <SummaryWithMath text="Solve $x^2=1$ and also \\(a+b\\)" />
    )
    expect(container.querySelector('.katex')).toBeInTheDocument()
  })

  it('handles parentheses within math', () => {
    const { getByText } = render(
      <SummaryWithMath text="Perimeter \\(a+b+c\\)" />
    )
    expect(getByText(/a\+b\+c/)).toBeInTheDocument()
  })

  it('renders markdown lists', () => {
    const { container } = render(
      <SummaryWithMath text={'- item1\n- item2'} />
    )
    expect(container.querySelector('ul')).toBeInTheDocument()
  })
})
