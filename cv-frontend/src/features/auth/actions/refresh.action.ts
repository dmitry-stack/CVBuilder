"use server";

import { cookies } from "next/headers";
import {
  executeAuthMutation,
  setAuthCookies,
  clearAuthCookies,
} from "@/lib/auth/graphql-auth.server";
import {
  UpdateTokenDocument,
  type UpdateTokenMutation,
} from "@/graphql/__generated__/graphql";

export async function refreshAction(): Promise<{ success: true }> {
  const cookieStore = await cookies();
  const currentRefreshToken = cookieStore.get("refresh_token")?.value;

  if (!currentRefreshToken) {
    await clearAuthCookies();
    throw new Error("Session expired. Please sign in again.");
  }

  const result = await executeAuthMutation<UpdateTokenMutation>(
    UpdateTokenDocument,
    undefined,
    { authorization: `Bearer ${currentRefreshToken}` },
  );

  const tokens = result.data?.updateToken;

  if (result.errors?.length || !tokens?.access_token) {
    await clearAuthCookies();
    throw new Error(result.errors?.[0]?.message || "Failed to refresh session");
  }

  await setAuthCookies({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token ?? currentRefreshToken,
  });

  return { success: true };
}
