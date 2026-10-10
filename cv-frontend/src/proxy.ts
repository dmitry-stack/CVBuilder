import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token =
    request.cookies.get("access_token")?.value ||
    request.cookies.get("refresh_token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/signin") || pathname.startsWith("/signup");
  const isProtectedPage =
    pathname.startsWith("/users") ||
    pathname.startsWith("/skills") ||
    pathname.startsWith("/languages") ||
    pathname.startsWith("/cvs") ||
    pathname.startsWith("/settings");

  if (!token && isProtectedPage) {
    const signinUrl = new URL("/signin", request.url);
    const callbackPath = pathname + request.nextUrl.search;
    signinUrl.searchParams.set("callbackUrl", callbackPath);
    return NextResponse.redirect(signinUrl);
  }

  if (pathname === "/login") {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.search = request.nextUrl.search;
    return NextResponse.redirect(signinUrl);
  }

  if (token && isAuthPage) {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    if (callbackUrl) {
      try {
        const targetUrl = new URL(callbackUrl, request.url);
        if (
          targetUrl.origin === request.nextUrl.origin &&
          !targetUrl.pathname.startsWith("/signin") &&
          !targetUrl.pathname.startsWith("/signup")
        ) {
          return NextResponse.redirect(targetUrl);
        }
      } catch {
        // Fall back to /users if callbackUrl is invalid
      }
    }
    return NextResponse.redirect(new URL("/users", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
