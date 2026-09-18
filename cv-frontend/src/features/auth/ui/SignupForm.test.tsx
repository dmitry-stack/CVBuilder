import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SignupForm from "./SignupForm";
import { signupAction } from "../actions/signup.action";

const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(null),
  }),
}));

vi.mock("../actions/signup.action", () => ({
  signupAction: vi.fn(),
}));

describe("SignupForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display input fields and a sign-up button", () => {
    render(<SignupForm />);

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/confirm password/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /CREATE AN ACCOUNT/i }),
    ).toBeInTheDocument();
  });

  it("should display validation errors when submitting an empty form", async () => {
    const user = userEvent.setup();

    render(<SignupForm />);

    const submitBtn = screen.getByRole("button", {
      name: /CREATE AN ACCOUNT/i,
    });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email/i),
      ).toBeInTheDocument();
    });
    expect(signupAction).not.toHaveBeenCalled();
  });

  it("should display a validation error when passwords do not match", async () => {
    const user = userEvent.setup();

    render(<SignupForm />);

    await user.type(screen.getByPlaceholderText(/email/i), "test@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.type(
      screen.getByPlaceholderText(/confirm password/i),
      "differentpassword",
    );

    await user.click(
      screen.getByRole("button", { name: /CREATE AN ACCOUNT/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(/passwords do not match|passwords don't match/i),
      ).toBeInTheDocument();
    });

    expect(signupAction).not.toHaveBeenCalled();
  });

  it("should successfully call signupAction and redirect", async () => {
    const user = userEvent.setup();
    vi.mocked(signupAction).mockResolvedValueOnce({ success: true });

    render(<SignupForm />);

    await user.type(screen.getByPlaceholderText(/email/i), "test@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.type(
      screen.getByPlaceholderText(/confirm password/i),
      "password123",
    );

    await user.click(
      screen.getByRole("button", { name: /CREATE AN ACCOUNT/i }),
    );

    await waitFor(() => {
      expect(signupAction).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
      });
      expect(mockPush).toHaveBeenCalledWith("/users");
    });
  });

  it("should display a backend error when registration fails", async () => {
    const user = userEvent.setup();
    vi.mocked(signupAction).mockResolvedValueOnce({
      serverError:
        "An account with this email already exists. Please sign in instead.",
    });

    render(<SignupForm />);

    await user.type(
      screen.getByPlaceholderText(/email/i),
      "exists@example.com",
    );
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.type(
      screen.getByPlaceholderText(/confirm password/i),
      "password123",
    );

    await user.click(
      screen.getByRole("button", { name: /CREATE AN ACCOUNT/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(/an account with this email already exists/i),
      ).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });
});
