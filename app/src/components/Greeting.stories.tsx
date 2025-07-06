import type { Meta, StoryObj } from '@storybook/react';
import { Greeting } from './Greeting';

const meta: Meta<typeof Greeting> = {
  component: Greeting,
  args: { name: 'World' },
};
export default meta;

type Story = StoryObj<typeof Greeting>;

export const Default: Story = {};
export const CustomName: Story = { args: { name: 'Alice' } };
