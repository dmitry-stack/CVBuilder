import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UserLanguagesView } from "./UserLanguagesView";
import { HeaderProvider } from "@/components/layout/HeaderContext";

const mockDeleteProfileLanguage = vi.fn().mockResolvedValue({
  data: {
    deleteProfileLanguage: {
      id: "user-1",
      languages: [],
    },
  },
});

vi.mock("@apollo/client/react", () => ({
  useQuery: vi.fn(() => ({
    data: null,
    loading: false,
    error: null,
  })),
  useMutation: vi.fn(() => [mockDeleteProfileLanguage]),
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

  it("renders Add Language and Remove Languages buttons when viewing own profile", () => {
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
    expect(
      screen.getByRole("button", { name: /Remove Languages/i }),
    ).toBeInTheDocument();
  });

  it("hides Add Language, Remove Languages, and edit controls when viewing peer profile", () => {
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
    expect(
      screen.queryByRole("button", { name: /Remove Languages/i }),
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

  it("enters selection mode when Remove Languages is clicked, allows picking items and shows selection checkboxes", () => {
    render(
      <HeaderProvider>
        <UserLanguagesView
          userId="user-1"
          initialProfile={mockInitialProfile}
          isOwner={true}
        />
      </HeaderProvider>,
    );

    const removeBtn = screen.getByRole("button", {
      name: /Remove Languages/i,
    });
    fireEvent.click(removeBtn);

    // Cancel and Delete buttons appear
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    const deleteBtn = screen.getByRole("button", { name: /Delete/i });
    expect(deleteBtn).toBeInTheDocument();
    expect(deleteBtn).toBeDisabled();

    // Language items now have role="checkbox"
    const englishCheckbox = screen.getByRole("checkbox", {
      name: /English/i,
    });
    expect(englishCheckbox).toHaveAttribute("aria-checked", "false");

    // Click to select English
    fireEvent.click(englishCheckbox);
    expect(englishCheckbox).toHaveAttribute("aria-checked", "true");
    expect(
      screen.getByRole("button", { name: /Delete \(1\)/i }),
    ).not.toBeDisabled();

    // Click to select German
    const germanCheckbox = screen.getByRole("checkbox", { name: /German/i });
    fireEvent.click(germanCheckbox);
    expect(germanCheckbox).toHaveAttribute("aria-checked", "true");
    expect(
      screen.getByRole("button", { name: /Delete \(2\)/i }),
    ).not.toBeDisabled();

    // Click German again to deselect
    fireEvent.click(germanCheckbox);
    expect(germanCheckbox).toHaveAttribute("aria-checked", "false");
    expect(
      screen.getByRole("button", { name: /Delete \(1\)/i }),
    ).not.toBeDisabled();
  });

  it("cancels selection mode when Cancel button is clicked", () => {
    render(
      <HeaderProvider>
        <UserLanguagesView
          userId="user-1"
          initialProfile={mockInitialProfile}
          isOwner={true}
        />
      </HeaderProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Remove Languages/i }));
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));

    expect(
      screen.getByRole("button", { name: /Add Language/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Remove Languages/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Cancel/i }),
    ).not.toBeInTheDocument();
  });

  it("cancels selection mode when Escape key is pressed", () => {
    render(
      <HeaderProvider>
        <UserLanguagesView
          userId="user-1"
          initialProfile={mockInitialProfile}
          isOwner={true}
        />
      </HeaderProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Remove Languages/i }));
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });

    expect(
      screen.getByRole("button", { name: /Add Language/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Remove Languages/i }),
    ).toBeInTheDocument();
  });

  it("deletes multiple selected languages in batch when Delete button is clicked", async () => {
    render(
      <HeaderProvider>
        <UserLanguagesView
          userId="user-1"
          initialProfile={mockInitialProfile}
          isOwner={true}
        />
      </HeaderProvider>,
    );

    // Enter delete mode
    fireEvent.click(screen.getByRole("button", { name: /Remove Languages/i }));

    // Select English and Russian
    fireEvent.click(screen.getByRole("checkbox", { name: /English/i }));
    fireEvent.click(screen.getByRole("checkbox", { name: /Russian/i }));

    const deleteBtn = screen.getByRole("button", { name: /Delete \(2\)/i });
    fireEvent.click(deleteBtn);

    const confirmBtn = await screen.findByRole("button", {
      name: /Delete Languages \(2\)/i,
    });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockDeleteProfileLanguage).toHaveBeenCalledWith({
        variables: {
          language: {
            userId: "user-1",
            name: expect.arrayContaining(["English", "Russian"]),
          },
        },
      });
    });

    // Automatically exits selection mode after deletion
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Add Language/i }),
      ).toBeInTheDocument();
    });
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
