"use server";

import { cookies } from "next/headers";
import { signupSchema, type SignupFormData } from "../schemas/auth.schema";

export type AuthActionResult = {
  success?: boolean;
  serverError?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function signupAction(
  data: SignupFormData,
): Promise<AuthActionResult> {
  const validation = signupSchema.safeParse(data);
  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
      serverError: "Please fix the validation errors in the form.",
    };
  }

  const { email, password, confirmPassword } = validation.data;
  const graphqlUrl =
    process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3001/api/graphql";

  try {
    const response = await fetch(graphqlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation Signup($auth: SignupInput!) {
            signup(auth: $auth) {
              access_token
              refresh_token
              user {
                id
                email
              }
            }
          }
        `,
        variables: {
          auth: { email, password, confirmPassword },
        },
      }),
    });

    const result = await response.json();

    if (result.errors?.length || !result.data?.signup) {
      const message =
        result.errors?.[0]?.message ||
        "Failed to create account. Please try again.";

      if (message.includes("userAlreadyExists")) {
        return {
          serverError:
            "An account with this email already exists. Please sign in instead.",
        };
      }
      if (message.includes("confirmPasswordMismatch")) {
        return { serverError: "Passwords do not match." };
      }

      return { serverError: message };
    }

    const { access_token, refresh_token } = result.data.signup;
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

    cookieStore.set("access_token", access_token, {
      httpOnly: false,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    cookieStore.set("refresh_token", refresh_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

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
