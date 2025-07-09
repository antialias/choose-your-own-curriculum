import { render, screen } from '@testing-library/react'
import { ThumbnailPlaceholder } from './ThumbnailPlaceholder'
import '@testing-library/jest-dom'

describe('ThumbnailPlaceholder', () => {
  it('shows extension in uppercase', () => {
    render(<ThumbnailPlaceholder mime="application/pdf" />)
    expect(screen.getByTestId('thumbnail-placeholder')).toHaveTextContent('PDF')
  })
})
