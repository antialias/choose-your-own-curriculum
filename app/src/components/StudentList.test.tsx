import { render, screen } from '@testing-library/react'
import { StudentList } from './StudentList'

vi.mock('./StudentForm', () => ({ StudentForm: () => <div>form</div> }))

beforeEach(() => {
  vi.spyOn(global, 'fetch').mockResolvedValue({
    json: async () => ({ students: [{ id: '1', name: 'Joe', email: 'j@e.com' }] }),
  } as unknown as Response)
})

test('renders list', async () => {
  render(<StudentList />)
  expect(await screen.findByText('Joe')).toBeInTheDocument()
})
