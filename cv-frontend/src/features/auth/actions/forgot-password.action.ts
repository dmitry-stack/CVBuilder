"use server";

import { headers } from "next/headers";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../schemas/auth.schema";
import { executeAuthMutation } from "@/lib/auth/graphql-auth.server";
import {
  ForgotPasswordDocument,
  type ForgotPasswordMutation,
} from "@/graphql/__generated__/graphql";
import type { AuthActionResult } from "./login.action";

export async function forgotPasswordAction(
  data: ForgotPasswordFormData,
): Promise<AuthActionResult> {
  const validation = forgotPasswordSchema.safeParse(data);
  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
      serverError: "Invalid email format",
    };
  }

  const { email } = validation.data;

  try {
    const headerList = await headers();
    const origin =
      headerList.get("origin") ||
      (headerList.get("host")
        ? `${headerList.get("x-forwarded-proto") || "http"}://${headerList.get("host")}`
        : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");

    const result = await executeAuthMutation<ForgotPasswordMutation>(
      ForgotPasswordDocument,
      { auth: { email } },
      { origin },
    );

    if (result.errors?.length) {
      const message =
        result.errors[0]?.message ||
        "Failed to process password reset request.";
      return { serverError: message };
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
