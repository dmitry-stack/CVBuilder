import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { loginAction } from "./login.action";
import { signupAction } from "./signup.action";

const mockCookieSet = vi.fn();

vi.mock("next/headers", () => ({
  cookies: () =>
    Promise.resolve({
      set: mockCookieSet,
    }),
}));

describe("Auth Server Actions", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
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
        expect.objectContaining({ httpOnly: false }),
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
        expect.objectContaining({ httpOnly: false }),
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
});
