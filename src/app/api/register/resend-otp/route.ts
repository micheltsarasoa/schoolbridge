import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { checkRateLimit } from "@/lib/rate-limiter";
import { sendOTPEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { limited } = await checkRateLimit(req, "RESEND_OTP");
    if (limited) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }

    const body = await req.json();
    const { email } = body;

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    // Find pending registration
    const pendingRegistration = await prisma.pendingRegistration.findUnique({
      where: { email },
    });

    if (!pendingRegistration) {
      return new NextResponse("No pending registration found. Please register again.", {
        status: 404,
      });
    }

    // Generate new 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const tokenExpiry = new Date(new Date().getTime() + 10 * 60 * 1000); // 10 minutes

    // Update pending registration with new OTP
    await prisma.pendingRegistration.update({
      where: { email },
      data: {
        otpHash: hashedOtp,
        expires: tokenExpiry,
      },
    });

    // Log OTP for development (ALWAYS log this for debugging)
    console.log(`\n🔐 Resent OTP for ${email}: ${otp}\n`);

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
      console.log(`📧 Resend email sent successfully to ${email}`);
    } catch (emailError) {
      console.error(`❌ Resend email failed for ${email}:`, emailError);
      // Continue anyway - user can still use OTP from logs in development
    }

    return NextResponse.json(
      {
        message: "Verification code resent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[RESEND_OTP_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

