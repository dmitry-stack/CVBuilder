import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./button";

describe("Button component", () => {
  it("renders with default primary styling including hover, active, and disabled classes", () => {
    render(<Button>Update</Button>);

    const button = screen.getByRole("button", { name: /update/i });
    expect(button).toBeInTheDocument();
    expect(button.className).toContain("rounded-full");
    expect(button.className).toContain("uppercase");
    expect(button.className).toContain("bg-[#C63031]");
    expect(button.className).toContain("hover:border-[#C63031]");
    expect(button.className).toContain("hover:text-[#C63031]");
    expect(button.className).toContain("active:bg-[#EF9A9A]");
    expect(button.className).toContain("disabled:bg-[#BDBDBD]");
  });

  it("renders secondary variant with hover, active, and disabled classes", () => {
    render(<Button variant="secondary">Verify Email</Button>);

    const button = screen.getByRole("button", { name: /verify email/i });
    expect(button.className).toContain("border-[#2E2E2E]");
    expect(button.className).toContain("hover:bg-[#9E9E9E]");
    expect(button.className).toContain("hover:text-white");
    expect(button.className).toContain("active:bg-[#424242]");
    expect(button.className).toContain("disabled:bg-[#BDBDBD]");
  });

  it("renders ghost variant with hover and active classes", () => {
    render(<Button variant="ghost">Cancel</Button>);

    const button = screen.getByRole("button", { name: /cancel/i });
    expect(button.className).toContain("border-transparent");
    expect(button.className).toContain("hover:border-[#2E2E2E]");
    expect(button.className).toContain("active:bg-[#BDBDBD]");
    expect(button.className).toContain("disabled:bg-[#BDBDBD]");
  });

  it("renders primary-v2 variant with hover and active classes", () => {
    render(<Button variant="primary-v2">Update</Button>);

    const button = screen.getByRole("button", { name: /update/i });
    expect(button.className).toContain("text-[#C63031]");
    expect(button.className).toContain("hover:border-[#C63031]");
    expect(button.className).toContain("active:bg-[#EF9A9A]");
    expect(button.className).toContain("disabled:bg-[#BDBDBD]");
  });

  it("renders icon variant with circular aspect ratio and hover/active states", () => {
    render(
      <Button variant="icon" size="icon" aria-label="More">
        <span>⋮</span>
      </Button>,
    );

    const button = screen.getByRole("button", { name: /more/i });
    expect(button.className).toContain("rounded-full");
    expect(button.className).toContain("aspect-square");
    expect(button.className).toContain("hover:border-[#2E2E2E]");
    expect(button.className).toContain("active:bg-[#9E9E9E]");
  });

  it("applies disabled attributes and styling", () => {
    render(<Button disabled>Disabled Action</Button>);

    const button = screen.getByRole("button", { name: /disabled action/i });
    expect(button).toBeDisabled();
    expect(button.className).toContain("disabled:bg-[#BDBDBD]");
    expect(button.className).toContain("disabled:cursor-not-allowed");
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
