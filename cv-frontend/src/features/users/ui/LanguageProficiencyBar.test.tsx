import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LanguageProficiencyBar } from "./LanguageProficiencyBar";

describe("LanguageProficiencyBar Component", () => {
  it("renders A1 level with 15% progress and grey styling", () => {
    render(<LanguageProficiencyBar proficiency="A1" languageName="French" />);

    const bar = screen.getByRole("progressbar", {
      name: "French: A1 (Beginner)",
    });
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute("aria-valuenow", "15");

    const fill = bar.querySelector("[data-slot='language-proficiency-fill']");
    expect(fill).toHaveStyle({ width: "15%" });
    expect(fill?.className).toContain("bg-[#626262]");
  });

  it("renders B1 level with 45% progress and blue styling", () => {
    render(<LanguageProficiencyBar proficiency="B1" languageName="German" />);

    const bar = screen.getByRole("progressbar", {
      name: "German: B1 (Intermediate)",
    });
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute("aria-valuenow", "45");

    const fill = bar.querySelector("[data-slot='language-proficiency-fill']");
    expect(fill).toHaveStyle({ width: "45%" });
    expect(fill?.className).toContain("bg-[#29B6F6]");
  });

  it("renders B2 level with 60% progress and green styling", () => {
    render(<LanguageProficiencyBar proficiency="B2" languageName="English" />);

    const bar = screen.getByRole("progressbar", {
      name: "English: B2 (Upper Intermediate)",
    });
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute("aria-valuenow", "60");

    const fill = bar.querySelector("[data-slot='language-proficiency-fill']");
    expect(fill).toHaveStyle({ width: "60%" });
    expect(fill?.className).toContain("bg-[#66BB6A]");
  });

  it("renders C1 level with 75% progress and yellow styling", () => {
    render(<LanguageProficiencyBar proficiency="C1" languageName="Italian" />);

    const bar = screen.getByRole("progressbar", {
      name: "Italian: C1 (Advanced)",
    });
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute("aria-valuenow", "75");

    const fill = bar.querySelector("[data-slot='language-proficiency-fill']");
    expect(fill).toHaveStyle({ width: "75%" });
    expect(fill?.className).toContain("bg-[#FFB800]");
  });

  it("renders Native level with 100% progress and cv-accent styling", () => {
    render(
      <LanguageProficiencyBar proficiency="Native" languageName="Spanish" />,
    );

    const bar = screen.getByRole("progressbar", {
      name: "Spanish: Native (Native / Bilingual)",
    });
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute("aria-valuenow", "100");

    const fill = bar.querySelector("[data-slot='language-proficiency-fill']");
    expect(fill).toHaveStyle({ width: "100%" });
    expect(fill?.className).toContain("bg-cv-accent");
  });

  it("handles case-insensitive proficiency string", () => {
    render(<LanguageProficiencyBar proficiency="b1" languageName="German" />);

    const bar = screen.getByRole("progressbar", {
      name: "German: B1 (Intermediate)",
    });
    expect(bar).toHaveAttribute("aria-valuenow", "45");
  });

  it("defaults to A1 if unknown proficiency is provided", () => {
    render(<LanguageProficiencyBar proficiency="Unknown" />);

    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "15");
  });
});
