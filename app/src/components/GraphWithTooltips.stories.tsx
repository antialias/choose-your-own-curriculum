import type { Meta } from '@storybook/react'
import { GraphWithTooltips } from './GraphWithTooltips'

const meta: Meta<typeof GraphWithTooltips> = {
  title: 'GraphWithTooltips',
  component: GraphWithTooltips,
}
export default meta

export const Default = {
  args: {
    graph: {
      nodes: [
        { id: 'a', label: 'A', desc: '', tags: ['alpha', 'beta', 'gamma'] },
        { id: 'b', label: 'B', desc: '', tags: ['beta', 'delta', 'epsilon'] },
      ],
      edges: [['a', 'b']],
    },
  },
}
