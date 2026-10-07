import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProfileTabs } from "./ProfileTabs";

let mockPathname = "/users/user-1/profile";

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

const mockIsOwnProfile = vi.fn((id?: string) => id === "owner-id");

vi.mock("@/features/auth/hooks/useCurrentUser", () => ({
  useCurrentUser: () => ({
    currentUser: { id: "owner-id" },
    currentUserId: "owner-id",
    isOwnProfile: mockIsOwnProfile,
    loading: false,
  }),
}));

describe("ProfileTabs Component", () => {
  beforeEach(() => {
    mockPathname = "/users/user-1/profile";
    mockIsOwnProfile.mockImplementation((id?: string) => id === "owner-id");
  });

  it("renders navigation tabs with correct links for peer profile", () => {
    render(<ProfileTabs userId="user-1" isOwner={false} />);

    const profileTab = screen.getByRole("link", { name: "PROFILE" });
    const skillsTab = screen.getByRole("link", { name: "SKILLS" });
    const languagesTab = screen.getByRole("link", { name: "LANGUAGES" });

    expect(profileTab).toHaveAttribute("href", "/users/user-1/profile");
    expect(skillsTab).toHaveAttribute("href", "/users/user-1/skills");
    expect(languagesTab).toHaveAttribute("href", "/users/user-1/languages");
    expect(screen.queryByRole("link", { name: /cvs/i })).not.toBeInTheDocument();
  });

  it("renders CV tab for owner profile linking to /users/[id]/cvs", () => {
    render(<ProfileTabs userId="user-1" isOwner={true} />);

    const cvTab = screen.getByRole("link", { name: /cvs/i });
    expect(cvTab).toBeInTheDocument();
    expect(cvTab).toHaveAttribute("href", "/users/user-1/cvs");
  });

  it("automatically shows CV tab when logged in user is the owner", () => {
    render(<ProfileTabs userId="owner-id" />);

    const cvTab = screen.getByRole("link", { name: /cvs/i });
    expect(cvTab).toBeInTheDocument();
    expect(cvTab).toHaveAttribute("href", "/users/owner-id/cvs");
  });

  it("marks the current tab as active page", () => {
    render(<ProfileTabs userId="user-1" isOwner={false} />);

    const profileTab = screen.getByRole("link", { name: "PROFILE" });
    expect(profileTab).toHaveAttribute("aria-current", "page");

    const skillsTab = screen.getByRole("link", { name: "SKILLS" });
    expect(skillsTab).not.toHaveAttribute("aria-current");
  });

  it("marks the CV tab as active when on /users/[id]/cvs", () => {
    mockPathname = "/users/user-1/cvs";
    render(<ProfileTabs userId="user-1" isOwner={true} />);

    const cvTab = screen.getByRole("link", { name: /cvs/i });
    expect(cvTab).toHaveAttribute("aria-current", "page");
  });
});
