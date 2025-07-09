import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import { TagPill } from './TagPill';

const meta: Meta<typeof Tooltip> = {
  title: 'Tooltip',
  component: Tooltip,
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip content="Example tooltip">
      <TagPill text="tag" vector={[0.1, 0.2, 0.3]} />
    </Tooltip>
  ),
};
