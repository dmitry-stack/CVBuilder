import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CVPreviewSkeleton } from "./CVPreviewSkeleton";

describe("CVPreviewSkeleton component", () => {
  it("renders the cv preview skeleton container", () => {
    const { container } = render(<CVPreviewSkeleton />);
    expect(
      container.querySelector('[data-slot="cv-preview-skeleton"]'),
    ).toBeInTheDocument();
  });

  it("has accessible label for loading", () => {
    render(<CVPreviewSkeleton />);
    expect(screen.getByLabelText(/loading cv preview/i)).toBeInTheDocument();
  });
});
