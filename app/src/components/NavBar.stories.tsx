import type { Meta, StoryObj } from '@storybook/react'
import { NavBar } from './NavBar'

const meta: Meta<typeof NavBar> = {
  component: NavBar,
}
export default meta

type Story = StoryObj<typeof NavBar>

export const LoggedOut: Story = {
  args: { session: null },
}

export const LoggedIn: Story = {
  args: {
    session: {
      user: { name: 'Alice', email: 'alice@example.com' },
      expires: '1',
    } as any,
  },
}
