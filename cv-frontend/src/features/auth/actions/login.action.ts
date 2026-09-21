"use server";

import { loginSchema, type LoginFormData } from "../schemas/auth.schema";
import {
  executeAuthMutation,
  setAuthCookies,
} from "@/lib/auth/graphql-auth.server";
import {
  LoginDocument,
  type LoginMutation,
} from "@/graphql/__generated__/graphql";

export type AuthActionResult = {
  success?: boolean;
  serverError?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function loginAction(
  data: LoginFormData,
): Promise<AuthActionResult> {
  const validation = loginSchema.safeParse(data);
  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
      serverError: "Invalid email or password format",
    };
  }

  const { email, password } = validation.data;

  try {
    const result = await executeAuthMutation<LoginMutation>(LoginDocument, {
      auth: { email, password },
    });

    if (result.errors?.length || !result.data?.login) {
      const message =
        result.errors?.[0]?.message || "Invalid credentials. Please try again.";
      return { serverError: message };
    }

    const { access_token, refresh_token } = result.data.login;
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
