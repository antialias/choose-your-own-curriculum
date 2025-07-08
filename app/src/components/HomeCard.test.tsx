import { render, screen } from "@testing-library/react";
import { HomeCard } from "./HomeCard";

test("renders label and description", () => {
  render(
    <HomeCard href="/path" label="Label" description="Desc" />
  );
  expect(screen.getByText("Label")).toBeInTheDocument();
  expect(screen.getByText("Desc")).toBeInTheDocument();
});
