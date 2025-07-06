import type { Meta, StoryObj } from '@storybook/react';
import { MathSkillSelector } from './MathSkillSelector';

const meta: Meta<typeof MathSkillSelector> = {
  component: MathSkillSelector,
};
export default meta;

type Story = StoryObj<typeof MathSkillSelector>;

export const Default: Story = {};
