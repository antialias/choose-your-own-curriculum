import type { Meta, StoryObj } from '@storybook/react';
import { HomeCard } from './HomeCard';

const meta: Meta<typeof HomeCard> = {
  component: HomeCard,
};
export default meta;

type Story = StoryObj<typeof HomeCard>;

export const Default: Story = {
  args: { href: '/', label: 'Example' },
};
