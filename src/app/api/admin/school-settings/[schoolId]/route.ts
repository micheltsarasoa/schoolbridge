import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole, AdminRole } from "@/types/db"; // Assuming AdminRole is also defined for finer-grained checks

// Helper to check admin authorization
// Helper to check admin authorization
// Returns NextResponse if unauthorized, or null if authorized.
async function checkAdminAuth(request: NextRequest, schoolId: string): Promise<NextResponse | null> {
  const session = await auth();
  if (!session?.user?.id || !session?.user?.role) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { admin: true },
  });

  if (!user || user.role !== UserRole.ADMIN || !user.admin) {
    return new NextResponse("Forbidden: Not an admin", { status: 403 });
  }

  // Check if School Admin is trying to modify their own school
  if (user.admin.role === AdminRole.SCHOOL_ADMIN && user.schoolId !== schoolId) {
    return new NextResponse("Forbidden: School Admin can only manage their own school", { status: 403 });
  }

  // Super Admin can modify any school
  if (user.admin.role === AdminRole.SUPER_ADMIN) {
    return null;
  }

  // If it's a School Admin and it's their school
  if (user.admin.role === AdminRole.SCHOOL_ADMIN && user.schoolId === schoolId) {
    return null;
  }

  return new NextResponse("Forbidden: Insufficient permissions", { status: 403 });
}


export async function GET(
  request: NextRequest,
  context: { params: Promise<{ schoolId: string }> }
) {
  const { schoolId } = await context.params;

  if (!schoolId) {
    return new NextResponse("Missing schoolId parameter", { status: 400 });
  }

  const authResponse = await checkAdminAuth(request, schoolId);
  if (authResponse) {
    return authResponse;
  }

  try {
    const schoolConfig = await prisma.schoolConfig.findUnique({
      where: { schoolId },
      select: { otpEnabled: true },
    });

    if (!schoolConfig) {
      return new NextResponse("School configuration not found", { status: 404 });
    }

    return NextResponse.json({ otpEnabled: schoolConfig.otpEnabled });
  } catch (error) {
    console.error("[SCHOOL_SETTINGS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ schoolId: string }> }
) {
  const { schoolId } = await context.params;

  if (!schoolId) {
    return new NextResponse("Missing schoolId parameter", { status: 400 });
  }

  const authResponse = await checkAdminAuth(request, schoolId);
  if (authResponse) {
    return authResponse;
  }

  try {
    const body = await request.json();
    const { otpEnabled } = body;

    if (typeof otpEnabled !== "boolean") {
      return new NextResponse("Invalid otpEnabled value (must be boolean)", { status: 400 });
    }

    // Ensure SchoolConfig exists, create if not (should generally exist after school creation)
    const updatedSchoolConfig = await prisma.schoolConfig.upsert({
      where: { schoolId },
      update: { otpEnabled },
      create: {
        schoolId,
        otpEnabled,
        // Set other default values if creating a new config, assuming reasonable defaults
        // or that it's always created with the school.
        // For now, only updating otpEnabled, relying on existing entry.
      },
      select: { otpEnabled: true },
    });

    return NextResponse.json({ otpEnabled: updatedSchoolConfig.otpEnabled });
  } catch (error) {
    console.error("[SCHOOL_SETTINGS_PUT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
