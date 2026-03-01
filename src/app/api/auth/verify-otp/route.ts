import { NextRequest, NextResponse } from "next/server";
import { otpSchema } from "@/lib/validators/schemas";
import { signToken } from "@/lib/auth/jwt";
import { setAuthCookie } from "@/lib/auth/cookies";
import prisma from "@/lib/db/prisma";
import { createAuditLog } from "@/lib/middleware/auditLog";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = otpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { phone, otp, name } = parsed.data;
    const expectedOtp = process.env.OTP_CODE || "123456";

    if (otp !== expectedOtp) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 401 }
      );
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { phone } });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = await prisma.user.create({
        data: {
          phone,
          name: name || "Citizen",
          role: "CITIZEN",
        },
      });

      // Auto-seed dummy bills for new users
      const now = new Date();
      await prisma.bill.createMany({
        data: [
          {
            userId: user.id,
            billType: "Electricity",
            label: "Electricity Bill - March 2026",
            amount: 1850.0,
            dueDate: new Date(now.getFullYear(), now.getMonth() + 1, 15),
            status: "PENDING",
          },
          {
            userId: user.id,
            billType: "Water",
            label: "Water Supply Bill - Q1 2026",
            amount: 750.0,
            dueDate: new Date(now.getFullYear(), now.getMonth(), 28),
            status: "PENDING",
          },
          {
            userId: user.id,
            billType: "Property Tax",
            label: "Property Tax - FY 2025-26",
            amount: 12500.0,
            dueDate: new Date(now.getFullYear(), now.getMonth() + 2, 1),
            status: "PENDING",
          },
          {
            userId: user.id,
            billType: "Gas",
            label: "Gas Pipeline Bill - Feb 2026",
            amount: 480.0,
            dueDate: new Date(now.getFullYear(), now.getMonth() - 1, 20),
            status: "PENDING",
          },
          {
            userId: user.id,
            billType: "Sewerage",
            label: "Sewerage & Drainage - H2 2025",
            amount: 1200.0,
            dueDate: new Date(now.getFullYear(), now.getMonth(), 10),
            status: "PAID",
          },
        ],
      });
    }

    // Issue JWT
    const token = await signToken({
      userId: user.id,
      phone: user.phone,
      role: user.role,
    });

    // Audit log
    await createAuditLog(user.id, "LOGIN", { phone, method: "OTP" });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });

    return setAuthCookie(response, token);
  } catch (error) {
    console.error("[Verify OTP Error]", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
