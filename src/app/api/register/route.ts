
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { checkRateLimit } from "@/lib/rate-limiter";

// Password complexity: at least 8 characters, 1 uppercase, 1 lowercase, 1 number
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export async function POST(req: NextRequest) {
  try {
    const { limited } = await checkRateLimit(req, "REGISTER");
    if (limited) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }

    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
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

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        isActive: true, // User is active but not verified
      },
    });

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const tokenExpiry = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashedToken,
        expires: tokenExpiry,
      },
    });

    // Log verification link for development
    const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;
    console.log(`Email verification link for ${email}: ${verificationLink}`);

    return NextResponse.json(
      {
        message: "User created successfully. A verification email has been sent.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
