import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CVTable, type CVItem } from "./CVTable";

vi.mock("@apollo/client/react", () => ({
  useQuery: vi.fn(() => ({
    data: null,
    loading: false,
    error: null,
    refetch: vi.fn(),
  })),
  useMutation: vi.fn(() => [vi.fn().mockResolvedValue({})]),
}));

vi.mock("@/features/auth/hooks/useCurrentUser", () => ({
  useCurrentUser: vi.fn(() => ({
    currentUserId: "user-1",
    isOwnProfile: vi.fn(() => true),
  })),
}));

const mockCvs: CVItem[] = [
  {
    id: "cv-1",
    name: "Senior Frontend Engineer",
    education: "BS Computer Science",
    description:
      "Expert in React, TypeScript, and modern frontend architecture.",
    user: {
      id: "user-1",
      email: "alice@example.com",
      profile: {
        first_name: "Alice",
        last_name: "Smith",
      },
    },
  },
  {
    id: "cv-2",
    name: "Backend Developer",
    education: "MS Software Engineering",
    description: "Specializing in NestJS, PostgreSQL, and GraphQL services.",
    user: {
      id: "user-2",
      email: "bob@example.com",
      profile: {
        first_name: "Bob",
        last_name: "Jones",
      },
    },
  },
];

describe("CVTable Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders search input, Create CV button, and table columns", () => {
    render(<CVTable initialCvs={mockCvs} />);

    expect(screen.getByPlaceholderText(/search cvs/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create cv/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /name/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /education/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /employee/i }),
    ).toBeInTheDocument();
  });

  it("renders CV rows with name, education, employee, and description", () => {
    render(<CVTable initialCvs={mockCvs} />);

    expect(screen.getByText("Senior Frontend Engineer")).toBeInTheDocument();
    expect(screen.getByText("BS Computer Science")).toBeInTheDocument();
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(
      screen.getByText(
        /expert in react, typescript, and modern frontend architecture/i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText("Backend Developer")).toBeInTheDocument();
    expect(screen.getByText("MS Software Engineering")).toBeInTheDocument();
    expect(screen.getByText("Bob Jones")).toBeInTheDocument();
  });

  it("filters CVs when searching", () => {
    render(<CVTable initialCvs={mockCvs} />);

    const searchInput = screen.getByPlaceholderText(/search cvs/i);
    fireEvent.change(searchInput, { target: { value: "Backend" } });

    expect(screen.getByText("Backend Developer")).toBeInTheDocument();
    expect(
      screen.queryByText("Senior Frontend Engineer"),
    ).not.toBeInTheDocument();
  });

  it("opens Create CV dialog when clicking Create CV button", async () => {
    render(<CVTable initialCvs={mockCvs} />);

    const createBtn = screen.getByRole("button", { name: /create cv/i });
    fireEvent.click(createBtn);

    expect(
      await screen.findByRole("heading", { name: /create cv/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/cv name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/education/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it("opens Update CV dialog when clicking Update in row dropdown", async () => {
    render(<CVTable initialCvs={mockCvs} />);

    const actionButtons = screen.getAllByRole("button", {
      name: /actions for user cv-/i,
    });
    fireEvent.click(actionButtons[0]);

    const updateItem = await screen.findByRole("menuitem", { name: /update/i });
    fireEvent.click(updateItem);

    expect(
      await screen.findByRole("heading", { name: /update cv/i }),
    ).toBeInTheDocument();
    const nameInput = screen.getByLabelText(/cv name/i) as HTMLInputElement;
    const eduInput = screen.getByLabelText(/education/i) as HTMLInputElement;
    expect(nameInput.value).toBe("Backend Developer");
    expect(eduInput.value).toBe("MS Software Engineering");
  });

  it("opens Delete CV dialog when clicking Delete in row dropdown", async () => {
    render(<CVTable initialCvs={mockCvs} />);

    const actionButtons = screen.getAllByRole("button", {
      name: /actions for user cv-/i,
    });
    fireEvent.click(actionButtons[0]);

    const deleteItem = await screen.findByRole("menuitem", { name: /delete/i });
    fireEvent.click(deleteItem);

    expect(
      await screen.findByRole("heading", { name: /delete cv/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/are you sure you want to delete/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) =>
        content.includes("Senior Frontend Engineer"),
      ),
    ).toBeInTheDocument();
  });
});
