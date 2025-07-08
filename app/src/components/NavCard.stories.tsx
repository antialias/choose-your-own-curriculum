import type { Meta } from "@storybook/react";
import { NavCard } from "./NavCard";

const meta: Meta<typeof NavCard> = {
  title: "NavCard",
  component: NavCard,
};
export default meta;

export const Default = {
  args: { href: "/students", label: "Students", count: 3 },
};
