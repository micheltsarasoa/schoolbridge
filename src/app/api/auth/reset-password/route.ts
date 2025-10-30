
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { checkRateLimit } from "@/lib/rate-limiter";

// Password complexity: at least 8 characters, 1 uppercase, 1 lowercase, 1 number
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export async function POST(req: NextRequest) {
  try {
    const { limited } = await checkRateLimit(req, "RESET_PASSWORD");
    if (limited) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }

    const body = await req.json();
    const { token, email, password } = body;

    if (!token || !email || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Hash the token from the user to match the one in the DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: hashedToken,
      },
    });

    if (!verificationToken) {
      return new NextResponse("Invalid token", { status: 400 });
    }

    if (verificationToken.expires < new Date()) {
      return new NextResponse("Token has expired", { status: 400 });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return new NextResponse(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user's password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Delete the verification token so it cannot be used again
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: hashedToken,
        },
      },
    });

    return new NextResponse("Password has been reset successfully", { status: 200 });

  } catch (error) {
    console.error("[RESET_PASSWORD_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
