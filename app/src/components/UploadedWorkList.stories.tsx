import type { Meta, StoryObj } from '@storybook/react';
import { UploadedWorkList } from './UploadedWorkList';

const meta: Meta<typeof UploadedWorkList> = {
  component: UploadedWorkList,
  args: {
    items: [
      { id: '1', studentName: 'Alice', summary: 'Essay', completedAt: new Date() },
    ],
  },
};
export default meta;

export const Default: StoryObj<typeof UploadedWorkList> = {};
