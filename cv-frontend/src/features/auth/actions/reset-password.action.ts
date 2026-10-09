"use server";

import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../schemas/auth.schema";
import { executeAuthMutation } from "@/shared/lib/auth/graphql-auth.server";
import {
  ResetPasswordDocument,
  type ResetPasswordMutation,
} from "@/graphql/__generated__/graphql";
import type { AuthActionResult } from "./login.action";

export interface ResetPasswordActionInput extends ResetPasswordFormData {
  token: string;
}

export async function resetPasswordAction(
  data: ResetPasswordActionInput,
): Promise<AuthActionResult> {
  const validation = resetPasswordSchema.safeParse(data);
  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
      serverError: "Invalid password format or passwords do not match",
    };
  }

  if (!data.token?.trim()) {
    return {
      serverError:
        "Reset token is missing or invalid. Please request a new link.",
    };
  }

  const { newPassword, confirmPassword } = validation.data;

  try {
    const result = await executeAuthMutation<ResetPasswordMutation>(
      ResetPasswordDocument,
      { auth: { newPassword, confirmPassword } },
      { authorization: `Bearer ${data.token.trim()}` },
    );

    if (result.errors?.length) {
      const errorMsg = result.errors[0]?.message;
      if (errorMsg === "actionExpired") {
        return {
          serverError:
            "This password reset link has expired. Please request a new one.",
        };
      }
      return {
        serverError: errorMsg || "Failed to reset password. Please try again.",
      };
    }

    return { success: true };
  } catch (err: unknown) {
    return {
      serverError:
        err instanceof Error
          ? err.message
          : "Failed to connect to authentication service. Please try again.",
    };
  }
}
