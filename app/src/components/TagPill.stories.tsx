import type { Meta } from '@storybook/react'
import { TagPill } from './TagPill'

const meta: Meta<typeof TagPill> = {
  title: 'TagPill',
  component: TagPill,
}
export default meta

export const Default = {
  args: { text: 'math', color: 'hsl(200,80%,60%)' },
}
