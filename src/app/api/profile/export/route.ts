
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function handler(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    // Fetch all data related to the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: true,
        sessions: true,
        coursesCreated: true,
        courseValidations: true,
        parentRelations: true,
        studentRelations: true,
        studentProgress: true,
        instructionsGiven: true,
        instructionsReceived: true,
        notifications: true,
        auditLogs: true,
        submissions: true,
        attendances: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Remove sensitive data like password hash before export
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("[GET_USER_DATA_EXPORT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const GET = handler;
