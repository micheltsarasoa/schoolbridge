import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/auth-utils";
import bcrypt from "bcryptjs";
import { parse } from "csv-parse/sync";
import { UserRole } from "@/generated/prisma";

// Valid user roles
const VALID_ROLES: string[] = [
  UserRole.STUDENT,
  UserRole.TEACHER,
  UserRole.PARENT,
  UserRole.ADMIN,
  UserRole.EDUCATIONAL_MANAGER,
];

// Helper to parse CSV data
function parseCsv(csvString: string): any[] {
  try {
    return parse(csvString, {
      columns: true, // Treat the first row as column headers
      skip_empty_lines: true,
      trim: true,
    });
  } catch (error) {
    throw new Error("Failed to parse CSV file. Please ensure it's properly formatted.");
  }
}

// Helper to parse JSON data
function parseJson(jsonString: string): any[] {
  try {
    const parsed = JSON.parse(jsonString);

    // Support both array format and object with 'users' property
    if (Array.isArray(parsed)) {
      return parsed;
    } else if (parsed && Array.isArray(parsed.users)) {
      return parsed.users;
    } else {
      throw new Error("JSON must be an array or an object with a 'users' array property");
    }
  } catch (error: any) {
    if (error.message.includes("JSON must be")) {
      throw error;
    }
    throw new Error("Failed to parse JSON file. Please ensure it's properly formatted.");
  }
}

// Helper to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper to generate random password
function generatePassword(length: number = 12): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

// Validate user data
function validateUserData(userData: any, rowIndex: number): { valid: boolean; error?: string } {
  // Check required fields
  if (!userData.name || typeof userData.name !== 'string' || userData.name.trim() === '') {
    return { valid: false, error: `Row ${rowIndex + 2}: Missing or invalid 'name' field` };
  }

  if (!userData.email || typeof userData.email !== 'string' || userData.email.trim() === '') {
    return { valid: false, error: `Row ${rowIndex + 2}: Missing or invalid 'email' field` };
  }

  if (!isValidEmail(userData.email)) {
    return { valid: false, error: `Row ${rowIndex + 2}: Invalid email format` };
  }

  if (!userData.role || typeof userData.role !== 'string') {
    return { valid: false, error: `Row ${rowIndex + 2}: Missing 'role' field` };
  }

  if (!VALID_ROLES.includes(userData.role)) {
    return {
      valid: false,
      error: `Row ${rowIndex + 2}: Invalid role '${userData.role}'. Must be one of: ${VALID_ROLES.join(', ')}`
    };
  }

  // Validate optional isActive field
  if (userData.isActive !== undefined && userData.isActive !== '') {
    const isActiveStr = String(userData.isActive).toLowerCase();
    if (!['true', 'false', '1', '0'].includes(isActiveStr)) {
      return { valid: false, error: `Row ${rowIndex + 2}: Invalid 'isActive' value. Must be true or false` };
    }
  }

  return { valid: true };
}

async function handler(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // Detect file type
    const fileName = file.name.toLowerCase();
    const isCSV = fileName.endsWith('.csv');
    const isJSON = fileName.endsWith('.json');

    if (!isCSV && !isJSON) {
      return NextResponse.json(
        { message: "Invalid file type. Please upload a CSV or JSON file." },
        { status: 400 }
      );
    }

    const fileContent = await file.text();

    // Parse file based on type
    let usersToCreate: any[];
    try {
      if (isCSV) {
        usersToCreate = parseCsv(fileContent);
      } else {
        usersToCreate = parseJson(fileContent);
      }
    } catch (error: any) {
      return NextResponse.json(
        { message: error.message || `Failed to parse ${isCSV ? 'CSV' : 'JSON'} file` },
        { status: 400 }
      );
    }

    if (!usersToCreate || usersToCreate.length === 0) {
      return NextResponse.json(
        { message: `${isCSV ? 'CSV' : 'JSON'} file is empty or contains no valid data` },
        { status: 400 }
      );
    }

    // Validate required fields exist
    const firstRow = usersToCreate[0];
    const requiredFields = ['name', 'email', 'role'];
    const missingFields = requiredFields.filter(field => !(field in firstRow));

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message: `Missing required fields: ${missingFields.join(', ')}. Field names are case-sensitive.`
        },
        { status: 400 }
      );
    }

    const createdUsers = [];
    const errors = [];

    for (let i = 0; i < usersToCreate.length; i++) {
      const userData = usersToCreate[i];

      try {
        // Validate user data
        const validation = validateUserData(userData, i);
        if (!validation.valid) {
          errors.push({
            user: userData.email || userData.name || `Row ${i + 2}`,
            error: validation.error || 'Validation failed'
          });
          continue;
        }

        // Normalize email
        const email = userData.email.trim().toLowerCase();

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [
              { email: email },
              { phone: userData.phone && userData.phone.trim() !== '' ? userData.phone.trim() : undefined },
            ],
          },
        });

        if (existingUser) {
          errors.push({
            user: email,
            error: 'User with this email or phone already exists'
          });
          continue;
        }

        // Generate password
        const generatedPassword = generatePassword();
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        // Parse isActive field
        let isActive = true; // Default value
        if (userData.isActive !== undefined && userData.isActive !== '') {
          const isActiveStr = String(userData.isActive).toLowerCase();
          isActive = isActiveStr === 'true' || isActiveStr === '1';
        }

        // Create user
        const newUser = await prisma.user.create({
          data: {
            name: userData.name.trim(),
            email: email,
            phone: userData.phone && userData.phone.trim() !== '' ? userData.phone.trim() : null,
            password: hashedPassword,
            role: userData.role as UserRole,
            isActive: isActive,
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
          },
        });

        createdUsers.push(newUser);

        // TODO: Send email to user with their credentials
        // This should be implemented with your email service
        console.log(`[BULK_IMPORT] User created: ${email} with password: ${generatedPassword}`);

      } catch (userError: any) {
        console.error(`[BULK_IMPORT] Error creating user:`, userError);
        errors.push({
          user: userData.email || userData.name || `Row ${i + 2}`,
          error: userError.message || 'Failed to create user'
        });
      }
    }

    // Determine response status
    const statusCode = createdUsers.length === 0 ? 400 :
                      errors.length > 0 ? 207 : // Multi-Status
                      200;

    return NextResponse.json(
      {
        message: createdUsers.length > 0
          ? `Successfully imported ${createdUsers.length} user${createdUsers.length !== 1 ? 's' : ''}`
          : 'No users were imported',
        createdCount: createdUsers.length,
        errors: errors,
      },
      { status: statusCode }
    );

  } catch (error: any) {
    console.error("[ADMIN_BULK_IMPORT]", error);
    return NextResponse.json(
      {
        message: error.message || "Internal Server Error",
        createdCount: 0,
        errors: [],
      },
      { status: 500 }
    );
  }
}

export const POST = withAdmin(handler);
