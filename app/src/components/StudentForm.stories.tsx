import type { Meta, StoryObj } from '@storybook/react'
import { StudentForm } from './StudentForm'

const meta: Meta<typeof StudentForm> = {
  component: StudentForm,
  args: {
    initial: { name: 'Jane Doe', email: 'jane@example.com' },
    onSubmit: async () => alert('submitted'),
  },
}
export default meta

type Story = StoryObj<typeof StudentForm>
export const Default: Story = {}
