import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Navbar } from "./Navbar";
import { logoutAction } from "@/features/auth/actions/logout.action";

const mockPush = vi.fn();
const mockRefresh = vi.fn();
let mockCurrentPath = "/users";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
  usePathname: () => mockCurrentPath,
}));

const mockClearStore = vi.fn().mockResolvedValue(undefined);
vi.mock("@apollo/client/react", () => ({
  useApolloClient: () => ({
    clearStore: mockClearStore,
  }),
}));

vi.mock("@/features/auth/actions/logout.action", () => ({
  logoutAction: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("@/features/auth/hooks/useCurrentUser", () => ({
  useCurrentUser: vi.fn().mockReturnValue({
    currentUser: {
      id: "user-123",
      first_name: "Rostislav",
      last_name: "Harlanov",
      email: "rostislav@example.com",
      avatar: null,
    },
    currentUserId: "user-123",
    isOwnProfile: (id?: string) => id === "user-123",
    loading: false,
  }),
}));

describe("Navbar / Aside Sidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCurrentPath = "/users";
  });

  it("renders the CV Builder brand logo and title", () => {
    render(<Navbar />);

    const brandTitles = screen.getAllByText("CV Builder");
    expect(brandTitles.length).toBeGreaterThan(0);
  });

  it("renders navigation links for Employees, Skills, Languages, and CVs", () => {
    render(<Navbar />);

    const employeesLinks = screen.getAllByRole("link", { name: /employees/i });
    const skillsLinks = screen.getAllByRole("link", { name: /skills/i });
    const languagesLinks = screen.getAllByRole("link", { name: /languages/i });
    const cvsLinks = screen.getAllByRole("link", { name: /cvs/i });

    expect(employeesLinks.length).toBeGreaterThan(0);
    expect(skillsLinks.length).toBeGreaterThan(0);
    expect(languagesLinks.length).toBeGreaterThan(0);
    expect(cvsLinks.length).toBeGreaterThan(0);
  });

  it("marks active page with aria-current='page' and active styling", () => {
    mockCurrentPath = "/users";
    render(<Navbar />);

    const activeLink = screen.getByRole("link", {
      name: /employees/i,
      current: "page",
    });
    expect(activeLink).toBeInTheDocument();
    expect(activeLink.className).toMatch(/bg-cv-surface|bg-\[#E2E2E4\]/);
  });

  it("renders user avatar with initial and full name", () => {
    render(<Navbar userName="Rostislav Harlanov" userInitial="R" />);

    expect(screen.getByText("Rostislav Harlanov")).toBeInTheDocument();
    expect(screen.getByText("R")).toBeInTheDocument();
  });

  it("handles logout click by clearing tokens and routing to /signin", async () => {
    render(<Navbar />);

    const profileBtn = screen.getByRole("button", {
      name: /user profile for/i,
    });
    fireEvent.click(profileBtn);

    const logoutBtn = screen.getByRole("button", { name: /log out/i });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(logoutAction).toHaveBeenCalledTimes(1);
      expect(mockClearStore).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/signin");
      expect(mockRefresh).toHaveBeenCalledTimes(1);
    });
  });

  it("toggles mobile drawer when mobile menu button is clicked", () => {
    render(<Navbar />);

    const menuButton = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(menuButton);

    expect(
      screen.getByRole("button", { name: /close menu/i }),
    ).toBeInTheDocument();
  });

  it("links to current user's profile page in user menu", () => {
    render(<Navbar />);

    const profileBtn = screen.getByRole("button", {
      name: /user profile for/i,
    });
    fireEvent.click(profileBtn);

    const profileLink = screen.getByRole("link", { name: /profile/i });
    expect(profileLink).toHaveAttribute("href", "/users/user-123");
    expect(screen.getByText("rostislav@example.com")).toBeInTheDocument();
  });
});
