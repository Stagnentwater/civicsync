import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/middleware/authMiddleware";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    user: {
      userId: user.userId,
      phone: user.phone,
      role: user.role,
    },
  });
}
