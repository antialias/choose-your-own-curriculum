import { render, screen } from '@testing-library/react'
import { TagPill } from './TagPill'
import { CurriculumGraphProvider } from './CurriculumGraphContext'

describe('TagPill', () => {
  it('renders text', () => {
    render(
      <CurriculumGraphProvider>
        <TagPill text="math" vector={[0.1, 0.2, 0.3]} />
      </CurriculumGraphProvider>
    )
    expect(screen.getByText('math')).toBeInTheDocument()
  })
})
