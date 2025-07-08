import { render, screen } from '@testing-library/react'
import { MermaidChart } from './MermaidChart'

vi.mock('react-mermaid2', () => ({ default: ({ chart }: { chart: string }) => <div data-testid="mermaid">{chart}</div> }))

test('renders chart', () => {
  render(<MermaidChart chart="graph TD;A-->B;" />)
  expect(screen.getByTestId('mermaid')).toHaveTextContent('graph TD;A-->B;')
})
