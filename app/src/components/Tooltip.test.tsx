import { render, screen } from '@testing-library/react';
import { Tooltip } from './Tooltip';
import { TagPill } from './TagPill';

it('renders trigger', () => {
  render(
    <Tooltip content="info">
      <TagPill text="tag" vector={[0, 0, 0]} />
    </Tooltip>
  );
  expect(screen.getByText('tag')).toBeInTheDocument();
});
