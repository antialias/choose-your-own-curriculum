import type { Meta, StoryObj } from '@storybook/react'
import { SummaryWithMath } from './SummaryWithMath'

const meta: Meta<typeof SummaryWithMath> = {
  component: SummaryWithMath,
  args: {
    text: 'Equation: $a^2 + b^2 = c^2$\n\n- Item **one**\n- Item two',
  },
}
export default meta

export const Default: StoryObj<typeof SummaryWithMath> = {}
