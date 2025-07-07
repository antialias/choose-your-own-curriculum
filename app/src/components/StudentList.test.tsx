import { render, screen } from '@testing-library/react'
import { StudentList } from './StudentList'
import '@testing-library/jest-dom'

vi.mock('next/navigation', () => ({ useRouter: () => ({}) }))

global.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve({ students: [] }) })) as unknown as typeof fetch

describe('StudentList', () => {
  it('renders', async () => {
    render(<StudentList />)
    expect(await screen.findByRole('list')).toBeInTheDocument()
  })
})
