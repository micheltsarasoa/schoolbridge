
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma";

type ApiHandler = (req: Request, ...args: any[]) => Promise<NextResponse>;

export function withRole(role: UserRole, handler: ApiHandler) {
  return async (req: Request, ...args: any[]) => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // @ts-ignore
    if (session.user.role !== role) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    return handler(req, ...args);
  };
}

export function withAdmin(handler: ApiHandler) {
  return withRole(UserRole.ADMIN, handler);
}

export function withTeacher(handler: ApiHandler) {
  return withRole(UserRole.TEACHER, handler);
}
