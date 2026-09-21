import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { UsersTableSkeleton } from "./UsersTableSkeleton";
import { UsersTableRowSkeleton } from "./UsersTableRowSkeleton";

describe("UsersTableSkeleton component", () => {
  it("renders page header and disabled search input", () => {
    render(<UsersTableSkeleton />);

    expect(screen.getByText("Employees")).toBeInTheDocument();
    const searchInput = screen.getByRole("textbox", {
      name: /search employees/i,
    });
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toBeDisabled();
  });

  it("renders standard table headers", () => {
    render(<UsersTableSkeleton />);

    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Department")).toBeInTheDocument();
    expect(screen.getByText("Position")).toBeInTheDocument();
  });

  it("renders the specified number of skeleton rows", () => {
    const { container } = render(<UsersTableSkeleton rowCount={3} />);

    const rows = container.querySelectorAll(
      '[data-slot="users-table-row-skeleton"]',
    );
    expect(rows.length).toBe(3);
  });
});

describe("UsersTableRowSkeleton component", () => {
  it("renders 7 table cells matching columns", () => {
    const { container } = render(
      <table>
        <tbody>
          <UsersTableRowSkeleton />
        </tbody>
      </table>,
    );

    const cells = container.querySelectorAll("td");
    expect(cells.length).toBe(7);
  });
});
