import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { NoInternetView } from "./NoInternetView";

describe("NoInternetView Component", () => {
  it("renders Oops title, description, and RETRY button", () => {
    render(<NoInternetView />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Oops")).toBeInTheDocument();
    expect(
      screen.getByText(/Something went wrong/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^retry$/i }),
    ).toBeInTheDocument();
  });

  it("calls onRetry callback when RETRY button is clicked", async () => {
    const handleRetry = vi.fn();
    const user = userEvent.setup();

    render(<NoInternetView onRetry={handleRetry} />);

    const retryBtn = screen.getByRole("button", { name: /^retry$/i });
    await user.click(retryBtn);

    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it("applies overlay container classes when isOverlay is true", () => {
    const { container } = render(<NoInternetView isOverlay={true} />);
    const alert = container.querySelector('[data-slot="no-internet-view"]');

    expect(alert).toHaveClass("shadow-2xl");
    expect(alert).toHaveClass("rounded-2xl");
  });
});
