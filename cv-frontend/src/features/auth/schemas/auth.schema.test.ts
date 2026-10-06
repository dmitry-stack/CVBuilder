import { describe, it, expect } from "vitest";
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  changePasswordSchema,
} from "./auth.schema";

describe("auth.schema", () => {
  describe("loginSchema", () => {
    it("should succeed with valid email and password", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "password123",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("user@example.com");
      }
    });

    it("should trim whitespace from email", () => {
      const result = loginSchema.safeParse({
        email: "   user@example.com   ",
        password: "password123",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("user@example.com");
      }
    });

    it("should fail when email is invalid", () => {
      const result = loginSchema.safeParse({
        email: "invalid-email",
        password: "password123",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const emailError = result.error.issues.find((issue) =>
          issue.path.includes("email"),
        );
        expect(emailError?.message).toBe("Please enter a valid email");
      }
    });

    it("should fail when password is less than 6 characters", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "12345",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordError = result.error.issues.find((issue) =>
          issue.path.includes("password"),
        );
        expect(passwordError?.message).toBe(
          "Password must be at least 6 characters",
        );
      }
    });
  });

  describe("signupSchema", () => {
    it("should succeed when passwords match and inputs are valid", () => {
      const result = signupSchema.safeParse({
        email: "user@example.com",
        password: "password123",
        confirmPassword: "password123",
      });

      expect(result.success).toBe(true);
    });

    it("should fail when password and confirmPassword do not match", () => {
      const result = signupSchema.safeParse({
        email: "user@example.com",
        password: "password123",
        confirmPassword: "password456",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const confirmError = result.error.issues.find((issue) =>
          issue.path.includes("confirmPassword"),
        );
        expect(confirmError?.message).toBe("Passwords do not match");
      }
    });

    it("should fail when confirmPassword is less than 6 characters", () => {
      const result = signupSchema.safeParse({
        email: "user@example.com",
        password: "password123",
        confirmPassword: "123",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const confirmError = result.error.issues.find((issue) =>
          issue.path.includes("confirmPassword"),
        );
        expect(confirmError?.message).toBe("Password confirmation is required");
      }
    });
  });

  describe("forgotPasswordSchema", () => {
    it("should succeed with valid email", () => {
      const result = forgotPasswordSchema.safeParse({
        email: "user@example.com",
      });
      expect(result.success).toBe(true);
    });

    it("should fail with invalid email", () => {
      const result = forgotPasswordSchema.safeParse({
        email: "invalid-email",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("resetPasswordSchema", () => {
    it("should succeed when newPassword and confirmPassword match", () => {
      const result = resetPasswordSchema.safeParse({
        newPassword: "newpassword123",
        confirmPassword: "newpassword123",
      });
      expect(result.success).toBe(true);
    });

    it("should fail when passwords do not match", () => {
      const result = resetPasswordSchema.safeParse({
        newPassword: "newpassword123",
        confirmPassword: "differentpassword",
      });
      expect(result.success).toBe(false);
    });

    it("should fail when password is too short", () => {
      const result = resetPasswordSchema.safeParse({
        newPassword: "123",
        confirmPassword: "123",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("verifyEmailSchema", () => {
    it("should succeed with 6 digit string", () => {
      const result = verifyEmailSchema.safeParse({
        otp: "123456",
      });
      expect(result.success).toBe(true);
    });

    it("should fail when code is less than 6 digits", () => {
      const result = verifyEmailSchema.safeParse({
        otp: "12345",
      });
      expect(result.success).toBe(false);
    });

    it("should fail when code contains non-digits", () => {
      const result = verifyEmailSchema.safeParse({
        otp: "12345a",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("changePasswordSchema", () => {
    it("should succeed with valid current, new, and matching confirm passwords", () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: "oldpassword123",
        newPassword: "newpassword123",
        confirmPassword: "newpassword123",
      });
      expect(result.success).toBe(true);
    });

    it("should fail when new password is less than 6 characters", () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: "oldpassword123",
        newPassword: "123",
        confirmPassword: "123",
      });
      expect(result.success).toBe(false);
    });

    it("should fail when passwords do not match", () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: "oldpassword123",
        newPassword: "newpassword123",
        confirmPassword: "mismatchpassword",
      });
      expect(result.success).toBe(false);
    });

    it("should fail when new password is the same as current password", () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: "samepassword123",
        newPassword: "samepassword123",
        confirmPassword: "samepassword123",
      });
      expect(result.success).toBe(false);
    });
  });
});
