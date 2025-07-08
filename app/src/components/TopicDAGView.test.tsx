import { render, screen } from '@testing-library/react'
import { TopicDAGView } from './TopicDAGView'

test('renders mermaid graph', () => {
  render(<TopicDAGView graph="graph TD;A-->B;" />)
  expect(screen.getByText('A')).toBeInTheDocument()
})
