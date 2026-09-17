import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MockedProvider } from "@apollo/client/testing/react";

import { SignupDocument } from "@/graphql/__generated__/graphql";
import { authStorage } from "@/lib/auth-storage";
import SignupForm from "./SignupForm";

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

vi.mock("@/lib/auth-storage", () => ({
  authStorage: {
    setTokens: vi.fn(),
  },
}));

describe("SignupForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display input fields and a sign-up button", () => {
    render(
      <MockedProvider mocks={[]}>
        <SignupForm />
      </MockedProvider>,
    );

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

    render(
      <MockedProvider mocks={[]}>
        <SignupForm />
      </MockedProvider>,
    );

    const submitBtn = screen.getByRole("button", {
      name: /CREATE AN ACCOUNT/i,
    });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email/i),
      ).toBeInTheDocument();
    });
    expect(authStorage.setTokens).not.toHaveBeenCalled();
  });

  it("should display a validation error when passwords do not match", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[]}>
        <SignupForm />
      </MockedProvider>,
    );

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

    expect(authStorage.setTokens).not.toHaveBeenCalled();
  });

  it("should successfully register a user, save tokens, and redirect", async () => {
    const user = userEvent.setup();

    const signupMock = {
      request: {
        query: SignupDocument,
        variables: {
          auth: {
            email: "test@example.com",
            password: "password123",
            confirmPassword: "password123",
          },
        },
      },
      result: {
        data: {
          signup: {
            access_token: "mock-signup-access",
            refresh_token: "mock-signup-refresh",
            user: {
              id: "2",
              email: "test@example.com",
            },
          },
        },
      },
    };

    render(
      <MockedProvider mocks={[signupMock]}>
        <SignupForm />
      </MockedProvider>,
    );

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
      expect(authStorage.setTokens).toHaveBeenCalledWith(
        "mock-signup-access",
        "mock-signup-refresh",
      );
      expect(mockPush).toHaveBeenCalledWith("/users");
    });
  });

  it("should display a backend error when registration fails", async () => {
    const user = userEvent.setup();

    const errorMock = {
      request: {
        query: SignupDocument,
        variables: {
          auth: {
            email: "exists@example.com",
            password: "password123",
            confirmPassword: "password123",
          },
        },
      },
      error: new Error("User already exists"),
    };

    render(
      <MockedProvider mocks={[errorMock]}>
        <SignupForm />
      </MockedProvider>,
    );

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
      expect(screen.getByText(/user already exists/i)).toBeInTheDocument();
    });

    expect(authStorage.setTokens).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
