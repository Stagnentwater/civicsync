import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getUserFromRequest } from "@/lib/middleware/authMiddleware";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const [
      totalUsers,
      totalComplaints,
      openComplaints,
      inProgressComplaints,
      resolvedComplaints,
      totalBills,
      paidBills,
      pendingBills,
      totalPayments,
      recentComplaints,
      recentPayments,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.complaint.count(),
      prisma.complaint.count({ where: { status: "OPEN" } }),
      prisma.complaint.count({ where: { status: "IN_PROGRESS" } }),
      prisma.complaint.count({ where: { status: "RESOLVED" } }),
      prisma.bill.count(),
      prisma.bill.count({ where: { status: "PAID" } }),
      prisma.bill.count({ where: { status: "PENDING" } }),
      prisma.payment.count(),
      prisma.complaint.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, phone: true } } },
      }),
      prisma.payment.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          bill: {
            include: { user: { select: { name: true, phone: true } } },
          },
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalComplaints,
        openComplaints,
        inProgressComplaints,
        resolvedComplaints,
        totalBills,
        paidBills,
        pendingBills,
        totalPayments,
      },
      recentComplaints,
      recentPayments,
    });
  } catch (error) {
    console.error("[Admin Dashboard Error]", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
