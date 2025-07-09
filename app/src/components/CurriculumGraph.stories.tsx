import type { Meta } from '@storybook/react'
import { CurriculumGraph } from './CurriculumGraph'

const meta: Meta<typeof CurriculumGraph> = {
  title: 'CurriculumGraph',
  component: CurriculumGraph,
}
export default meta

export const Default = {
  args: {
    graph: {
      nodes: [
        { id: 'a', label: 'A', desc: '', tags: ['tag1', 'tag2'], grade: undefined },
        { id: 'b', label: 'B', desc: '', tags: ['tag3'], grade: undefined },
      ],
      edges: [['a', 'b']],
    },
  },
}
