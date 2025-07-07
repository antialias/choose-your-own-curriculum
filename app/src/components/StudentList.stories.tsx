import type { Meta, StoryObj } from '@storybook/react'
import { StudentList } from './StudentList'

const meta: Meta<typeof StudentList> = {
  component: StudentList,
}
export default meta

type Story = StoryObj<typeof StudentList>
export const Default: Story = {}
