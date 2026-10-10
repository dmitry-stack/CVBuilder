"use server";

import { headers, cookies } from "next/headers";
import { executeAuthMutation } from "@/shared/lib/auth/graphql-auth.server";
import {
  SendVerificationDocument,
  type SendVerificationMutation,
} from "@/graphql/__generated__/graphql";
import type { AuthActionResult } from "./login.action";

export async function sendVerificationAction(
  email: string,
): Promise<AuthActionResult> {
  if (!email?.trim()) {
    return {
      serverError: "Email address is required to resend verification code.",
    };
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const headerList = await headers();
    const origin =
      headerList.get("origin") ||
      (headerList.get("host")
        ? `${headerList.get("x-forwarded-proto") || "http"}://${headerList.get("host")}`
        : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");

    const reqHeaders: Record<string, string> = { origin };
    if (token) {
      reqHeaders.authorization = `Bearer ${token}`;
    }

    const result = await executeAuthMutation<SendVerificationMutation>(
      SendVerificationDocument,
      { email: email.trim() },
      reqHeaders,
    );

    if (result.errors?.length) {
      return {
        serverError:
          result.errors[0]?.message ||
          "Failed to send verification email. Please try again.",
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
