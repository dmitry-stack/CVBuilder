import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CVProjectsView } from "./CVProjectsView";
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

describe("CVProjectsView Component", () => {
  const mockCvData = {
    cv: {
      id: "cv-1",
      name: "Software Engineer With 5+ Years Of Experience",
      user: {
        id: "user-1",
      },
      projects: [
        {
          id: "cp-1",
          name: "SaaS Media Platform",
          internal_name: "saas_media",
          domain: "IoT (Internet of Things)",
          start_date: "2023-08-21",
          end_date: null,
          description:
            "A digital music, podcast, and video service that gives you access to millions of songs...",
          environment: ["React", "Node.js"],
          roles: ["Fullstack Engineer"],
          responsibilities: ["Managed to write code in time"],
          project: {
            id: "5",
            name: "SaaS Media Platform",
          },
        },
        {
          id: "cp-2",
          name: "Business Process Automation",
          internal_name: "bpa",
          domain: "Automation",
          start_date: "2023-01-20",
          end_date: "2023-06-19",
          description:
            "A system for setting up business process automation. Includes work with webhooks...",
          environment: ["TypeScript", "NestJS"],
          roles: ["Backend Engineer"],
          responsibilities: ["Did something great", "Did not break production"],
          project: {
            id: "3",
            name: "Business Process Automation",
          },
        },
      ],
    },
  };

  const mockAvailableProjects = {
    projects: {
      items: [
        { id: "3", name: "Business Process Automation", domain: "Automation" },
        {
          id: "5",
          name: "SaaS Media Platform",
          domain: "IoT (Internet of Things)",
        },
      ],
      total: 2,
    },
  };

  const mockAddCvProject = vi.fn().mockResolvedValue({ data: {} });
  const mockRemoveCvProject = vi.fn().mockResolvedValue({ data: {} });

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

    vi.mocked(useMutation).mockImplementation((document: unknown) => {
      const docStr = JSON.stringify(document);
      if (docStr.includes("RemoveCvProject")) {
        return [
          mockRemoveCvProject,
          {
            loading: false,
            reset: vi.fn(),
            called: false,
            client: undefined as never,
          },
        ];
      }
      return [
        mockAddCvProject,
        {
          loading: false,
          reset: vi.fn(),
          called: false,
          client: undefined as never,
        },
      ];
    });

    vi.mocked(useQuery).mockImplementation((document: unknown) => {
      const docStr = JSON.stringify(document);
      if (docStr.includes("AvailableProjects")) {
        return { data: mockAvailableProjects, loading: false } as never;
      }
      return { data: mockCvData, loading: false } as never;
    });
  });

  it("renders loading skeleton when cv query is loading", () => {
    vi.mocked(useQuery).mockReturnValue({ data: null, loading: true } as never);

    render(
      <HeaderProvider>
        <CVProjectsView cvId="cv-1" />
      </HeaderProvider>,
    );

    expect(screen.getByLabelText("Loading projects")).toBeInTheDocument();
  });

  it("renders projects list with exact columns, descriptions, and badges matching cvProjects.png", () => {
    render(
      <HeaderProvider>
        <CVProjectsView cvId="cv-1" />
      </HeaderProvider>,
    );

    // Project 1
    expect(screen.getByText("SaaS Media Platform")).toBeInTheDocument();
    expect(screen.getByText("IoT (Internet of Things)")).toBeInTheDocument();
    expect(screen.getByText("08/21/2023")).toBeInTheDocument();
    expect(screen.getByText("Till now")).toBeInTheDocument();
    expect(
      screen.getByText(/A digital music, podcast, and video service/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Managed to write code in time"),
    ).toBeInTheDocument();

    // Project 2
    expect(screen.getByText("Business Process Automation")).toBeInTheDocument();
    expect(screen.getByText("Automation")).toBeInTheDocument();
    expect(screen.getByText("01/20/2023")).toBeInTheDocument();
    expect(screen.getByText("06/19/2023")).toBeInTheDocument();
    expect(screen.getByText("Did something great")).toBeInTheDocument();
    expect(screen.getByText("Did not break production")).toBeInTheDocument();
  });

  it("shows + ADD PROJECT button and 3-dots action menu for owner", () => {
    render(
      <HeaderProvider>
        <CVProjectsView cvId="cv-1" />
      </HeaderProvider>,
    );

    expect(
      screen.getByRole("button", { name: /Add Project/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Actions for SaaS Media Platform/i }),
    ).toBeInTheDocument();
  });

  it("hides + ADD PROJECT button and 3-dots menu for peer view", () => {
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
        <CVProjectsView cvId="cv-1" />
      </HeaderProvider>,
    );

    expect(
      screen.queryByRole("button", { name: /Add Project/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: /Actions for SaaS Media Platform/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("filters projects by search term", () => {
    render(
      <HeaderProvider>
        <CVProjectsView cvId="cv-1" />
      </HeaderProvider>,
    );

    const searchInput = screen.getByLabelText("Search projects");
    fireEvent.change(searchInput, { target: { value: "Automation" } });

    expect(screen.getByText("Business Process Automation")).toBeInTheDocument();
    expect(screen.queryByText("SaaS Media Platform")).not.toBeInTheDocument();
  });

  it("renders empty state when CV has no projects", () => {
    vi.mocked(useQuery).mockImplementation((document: unknown) => {
      const docStr = JSON.stringify(document);
      if (docStr.includes("AvailableProjects")) {
        return { data: mockAvailableProjects, loading: false } as never;
      }
      return {
        data: { cv: { ...mockCvData.cv, projects: [] } },
        loading: false,
      } as never;
    });

    render(
      <HeaderProvider>
        <CVProjectsView cvId="cv-1" />
      </HeaderProvider>,
    );

    expect(screen.getByTestId("cv-projects-empty")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add Your First Project/i }),
    ).toBeInTheDocument();
  });

  it("opens Add Project modal when + ADD PROJECT button is clicked", async () => {
    render(
      <HeaderProvider>
        <CVProjectsView cvId="cv-1" />
      </HeaderProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Add Project/i }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Add project")).toBeInTheDocument();
  });

  it("opens remove confirmation dialog when Remove is clicked from action menu", async () => {
    render(
      <HeaderProvider>
        <CVProjectsView cvId="cv-1" />
      </HeaderProvider>,
    );

    // Open action menu for SaaS Media Platform
    const actionBtn = screen.getByRole("button", {
      name: /Actions for SaaS Media Platform/i,
    });
    fireEvent.click(actionBtn);

    // Click Remove item
    const removeMenuItem = screen.getByRole("menuitem", { name: /Remove/i });
    fireEvent.click(removeMenuItem);

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Remove Project from CV")).toBeInTheDocument();

    // Confirm remove
    const confirmBtn = screen.getByRole("button", { name: "Remove" });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockRemoveCvProject).toHaveBeenCalledWith({
        variables: {
          project: {
            cvId: "cv-1",
            projectId: "5",
          },
        },
      });
    });
  });
});
