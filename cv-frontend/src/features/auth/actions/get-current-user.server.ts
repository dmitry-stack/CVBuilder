"use server";

import { cache } from "react";
import { cookies } from "next/headers";
import { executeAuthMutation } from "@/lib/auth/graphql-auth.server";
import { MeDocument, type MeQuery } from "@/graphql/__generated__/graphql";

export const getCurrentUser = cache(async () => {
  const accessToken = (await cookies()).get("access_token")?.value;
  if (!accessToken) return null;

  const result = await executeAuthMutation<MeQuery>(MeDocument, undefined, {
    authorization: `Bearer ${accessToken}`,
  });

  return result.data?.me ?? null;
});
