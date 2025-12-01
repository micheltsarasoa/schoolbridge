import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schoolSchema = z.object({
  name: z.string().min(3, "Name is required"),
  code: z.string().min(2, "Code is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  country: z.string().optional(),
  timezone: z.string().optional(),
});

// GET all schools - public endpoint for registration
export async function GET(req: Request) {
  try {
    const schools = await prisma.schools.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        code: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json({ schools });
  } catch (error) {
    console.error("[GET_SCHOOLS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = schoolSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse(JSON.stringify({ error: "Invalid input", details: validation.error.flatten() }), { status: 400 });
    }

    const {
      name,
      code,
      address,
      city,
      phone,
      email,
      country = "Madagascar",
      timezone = "Indian/Antananarivo",
    } = validation.data;

    // Check if school with the same code already exists
    const existingSchool = await prisma.schools.findFirst({
      where: { OR: [{ code }, { name }] },
    });

    if (existingSchool) {
      const duplicateField = existingSchool.code === code ? "code" : "name";
      return new NextResponse(
        JSON.stringify({
          error: `A school with this ${duplicateField} already exists.`
        }),
        { status: 409 }
      );
    }

    const school = await prisma.schools.create({
      data: {
        name,
        code,
        address,
        city,
        phone,
        email,
        country,
        timezone,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(school, { status: 201 });
  } catch (error) {
    console.error("[POST_SCHOOL]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

