import type { Meta, StoryObj } from '@storybook/react';
import { RenderedSummary } from './RenderedSummary';

const meta: Meta<typeof RenderedSummary> = {
  component: RenderedSummary,
};
export default meta;

type Story = StoryObj<typeof RenderedSummary>;

export const Example: Story = {
  args: {
    text: 'Area formula: $$A = \\pi r^2$$ and slope $m = \\frac{dy}{dx}$.',
  },
};
