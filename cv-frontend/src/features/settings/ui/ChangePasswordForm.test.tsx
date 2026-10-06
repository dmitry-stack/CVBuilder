import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { changePasswordAction } from "@/features/auth/actions/change-password.action";

vi.mock("@/features/auth/actions/change-password.action", () => ({
  changePasswordAction: vi.fn(),
}));

describe("ChangePasswordForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all three password input fields with placeholders", () => {
    render(<ChangePasswordForm />);

    expect(screen.getByPlaceholderText("Current Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("New Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
  });

  it("renders CHANGE PASSWORD and CANCEL buttons", () => {
    render(<ChangePasswordForm />);

    expect(
      screen.getByRole("button", { name: /change password/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("toggles password visibility between password and text types", () => {
    render(<ChangePasswordForm />);

    const currentPasswordInput =
      screen.getByPlaceholderText("Current Password");
    expect(currentPasswordInput).toHaveAttribute("type", "password");

    const toggleBtn = screen.getByRole("button", {
      name: /show current password/i,
    });
    fireEvent.click(toggleBtn);

    expect(currentPasswordInput).toHaveAttribute("type", "text");

    fireEvent.click(
      screen.getByRole("button", { name: /hide current password/i }),
    );
    expect(currentPasswordInput).toHaveAttribute("type", "password");
  });

  it("resets input values when clicking CANCEL", () => {
    render(<ChangePasswordForm />);

    const currentInput = screen.getByPlaceholderText("Current Password");
    const newInput = screen.getByPlaceholderText("New Password");
    const confirmInput = screen.getByPlaceholderText("Confirm Password");

    fireEvent.change(currentInput, { target: { value: "oldsecret123" } });
    fireEvent.change(newInput, { target: { value: "newsecret456" } });
    fireEvent.change(confirmInput, { target: { value: "newsecret456" } });

    expect(currentInput).toHaveValue("oldsecret123");
    expect(newInput).toHaveValue("newsecret456");
    expect(confirmInput).toHaveValue("newsecret456");

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelBtn);

    expect(currentInput).toHaveValue("");
    expect(newInput).toHaveValue("");
    expect(confirmInput).toHaveValue("");
  });

  it("shows validation error when submitting empty fields", async () => {
    const user = userEvent.setup();
    render(<ChangePasswordForm />);

    const submitBtn = screen.getByRole("button", { name: /change password/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/current password is required/i),
      ).toBeInTheDocument();
    });
    expect(changePasswordAction).not.toHaveBeenCalled();
  });

  it("shows validation error when new password is same as current password", async () => {
    const user = userEvent.setup();
    render(<ChangePasswordForm />);

    await user.type(
      screen.getByPlaceholderText("Current Password"),
      "samepassword123",
    );
    await user.type(
      screen.getByPlaceholderText("New Password"),
      "samepassword123",
    );
    await user.type(
      screen.getByPlaceholderText("Confirm Password"),
      "samepassword123",
    );

    const submitBtn = screen.getByRole("button", { name: /change password/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(
          /new password cannot be the same as the current password/i,
        ),
      ).toBeInTheDocument();
    });
    expect(changePasswordAction).not.toHaveBeenCalled();
  });

  it("successfully calls changePasswordAction and shows success message", async () => {
    const user = userEvent.setup();
    vi.mocked(changePasswordAction).mockResolvedValueOnce({ success: true });

    render(<ChangePasswordForm />);

    await user.type(
      screen.getByPlaceholderText("Current Password"),
      "oldpassword123",
    );
    await user.type(
      screen.getByPlaceholderText("New Password"),
      "newpassword123",
    );
    await user.type(
      screen.getByPlaceholderText("Confirm Password"),
      "newpassword123",
    );

    const submitBtn = screen.getByRole("button", { name: /change password/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(changePasswordAction).toHaveBeenCalledWith({
        currentPassword: "oldpassword123",
        newPassword: "newpassword123",
        confirmPassword: "newpassword123",
      });
      expect(
        screen.getByText(/password successfully changed/i),
      ).toBeInTheDocument();
    });
  });

  it("displays server error message when changePasswordAction fails", async () => {
    const user = userEvent.setup();
    vi.mocked(changePasswordAction).mockResolvedValueOnce({
      serverError: "Current password is incorrect.",
    });

    render(<ChangePasswordForm />);

    await user.type(
      screen.getByPlaceholderText("Current Password"),
      "wrongpassword",
    );
    await user.type(
      screen.getByPlaceholderText("New Password"),
      "newpassword123",
    );
    await user.type(
      screen.getByPlaceholderText("Confirm Password"),
      "newpassword123",
    );

    const submitBtn = screen.getByRole("button", { name: /change password/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/current password is incorrect/i),
      ).toBeInTheDocument();
    });
  });
});
