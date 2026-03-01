import prisma from "../db/prisma";
import type { Prisma } from "@prisma/client";

export async function createAuditLog(
  userId: string,
  action: string,
  metadata?: Record<string, unknown>
) {
  return prisma.auditLog.create({
    data: {
      userId,
      action,
      metadata: (metadata || {}) as Prisma.InputJsonValue,
    },
  });
}
