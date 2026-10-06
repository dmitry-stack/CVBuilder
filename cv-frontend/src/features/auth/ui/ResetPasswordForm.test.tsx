import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ResetPasswordForm from "./ResetPasswordForm";
import { resetPasswordAction } from "../actions/reset-password.action";

const mockPush = vi.fn();
let mockToken: string | null = "test-token-123";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: (key: string) => (key === "token" ? mockToken : null),
  }),
}));

vi.mock("../actions/reset-password.action", () => ({
  resetPasswordAction: vi.fn(),
}));

describe("ResetPasswordForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockToken = "test-token-123";
  });

  it("should display password fields, submit button, and sign in link", () => {
    render(<ResetPasswordForm />);

    expect(screen.getByPlaceholderText(/^new password$/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/confirm password/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^submit$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /go to sign in/i }),
    ).toBeInTheDocument();
  });

  it("should show warning when token is missing", () => {
    mockToken = null;
    render(<ResetPasswordForm />);

    expect(screen.getByText(/no reset token provided/i)).toBeInTheDocument();
  });

  it("should display validation error when passwords do not match", async () => {
    const user = userEvent.setup();

    render(<ResetPasswordForm />);

    await user.type(
      screen.getByPlaceholderText(/^new password$/i),
      "password123",
    );
    await user.type(
      screen.getByPlaceholderText(/confirm password/i),
      "mismatchpass",
    );
    await user.click(screen.getByRole("button", { name: /^submit$/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
    expect(resetPasswordAction).not.toHaveBeenCalled();
  });

  it("should successfully call resetPasswordAction on valid submission", async () => {
    const user = userEvent.setup();
    vi.mocked(resetPasswordAction).mockResolvedValueOnce({ success: true });

    render(<ResetPasswordForm />);

    await user.type(
      screen.getByPlaceholderText(/^new password$/i),
      "newPassword123",
    );
    await user.type(
      screen.getByPlaceholderText(/confirm password/i),
      "newPassword123",
    );
    await user.click(screen.getByRole("button", { name: /^submit$/i }));

    await waitFor(() => {
      expect(resetPasswordAction).toHaveBeenCalledWith({
        newPassword: "newPassword123",
        confirmPassword: "newPassword123",
        token: "test-token-123",
      });
      expect(
        screen.getByText(/your password has been successfully reset/i),
      ).toBeInTheDocument();
    });
  });

  it("should display server error message when reset action returns an error", async () => {
    const user = userEvent.setup();
    vi.mocked(resetPasswordAction).mockResolvedValueOnce({
      serverError: "This password reset link has expired.",
    });

    render(<ResetPasswordForm />);

    await user.type(
      screen.getByPlaceholderText(/^new password$/i),
      "newPassword123",
    );
    await user.type(
      screen.getByPlaceholderText(/confirm password/i),
      "newPassword123",
    );
    await user.click(screen.getByRole("button", { name: /^submit$/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/this password reset link has expired/i),
      ).toBeInTheDocument();
    });
  });

  it("should toggle password visibility when clicking eye button", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm />);

    const newPasswordInput = screen.getByPlaceholderText(/^new password$/i);
    expect(newPasswordInput).toHaveAttribute("type", "password");

    const toggleBtn = screen.getByRole("button", {
      name: /show new password/i,
    });
    await user.click(toggleBtn);
    expect(newPasswordInput).toHaveAttribute("type", "text");

    const hideBtn = screen.getByRole("button", { name: /hide new password/i });
    await user.click(hideBtn);
    expect(newPasswordInput).toHaveAttribute("type", "password");
  });
});
