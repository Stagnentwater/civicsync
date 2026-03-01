import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./src/lib/auth/jwt";
import { addSecurityHeaders } from "./src/lib/middleware/secureHeaders";
import { rateLimit } from "./src/lib/middleware/rateLimit";
import { parse } from "cookie";

const PUBLIC_PATHS = ["/", "/login", "/api/auth/send-otp", "/api/auth/verify-otp"];
const ADMIN_PATHS = ["/admin", "/api/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limiting for API routes
  if (pathname.startsWith("/api")) {
    const rateLimitResponse = rateLimit(request);
    if (rateLimitResponse) return rateLimitResponse;
  }

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith("/api/auth"))) {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check auth token
  const cookieHeader = request.headers.get("cookie");
  const cookies = cookieHeader ? parse(cookieHeader) : {};
  const token = cookies["civicsync_token"];

  if (!token) {
    if (pathname.startsWith("/api")) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Authentication required" }, { status: 401 })
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const user = verifyToken(token);
  if (!user) {
    if (pathname.startsWith("/api")) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Admin route protection
  if (ADMIN_PATHS.some((p) => pathname.startsWith(p)) && user.role !== "ADMIN") {
    if (pathname.startsWith("/api")) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
      );
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const response = NextResponse.next();
  response.headers.set("x-user-id", user.userId);
  response.headers.set("x-user-role", user.role);
  return addSecurityHeaders(response);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
