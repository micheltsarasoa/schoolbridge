
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/auth-utils";
import { UserRole } from "@/types/db";

interface IParams {
  params: Promise<{ userId: string }>;
}

// Get a user's details
async function getHandler(req: Request, { params }: IParams) {
  try {
    const { userId } = await params;

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        schoolId: true,
        lastLogin: true,
        createdAt: true,
        classes: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[ADMIN_GET_USER]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Update a user's role, status, and class assignment
async function updateHandler(req: Request, { params }: IParams) {
  try {
    const { userId } = await params;
    const body = await req.json();
    const { role, isActive, name, email, phone, classId, schoolId } = body;

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    if (role && !Object.values(UserRole).includes(role)) {
        return new NextResponse("Invalid role specified", { status: 400 });
    }

    // Start building the update data
    const updateData: any = {};

    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (schoolId) updateData.schoolId = schoolId;

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        schoolId: true,
        classes: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // If role is STUDENT and classId is provided, update class assignment
    if (role === "STUDENT" && classId) {
      // First, find all classes where this student is currently enrolled
      const currentClasses = await prisma.class.findMany({
        where: {
          students: {
            some: {
              id: userId,
            },
          },
        },
        select: { id: true },
      });

      // Remove student from all current classes
      for (const cls of currentClasses) {
        if (cls.id !== classId) {
          await prisma.class.update({
            where: { id: cls.id },
            data: {
              students: {
                disconnect: { id: userId },
              },
            },
          });
        }
      }

      // Add student to new class (if not already there)
      await prisma.class.update({
        where: { id: classId },
        data: {
          students: {
            connect: { id: userId },
          },
        },
      });
    }

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error("[ADMIN_UPDATE_USER]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Delete a user
async function deleteHandler(req: Request, { params }: IParams) {
    try {
        const { userId } = await params;

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

export const GET = withAdmin(getHandler);
export const PUT = withAdmin(updateHandler);
export const DELETE = withAdmin(deleteHandler);
