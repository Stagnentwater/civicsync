import { NextRequest, NextResponse } from "next/server";
import { removeAuthCookie } from "@/lib/auth/cookies";
import { getUserFromRequest } from "@/lib/middleware/authMiddleware";
import { createAuditLog } from "@/lib/middleware/auditLog";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (user) {
      await createAuditLog(user.userId, "LOGOUT", { phone: user.phone });
    }

    const response = NextResponse.json({ success: true, message: "Logged out" });
    return removeAuthCookie(response);
  } catch {
    const response = NextResponse.json({ success: true, message: "Logged out" });
    return removeAuthCookie(response);
  }
}
