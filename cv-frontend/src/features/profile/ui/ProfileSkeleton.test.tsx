import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProfileSkeleton } from "./ProfileSkeleton";

describe("ProfileSkeleton component", () => {
  it("renders profile skeleton container with data-slot", () => {
    const { container } = render(<ProfileSkeleton />);

    const skeleton = container.querySelector('[data-slot="profile-skeleton"]');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass("animate-pulse");
  });

  it("renders 4 field skeletons with labels and input boxes", () => {
    const { container } = render(<ProfileSkeleton />);

    const inputs = container.querySelectorAll(".h-11");
    expect(inputs.length).toBe(4);

    const labels = container.querySelectorAll(".h-3");
    expect(labels.length).toBe(4);
  });
});
