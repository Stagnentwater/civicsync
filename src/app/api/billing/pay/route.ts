import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getUserFromRequest } from "@/lib/middleware/authMiddleware";
import { payBillSchema } from "@/lib/validators/schemas";
import { createAuditLog } from "@/lib/middleware/auditLog";

export async function POST(req: NextRequest) {
    const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = payBillSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { billId } = parsed.data;

    // Find the bill
    const bill = await prisma.bill.findFirst({
      where: { id: billId, userId: user.userId },
    });

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 });
    }

    if (bill.status === "PAID") {
      return NextResponse.json(
        { error: "Bill is already paid" },
        { status: 400 }
      );
    }

    // Mock payment processing (Stripe-ready structure)
    // In production: create Stripe PaymentIntent, process payment, then update
    const [updatedBill, payment] = await prisma.$transaction([
      prisma.bill.update({
        where: { id: billId },
        data: { status: "PAID" },
      }),
      prisma.payment.create({
        data: {
          billId,
          amount: bill.amount,
          status: "SUCCESS",
        },
      }),
    ]);

    // Audit log
    await createAuditLog(user.userId, "PAYMENT_MADE", {
      billId,
      amount: bill.amount,
      paymentId: payment.id,
    });

    return NextResponse.json({
      success: true,
      message: "Payment successful",
      payment: {
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        billId: updatedBill.id,
      },
    });
  } catch (error) {
    console.error("[Payment Error]", error);
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 }
    );
  }
}
