import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "./proxy";

function createMockRequest(
  url: string,
  cookies: Record<string, string> = {},
): NextRequest {
  const req = new NextRequest(new URL(url, "http://localhost:3000"));
  Object.entries(cookies).forEach(([key, value]) => {
    req.cookies.set(key, value);
  });
  return req;
}

describe("proxy middleware", () => {
  it("redirects unauthenticated user accessing /skills to /signin with callbackUrl", () => {
    const req = createMockRequest("http://localhost:3000/skills");
    const res = proxy(req);

    expect(res.status).toBe(307);
    const redirectUrl = new URL(res.headers.get("location")!);
    expect(redirectUrl.pathname).toBe("/signin");
    expect(redirectUrl.searchParams.get("callbackUrl")).toBe("/skills");
  });

  it("redirects unauthenticated user accessing /cvs?search=react to /signin with callbackUrl preserving query", () => {
    const req = createMockRequest("http://localhost:3000/cvs?search=react");
    const res = proxy(req);

    expect(res.status).toBe(307);
    const redirectUrl = new URL(res.headers.get("location")!);
    expect(redirectUrl.pathname).toBe("/signin");
    expect(redirectUrl.searchParams.get("callbackUrl")).toBe(
      "/cvs?search=react",
    );
  });

  it("redirects /login to /signin preserving search params", () => {
    const req = createMockRequest(
      "http://localhost:3000/login?callbackUrl=/skills",
    );
    const res = proxy(req);

    expect(res.status).toBe(307);
    const redirectUrl = new URL(res.headers.get("location")!);
    expect(redirectUrl.pathname).toBe("/signin");
    expect(redirectUrl.searchParams.get("callbackUrl")).toBe("/skills");
  });

  it("allows unauthenticated user to access /signin", () => {
    const req = createMockRequest("http://localhost:3000/signin");
    const res = proxy(req);

    expect(res.headers.get("location")).toBeNull();
  });

  it("allows authenticated user with access_token to access /cvs", () => {
    const req = createMockRequest("http://localhost:3000/cvs", {
      access_token: "mock-token",
    });
    const res = proxy(req);

    expect(res.headers.get("location")).toBeNull();
  });

  it("allows authenticated user with only refresh_token to access /skills", () => {
    const req = createMockRequest("http://localhost:3000/skills", {
      refresh_token: "mock-refresh",
    });
    const res = proxy(req);

    expect(res.headers.get("location")).toBeNull();
  });

  it("redirects authenticated user visiting /signin to /users when no callbackUrl is present", () => {
    const req = createMockRequest("http://localhost:3000/signin", {
      access_token: "mock-token",
    });
    const res = proxy(req);

    expect(res.status).toBe(307);
    const redirectUrl = new URL(res.headers.get("location")!);
    expect(redirectUrl.pathname).toBe("/users");
  });

  it("redirects authenticated user visiting /signin to callbackUrl when present", () => {
    const req = createMockRequest(
      "http://localhost:3000/signin?callbackUrl=/cvs",
      {
        refresh_token: "mock-refresh",
      },
    );
    const res = proxy(req);

    expect(res.status).toBe(307);
    const redirectUrl = new URL(res.headers.get("location")!);
    expect(redirectUrl.pathname).toBe("/cvs");
  });

  it("redirects authenticated user to callbackUrl preserving query parameters", () => {
    const req = createMockRequest(
      "http://localhost:3000/signin?callbackUrl=%2Fskills%3Fcategory%3Dfrontend",
      {
        access_token: "mock-token",
      },
    );
    const res = proxy(req);

    expect(res.status).toBe(307);
    const redirectUrl = new URL(res.headers.get("location")!);
    expect(redirectUrl.pathname).toBe("/skills");
    expect(redirectUrl.searchParams.get("category")).toBe("frontend");
  });

  it("falls back to /users if callbackUrl is cross-origin external URL", () => {
    const req = createMockRequest(
      "http://localhost:3000/signin?callbackUrl=https://evil.com/hack",
      {
        access_token: "mock-token",
      },
    );
    const res = proxy(req);

    expect(res.status).toBe(307);
    const redirectUrl = new URL(res.headers.get("location")!);
    expect(redirectUrl.pathname).toBe("/users");
  });

  it("falls back to /users if callbackUrl loops back to /signin", () => {
    const req = createMockRequest(
      "http://localhost:3000/signin?callbackUrl=/signin",
      {
        access_token: "mock-token",
      },
    );
    const res = proxy(req);

    expect(res.status).toBe(307);
    const redirectUrl = new URL(res.headers.get("location")!);
    expect(redirectUrl.pathname).toBe("/users");
  });
});
