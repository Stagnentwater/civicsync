import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getUserFromRequest } from "@/lib/middleware/authMiddleware";
import { complaintStatusSchema } from "@/lib/validators/schemas";
import { createAuditLog } from "@/lib/middleware/auditLog";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUserFromRequest(req);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = complaintStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid status", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.complaint.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    await createAuditLog(user.userId, "COMPLAINT_STATUS_UPDATED", {
      complaintId: id,
      oldStatus: complaint.status,
      newStatus: parsed.data.status,
    });

    return NextResponse.json({
      success: true,
      complaint: updated,
    });
  } catch (error) {
    console.error("[Admin Update Complaint Error]", error);
    return NextResponse.json(
      { error: "Failed to update complaint" },
      { status: 500 }
    );
  }
}
