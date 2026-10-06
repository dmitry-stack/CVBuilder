import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { forgotPasswordAction } from "../actions/forgot-password.action";

vi.mock("../actions/forgot-password.action", () => ({
  forgotPasswordAction: vi.fn(),
}));

describe("ForgotPasswordForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display email input and reset password button", () => {
    render(<ForgotPasswordForm />);

    expect(
      screen.getByPlaceholderText(/example@email.com/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reset password/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cancel/i })).toBeInTheDocument();
  });

  it("should display validation error when submitting invalid email", async () => {
    const user = userEvent.setup();

    render(<ForgotPasswordForm />);

    const submitBtn = screen.getByRole("button", { name: /reset password/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email/i),
      ).toBeInTheDocument();
    });
    expect(forgotPasswordAction).not.toHaveBeenCalled();
  });

  it("should successfully call forgotPasswordAction and show success message", async () => {
    const user = userEvent.setup();
    vi.mocked(forgotPasswordAction).mockResolvedValueOnce({ success: true });

    render(<ForgotPasswordForm />);

    await user.type(
      screen.getByPlaceholderText(/example@email.com/i),
      "user@example.com",
    );
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(forgotPasswordAction).toHaveBeenCalledWith({
        email: "user@example.com",
      });
      expect(
        screen.getByText(/if an account exists for this email/i),
      ).toBeInTheDocument();
    });
  });

  it("should display server error message when action fails", async () => {
    const user = userEvent.setup();
    vi.mocked(forgotPasswordAction).mockResolvedValueOnce({
      serverError: "Email not found",
    });

    render(<ForgotPasswordForm />);

    await user.type(
      screen.getByPlaceholderText(/example@email.com/i),
      "unknown@example.com",
    );
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/email not found/i)).toBeInTheDocument();
    });
  });
});
