"use server";

import { clearAuthCookies } from "@/shared/lib/auth/graphql-auth.server";

export async function logoutAction() {
  await clearAuthCookies();
  return { success: true };
}
