/**
 * MindOrbit Learn - Database Client
 */

import { PrismaClient } from "@prisma/client";

import { resolvePrismaDatabaseUrl } from "./resolve-database-url";

declare global {
  var prisma: PrismaClient | undefined;
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "Missing DATABASE_URL. Set it in the process environment.",
  );
}

const databaseUrl = resolvePrismaDatabaseUrl(process.env.DATABASE_URL);

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    datasources: { db: { url: databaseUrl } },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export * from "@prisma/client";
