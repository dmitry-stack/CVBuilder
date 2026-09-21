import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LogoutButton } from "./LogoutButton";
import { logoutAction } from "@/features/auth/actions/logout.action";

const mockPush = vi.fn();
const mockRefresh = vi.fn();
const mockClearStore = vi.fn().mockResolvedValue(undefined);

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

vi.mock("@apollo/client/react", () => ({
  useApolloClient: () => ({
    clearStore: mockClearStore,
  }),
}));

vi.mock("@/features/auth/actions/logout.action", () => ({
  logoutAction: vi.fn().mockResolvedValue({ success: true }),
}));

describe("LogoutButton component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with label", () => {
    render(<LogoutButton />);
    const button = screen.getByRole("button", { name: /log out/i });
    expect(button).toBeInTheDocument();
  });

  it("clears tokens, resets Apollo store, and redirects to /signin on click", async () => {
    const user = userEvent.setup();
    render(<LogoutButton />);

    const button = screen.getByRole("button", { name: /log out/i });
    await user.click(button);

    expect(logoutAction).toHaveBeenCalled();
    expect(mockClearStore).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/signin");
    expect(mockRefresh).toHaveBeenCalled();
  });
});
