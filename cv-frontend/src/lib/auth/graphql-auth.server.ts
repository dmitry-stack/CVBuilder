"use server";

import { cookies } from "next/headers";
import { print, type ASTNode } from "graphql";

const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3001/api/graphql";

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
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({ query: queryString, variables }),
    cache: "no-store",
  });

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
