import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProfileTabs } from "./ProfileTabs";

vi.mock("next/navigation", () => ({
  usePathname: () => "/users/user-1/profile",
}));

describe("ProfileTabs Component", () => {
  it("renders navigation tabs with correct links", () => {
    render(<ProfileTabs userId="user-1" />);

    const profileTab = screen.getByRole("link", { name: "PROFILE" });
    const skillsTab = screen.getByRole("link", { name: "SKILLS" });
    const languagesTab = screen.getByRole("link", { name: "LANGUAGES" });

    expect(profileTab).toHaveAttribute("href", "/users/user-1/profile");
    expect(skillsTab).toHaveAttribute("href", "/users/user-1/skills");
    expect(languagesTab).toHaveAttribute("href", "/users/user-1/languages");
  });

  it("marks the current tab as active page", () => {
    render(<ProfileTabs userId="user-1" />);

    const profileTab = screen.getByRole("link", { name: "PROFILE" });
    expect(profileTab).toHaveAttribute("aria-current", "page");

    const skillsTab = screen.getByRole("link", { name: "SKILLS" });
    expect(skillsTab).not.toHaveAttribute("aria-current");
  });
});
