import type { Meta } from '@storybook/react'
import { StudentCurriculum } from './StudentCurriculum'

const meta: Meta<typeof StudentCurriculum> = {
  title: 'StudentCurriculum',
  component: StudentCurriculum,
}
export default meta

export const Default = {
  args: { studentId: 's1' },
}
