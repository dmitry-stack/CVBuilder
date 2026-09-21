import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthTabs } from "./AuthTabs";

let mockPathname = "/signin";

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

describe("AuthTabs component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPathname = "/signin";
  });

  it("renders SIGN IN and SIGN UP navigation tabs", () => {
    render(<AuthTabs />);

    const signinLink = screen.getByRole("link", { name: /sign in/i });
    const signupLink = screen.getByRole("link", { name: /sign up/i });

    expect(signinLink).toBeInTheDocument();
    expect(signupLink).toBeInTheDocument();
  });

  it("marks SIGN IN as active when on /signin", () => {
    mockPathname = "/signin";
    render(<AuthTabs />);

    const signinLink = screen.getByRole("link", { name: /sign in/i });
    expect(signinLink).toHaveAttribute("aria-current", "page");
    expect(signinLink.className).toMatch(/text-cv-accent|text-\[#C63031\]/);
  });

  it("marks SIGN UP as active when on /signup", () => {
    mockPathname = "/signup";
    render(<AuthTabs />);

    const signupLink = screen.getByRole("link", { name: /sign up/i });
    expect(signupLink).toHaveAttribute("aria-current", "page");
    expect(signupLink.className).toMatch(/text-cv-accent|text-\[#C63031\]/);
  });
});
