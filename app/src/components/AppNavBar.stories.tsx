import type { Meta, StoryObj } from '@storybook/react';
import { AppNavBar } from './AppNavBar';

const meta: Meta<typeof AppNavBar> = {
  component: AppNavBar,
};
export default meta;

type Story = StoryObj<typeof AppNavBar>;

export const Default: Story = {};
