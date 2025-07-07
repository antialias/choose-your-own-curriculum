import type { Meta, StoryObj } from '@storybook/react';
import { UploadWorkForm } from './UploadWorkForm';

const meta: Meta<typeof UploadWorkForm> = {
  component: UploadWorkForm,
};
export default meta;

export const Basic: StoryObj<typeof UploadWorkForm> = {
  render: () => <UploadWorkForm />,
};
