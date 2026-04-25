/**
 * MindOrbit Learn - Database Client
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

function stripWrappingQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function readDatabaseUrlFromFile(path: string): string | null {
  if (!existsSync(path)) return null;
  const content = readFileSync(path, "utf8");
  const match = content.match(/^DATABASE_URL\s*=\s*(.+)\s*$/m);
  if (!match?.[1]) return null;
  return stripWrappingQuotes(match[1]);
}

function loadDatabaseUrlFallback(): void {
  if (process.env.DATABASE_URL) return;

  const candidates = [".env.local", ".env", ".env.production.local"];
  let currentDir = process.cwd();
  const visited = new Set<string>();

  while (!visited.has(currentDir)) {
    visited.add(currentDir);
    for (const filename of candidates) {
      const value = readDatabaseUrlFromFile(join(currentDir, filename));
      if (value) {
        process.env.DATABASE_URL = value;
        return;
      }
    }
    currentDir = dirname(currentDir);
  }
}

loadDatabaseUrlFallback();

if (!process.env.DATABASE_URL) {
  throw new Error(
    "Missing DATABASE_URL. Set it in the process environment or define it in a root .env/.env.local file.",
  );
}

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export * from "@prisma/client";
