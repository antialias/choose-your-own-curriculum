import { render, screen } from '@testing-library/react';
import { TagTooltip } from './TagTooltip';
import { Graph } from '@/graphSchema';

const graph: Graph = {
  nodes: [
    { id: 'a', label: 'A', desc: '', grade: '', prereq: [], tags: ['tag'] },
    { id: 'b', label: 'B', desc: '', grade: '', prereq: [], tags: [] },
  ],
  edges: [['a', 'b']],
};

it('renders trigger', () => {
  render(<TagTooltip text="tag" vector={[0, 0, 0]} graph={graph} />);
  expect(screen.getByText('tag')).toBeInTheDocument();
});
