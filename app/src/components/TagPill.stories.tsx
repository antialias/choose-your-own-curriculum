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
    score: 0.5,
  },
}

export const WithTooltip = {
  args: {
    text: 'math',
    vector: [0, 0, 0],
    score: 0.9,
    graph: {
      nodes: [
        { id: 'a', label: 'A', desc: '', tags: ['math'], grade: undefined },
        { id: 'b', label: 'B', desc: '', tags: [], grade: undefined },
      ],
      edges: [['a', 'b']],
    },
  },
}
