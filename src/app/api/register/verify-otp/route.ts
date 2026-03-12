import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendOTPEmail } from "@/lib/email";
import { UserRole } from "@/types/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return new NextResponse("Missing email or OTP", { status: 400 });
    }

    const pendingReg = await prisma.pendingRegistration.findUnique({
      where: { email },
    });

    if (!pendingReg) {
      return new NextResponse("Registration not found or expired", { status: 404 });
    }

    // Hash the received OTP for comparison
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (pendingReg.otpHash !== hashedOtp) {
      return new NextResponse("Invalid OTP", { status: 400 });
    }

    if (new Date() > pendingReg.expires) {
      await prisma.pendingRegistration.delete({ where: { email } });
      return new NextResponse("OTP expired", { status: 400 });
    }

    // OTP is valid and not expired, proceed with user creation
    const newUser = await prisma.user.create({
      data: {
        email: pendingReg.email,
        firstName: pendingReg.name.split(' ')[0],
        lastName: pendingReg.name.split(' ').slice(1).join(' '),
        password: pendingReg.passwordHash,
        role: pendingReg.role,
        schoolId: pendingReg.schoolId,
        emailVerified: new Date(), // Mark email as verified
        // Create associated profile based on role
        ...(pendingReg.role === UserRole.STUDENT && {
          student: {
            create: {
              // Any default student data can go here
            },
          },
        }),
        ...(pendingReg.role === UserRole.PARENT && {
          parents: {
            create: {
              // Any default parent data can go here
            },
          },
        }),
        ...(pendingReg.role === UserRole.TEACHER && {
          instructor: {
            create: {
              // Any default teacher/instructor data can go here
            },
          },
        }),
        // Add more roles as needed
        updatedAt: new Date(),
      },
    });


    // Delete the pending registration record
    await prisma.pendingRegistration.delete({ where: { email } });

    return NextResponse.json({ message: "Email verified and user created successfully" }, { status: 200 });
  } catch (error) {
    console.error("[VERIFY_OTP_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}