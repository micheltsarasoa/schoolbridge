
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/auth-utils";

async function handler(req: Request) {
  try {
    const userCount = await prisma.user.count();
    const courseCount = await prisma.course.count();
    const schoolCount = await prisma.school.count();
    const subjectCount = await prisma.subject.count();
    const classCount = await prisma.class.count();

    return NextResponse.json({
      userCount,
      courseCount,
      schoolCount,
      subjectCount,
      classCount,
    });
  } catch (error) {
    console.error("[ADMIN_GET_COUNTS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const GET = withAdmin(handler);
