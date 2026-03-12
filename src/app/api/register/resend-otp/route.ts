import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendOTPEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  try {
    const { limited } = await checkRateLimit(req, "RESEND_OTP");
    if (limited) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }

    const body = await req.json();
    const { email } = body;

    if (!email) {
      return new NextResponse("Missing email", { status: 400 });
    }

    const pendingReg = await prisma.pendingRegistration.findUnique({
      where: { email },
    });

    if (!pendingReg) {
      return new NextResponse("No pending registration found for this email", { status: 404 });
    }

    // Generate new OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const tokenExpiry = new Date(new Date().getTime() + 10 * 60 * 1000); // 10 minutes from now

    // Update pending registration with new OTP and expiry
    await prisma.pendingRegistration.update({
      where: { email },
      data: {
        otpHash: hashedOtp,
        expires: tokenExpiry,
      },
    });

    // Log OTP for development
    console.log(`\n🔐 NEW OTP for ${email}: ${otp}\n`);

    // Send new OTP email
    try {
      await sendOTPEmail(email, otp);
      console.log(`📧 New OTP email sent successfully to ${email}`);
    } catch (emailError) {
      console.error(`❌ New OTP email sending failed for ${email}:`, emailError);
      // In production, you might want to return an error here
    }

    return NextResponse.json({ message: "New verification code sent to your email" }, { status: 200 });
  } catch (error) {
    console.error("[RESEND_OTP_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}