import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getUserFromRequest } from "@/lib/middleware/authMiddleware";
import { serviceBookingSchema } from "@/lib/validators/schemas";
import { createAuditLog } from "@/lib/middleware/auditLog";

const SERVICE_PRICES: Record<string, number> = {
  GAS_CYLINDER: 950,
  WATER_TANKER: 600,
  NEW_WATER_CONNECTION: 3500,
  NEW_GAS_CONNECTION: 2800,
};

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bookings = await prisma.serviceBooking.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("[Services Error]", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = serviceBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const pricePerUnit = SERVICE_PRICES[parsed.data.serviceType] || 1000;
    const totalAmount = pricePerUnit * parsed.data.quantity;
    const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const booking = await prisma.serviceBooking.create({
      data: {
        userId: user.userId,
        serviceType: parsed.data.serviceType,
        quantity: parsed.data.quantity,
        amount: totalAmount,
        address: parsed.data.address,
        locality: parsed.data.locality || "",
        landmark: parsed.data.landmark || "",
        pincode: parsed.data.pincode || "",
        latitude: parsed.data.latitude,
        longitude: parsed.data.longitude,
        paymentId,
        status: "BOOKED",
      },
    });

    await createAuditLog(
      user.userId,
      "SERVICE_BOOKED",
      { bookingId: booking.id, serviceType: parsed.data.serviceType, amount: totalAmount }
    );

    return NextResponse.json({
      booking,
      payment: { id: paymentId, amount: totalAmount, status: "SUCCESS" },
    }, { status: 201 });
  } catch (error) {
    console.error("[Service Booking Error]", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
