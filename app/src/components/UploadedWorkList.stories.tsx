import type { Meta } from '@storybook/react'
import { UploadedWorkList } from './UploadedWorkList'

const meta: Meta<typeof UploadedWorkList> = {
  title: 'UploadedWorkList',
  component: UploadedWorkList,
  args: {
    initialWorks: [
      { id: '1', dateUploaded: new Date(), dateCompleted: null, summary: 'Summary' }
    ],
  },
}
export default meta

export const Default = {}
