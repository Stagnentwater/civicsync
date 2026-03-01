import { serialize, parse } from "cookie";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "civicsync_token";
const MAX_AGE = 15 * 60; // 15 minutes

export function setAuthCookie(response: NextResponse, token: string): NextResponse {
  response.headers.set(
    "Set-Cookie",
    serialize(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    })
  );
  return response;
}

export function removeAuthCookie(response: NextResponse): NextResponse {
  response.headers.set(
    "Set-Cookie",
    serialize(COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    })
  );
  return response;
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  const cookies = parse(cookieHeader);
  return cookies[COOKIE_NAME] || null;
}

export { COOKIE_NAME };
