import type { Meta, StoryObj } from '@storybook/react'
import { StudentForm } from './StudentForm'
import QueryProvider from './QueryProvider'

const meta: Meta<typeof StudentForm> = {
  title: 'StudentForm',
  component: StudentForm,
}
export default meta

type Story = StoryObj<typeof StudentForm>

export const Default: Story = {
  render: () => (
    <QueryProvider>
      <StudentForm />
    </QueryProvider>
  ),
}
