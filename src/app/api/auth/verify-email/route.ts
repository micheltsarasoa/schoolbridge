
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return new NextResponse("Missing token", { status: 400 });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token: hashedToken,
      },
    });

    if (!verificationToken) {
      return new NextResponse("Invalid token", { status: 400 });
    }

    if (verificationToken.expires < new Date()) {
      return new NextResponse("Token has expired", { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { email: verificationToken.identifier }
    });

    if (!user) {
        return new NextResponse("User not found", { status: 404 });
    }

    // Mark the user's email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
            identifier: verificationToken.identifier,
            token: hashedToken,
        }
      },
    });

    return new NextResponse("Email verified successfully", { status: 200 });

  } catch (error) {
    console.error("[VERIFY_EMAIL_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
