import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function handler(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    // Delete the user and rely on Prisma's cascading deletes for related data
    await prisma.user.delete({
      where: { id: userId },
    });

    return new NextResponse("Account deleted successfully", { status: 200 });
  } catch (error) {
    console.error("[DELETE_USER_ACCOUNT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const DELETE = handler;