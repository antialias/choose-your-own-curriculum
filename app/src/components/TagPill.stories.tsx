import type { Meta } from '@storybook/react'
import { TagPill } from './TagPill'

const meta: Meta<typeof TagPill> = {
  title: 'TagPill',
  component: TagPill,
  args: { text: 'math', color: '#ff0000' },
}
export default meta

export const Default = {}
