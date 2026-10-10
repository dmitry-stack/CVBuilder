import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { loginAction } from "./login.action";
import { signupAction } from "./signup.action";
import { logoutAction } from "./logout.action";
import { refreshAction } from "./refresh.action";
import { forgotPasswordAction } from "./forgot-password.action";
import { resetPasswordAction } from "./reset-password.action";
import { verifyEmailAction } from "./verify-email.action";
import { sendVerificationAction } from "./send-verification.action";
import { changePasswordAction } from "./change-password.action";

const mockCookieSet = vi.fn();
const mockCookieDelete = vi.fn();
const mockCookieGet = vi.fn();
const mockHeadersGet = vi.fn();

vi.mock("next/headers", () => ({
  cookies: () =>
    Promise.resolve({
      set: mockCookieSet,
      delete: mockCookieDelete,
      get: mockCookieGet,
    }),
  headers: () =>
    Promise.resolve({
      get: mockHeadersGet,
    }),
}));

describe("Auth Server Actions", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    mockHeadersGet.mockImplementation((key: string) => {
      if (key === "origin") return "http://localhost:3000";
      return null;
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe("loginAction", () => {
    it("returns validation error for invalid email", async () => {
      const result = await loginAction({
        email: "not-an-email",
        password: "password123",
      });

      expect(result.fieldErrors?.email).toBeDefined();
      expect(mockCookieSet).not.toHaveBeenCalled();
    });

    it("successfully authenticates, sets cookies, and returns success", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              login: {
                access_token: "action-access-token",
                refresh_token: "action-refresh-token",
                user: { id: "1", email: "test@example.com" },
              },
            },
          }),
      });

      const result = await loginAction({
        email: "test@example.com",
        password: "password123",
      });

      expect(result.success).toBe(true);
      expect(mockCookieSet).toHaveBeenCalledWith(
        "access_token",
        "action-access-token",
        expect.objectContaining({ httpOnly: true }),
      );
      expect(mockCookieSet).toHaveBeenCalledWith(
        "refresh_token",
        "action-refresh-token",
        expect.objectContaining({ httpOnly: true }),
      );
    });

    it("returns serverError when backend returns GraphQL errors", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            errors: [{ message: "Invalid email or password" }],
          }),
      });

      const result = await loginAction({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(result.serverError).toBe("Invalid email or password");
      expect(mockCookieSet).not.toHaveBeenCalled();
    });
  });

  describe("signupAction", () => {
    it("returns validation error when passwords do not match", async () => {
      const result = await signupAction({
        email: "test@example.com",
        password: "password123",
        confirmPassword: "mismatchpassword",
      });

      expect(result.fieldErrors?.confirmPassword).toBeDefined();
      expect(mockCookieSet).not.toHaveBeenCalled();
    });

    it("successfully registers user, sets cookies, and returns success", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              signup: {
                access_token: "signup-access-token",
                refresh_token: "signup-refresh-token",
                user: { id: "2", email: "new@example.com" },
              },
            },
          }),
      });

      const result = await signupAction({
        email: "new@example.com",
        password: "password123",
        confirmPassword: "password123",
      });

      expect(result.success).toBe(true);
      expect(mockCookieSet).toHaveBeenCalledWith(
        "access_token",
        "signup-access-token",
        expect.objectContaining({ httpOnly: true }),
      );
      expect(mockCookieSet).toHaveBeenCalledWith(
        "refresh_token",
        "signup-refresh-token",
        expect.objectContaining({ httpOnly: true }),
      );
    });

    it("translates userAlreadyExists backend error to friendly message", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            errors: [{ message: "userAlreadyExists" }],
          }),
      });

      const result = await signupAction({
        email: "exists@example.com",
        password: "password123",
        confirmPassword: "password123",
      });

      expect(result.serverError).toContain("already exists");
      expect(mockCookieSet).not.toHaveBeenCalled();
    });
  });

  describe("logoutAction", () => {
    it("clears auth cookies and returns success", async () => {
      const result = await logoutAction();
      expect(result.success).toBe(true);
      expect(mockCookieDelete).toHaveBeenCalledWith("access_token");
      expect(mockCookieDelete).toHaveBeenCalledWith("refresh_token");
    });
  });

  describe("refreshAction", () => {
    it("throws error and clears cookies if no refresh token is present", async () => {
      mockCookieGet.mockReturnValue(undefined);

      await expect(refreshAction()).rejects.toThrow(/session expired/i);
      expect(mockCookieDelete).toHaveBeenCalledWith("access_token");
      expect(mockCookieDelete).toHaveBeenCalledWith("refresh_token");
    });

    it("refreshes tokens and sets new cookies when valid refresh token is present", async () => {
      mockCookieGet.mockReturnValue({ value: "valid-refresh-token" });
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              updateToken: {
                access_token: "new-access-token",
                refresh_token: "new-refresh-token",
              },
            },
          }),
      });

      const result = await refreshAction();
      expect(result.success).toBe(true);
      expect(mockCookieSet).toHaveBeenCalledWith(
        "access_token",
        "new-access-token",
        expect.objectContaining({ httpOnly: true }),
      );
      expect(mockCookieSet).toHaveBeenCalledWith(
        "refresh_token",
        "new-refresh-token",
        expect.objectContaining({ httpOnly: true }),
      );
    });
  });

  describe("forgotPasswordAction", () => {
    it("returns validation error for invalid email", async () => {
      const result = await forgotPasswordAction({
        email: "not-an-email",
      });

      expect(result.fieldErrors?.email).toBeDefined();
    });

    it("successfully sends reset request", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              forgotPassword: true,
            },
          }),
      });

      const result = await forgotPasswordAction({
        email: "reset@example.com",
      });

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            origin: "http://localhost:3000",
          }),
        }),
      );
    });

    it("returns serverError on mutation failure", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            errors: [{ message: "userNotFound" }],
          }),
      });

      const result = await forgotPasswordAction({
        email: "unknown@example.com",
      });

      expect(result.serverError).toBe("userNotFound");
    });

    it("returns friendly error when failedToSendEmail is returned", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            errors: [{ message: "failedToSendEmail" }],
          }),
      });

      const result = await forgotPasswordAction({
        email: "existing@example.com",
      });

      expect(result.serverError).toContain("Unable to send password reset email");
    });
  });

  describe("resetPasswordAction", () => {
    it("returns validation error for mismatched passwords", async () => {
      const result = await resetPasswordAction({
        newPassword: "password123",
        confirmPassword: "differentpassword",
        token: "sample-token",
      });

      expect(result.fieldErrors?.confirmPassword).toBeDefined();
    });

    it("returns serverError if token is missing", async () => {
      const result = await resetPasswordAction({
        newPassword: "password123",
        confirmPassword: "password123",
        token: "",
      });

      expect(result.serverError).toContain("Reset token is missing");
    });

    it("successfully resets password with bearer token header", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              resetPassword: true,
            },
          }),
      });

      const result = await resetPasswordAction({
        newPassword: "password123",
        confirmPassword: "password123",
        token: "my-valid-token",
      });

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            authorization: "Bearer my-valid-token",
          }),
        }),
      );
    });

    it("handles actionExpired error specifically", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            errors: [{ message: "actionExpired" }],
          }),
      });

      const result = await resetPasswordAction({
        newPassword: "password123",
        confirmPassword: "password123",
        token: "expired-token",
      });

      expect(result.serverError).toContain("expired");
    });
  });

  describe("verifyEmailAction", () => {
    it("returns validation error for non-6-digit otp", async () => {
      const result = await verifyEmailAction({
        otp: "123",
      });

      expect(result.fieldErrors?.otp).toBeDefined();
    });

    it("returns serverError if user is not authenticated and no token provided", async () => {
      mockCookieGet.mockReturnValue(undefined);

      const result = await verifyEmailAction({
        otp: "123456",
      });

      expect(result.serverError).toContain("must be signed in");
    });

    it("successfully verifies email using cookies access token", async () => {
      mockCookieGet.mockReturnValue({ value: "cookie-access-token" });
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              verifyMail: true,
            },
          }),
      });

      const result = await verifyEmailAction({
        otp: "123456",
      });

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            authorization: "Bearer cookie-access-token",
          }),
        }),
      );
    });

    it("handles mailNotFound error gracefully", async () => {
      mockCookieGet.mockReturnValue({ value: "cookie-access-token" });
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            errors: [{ message: "mailNotFound" }],
          }),
      });

      const result = await verifyEmailAction({
        otp: "654321",
      });

      expect(result.serverError).toContain("Invalid or expired");
    });
  });

  describe("sendVerificationAction", () => {
    it("returns error if email is empty", async () => {
      const result = await sendVerificationAction("");
      expect(result.serverError).toContain("Email address is required");
    });

    it("successfully sends verification request", async () => {
      mockCookieGet.mockReturnValue({ value: "test-token" });
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              sendVerification: true,
            },
          }),
      });

      const result = await sendVerificationAction("user@example.com");
      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            origin: "http://localhost:3000",
            authorization: "Bearer test-token",
          }),
        }),
      );
    });

    it("returns server error on mutation failure", async () => {
      mockCookieGet.mockReturnValue(undefined);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            errors: [{ message: "Failed to send email" }],
          }),
      });

      const result = await sendVerificationAction("user@example.com");
      expect(result.serverError).toBe("Failed to send email");
    });

    it("returns friendly error when failedToSendEmail is returned", async () => {
      mockCookieGet.mockReturnValue(undefined);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            errors: [{ message: "failedToSendEmail" }],
          }),
      });

      const result = await sendVerificationAction("user@example.com");
      expect(result.serverError).toContain("Unable to send verification email");
    });
  });

  describe("changePasswordAction", () => {
    it("returns validation error if inputs are invalid", async () => {
      const result = await changePasswordAction({
        currentPassword: "",
        newPassword: "short",
        confirmPassword: "short",
      });

      expect(result.fieldErrors?.currentPassword).toBeDefined();
    });

    it("returns server error if user is not authenticated", async () => {
      mockCookieGet.mockReturnValue(undefined);

      const result = await changePasswordAction({
        currentPassword: "oldpassword123",
        newPassword: "newpassword123",
        confirmPassword: "newpassword123",
      });

      expect(result.serverError).toContain("Unauthorized");
    });

    it("successfully changes password with authorization header and args", async () => {
      mockCookieGet.mockReturnValue({ value: "user-access-token" });
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              changePassword: { id: "1" },
            },
          }),
      });

      const result = await changePasswordAction({
        currentPassword: "oldpassword123",
        newPassword: "newpassword123",
        confirmPassword: "newpassword123",
      });

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            authorization: "Bearer user-access-token",
          }),
          body: expect.stringContaining('"oldPassword":"oldpassword123"'),
        }),
      );
    });

    it("translates oldPasswordIncorrect error", async () => {
      mockCookieGet.mockReturnValue({ value: "user-access-token" });
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            errors: [{ message: "oldPasswordIncorrect" }],
          }),
      });

      const result = await changePasswordAction({
        currentPassword: "wrongpassword123",
        newPassword: "newpassword123",
        confirmPassword: "newpassword123",
      });

      expect(result.serverError).toBe("Current password is incorrect.");
    });
  });
});
