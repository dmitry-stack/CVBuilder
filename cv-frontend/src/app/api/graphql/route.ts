import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getBackendGraphQLUrl } from "@/lib/auth/graphql-url";

export async function POST(request: NextRequest) {
  const token = (await cookies()).get("access_token")?.value;
  const body = await request.text();
  const graphqlUrl = getBackendGraphQLUrl();

  const response = await fetch(graphqlUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body,
    cache: "no-store",
  });

  if (typeof response.text === "function") {
    const responseText = await response.text();
    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data, { status: response.status });
    } catch {
      return NextResponse.json(
        {
          errors: [
            {
              message: `Backend service error (${response.status}): ${responseText.slice(0, 200).trim() || response.statusText}`,
            },
          ],
        },
        { status: response.status >= 400 ? response.status : 502 },
      );
    }
  }

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}


