import type { Meta } from '@storybook/react';
import { MathSummary } from './MathSummary';

const meta: Meta<typeof MathSummary> = {
  title: 'MathSummary',
  component: MathSummary,
  args: { text: 'This is inline $x^2$ and block: $$y = x + 1$$' },
};
export default meta;

export const Default = {};
