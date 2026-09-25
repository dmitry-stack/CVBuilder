import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UserSkillsView } from "./UserSkillsView";
import { HeaderProvider } from "@/components/layout/HeaderContext";

const mockDeleteProfileSkill = vi.fn().mockResolvedValue({
  data: {
    deleteProfileSkill: {
      id: "user-1",
      skills: [],
    },
  },
});

vi.mock("@apollo/client/react", () => ({
  useQuery: vi.fn(() => ({
    data: null,
    loading: false,
    error: null,
  })),
  useMutation: vi.fn(() => [mockDeleteProfileSkill]),
}));

vi.mock("@features/auth/hooks/useCurrentUser", () => ({
  useCurrentUser: vi.fn(() => ({
    currentUserId: "user-1",
    isOwnProfile: vi.fn((id) => id === "user-1"),
  })),
}));

describe("UserSkillsView Component", () => {
  const mockInitialProfile = {
    id: "user-1",
    first_name: "Rostislav",
    last_name: "Harlanov",
    skills: [
      { name: "TypeScript", mastery: "Proficient" as const },
      { name: "JavaScript", mastery: "Expert" as const },
      { name: "React", mastery: "Expert" as const },
      { name: "CSS3", mastery: "Proficient" as const },
      { name: "Storybook", mastery: "Advanced" as const },
      { name: "Keycloak", mastery: "Novice" as const },
      { name: "Node.js", mastery: "Competent" as const },
      { name: "Git", mastery: "Expert" as const },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders skills categorized according to the layout in skills.png", () => {
    render(
      <HeaderProvider>
        <UserSkillsView
          userId="user-1"
          initialProfile={mockInitialProfile}
          isOwner={true}
        />
      </HeaderProvider>,
    );

    expect(screen.getByText("Programming languages")).toBeInTheDocument();
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("Source control systems")).toBeInTheDocument();

    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("CSS3")).toBeInTheDocument();
    expect(screen.getByText("Storybook")).toBeInTheDocument();
    expect(screen.getByText("Keycloak")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
    expect(screen.getByText("Git")).toBeInTheDocument();

    expect(
      screen.getByRole("progressbar", { name: "Keycloak: Novice" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: "Storybook: Advanced" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: "Node.js: Competent" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: "TypeScript: Proficient" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: "React: Expert" }),
    ).toBeInTheDocument();
  });

  it("renders Add Skill and Remove Skills buttons when viewing own profile", () => {
    render(
      <HeaderProvider>
        <UserSkillsView
          userId="user-1"
          initialProfile={mockInitialProfile}
          isOwner={true}
        />
      </HeaderProvider>,
    );

    expect(
      screen.getByRole("button", { name: /Add Skill/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Remove Skills/i }),
    ).toBeInTheDocument();
  });

  it("hides Add Skill, Remove Skills, and edit buttons when viewing peer profile", () => {
    render(
      <HeaderProvider>
        <UserSkillsView
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
      screen.queryByRole("button", { name: /Add Skill/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Remove Skills/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Edit React/i)).not.toBeInTheDocument();
  });

  it("opens add skill modal when Add Skill button is clicked", async () => {
    render(
      <HeaderProvider>
        <UserSkillsView
          userId="user-1"
          initialProfile={mockInitialProfile}
          isOwner={true}
        />
      </HeaderProvider>,
    );

    const addBtn = screen.getByRole("button", { name: /Add Skill/i });
    fireEvent.click(addBtn);

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Add Skill" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Skill Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Mastery Level")).toBeInTheDocument();
  });

  it("enters selection mode when Remove Skills is clicked, allows picking items and shows selection checkboxes", () => {
    render(
      <HeaderProvider>
        <UserSkillsView
          userId="user-1"
          initialProfile={mockInitialProfile}
          isOwner={true}
        />
      </HeaderProvider>,
    );

    const removeBtn = screen.getByRole("button", { name: /Remove Skills/i });
    fireEvent.click(removeBtn);

    // Cancel and Delete buttons appear
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    const deleteBtn = screen.getByRole("button", { name: /Delete/i });
    expect(deleteBtn).toBeInTheDocument();
    expect(deleteBtn).toBeDisabled();

    // Skill items now have role="checkbox"
    const tsCheckbox = screen.getByRole("checkbox", { name: /TypeScript/i });
    expect(tsCheckbox).toHaveAttribute("aria-checked", "false");

    // Click to select TypeScript
    fireEvent.click(tsCheckbox);
    expect(tsCheckbox).toHaveAttribute("aria-checked", "true");
    expect(
      screen.getByRole("button", { name: /Delete \(1\)/i }),
    ).not.toBeDisabled();

    // Click to select React
    const reactCheckbox = screen.getByRole("checkbox", { name: /React/i });
    fireEvent.click(reactCheckbox);
    expect(reactCheckbox).toHaveAttribute("aria-checked", "true");
    expect(
      screen.getByRole("button", { name: /Delete \(2\)/i }),
    ).not.toBeDisabled();

    // Click React again to deselect
    fireEvent.click(reactCheckbox);
    expect(reactCheckbox).toHaveAttribute("aria-checked", "false");
    expect(
      screen.getByRole("button", { name: /Delete \(1\)/i }),
    ).not.toBeDisabled();
  });

  it("cancels selection mode when Cancel button is clicked", () => {
    render(
      <HeaderProvider>
        <UserSkillsView
          userId="user-1"
          initialProfile={mockInitialProfile}
          isOwner={true}
        />
      </HeaderProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Remove Skills/i }));
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));

    expect(
      screen.getByRole("button", { name: /Add Skill/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Remove Skills/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Cancel/i }),
    ).not.toBeInTheDocument();
  });

  it("cancels selection mode when Escape key is pressed", () => {
    render(
      <HeaderProvider>
        <UserSkillsView
          userId="user-1"
          initialProfile={mockInitialProfile}
          isOwner={true}
        />
      </HeaderProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Remove Skills/i }));
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });

    expect(
      screen.getByRole("button", { name: /Add Skill/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Remove Skills/i }),
    ).toBeInTheDocument();
  });

  it("deletes multiple selected skills in batch when Delete button is clicked", async () => {
    render(
      <HeaderProvider>
        <UserSkillsView
          userId="user-1"
          initialProfile={mockInitialProfile}
          isOwner={true}
        />
      </HeaderProvider>,
    );

    // Enter delete mode
    fireEvent.click(screen.getByRole("button", { name: /Remove Skills/i }));

    // Select TypeScript and Git
    fireEvent.click(screen.getByRole("checkbox", { name: /TypeScript/i }));
    fireEvent.click(screen.getByRole("checkbox", { name: /Git/i }));

    const deleteBtn = screen.getByRole("button", { name: /Delete \(2\)/i });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockDeleteProfileSkill).toHaveBeenCalledWith({
        variables: {
          skill: {
            userId: "user-1",
            name: expect.arrayContaining(["TypeScript", "Git"]),
          },
        },
      });
    });

    // Automatically exits selection mode after deletion
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Add Skill/i }),
      ).toBeInTheDocument();
    });
  });

  it("renders empty state when user has no skills", () => {
    render(
      <HeaderProvider>
        <UserSkillsView
          userId="user-1"
          initialProfile={{
            id: "user-1",
            first_name: "New",
            last_name: "User",
            skills: [],
          }}
          isOwner={true}
        />
      </HeaderProvider>,
    );

    expect(
      screen.getByText("No skills have been added yet."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add Your First Skill/i }),
    ).toBeInTheDocument();
  });
});
