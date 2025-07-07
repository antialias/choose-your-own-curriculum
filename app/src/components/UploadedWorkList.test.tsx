import { render, screen } from '@testing-library/react'
import { UploadedWorkList } from './UploadedWorkList'

test('renders initial works', () => {
  render(<UploadedWorkList initialWorks={[{ id: '1', dateUploaded: new Date(), dateCompleted: null, summary: 'Hi' }]} />)
  expect(screen.getByText('Hi')).toBeInTheDocument()
})
