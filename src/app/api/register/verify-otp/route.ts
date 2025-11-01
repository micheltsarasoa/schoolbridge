import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { checkRateLimit } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  try {
    const { limited } = await checkRateLimit(req, "VERIFY_OTP");
    if (limited) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }

    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return new NextResponse("Email and OTP are required", { status: 400 });
    }

    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return new NextResponse("Invalid OTP format", { status: 400 });
    }

    // Hash the provided OTP
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    // Find pending registration
    const pendingRegistration = await prisma.pendingRegistration.findUnique({
      where: { email },
    });

    if (!pendingRegistration) {
      return new NextResponse("No pending registration found. Please register again.", {
        status: 404,
      });
    }

    // Check if OTP matches
    if (pendingRegistration.otpHash !== hashedOtp) {
      return new NextResponse("Invalid verification code", { status: 400 });
    }

    // Check if OTP has expired
    if (pendingRegistration.expires < new Date()) {
      await prisma.pendingRegistration.delete({
        where: { email },
      });
      return new NextResponse("Verification code has expired. Please register again.", {
        status: 400,
      });
    }

    // Verify email doesn't already exist
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      await prisma.pendingRegistration.delete({
        where: { email },
      });
      return new NextResponse("User already exists", {
        status: 409,
      });
    }

    // Create the user
    const user = await prisma.user.create({
      data: {
        email: pendingRegistration.email,
        name: pendingRegistration.name,
        password: pendingRegistration.passwordHash,
        role: pendingRegistration.role,
        schoolId: pendingRegistration.schoolId,
        isActive: true,
        emailVerified: new Date(),
      },
    });

    // Delete pending registration
    await prisma.pendingRegistration.delete({
      where: { email },
    });

    // Log success
    console.log(`User created successfully: ${email}`);

    return NextResponse.json(
      {
        message: "Email verified successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[VERIFY_OTP_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

