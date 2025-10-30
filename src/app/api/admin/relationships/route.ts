
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/auth-utils";

// GET all parent-student relationships
async function getHandler(req: Request) {
  try {
    const relationships = await prisma.userRelationship.findMany({
      include: {
        parent: { select: { id: true, name: true, email: true } },
        student: { select: { id: true, name: true, email: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(relationships);
  } catch (error) {
    console.error("[ADMIN_GET_RELATIONSHIPS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// CREATE a new parent-student relationship
async function postHandler(req: Request) {
    try {
        const body = await req.json();
        const { parentId, studentId } = body;

        if (!parentId || !studentId) {
            return new NextResponse("Parent ID and Student ID are required", { status: 400 });
        }

        // Check if relationship already exists
        const existingRelationship = await prisma.userRelationship.findUnique({
            where: {
                parentId_studentId: {
                    parentId,
                    studentId,
                },
            },
        });

        if (existingRelationship) {
            return new NextResponse("Relationship already exists", { status: 409 });
        }

        const newRelationship = await prisma.userRelationship.create({
            data: {
                parentId,
                studentId,
                isVerified: true, // Assuming admin creates verified relationships
            }
        });

        return NextResponse.json(newRelationship, { status: 201 });

    } catch (error) {
        console.error("[ADMIN_CREATE_RELATIONSHIP]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const GET = withAdmin(getHandler);
export const POST = withAdmin(postHandler);
