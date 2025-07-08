import type { Meta } from '@storybook/react'
import { TagPill } from './TagPill'

const meta: Meta<typeof TagPill> = {
  title: 'TagPill',
  component: TagPill,
}
export default meta

export const Default = {
  args: {
    text: 'example',
    vector: [0.1, 0.2, 0.3],
  },
}
