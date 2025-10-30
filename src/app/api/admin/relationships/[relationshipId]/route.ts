
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/auth-utils";

interface IParams {
  params: { relationshipId: string };
}

// Delete a parent-student relationship
async function deleteHandler(req: Request, { params }: IParams) {
    try {
        const { relationshipId } = params;

        if (!relationshipId) {
            return new NextResponse("Relationship ID is required", { status: 400 });
        }

        await prisma.userRelationship.delete({
            where: {
                id: relationshipId,
            },
        });

        return new NextResponse("Relationship deleted successfully", { status: 200 });

    } catch (error) {
        console.error("[ADMIN_DELETE_RELATIONSHIP]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const DELETE = withAdmin(deleteHandler);
