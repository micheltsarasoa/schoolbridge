import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schoolSchema = z.object({
  name: z.string().min(3, "Name is required"),
  code: z.string().min(2, "Code is required"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
});

export async function PUT(
  req: Request,
  context: { params: Promise<{ schoolId: string }> }
) {
  try {
    const { schoolId } = await context.params;
    const body = await req.json();
    const validation = schoolSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse(JSON.stringify({ error: "Invalid input", details: validation.error.flatten() }), { status: 400 });
    }

    const { name, code, address, phone, email } = validation.data;

    // Check if another school with the same code already exists
    const existingSchool = await prisma.school.findFirst({
      where: {
        code,
        id: { not: schoolId },
      },
    });

    if (existingSchool) {
      return new NextResponse(JSON.stringify({ error: "A school with this code already exists." }), { status: 409 });
    }

    const updatedSchool = await prisma.school.update({
      where: { id: schoolId },
      data: {
        name,
        code,
        address,
        phone,
        email,
      },
    });

    return NextResponse.json(updatedSchool, { status: 200 });
  } catch (error) {
    console.error("[PUT_SCHOOL]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ schoolId: string }> }
) {
  try {
    const { schoolId } = await context.params;

    await prisma.school.delete({
      where: { id: schoolId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE_SCHOOL]", error);
    // Handle potential foreign key constraints, etc.
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
