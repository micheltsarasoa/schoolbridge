
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/auth-utils";
import bcrypt from "bcryptjs";
import { parse } from "csv-parse/sync";

// Helper to parse CSV data
function parseCsv(csvString: string) {
  return parse(csvString, {
    columns: true, // Treat the first row as column headers
    skip_empty_lines: true,
  });
}

async function handler(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    const fileContent = await file.text();
    let usersToCreate: any[] = [];

    // Determine file type and parse
    if (file.type === "text/csv") {
      usersToCreate = parseCsv(fileContent);
    } else if (file.type === "application/json") {
      usersToCreate = JSON.parse(fileContent);
    } else {
      return new NextResponse("Unsupported file type. Please upload CSV or JSON.", { status: 400 });
    }

    const createdUsers = [];
    const errors = [];

    for (const userData of usersToCreate) {
      try {
        // Basic validation and password hashing
        if (!userData.name || !userData.email || !userData.password || !userData.role) {
          errors.push({ user: userData.email || userData.name, error: "Missing required fields" });
          continue;
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const newUser = await prisma.user.create({
          data: {
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: userData.role,
            schoolId: userData.schoolId || null, // Optional school association
            isActive: true,
            emailVerified: new Date(), // Assume verified for bulk import
          },
        });
        createdUsers.push(newUser);
      } catch (userError: any) {
        errors.push({ user: userData.email || userData.name, error: userError.message });
      }
    }

    return NextResponse.json({
      message: "Bulk import processed",
      createdCount: createdUsers.length,
      errors: errors,
    }, { status: errors.length > 0 ? 207 : 200 }); // 207 Multi-Status if some errors occurred

  } catch (error) {
    console.error("[ADMIN_BULK_IMPORT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const POST = withAdmin(handler);
