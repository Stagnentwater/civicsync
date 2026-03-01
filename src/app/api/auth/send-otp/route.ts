import { NextRequest, NextResponse } from "next/server";
import { phoneSchema } from "@/lib/validators/schemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = phoneSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid phone number", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // In production, integrate with SMS provider (Twilio, etc.)
    // For now, OTP is always 123456
    const otp = process.env.OTP_CODE || "123456";

    console.log(`[OTP] Sending OTP ${otp} to ${parsed.data.phone}`);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      // Remove this in production:
      debug_otp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error) {
    console.error("[OTP Error]", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
