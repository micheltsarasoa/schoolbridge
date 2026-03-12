import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole, AdminRole } from "@/types/db";

// Helper to check admin authorization for user management
// Helper to check admin authorization for user management
// Returns NextResponse if unauthorized, or null if authorized.
async function checkAdminAuth(request: NextRequest, userIdToUnlock: string): Promise<NextResponse | null> {
  const session = await auth();
  if (!session?.user?.id || !session?.user?.role) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const callingUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { admin: true },
  });

  if (!callingUser || callingUser.role !== UserRole.ADMIN || !callingUser.admin) {
    return new NextResponse("Forbidden: Not an admin", { status: 403 });
  }

  const userToUnlock = await prisma.user.findUnique({
    where: { id: userIdToUnlock },
  });

  if (!userToUnlock) {
    return new NextResponse("User to unlock not found", { status: 404 });
  }

  // Super Admin can unlock any user
  if (callingUser.admin.role === AdminRole.SUPER_ADMIN) {
    return null;
  }

  // School Admin can only unlock users from their own school
  if (callingUser.admin.role === AdminRole.SCHOOL_ADMIN) {
    if (callingUser.schoolId && userToUnlock.schoolId === callingUser.schoolId) {
      return null;
    } else {
      return new NextResponse("Forbidden: School Admin can only unlock users from their own school", { status: 403 });
    }
  }

  return new NextResponse("Forbidden: Insufficient permissions", { status: 403 });
}


export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;

  if (!userId) {
    return new NextResponse("Missing userId parameter", { status: 400 });
  }

  const authResponse = await checkAdminAuth(request, userId);
  if (authResponse) {
    return authResponse;
  }

  try {
    const userToUnlock = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userToUnlock) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (!userToUnlock.lockedUntil && userToUnlock.failedLoginAttempts === 0) {
      return NextResponse.json({ message: "User account is not locked" }, { status: 200 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
      select: { id: true, email: true, failedLoginAttempts: true, lockedUntil: true }, // Return relevant info
    });

    return NextResponse.json({ message: "User account unlocked successfully", user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("[USER_UNLOCK_PUT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
