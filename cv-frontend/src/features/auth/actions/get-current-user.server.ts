"use server";

import { cache } from "react";
import { cookies } from "next/headers";
import {
  executeAuthMutation,
  setAuthCookies,
  clearAuthCookies,
} from "@/shared/lib/auth/graphql-auth.server";
import {
  MeDocument,
  type MeQuery,
  UpdateTokenDocument,
  type UpdateTokenMutation,
} from "@/graphql/__generated__/graphql";

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken && !refreshToken) return null;

  if (accessToken) {
    const result = await executeAuthMutation<MeQuery>(MeDocument, undefined, {
      authorization: `Bearer ${accessToken}`,
    });

    if (result.data?.me) {
      return result.data.me;
    }
  }

  // If accessToken is missing or expired, attempt to refresh using refreshToken
  if (refreshToken) {
    try {
      const refreshResult = await executeAuthMutation<UpdateTokenMutation>(
        UpdateTokenDocument,
        undefined,
        { authorization: `Bearer ${refreshToken}` },
      );

      const tokens = refreshResult.data?.updateToken;
      if (tokens?.access_token) {
        await setAuthCookies({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token ?? refreshToken,
        });

        const userResult = await executeAuthMutation<MeQuery>(
          MeDocument,
          undefined,
          {
            authorization: `Bearer ${tokens.access_token}`,
          },
        );

        return userResult.data?.me ?? null;
      } else {
        await clearAuthCookies();
      }
    } catch {
      await clearAuthCookies();
    }
  }

  return null;
});
