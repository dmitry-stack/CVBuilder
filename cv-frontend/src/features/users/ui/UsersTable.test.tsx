import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useQuery } from "@apollo/client/react";
import { UsersTable } from "./UsersTable";

const { MOCK_GRAPHQL_USERS } = vi.hoisted(() => ({
  MOCK_GRAPHQL_USERS: {
    users: {
      items: [
        {
          id: "1",
          email: "thorn_pear@icloud.com",
          profile: {
            first_name: "Rostislav",
            last_name: "Harlanov",
            avatar: null,
          },
          department: { name: "React" },
          position: { name: "Software Engineer" },
        },
        {
          id: "2",
          email: "tomgar9@outlook.com",
          profile: {
            first_name: "Vanf",
            last_name: "Darkholme",
            avatar:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
          },
          department: { name: ".NET" },
          position: { name: "Network Engineer" },
        },
        {
          id: "3",
          email: "christophernolan@gmail.com",
          profile: {
            first_name: "Christopher",
            last_name: "Nolan",
            avatar: null,
          },
          department: { name: "Blockchain" },
          position: { name: "DevOps Engineer" },
        },
        {
          id: "4",
          email: "persempre1+1@yandex.ru",
          profile: { first_name: "Марина", last_name: "", avatar: null },
          department: { name: "DevOps" },
          position: { name: "Data Analyst" },
        },
        {
          id: "5",
          email: "maxim.goncharov@gmail.com",
          profile: {
            first_name: "Maksim",
            last_name: "Hancharou",
            avatar: null,
          },
          department: { name: "Global" },
          position: { name: "Data Analyst" },
        },
        {
          id: "6",
          email: "artsem.lapatsin@innowise.com",
          profile: { first_name: "Artem", last_name: "Lopatin", avatar: null },
          department: { name: "Global" },
          position: { name: "Project Manager" },
        },
      ],
    },
  },
}));

vi.mock("@apollo/client/react", () => ({
  useQuery: vi.fn().mockReturnValue({
    data: MOCK_GRAPHQL_USERS,
    loading: false,
    error: null,
  }),
}));

describe("UsersTable component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useQuery).mockReturnValue({
      data: MOCK_GRAPHQL_USERS,
      loading: false,
      error: null,
    } as unknown as ReturnType<typeof useQuery>);
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

    expect(screen.getByText("Rostislav")).toBeInTheDocument();

    fireEvent.click(firstNameHeader);
    expect(screen.getByText("Artem")).toBeInTheDocument();
  });

  it("renders 5 skeleton rows when query is in loading state", () => {
    vi.mocked(useQuery).mockReturnValueOnce({
      data: null,
      loading: true,
      error: null,
    } as unknown as ReturnType<typeof useQuery>);

    const { container } = render(<UsersTable />);

    const skeletonRows = container.querySelectorAll(
      '[data-slot="users-table-row-skeleton"]',
    );
    expect(skeletonRows.length).toBe(5);
  });
});
