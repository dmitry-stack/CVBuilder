"use server";

import { clearAuthCookies } from "@/lib/auth/graphql-auth.server";

export async function logoutAction() {
  await clearAuthCookies();
  return { success: true };
}
