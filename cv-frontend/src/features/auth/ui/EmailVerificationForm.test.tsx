import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EmailVerificationForm from "./EmailVerificationForm";
import { verifyEmailAction } from "../actions/verify-email.action";
import { sendVerificationAction } from "../actions/send-verification.action";

const mockPush = vi.fn();
const mockRefresh = vi.fn();
let mockSearchParams: Record<string, string | null> = {};

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
  useSearchParams: () => ({
    get: (key: string) => mockSearchParams[key] ?? null,
  }),
}));

vi.mock("../actions/verify-email.action", () => ({
  verifyEmailAction: vi.fn(),
}));

vi.mock("../actions/send-verification.action", () => ({
  sendVerificationAction: vi.fn(),
}));

describe("EmailVerificationForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = {};
  });

  it("should render 6 OTP inputs, a submit button, and a later link", () => {
    render(<EmailVerificationForm />);

    for (let i = 1; i <= 6; i++) {
      expect(screen.getByLabelText(`Digit ${i}`)).toBeInTheDocument();
    }
    expect(
      screen.getByRole("button", { name: /confirm/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /later/i })).toBeInTheDocument();
  });

  it("should disable submit button when code is not complete", () => {
    render(<EmailVerificationForm />);

    const confirmBtn = screen.getByRole("button", { name: /confirm/i });
    expect(confirmBtn).toBeDisabled();
  });

  it("should allow entering 6 digits and submit successfully", async () => {
    const user = userEvent.setup();
    vi.mocked(verifyEmailAction).mockResolvedValueOnce({ success: true });

    render(<EmailVerificationForm />);

    for (let i = 1; i <= 6; i++) {
      await user.type(screen.getByLabelText(`Digit ${i}`), `${i}`);
    }

    const confirmBtn = screen.getByRole("button", { name: /confirm/i });
    expect(confirmBtn).toBeEnabled();

    await user.click(confirmBtn);

    await waitFor(() => {
      expect(verifyEmailAction).toHaveBeenCalledWith({
        otp: "123456",
        token: undefined,
      });
      expect(
        screen.getByText(/email successfully verified/i),
      ).toBeInTheDocument();
    });
  });

  it("should display server error message on verification failure", async () => {
    const user = userEvent.setup();
    vi.mocked(verifyEmailAction).mockResolvedValueOnce({
      serverError: "Invalid verification code",
    });

    render(<EmailVerificationForm />);

    for (let i = 1; i <= 6; i++) {
      await user.type(screen.getByLabelText(`Digit ${i}`), `${i}`);
    }

    const confirmBtn = screen.getByRole("button", { name: /confirm/i });
    await user.click(confirmBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/invalid verification code/i),
      ).toBeInTheDocument();
    });
  });

  it("should render resend button when email query param is present and trigger resend action", async () => {
    mockSearchParams = { email: "newuser@example.com" };
    const user = userEvent.setup();
    vi.mocked(sendVerificationAction).mockResolvedValueOnce({ success: true });

    render(<EmailVerificationForm />);

    const resendBtn = screen.getByRole("button", { name: /resend/i });
    expect(resendBtn).toBeInTheDocument();

    await user.click(resendBtn);

    await waitFor(() => {
      expect(sendVerificationAction).toHaveBeenCalledWith(
        "newuser@example.com",
      );
      expect(
        screen.getByText(/a new verification code has been sent/i),
      ).toBeInTheDocument();
    });
  });
});
