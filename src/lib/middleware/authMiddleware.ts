import { NextRequest, NextResponse } from "next/server";
import { verifyToken, JWTPayload } from "../auth/jwt";
import { getTokenFromRequest } from "../auth/cookies";

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export function withAuth(
  handler: (req: NextRequest, user: JWTPayload) => Promise<NextResponse>,
  requiredRole?: "CITIZEN" | "ADMIN"
) {
  return async (req: NextRequest) => {
    const token = getTokenFromRequest(req);

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (requiredRole && user.role !== requiredRole) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    return handler(req, user);
  };
}

export function getUserFromRequest(req: NextRequest): JWTPayload | null {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyToken(token);
}
