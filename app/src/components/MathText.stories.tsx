import type { Meta } from '@storybook/react';
import { MathText } from './MathText';

const meta: Meta<typeof MathText> = {
  title: 'MathText',
  component: MathText,
};
export default meta;

export const Default = {
  args: { text: 'Euler: $e^{i\\pi}+1=0$' },
};
