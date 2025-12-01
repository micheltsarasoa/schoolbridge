
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/browser";

type HandlerArgs = {
  params: Promise<{ [key: string]: string }>;
};

type ApiHandler = (req: Request, args: HandlerArgs) => Promise<NextResponse>;

export function withRole(role: UserRole, handler: ApiHandler) {
  return async (req: Request, args: HandlerArgs) => {
    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // @ts-expect-error - role is a custom property on the session user
    if (session.user.role !== role) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    return handler(req, args);
  };
}

export function withAdmin(handler: ApiHandler) {
  return withRole(UserRole.ADMIN, handler);
}

export function withTeacher(handler: ApiHandler) {
  return withRole(UserRole.TEACHER, handler);
}