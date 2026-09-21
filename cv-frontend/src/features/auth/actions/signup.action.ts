"use server";

import { signupSchema, type SignupFormData } from "../schemas/auth.schema";
import {
  executeAuthMutation,
  setAuthCookies,
} from "@/lib/auth/graphql-auth.server";
import {
  SignupDocument,
  type SignupMutation,
} from "@/graphql/__generated__/graphql";

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

  try {
    const result = await executeAuthMutation<SignupMutation>(SignupDocument, {
      auth: { email, password, confirmPassword },
    });

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
      if (message.includes("failedToSendEmail")) {
        return {
          serverError:
            "Unable to send verification email. Please check your email address or try again.",
        };
      }

      return { serverError: message };
    }

    const { access_token, refresh_token } = result.data.signup;
    await setAuthCookies({ access_token, refresh_token });

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
