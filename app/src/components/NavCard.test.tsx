import { render, screen } from "@testing-library/react";
import { NavCard } from "./NavCard";

describe("NavCard", () => {
  it("renders label and count", () => {
    render(<NavCard href="/" label="Test" count={5} />);
    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
