import type { Meta, StoryObj } from '@storybook/react';
import AuthProvider from './AuthProvider';

const meta: Meta<typeof AuthProvider> = {
  component: AuthProvider,
};
export default meta;

type Story = StoryObj<typeof AuthProvider>;

export const Default: Story = {
  render: () => (
    <AuthProvider>
      <div>Content</div>
    </AuthProvider>
  ),
};
