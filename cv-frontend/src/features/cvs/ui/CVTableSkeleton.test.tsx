import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CVTableSkeleton } from "./CVTableSkeleton";

describe("CVTableSkeleton component", () => {
  it("renders the cv table skeleton container", () => {
    const { container } = render(<CVTableSkeleton />);
    expect(
      container.querySelector('[data-slot="cv-table-skeleton"]'),
    ).toBeInTheDocument();
  });

  it("renders disabled search input", () => {
    render(<CVTableSkeleton />);
    const searchInput = screen.getByLabelText(/search cvs/i);
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toBeDisabled();
  });

  it("renders table headers for Name, Education, and Employee", () => {
    render(<CVTableSkeleton />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Education")).toBeInTheDocument();
    expect(screen.getByText("Employee")).toBeInTheDocument();
  });

  it("renders the default number of skeleton rows (5)", () => {
    const { container } = render(<CVTableSkeleton />);
    const rows = container.querySelectorAll(
      '[data-slot="cv-table-row-skeleton"]',
    );
    expect(rows.length).toBe(5);
  });

  it("renders a customizable number of skeleton rows", () => {
    const { container } = render(<CVTableSkeleton rowCount={3} />);
    const rows = container.querySelectorAll(
      '[data-slot="cv-table-row-skeleton"]',
    );
    expect(rows.length).toBe(3);
  });
});
