import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkillMasteryBar } from "./SkillMasteryBar";

describe("SkillMasteryBar Component", () => {
  it("renders Novice level with 20% progress and grey styling", () => {
    render(<SkillMasteryBar mastery="Novice" skillName="Keycloak" />);

    const bar = screen.getByRole("progressbar", { name: "Keycloak: Novice" });
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute("aria-valuenow", "20");

    const fill = bar.querySelector("[data-slot='skill-mastery-fill']");
    expect(fill).toHaveStyle({ width: "20%" });
    expect(fill?.className).toContain("bg-[#626262]");
  });

  it("renders Advanced level with 40% progress and blue styling", () => {
    render(<SkillMasteryBar mastery="Advanced" skillName="Storybook" />);

    const bar = screen.getByRole("progressbar", {
      name: "Storybook: Advanced",
    });
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute("aria-valuenow", "40");

    const fill = bar.querySelector("[data-slot='skill-mastery-fill']");
    expect(fill).toHaveStyle({ width: "40%" });
    expect(fill?.className).toContain("bg-[#29B6F6]");
  });

  it("renders Competent level with 60% progress and green styling", () => {
    render(<SkillMasteryBar mastery="Competent" skillName="Node.js" />);

    const bar = screen.getByRole("progressbar", { name: "Node.js: Competent" });
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute("aria-valuenow", "60");

    const fill = bar.querySelector("[data-slot='skill-mastery-fill']");
    expect(fill).toHaveStyle({ width: "60%" });
    expect(fill?.className).toContain("bg-[#66BB6A]");
  });

  it("renders Proficient level with 80% progress and amber styling", () => {
    render(<SkillMasteryBar mastery="Proficient" skillName="TypeScript" />);

    const bar = screen.getByRole("progressbar", {
      name: "TypeScript: Proficient",
    });
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute("aria-valuenow", "80");

    const fill = bar.querySelector("[data-slot='skill-mastery-fill']");
    expect(fill).toHaveStyle({ width: "80%" });
    expect(fill?.className).toContain("bg-[#FFB800]");
  });

  it("renders Expert level with 100% progress and cv-accent red styling", () => {
    render(<SkillMasteryBar mastery="Expert" skillName="React" />);

    const bar = screen.getByRole("progressbar", { name: "React: Expert" });
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute("aria-valuenow", "100");

    const fill = bar.querySelector("[data-slot='skill-mastery-fill']");
    expect(fill).toHaveStyle({ width: "100%" });
    expect(fill?.className).toContain("bg-cv-accent");
  });

  it("handles case-insensitive mastery string", () => {
    render(<SkillMasteryBar mastery="expert" />);

    const bar = screen.getByRole("progressbar", { name: "Expert" });
    expect(bar).toHaveAttribute("aria-valuenow", "100");
  });

  it("defaults to Novice if unknown mastery is provided", () => {
    render(<SkillMasteryBar mastery="Unknown" />);

    const bar = screen.getByRole("progressbar", { name: "Novice" });
    expect(bar).toHaveAttribute("aria-valuenow", "20");
  });
});
