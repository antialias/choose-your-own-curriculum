import type { Meta } from '@storybook/react'
import { TopicDAGView } from './TopicDAGView'

const meta: Meta<typeof TopicDAGView> = {
  title: 'TopicDAGView',
  component: TopicDAGView,
}
export default meta

export const Default = {
  args: {
    graph: 'graph TD;A-->B;B-->C;',
  },
}
