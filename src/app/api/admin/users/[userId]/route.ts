
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/auth-utils";
import { UserRole } from "@/generated/prisma";

interface IParams {
  params: { userId: string };
}

// Update a user's role or status
async function updateHandler(req: Request, { params }: IParams) {
  try {
    const { userId } = params;
    const body = await req.json();
    const { role, isActive } = body;

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    if (role && !Object.values(UserRole).includes(role)) {
        return new NextResponse("Invalid role specified", { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...(role && { role }),
        ...(isActive !== undefined && { isActive }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error("[ADMIN_UPDATE_USER]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Delete a user
async function deleteHandler(req: Request, { params }: IParams) {
    try {
        const { userId } = params;

        if (!userId) {
            return new NextResponse("User ID is required", { status: 400 });
        }

        await prisma.user.delete({
            where: {
                id: userId,
            },
        });

        return new NextResponse("User deleted successfully", { status: 200 });

    } catch (error) {
        console.error("[ADMIN_DELETE_USER]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const PUT = withAdmin(updateHandler);
export const DELETE = withAdmin(deleteHandler);
