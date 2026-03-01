import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getUserFromRequest } from "@/lib/middleware/authMiddleware";

// Seed endpoint - creates sample data for testing
export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Create sample bills for the current user
    const sampleBills = await Promise.all([
      prisma.bill.create({
        data: {
          userId: user.userId,
          amount: 1500.0,
          dueDate: new Date("2026-03-15"),
          status: "PENDING",
        },
      }),
      prisma.bill.create({
        data: {
          userId: user.userId,
          amount: 2500.0,
          dueDate: new Date("2026-04-01"),
          status: "PENDING",
        },
      }),
      prisma.bill.create({
        data: {
          userId: user.userId,
          amount: 800.0,
          dueDate: new Date("2026-02-28"),
          status: "PAID",
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Sample data created",
      bills: sampleBills,
    });
  } catch (error) {
    console.error("[Seed Error]", error);
    return NextResponse.json(
      { error: "Failed to seed data" },
      { status: 500 }
    );
  }
}
