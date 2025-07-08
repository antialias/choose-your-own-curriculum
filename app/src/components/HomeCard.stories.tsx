import type { Meta } from "@storybook/react";
import { HomeCard } from "./HomeCard";

const meta: Meta<typeof HomeCard> = {
  title: "HomeCard",
  component: HomeCard,
};
export default meta;

export const Default = {
  args: {
    href: "/students",
    label: "Students",
    description: "Manage your students",
  },
};
