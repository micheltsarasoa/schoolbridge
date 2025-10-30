
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/auth-utils";

// GET all schools
async function getHandler(req: Request) {
  try {
    const schools = await prisma.school.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(schools);
  } catch (error) {
    console.error("[ADMIN_GET_SCHOOLS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// CREATE a new school
async function postHandler(req: Request) {
    try {
        const body = await req.json();
        const { name, code, address, phone, email } = body;

        if (!name || !code) {
            return new NextResponse("Name and Code are required", { status: 400 });
        }

        const newSchool = await prisma.school.create({
            data: {
                name,
                code,
                address,
                phone,
                email,
            }
        });

        return NextResponse.json(newSchool, { status: 201 });

    } catch (error) {
        console.error("[ADMIN_CREATE_SCHOOL]", error);
        // Handle potential unique constraint errors
        if ((error as any).code === 'P2002') {
            return new NextResponse("A school with this code already exists", { status: 409 });
        }
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const GET = withAdmin(getHandler);
export const POST = withAdmin(postHandler);
