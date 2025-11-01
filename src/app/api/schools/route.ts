import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all schools - public endpoint for registration
export async function GET(req: Request) {
  try {
    const schools = await prisma.school.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        code: true,
      },
    });
    return NextResponse.json({ schools });
  } catch (error) {
    console.error("[GET_SCHOOLS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

