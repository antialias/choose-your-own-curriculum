import { render } from '@testing-library/react'
import { UploadForm } from './UploadForm'
import '@testing-library/jest-dom'

describe('UploadForm', () => {
  it('renders', () => {
    const { getByText } = render(<UploadForm />)
    expect(getByText('Upload')).toBeInTheDocument()
  })
})
