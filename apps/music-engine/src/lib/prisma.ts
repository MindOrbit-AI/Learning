import { PrismaClient } from "@prisma/client";
import { resolvePrismaDatabaseUrl } from "./resolve-database-url.js";

const globalForPrisma = globalThis as unknown as { musicEnginePrisma?: PrismaClient };

/** Lazy Prisma client for cron / batch jobs (same schema as @mindorbit/db; run `yarn db:generate` from repo root). */
export function getPrisma(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for this operation");
  }
  if (!globalForPrisma.musicEnginePrisma) {
    const url = resolvePrismaDatabaseUrl(process.env.DATABASE_URL);
    globalForPrisma.musicEnginePrisma = new PrismaClient({
      datasources: { db: { url } },
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }
  return globalForPrisma.musicEnginePrisma;
}
