
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

const RATE_LIMIT_WINDOW_IN_MINUTES = 15;
const MAX_REQUESTS_PER_WINDOW = 10;

export async function checkRateLimit(req: NextRequest, action: string) {
  const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? '127.0.0.1';

  const now = new Date();
  const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW_IN_MINUTES * 60 * 1000);

  // Count recent requests from this IP for the specific action
  const requestCount = await prisma.auditLog.count({
    where: {
      ipAddress: ip,
      action: action,
      createdAt: {
        gte: windowStart,
      },
    },
  });

  if (requestCount >= MAX_REQUESTS_PER_WINDOW) {
    return { limited: true };
  }

  // Log the current request
  await prisma.auditLog.create({
    data: {
      action: action,
      ipAddress: ip,
      entityType: "IP",
      entityId: ip,
    },
  });

  return { limited: false };
}
