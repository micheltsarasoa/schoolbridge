
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/auth-utils";

async function handler(req: Request) {
  try {
    const users = await prisma.user.findMany({
      // We don't want to return the password hash
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        schoolId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("[ADMIN_GET_USERS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const GET = withAdmin(handler);
