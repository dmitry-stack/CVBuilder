"use server";

import { cookies } from "next/headers";
import {
  verifyEmailSchema,
  type VerifyEmailFormData,
} from "../schemas/auth.schema";
import { executeAuthMutation } from "@/shared/lib/auth/graphql-auth.server";
import {
  VerifyMailDocument,
  type VerifyMailMutation,
} from "@/graphql/__generated__/graphql";
import type { AuthActionResult } from "./login.action";

export interface VerifyEmailActionInput extends VerifyEmailFormData {
  token?: string;
}

export async function verifyEmailAction(
  data: VerifyEmailActionInput,
): Promise<AuthActionResult> {
  const validation = verifyEmailSchema.safeParse(data);
  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
      serverError: "Invalid verification code",
    };
  }

  const { otp } = validation.data;

  try {
    const cookieStore = await cookies();
    const token = data.token?.trim() || cookieStore.get("access_token")?.value;

    if (!token) {
      return {
        serverError:
          "You must be signed in to verify your email. Please sign in.",
      };
    }

    const result = await executeAuthMutation<VerifyMailMutation>(
      VerifyMailDocument,
      { mail: { otp } },
      { authorization: `Bearer ${token}` },
    );

    if (result.errors?.length) {
      const message = result.errors[0]?.message;
      if (message === "mailNotFound") {
        return {
          serverError:
            "Invalid or expired verification code. Please check and try again.",
        };
      }
      return {
        serverError: message || "Failed to verify email. Please try again.",
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
