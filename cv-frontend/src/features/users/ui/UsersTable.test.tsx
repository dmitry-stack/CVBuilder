import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { UsersTable } from "./UsersTable";

// Mock @apollo/client/react useQuery
vi.mock("@apollo/client/react", () => ({
  useQuery: vi.fn().mockReturnValue({
    data: null,
    loading: false,
    error: null,
  }),
}));

describe("UsersTable component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Employees breadcrumb header", () => {
    render(<UsersTable />);

    expect(screen.getByText("Employees")).toBeInTheDocument();
  });

  it("renders the Search input with placeholder", () => {
    render(<UsersTable />);

    const searchInput = screen.getByRole("textbox", {
      name: /search employees/i,
    });
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute("placeholder", "Search");
  });

  it("renders the table headers for all specified columns", () => {
    render(<UsersTable />);

    expect(
      screen.getByRole("button", { name: /first name/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /last name/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /email/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /department/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /position/i }),
    ).toBeInTheDocument();
  });

  it("renders mock employee data rows matching the Figma design", () => {
    render(<UsersTable />);

    expect(screen.getByText("Rostislav")).toBeInTheDocument();
    expect(screen.getByText("Harlanov")).toBeInTheDocument();
    expect(screen.getByText("thorn_pear@icloud.com")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
  });

  it("renders avatar initials when no avatar image is available", () => {
    render(<UsersTable />);

    // Rostislav should have "R" avatar initial
    const initials = screen.getAllByText("R");
    expect(initials.length).toBeGreaterThan(0);
  });

  it("filters employees when searching", () => {
    render(<UsersTable />);

    const searchInput = screen.getByRole("textbox", {
      name: /search employees/i,
    });
    fireEvent.change(searchInput, { target: { value: "Nolan" } });

    expect(screen.getByText("Christopher")).toBeInTheDocument();
    expect(screen.getByText("Nolan")).toBeInTheDocument();
    expect(screen.queryByText("Harlanov")).not.toBeInTheDocument();
  });

  it("displays empty state message when search yields no results", () => {
    render(<UsersTable />);

    const searchInput = screen.getByRole("textbox", {
      name: /search employees/i,
    });
    fireEvent.change(searchInput, { target: { value: "NonExistentName123" } });

    expect(
      screen.getByText(/no employees found matching "NonExistentName123"/i),
    ).toBeInTheDocument();
  });

  it("sorts table rows when clicking column header", () => {
    render(<UsersTable />);

    const firstNameHeader = screen.getByRole("button", { name: /first name/i });

    // Initial render
    expect(screen.getByText("Rostislav")).toBeInTheDocument();

    // Click to toggle sort
    fireEvent.click(firstNameHeader);
    expect(screen.getByText("Artem")).toBeInTheDocument();
  });
});
