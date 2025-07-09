import type { Meta } from '@storybook/react'
import { Tooltip } from './Tooltip'

const meta: Meta<typeof Tooltip> = {
  title: 'Tooltip',
  component: Tooltip,
}
export default meta

export const Default = {
  render: () => (
    <Tooltip content="More info">
      <button>Hover</button>
    </Tooltip>
  ),
}
