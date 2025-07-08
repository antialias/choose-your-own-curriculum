import type { Meta, StoryObj } from '@storybook/react'
import { MermaidChart } from './MermaidChart'

const meta: Meta<typeof MermaidChart> = {
  component: MermaidChart,
  args: {
    chart: 'graph TD; A-->B;'
  }
}
export default meta

type Story = StoryObj<typeof MermaidChart>

export const Default: Story = {}
