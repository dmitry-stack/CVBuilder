import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MockedProvider } from "@apollo/client/testing/react";
import SigninForm from "./SigninForm";
import { LoginDocument } from "@/graphql/__generated__/graphql";
import { authStorage } from "@/lib/auth-storage";

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

describe("SigninForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display input fields and a sign-in button", () => {
    render(
      <MockedProvider mocks={[]}>
        <SigninForm />
      </MockedProvider>,
    );

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /log in/i }),
    ).toBeInTheDocument();
  });

  it("should display validation errors when submitting an empty form", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[]}>
        <SigninForm />
      </MockedProvider>,
    );

    const submitBtn = screen.getByRole("button", { name: /log in/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
    expect(authStorage.setTokens).not.toHaveBeenCalled();
  });

  it("should successfully authenticate a user, save tokens, and redirect", async () => {
    const user = userEvent.setup();

    const loginMock = {
      request: {
        query: LoginDocument,
        variables: {
          auth: {
            email: "test@example.com",
            password: "password123",
          },
        },
      },
      result: {
        data: {
          login: {
            access_token: "mock-access-token",
            refresh_token: "mock-refresh-token",
            user: {
              id: "1",
              email: "test@example.com",
            },
          },
        },
      },
    };

    render(
      <MockedProvider mocks={[loginMock]}>
        <SigninForm />
      </MockedProvider>,
    );

    await user.type(screen.getByPlaceholderText(/email/i), "test@example.com");
    await user.type(screen.getByPlaceholderText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(authStorage.setTokens).toHaveBeenCalledWith(
        "mock-access-token",
        "mock-refresh-token",
      );
      expect(mockPush).toHaveBeenCalledWith("/users");
    });
  });

  it("should display a backend error when using invalid credentials", async () => {
    const user = userEvent.setup();

    const errorMock = {
      request: {
        query: LoginDocument,
        variables: {
          auth: {
            email: "wrong@example.com",
            password: "wrongpassword",
          },
        },
      },
      error: new Error("Invalid credentials"),
    };

    render(
      <MockedProvider mocks={[errorMock]}>
        <SigninForm />
      </MockedProvider>,
    );

    await user.type(screen.getByPlaceholderText(/email/i), "wrong@example.com");
    await user.type(screen.getByPlaceholderText(/password/i), "wrongpassword");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    expect(authStorage.setTokens).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
