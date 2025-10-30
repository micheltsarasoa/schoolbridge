
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { checkRateLimit } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  try {
    const { limited } = await checkRateLimit(req, "REQUEST_PASSWORD_RESET");
    if (limited) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }

    const { email } = await req.json();

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // We don't want to reveal if a user exists or not for security reasons
      return new NextResponse("If a user with this email exists, a password reset link has been sent.", { status: 200 });
    }

    // Generate a secure, random token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set an expiry date for the token (e.g., 1 hour)
    const tokenExpiry = new Date(new Date().getTime() + 60 * 60 * 1000);

    // Store the hashed token in the database
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashedToken,
        expires: tokenExpiry,
      },
    });

    // In a real application, you would send an email to the user
    // For development, we'll log the link to the console.
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    console.log(`Password reset link for ${email}: ${resetLink}`);

    return new NextResponse("If a user with this email exists, a password reset link has been sent.", { status: 200 });

  } catch (error) {
    console.error("[REQUEST_PASSWORD_RESET_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
