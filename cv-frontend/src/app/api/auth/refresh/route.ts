import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const UPDATE_TOKEN_MUTATION = `
  mutation UpdateToken {
    updateToken {
      access_token
      refresh_token
    }
  }
`;

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { error: "No refresh token available" },
      { status: 401 },
    );
  }

  const graphqlUrl =
    process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3001/api/graphql";

  try {
    const response = await fetch(graphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({
        query: UPDATE_TOKEN_MUTATION,
      }),
    });

    const result = await response.json();
    const updateTokenData = result.data?.updateToken;

    if (
      !response.ok ||
      result.errors?.length ||
      !updateTokenData?.access_token
    ) {
      cookieStore.delete("access_token");
      cookieStore.delete("refresh_token");
      return NextResponse.json(
        { error: "Token refresh rejected" },
        { status: 401 },
      );
    }

    const isProduction = process.env.NODE_ENV === "production";

    cookieStore.set("access_token", updateTokenData.access_token, {
      httpOnly: false,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    if (updateTokenData.refresh_token) {
      cookieStore.set("refresh_token", updateTokenData.refresh_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return NextResponse.json({
      access_token: updateTokenData.access_token,
    });
  } catch {
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    return NextResponse.json(
      { error: "Failed to connect to authentication service" },
      { status: 500 },
    );
  }
}
