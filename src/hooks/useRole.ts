
import { useSession } from "next-auth/react";
import { UserRole } from "@/generated/prisma";

export function useRole(requiredRole: UserRole | UserRole[]) {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";

  if (isLoading) {
    return { isAuthorized: false, isLoading: true };
  }

  if (!session || !session.user) {
    return { isAuthorized: false, isLoading: false };
  }

  // @ts-ignore
  const userRole = session.user.role as UserRole;

  const hasRequiredRole = Array.isArray(requiredRole)
    ? requiredRole.includes(userRole)
    : userRole === requiredRole;

  return { isAuthorized: hasRequiredRole, isLoading: false };
}
