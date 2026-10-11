import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProfileTabsSkeleton } from "./ProfileTabsSkeleton";

describe("ProfileTabsSkeleton Component", () => {
  it("renders 3 tabs by default with profile active", () => {
    render(<ProfileTabsSkeleton />);

    expect(screen.getByText("PROFILE")).toBeInTheDocument();
    expect(screen.getByText("SKILLS")).toBeInTheDocument();
    expect(screen.getByText("LANGUAGES")).toBeInTheDocument();
    expect(screen.queryByText("CVS")).not.toBeInTheDocument();

    const profileText = screen.getByText("PROFILE");
    expect(profileText).toHaveClass("text-cv-accent");
    expect(profileText).toHaveClass("font-semibold");
    expect(profileText).toHaveClass("font-roboto");
    expect(profileText).toHaveClass("leading-cv-label");
    expect(profileText).toHaveClass("tracking-cv-wide");
  });

  it("renders CVS tab when showCvsTab is true", () => {
    render(<ProfileTabsSkeleton showCvsTab={true} activeTab="cvs" />);

    const cvsText = screen.getByText("CVS");
    expect(cvsText).toBeInTheDocument();
    expect(cvsText).toHaveClass("text-cv-accent");
    expect(cvsText).toHaveClass("font-semibold");
  });

  it("sets correct active tab styling for skills", () => {
    render(<ProfileTabsSkeleton activeTab="skills" />);

    const skillsText = screen.getByText("SKILLS");
    expect(skillsText).toHaveClass("text-cv-accent");
    expect(skillsText).toHaveClass("font-semibold");

    const profileText = screen.getByText("PROFILE");
    expect(profileText).toHaveClass("text-cv-text");
    expect(profileText).toHaveClass("font-medium");
  });
});
