import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UserSkillsView } from "./UserSkillsView";
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

  it("renders Add Skill button when viewing own profile", () => {
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
  });

  it("hides Add Skill and edit buttons when viewing peer profile", () => {
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
