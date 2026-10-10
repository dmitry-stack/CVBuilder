import * as React from "react";
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { DeviceGuard } from "./DeviceGuard";

let mockPathname = "/users";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

describe("DeviceGuard Component", () => {
  let listeners: Array<(e: MediaQueryListEvent) => void> = [];
  let matchesValue = false;

  beforeEach(() => {
    listeners = [];
    matchesValue = false;
    mockPathname = "/users";

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: matchesValue,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(
        (event: string, callback: (e: MediaQueryListEvent) => void) => {
          if (event === "change") {
            listeners.push(callback);
          }
        },
      ),
      removeEventListener: vi.fn(
        (event: string, callback: (e: MediaQueryListEvent) => void) => {
          if (event === "change") {
            listeners = listeners.filter((cb) => cb !== callback);
          }
        },
      ),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders children when viewport width is desktop or tablet (>= 768px)", () => {
    matchesValue = false;

    render(
      <DeviceGuard>
        <div data-testid="app-content">App Shell Content</div>
      </DeviceGuard>,
    );

    expect(screen.getByTestId("app-content")).toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: /unsupported device/i }),
    ).not.toBeInTheDocument();
  });

  it("renders UnsupportedDeviceView when viewport is mobile (< 768px)", () => {
    matchesValue = true;

    render(
      <DeviceGuard>
        <div data-testid="app-content">App Shell Content</div>
      </DeviceGuard>,
    );

    expect(screen.queryByTestId("app-content")).not.toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: /unsupported device/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Oops")).toBeInTheDocument();
    expect(screen.getByText(/Device is not supported/i)).toBeInTheDocument();
  });

  it("dynamically switches to UnsupportedDeviceView when media query change fires", () => {
    matchesValue = false;

    render(
      <DeviceGuard>
        <div data-testid="app-content">App Shell Content</div>
      </DeviceGuard>,
    );

    expect(screen.getByTestId("app-content")).toBeInTheDocument();

    act(() => {
      matchesValue = true;
      listeners.forEach((callback) =>
        callback({ matches: true } as MediaQueryListEvent),
      );
    });

    expect(screen.queryByTestId("app-content")).not.toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: /unsupported device/i }),
    ).toBeInTheDocument();
  });

  it("renders children when already on /unsupported-device route even on mobile", () => {
    matchesValue = true;
    mockPathname = "/unsupported-device";

    render(
      <DeviceGuard>
        <div data-testid="custom-unsupported-page">Direct Unsupported Page</div>
      </DeviceGuard>,
    );

    expect(screen.getByTestId("custom-unsupported-page")).toBeInTheDocument();
  });
});
