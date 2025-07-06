import type { Meta, StoryObj } from '@storybook/react';
import { NavBar } from './NavBar';
import { SessionProvider } from 'next-auth/react';

const meta: Meta<typeof NavBar> = {
  component: NavBar,
};
export default meta;

type Story = StoryObj<typeof NavBar>;

export const LoggedOut: Story = {
  render: () => (
    <SessionProvider>
      <NavBar />
    </SessionProvider>
  ),
};

export const LoggedIn: Story = {
  render: () => (
    <SessionProvider session={{
      user: { name: 'Alice', email: 'alice@example.com' },
      expires: '1',
    }}>
      <NavBar />
    </SessionProvider>
  ),
};
