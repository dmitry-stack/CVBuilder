"use server";

import { cookies } from "next/headers";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "../schemas/auth.schema";
import { executeAuthMutation } from "@/lib/auth/graphql-auth.server";
import {
  ChangePasswordDocument,
  type ChangePasswordMutation,
} from "@/graphql/__generated__/graphql";

export type ChangePasswordResult = {
  success?: boolean;
  serverError?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function changePasswordAction(
  data: ChangePasswordFormData,
): Promise<ChangePasswordResult> {
  const validation = changePasswordSchema.safeParse(data);
  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
      serverError: "Invalid input data",
    };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return { serverError: "Unauthorized. Please log in again." };
  }

  const { currentPassword, newPassword, confirmPassword } = validation.data;

  try {
    const result = await executeAuthMutation<ChangePasswordMutation>(
      ChangePasswordDocument,
      {
        args: {
          oldPassword: currentPassword,
          newPassword,
          confirmPassword,
        },
      },
      {
        authorization: `Bearer ${token}`,
      },
    );

    if (result.errors?.length) {
      const message = result.errors[0]?.message || "";

      if (message.includes("oldPasswordIncorrect")) {
        return { serverError: "Current password is incorrect." };
      }
      if (message.includes("oldPasswordSameNewPassword")) {
        return {
          serverError:
            "New password cannot be the same as the current password.",
        };
      }
      if (message.includes("confirmPasswordMismatch")) {
        return { serverError: "Passwords do not match." };
      }
      if (message.includes("unauthorized")) {
        return { serverError: "Unauthorized. Please log in again." };
      }

      return {
        serverError: message || "Failed to update password. Please try again.",
      };
    }

    return { success: true };
  } catch (err: unknown) {
    return {
      serverError:
        err instanceof Error
          ? err.message
          : "Server communication error. Please try again.",
    };
  }
}
