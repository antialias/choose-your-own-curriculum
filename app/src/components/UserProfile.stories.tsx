import type { Meta, StoryObj } from '@storybook/react'
import { UserProfile } from './UserProfile'

const meta: Meta<typeof UserProfile> = {
  component: UserProfile,
  args: {
    name: 'Alice',
    bio: 'I love mathematics and teaching.'
  }
}
export default meta

type Story = StoryObj<typeof UserProfile>

export const Default: Story = {}
