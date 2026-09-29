import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CVSkillsView } from "./CVSkillsView";
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

describe("CVSkillsView Component", () => {
  const mockCvData = {
    cv: {
      id: "cv-1",
      name: "Senior Frontend Engineer CV",
      skills: [
        { name: "TypeScript", categoryId: "1", mastery: "Expert" as const },
        { name: "React", categoryId: "2", mastery: "Proficient" as const },
        { name: "Docker", categoryId: "3", mastery: "Competent" as const },
      ],
      user: {
        id: "user-1",
        email: "alex@example.com",
        profile: {
          id: "p-1",
          first_name: "Alex",
          last_name: "Smith",
          avatar: null,
          skills: [],
        },
      },
    },
  };

  const mockCategoriesData = {
    skillCategories: [
      { id: "1", name: "Programming languages", order: 1 },
      { id: "2", name: "Frontend", order: 2 },
      { id: "3", name: "Backend", order: 3 },
    ],
  };

  const mockDeleteSkill = vi.fn().mockResolvedValue({ data: {} });

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
      mockDeleteSkill,
      {
        loading: false,
        reset: vi.fn(),
        called: false,
        client: undefined as unknown as ReturnType<
          typeof useMutation
        >[1]["client"],
      },
    ] as unknown as ReturnType<typeof useMutation>);

    vi.mocked(useQuery).mockImplementation((document: unknown) => {
      const docStr = JSON.stringify(document);
      if (docStr.includes("SkillCategories")) {
        return {
          data: mockCategoriesData,
          loading: false,
        } as unknown as ReturnType<typeof useQuery>;
      }
      return { data: mockCvData, loading: false } as unknown as ReturnType<
        typeof useQuery
      >;
    });
  });

  it("renders loading skeleton when query is loading", () => {
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      loading: true,
    } as unknown as ReturnType<typeof useQuery>);

    render(
      <HeaderProvider>
        <CVSkillsView cvId="cv-1" />
      </HeaderProvider>,
    );

    expect(screen.getByLabelText("Loading skills")).toBeInTheDocument();
  });

  it("renders empty state when CV has no skills", () => {
    vi.mocked(useQuery).mockImplementation((document: unknown) => {
      const docStr = JSON.stringify(document);
      if (docStr.includes("SkillCategories")) {
        return {
          data: mockCategoriesData,
          loading: false,
        } as unknown as ReturnType<typeof useQuery>;
      }
      return {
        data: { cv: { ...mockCvData.cv, skills: [] } },
        loading: false,
      } as unknown as ReturnType<typeof useQuery>;
    });

    render(
      <HeaderProvider>
        <CVSkillsView cvId="cv-1" />
      </HeaderProvider>,
    );

    expect(screen.getByTestId("cv-skills-empty")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add Your First Skill/i }),
    ).toBeInTheDocument();
  });

  it("renders grouped skills and mastery bars for CV matching skills page layout", () => {
    render(
      <HeaderProvider>
        <CVSkillsView cvId="cv-1" />
      </HeaderProvider>,
    );

    expect(screen.getByText("Programming languages")).toBeInTheDocument();
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Docker")).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: "TypeScript: Expert" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: "React: Proficient" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: "Docker: Competent" }),
    ).toBeInTheDocument();
  });

  it("shows action buttons for owner and hides them for peer view", () => {
    const { unmount } = render(
      <HeaderProvider>
        <CVSkillsView cvId="cv-1" />
      </HeaderProvider>,
    );

    expect(
      screen.getByRole("button", { name: /Add Skill/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Remove Skills/i }),
    ).toBeInTheDocument();

    unmount();

    // Peer view: currentUser is different from cv.user.id
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
        <CVSkillsView cvId="cv-1" />
      </HeaderProvider>,
    );

    expect(
      screen.queryByRole("button", { name: /Add Skill/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Remove Skills/i }),
    ).not.toBeInTheDocument();
  });

  it("handles delete mode: selects skills and updates delete button count", async () => {
    render(
      <HeaderProvider>
        <CVSkillsView cvId="cv-1" />
      </HeaderProvider>,
    );

    // Enter delete mode
    fireEvent.click(screen.getByRole("button", { name: /Remove Skills/i }));

    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    const deleteBtn = screen.getByRole("button", { name: /Delete/i });
    expect(deleteBtn).toBeDisabled();

    // Select TypeScript
    fireEvent.click(screen.getByTestId("skill-card-TypeScript"));
    expect(
      screen.getByRole("button", { name: /Delete \(1\)/i }),
    ).not.toBeDisabled();

    // Select React
    fireEvent.click(screen.getByTestId("skill-card-React"));
    expect(
      screen.getByRole("button", { name: /Delete \(2\)/i }),
    ).not.toBeDisabled();

    // Click CANCEL
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(
      screen.getByRole("button", { name: /Add Skill/i }),
    ).toBeInTheDocument();
  });

  it("cancels delete mode on Escape key press", () => {
    render(
      <HeaderProvider>
        <CVSkillsView cvId="cv-1" />
      </HeaderProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Remove Skills/i }));
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(
      screen.getByRole("button", { name: /Add Skill/i }),
    ).toBeInTheDocument();
  });

  it("opens add skill modal when Add Skill button is clicked", async () => {
    render(
      <HeaderProvider>
        <CVSkillsView cvId="cv-1" />
      </HeaderProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Add Skill/i }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Add Skill" }),
    ).toBeInTheDocument();
  });

  it("deletes multiple selected skills in batch when Delete button is clicked", async () => {
    render(
      <HeaderProvider>
        <CVSkillsView cvId="cv-1" />
      </HeaderProvider>,
    );

    // Enter delete mode
    fireEvent.click(screen.getByRole("button", { name: /Remove Skills/i }));

    // Select TypeScript and Docker
    fireEvent.click(screen.getByTestId("skill-card-TypeScript"));
    fireEvent.click(screen.getByTestId("skill-card-Docker"));

    const deleteBtn = screen.getByRole("button", { name: /Delete \(2\)/i });
    fireEvent.click(deleteBtn);

    const confirmBtn = await screen.findByRole("button", {
      name: /Delete Skills \(2\)/i,
    });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockDeleteSkill).toHaveBeenCalledWith({
        variables: {
          skill: {
            cvId: "cv-1",
            name: expect.arrayContaining(["TypeScript", "Docker"]),
          },
        },
      });
    });
  });
});
