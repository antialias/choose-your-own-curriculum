import type { Meta, StoryObj } from '@storybook/react';
import { TagTooltip } from './TagTooltip';
import { Graph } from '@/graphSchema';

const meta: Meta<typeof TagTooltip> = {
  title: 'TagTooltip',
  component: TagTooltip,
};
export default meta;

type Story = StoryObj<typeof TagTooltip>;

const graph: Graph = {
  nodes: [
    { id: 'a', label: 'A', desc: '', grade: '', prereq: [], tags: ['tag'] },
    { id: 'b', label: 'B', desc: '', grade: '', prereq: [], tags: [] },
  ],
  edges: [['a', 'b']],
};

export const Default: Story = {
  args: { text: 'tag', vector: [0, 0, 0], graph },
};
