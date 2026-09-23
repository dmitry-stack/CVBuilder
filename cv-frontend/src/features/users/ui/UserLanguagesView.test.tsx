import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UserLanguagesView } from "./UserLanguagesView";
import { HeaderProvider } from "@/components/layout/HeaderContext";

vi.mock("@apollo/client/react", () => ({
  useQuery: vi.fn(() => ({
    data: null,
    loading: false,
    error: null,
  })),
  useMutation: vi.fn(() => [vi.fn().mockResolvedValue({})]),
}));

vi.mock("@features/auth/hooks/useCurrentUser", () => ({
  useCurrentUser: vi.fn(() => ({
    currentUserId: "user-1",
    isOwnProfile: vi.fn((id) => id === "user-1"),
  })),
}));

describe("UserLanguagesView Component", () => {
  const mockInitialProfile = {
    id: "user-1",
    first_name: "Rostislav",
    last_name: "Harlanov",
    languages: [
      { name: "English", proficiency: "C1" as const },
      { name: "German", proficiency: "B2" as const },
      { name: "Spanish", proficiency: "A2" as const },
      { name: "Russian", proficiency: "Native" as const },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders languages with proficiency indicators and labels", () => {
    render(
      <HeaderProvider>
        <UserLanguagesView
          userId="user-1"
          initialProfile={mockInitialProfile}
          isOwner={true}
        />
      </HeaderProvider>,
    );

    expect(screen.getByText("Languages")).toBeInTheDocument();

    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("German")).toBeInTheDocument();
    expect(screen.getByText("Spanish")).toBeInTheDocument();
    expect(screen.getByText("Russian")).toBeInTheDocument();

    expect(
      screen.getByRole("progressbar", { name: /English: C1/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: /Russian: Native/i }),
    ).toBeInTheDocument();
  });

  it("renders Add Language button when viewing own profile", () => {
    render(
      <HeaderProvider>
        <UserLanguagesView
          userId="user-1"
          initialProfile={mockInitialProfile}
          isOwner={true}
        />
      </HeaderProvider>,
    );

    expect(
      screen.getByRole("button", { name: /Add Language/i }),
    ).toBeInTheDocument();
  });

  it("hides Add Language and edit controls when viewing peer profile", () => {
    render(
      <HeaderProvider>
        <UserLanguagesView
          userId="peer-user-2"
          initialProfile={{
            ...mockInitialProfile,
            id: "peer-user-2",
          }}
          isOwner={false}
        />
      </HeaderProvider>,
    );

    expect(
      screen.queryByRole("button", { name: /Add Language/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Edit English/i)).not.toBeInTheDocument();
  });

  it("opens add language modal when Add Language button is clicked", async () => {
    render(
      <HeaderProvider>
        <UserLanguagesView
          userId="user-1"
          initialProfile={mockInitialProfile}
          isOwner={true}
        />
      </HeaderProvider>,
    );

    const addBtn = screen.getByRole("button", { name: /Add Language/i });
    fireEvent.click(addBtn);

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Add Language" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Language Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Proficiency Level")).toBeInTheDocument();
  });

  it("renders empty state when user has no languages", () => {
    render(
      <HeaderProvider>
        <UserLanguagesView
          userId="user-1"
          initialProfile={{
            id: "user-1",
            first_name: "New",
            last_name: "User",
            languages: [],
          }}
          isOwner={true}
        />
      </HeaderProvider>,
    );

    expect(
      screen.getByText("No languages have been added yet."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add Your First Language/i }),
    ).toBeInTheDocument();
  });
});
