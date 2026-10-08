import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CVDetailsView } from "./CVDetailsView";
import { HeaderProvider } from "@/components/layout/HeaderContext";
import { useQuery, useMutation } from "@apollo/client/react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

vi.mock("@apollo/client/react", () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

vi.mock("@/features/auth/hooks/useCurrentUser", () => ({
  useCurrentUser: vi.fn(),
}));

describe("CVDetailsView Component", () => {
  const mockCvData = {
    cv: {
      id: "cv-1",
      created_at: "2024-01-14T00:00:00Z",
      name: "Senior Frontend Engineer CV",
      education: "MIT Computer Science",
      description: "Experienced React and TypeScript engineer.",
      user: {
        id: "user-1",
        email: "alex@example.com",
        profile: {
          first_name: "Alex",
          last_name: "Smith",
          avatar: null,
        },
      },
    },
  };

  const mockUpdateCv = vi.fn().mockResolvedValue({
    data: {
      updateCv: {
        id: "cv-1",
        name: "Updated CV Name",
        education: "MIT",
        description: "Updated description",
      },
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCurrentUser).mockReturnValue({
      currentUser: {
        id: "user-1",
        email: "alex@example.com",
        role: null,
        first_name: "Alex",
        last_name: "Smith",
        avatar: null,
      },
      currentUserId: "user-1",
      isOwnProfile: vi.fn((id) => id === "user-1"),
      loading: false,
      error: undefined,
    });

    vi.mocked(useMutation).mockReturnValue([
      mockUpdateCv,
      {
        loading: false,
        reset: vi.fn(),
        called: false,
        client: undefined as unknown as ReturnType<
          typeof useMutation
        >[1]["client"],
      },
    ] as unknown as ReturnType<typeof useMutation>);

    vi.mocked(useQuery).mockReturnValue({
      data: mockCvData,
      loading: false,
    } as unknown as ReturnType<typeof useQuery>);
  });

  it("renders loading skeleton when query is loading", async () => {
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      loading: true,
    } as unknown as ReturnType<typeof useQuery>);

    render(
      <HeaderProvider>
        <CVDetailsView cvId="cv-1" />
      </HeaderProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Loading CV details")).toBeInTheDocument();
    });
  });

  it("renders CV details form with name, education, and description", () => {
    render(
      <HeaderProvider>
        <CVDetailsView cvId="cv-1" />
      </HeaderProvider>,
    );

    const nameInput = screen.getByLabelText("Name");
    const educationInput = screen.getByLabelText("Education");
    const descriptionInput = screen.getByLabelText("Description");

    expect(nameInput).toHaveValue("Senior Frontend Engineer CV");
    expect(educationInput).toHaveValue("MIT Computer Science");
    expect(descriptionInput).toHaveValue(
      "Experienced React and TypeScript engineer.",
    );

    // Update button initially disabled when form is pristine/clean
    expect(screen.getByRole("button", { name: /Update/i })).toBeDisabled();
  });

  it("enables Update button when fields are changed", () => {
    render(
      <HeaderProvider>
        <CVDetailsView cvId="cv-1" />
      </HeaderProvider>,
    );

    const nameInput = screen.getByLabelText("Name");
    fireEvent.change(nameInput, { target: { value: "Lead Engineer CV" } });

    expect(screen.getByRole("button", { name: /Update/i })).not.toBeDisabled();
  });

  it("validates required name field on submission", async () => {
    render(
      <HeaderProvider>
        <CVDetailsView cvId="cv-1" />
      </HeaderProvider>,
    );

    const nameInput = screen.getByLabelText("Name");
    fireEvent.change(nameInput, { target: { value: "" } });

    const updateBtn = screen.getByRole("button", { name: /Update/i });
    fireEvent.click(updateBtn);

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(mockUpdateCv).not.toHaveBeenCalled();
  });

  it("calls updateCv mutation when Update is clicked with valid data", async () => {
    render(
      <HeaderProvider>
        <CVDetailsView cvId="cv-1" />
      </HeaderProvider>,
    );

    const nameInput = screen.getByLabelText("Name");
    fireEvent.change(nameInput, { target: { value: "Lead Fullstack CV" } });

    const updateBtn = screen.getByRole("button", { name: /Update/i });
    fireEvent.click(updateBtn);

    await waitFor(() => {
      expect(mockUpdateCv).toHaveBeenCalledWith({
        variables: {
          cv: {
            cvId: "cv-1",
            name: "Lead Fullstack CV",
            education: "MIT Computer Science",
            description: "Experienced React and TypeScript engineer.",
          },
        },
      });
    });
  });

  it("disables form inputs and hides action buttons in peer view", () => {
    // Current user is different from CV owner
    vi.mocked(useCurrentUser).mockReturnValue({
      currentUser: {
        id: "user-2",
        email: "other@example.com",
        role: null,
        first_name: "Other",
        last_name: "User",
        avatar: null,
      },
      currentUserId: "user-2",
      isOwnProfile: vi.fn(() => false),
      loading: false,
      error: undefined,
    });

    render(
      <HeaderProvider>
        <CVDetailsView cvId="cv-1" />
      </HeaderProvider>,
    );

    expect(screen.getByLabelText("Name")).toBeDisabled();
    expect(screen.getByLabelText("Education")).toBeDisabled();
    expect(screen.getByLabelText("Description")).toBeDisabled();

    expect(
      screen.queryByRole("button", { name: /Update/i }),
    ).not.toBeInTheDocument();
  });
});
