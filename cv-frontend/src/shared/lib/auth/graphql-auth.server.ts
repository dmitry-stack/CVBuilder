"use server";

import { cookies } from "next/headers";
import { print, type ASTNode } from "graphql";
import { getBackendGraphQLUrl } from "./graphql-url";

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string; extensions?: Record<string, unknown> }[];
};

export async function executeAuthMutation<T>(
  query: string | ASTNode,
  variables?: Record<string, unknown>,
  headers?: Record<string, string>,
): Promise<GraphQLResponse<T>> {
  const queryString = typeof query === "string" ? query : print(query);
  const graphqlUrl = getBackendGraphQLUrl();
  const response = await fetch(graphqlUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({ query: queryString, variables }),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });

  if (typeof response.text === "function") {
    const responseText = await response.text();
    try {
      return JSON.parse(responseText);
    } catch {
      const snippet = responseText.slice(0, 200).trim();
      throw new Error(
        `Backend responded with status ${response.status}: ${snippet || response.statusText || "Empty response"}`,
      );
    }
  }

  return response.json();
}



type Tokens = { access_token: string; refresh_token: string };

export async function setAuthCookies({ access_token, refresh_token }: Tokens) {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  cookieStore.set("access_token", access_token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });

  cookieStore.set("refresh_token", refresh_token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}
