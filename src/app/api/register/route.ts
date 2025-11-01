import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { checkRateLimit } from "@/lib/rate-limiter";
import { sendOTPEmail } from "@/lib/email";
import bcrypt from "bcryptjs";

// Password complexity: at least 8 characters, 1 uppercase, 1 lowercase, 1 number
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export async function POST(req: NextRequest) {
  try {
    const { limited } = await checkRateLimit(req, "REGISTER");
    if (limited) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }

    const body = await req.json();
    const { name, email, password, role, schoolId } = body;

    if (!name || !email || !password || !role || !schoolId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return new NextResponse(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse("User with this email already exists", {
        status: 409,
      });
    }

    // Check for existing pending registration
    const existingPending = await prisma.pendingRegistration.findUnique({
      where: { email },
    });

    if (existingPending) {
      await prisma.pendingRegistration.delete({
        where: { email },
      });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    const tokenExpiry = new Date(new Date().getTime() + 10 * 60 * 1000); // 10 minutes

    // Store registration data in PendingRegistration
    await prisma.pendingRegistration.create({
      data: {
        email,
        name,
        passwordHash,
        role,
        schoolId,
        otpHash: hashedOtp,
        expires: tokenExpiry,
      },
    });

    // Log OTP for development (ALWAYS log this for debugging)
    console.log(`\n🔐 OTP for ${email}: ${otp}\n`);

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
      console.log(`📧 Email sent successfully to ${email}`);
    } catch (emailError) {
      console.error(`❌ Email sending failed for ${email}:`, emailError);
      // Continue anyway - user can still use OTP from logs in development
      // In production, you might want to fail here
    }

    return NextResponse.json(
      {
        message: "Verification code sent to your email",
        email: email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[REGISTER_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
