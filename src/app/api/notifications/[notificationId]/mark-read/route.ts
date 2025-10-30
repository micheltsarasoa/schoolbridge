
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface IParams {
  params: { notificationId: string };
}

async function handler(req: Request, { params }: IParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { notificationId } = params;

    if (!notificationId) {
      return new NextResponse("Notification ID is required", { status: 400 });
    }

    const updatedNotification = await prisma.notification.update({
      where: {
        id: notificationId,
        userId: session.user.id, // Ensure user can only mark their own notifications
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error("[MARK_NOTIFICATION_READ]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const PUT = handler;
