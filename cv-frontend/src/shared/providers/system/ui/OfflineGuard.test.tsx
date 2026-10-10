import * as React from "react";
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { OfflineGuard } from "./OfflineGuard";

describe("OfflineGuard Component", () => {
  const originalOnLine = navigator.onLine;

  beforeEach(() => {
    Object.defineProperty(navigator, "onLine", {
      value: true,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(navigator, "onLine", {
      value: originalOnLine,
      writable: true,
      configurable: true,
    });
  });

  it("renders children when online", () => {
    render(
      <OfflineGuard>
        <div data-testid="app-content">App Shell Content</div>
      </OfflineGuard>,
    );

    expect(screen.getByTestId("app-content")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders overlay when offline event is fired", () => {
    render(
      <OfflineGuard>
        <div data-testid="app-content">App Shell Content</div>
      </OfflineGuard>,
    );

    act(() => {
      Object.defineProperty(navigator, "onLine", {
        value: false,
        writable: true,
        configurable: true,
      });
      window.dispatchEvent(new Event("offline"));
    });

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Oops")).toBeInTheDocument();
  });
});
