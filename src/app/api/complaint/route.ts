import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getUserFromRequest } from "@/lib/middleware/authMiddleware";
import { complaintSchema } from "@/lib/validators/schemas";
import { createAuditLog } from "@/lib/middleware/auditLog";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const complaints = await prisma.complaint.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ complaints });
  } catch (error) {
    console.error("[Complaints Error]", error);
    return NextResponse.json(
      { error: "Failed to fetch complaints" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = complaintSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const complaint = await prisma.complaint.create({
      data: {
        userId: user.userId,
        department: parsed.data.department,
        description: parsed.data.description,
        locality: parsed.data.locality,
        address: parsed.data.address,
        landmark: parsed.data.landmark || "",
        pincode: parsed.data.pincode || "",
        status: "OPEN",
      },
    });

    await createAuditLog(user.userId, "COMPLAINT_FILED", {
      complaintId: complaint.id,
      department: complaint.department,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Complaint filed successfully",
        complaint,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Complaint Error]", error);
    return NextResponse.json(
      { error: "Failed to file complaint" },
      { status: 500 }
    );
  }
}
