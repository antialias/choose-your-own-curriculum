import { render, screen } from '@testing-library/react'
import QueryProvider from './QueryProvider'

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')
  return { ...actual, QueryClientProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }
})

test('renders children', () => {
  render(
    <QueryProvider>
      <span>child</span>
    </QueryProvider>
  )
  expect(screen.getByText('child')).toBeInTheDocument()
})
