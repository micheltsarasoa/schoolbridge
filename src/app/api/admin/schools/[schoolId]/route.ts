
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/auth-utils";

interface IParams {
  params: { schoolId: string };
}

// Update a school's details
async function updateHandler(req: Request, { params }: IParams) {
  try {
    const { schoolId } = params;
    const body = await req.json();
    const { name, code, address, phone, email } = body;

    if (!schoolId) {
      return new NextResponse("School ID is required", { status: 400 });
    }

    if (!name || !code) {
        return new NextResponse("Name and Code are required", { status: 400 });
    }

    const updatedSchool = await prisma.school.update({
      where: {
        id: schoolId,
      },
      data: {
        name,
        code,
        address,
        phone,
        email,
      },
    });

    return NextResponse.json(updatedSchool);

  } catch (error) {
    console.error("[ADMIN_UPDATE_SCHOOL]", error);
    // Handle potential unique constraint errors
    if ((error as any).code === 'P2002') {
        return new NextResponse("A school with this code already exists", { status: 409 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Delete a school
async function deleteHandler(req: Request, { params }: IParams) {
    try {
        const { schoolId } = params;

        if (!schoolId) {
            return new NextResponse("School ID is required", { status: 400 });
        }

        await prisma.school.delete({
            where: {
                id: schoolId,
            },
        });

        return new NextResponse("School deleted successfully", { status: 200 });

    } catch (error) {
        console.error("[ADMIN_DELETE_SCHOOL]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const PUT = withAdmin(updateHandler);
export const DELETE = withAdmin(deleteHandler);
