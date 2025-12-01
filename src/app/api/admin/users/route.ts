import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/auth-utils";

async function getHandler(req: Request) {
  try {
    // Get pagination parameters from query string
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Optional filters
    const roleFilter = searchParams.get("role");
    const statusFilter = searchParams.get("status");
    const searchQuery = searchParams.get("search");

    // Build where clause
    const where: any = {};

    if (roleFilter) {
      where.role = roleFilter;
    }

    if (statusFilter !== null) {
      where.isActive = statusFilter === "active";
    }

    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: "insensitive" } },
        { email: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    // Fetch users with pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          schoolId: true,
          lastLogin: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("[ADMIN_GET_USERS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

async function postHandler(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      password,
      role,
      isActive = true,
      schoolId,
      classId,
    } = body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        password,
        role,
        isActive,
        schoolId: schoolId || null,
      },
    });

    // If creating a student and classId is provided, add to class
    if (role === "STUDENT" && classId) {
      await prisma.class.update({
        where: { id: classId },
        data: {
          students: {
            connect: { id: user.id },
          },
        },
      });
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[ADMIN_CREATE_USER]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const GET = withAdmin(getHandler);
export const POST = withAdmin(postHandler);
