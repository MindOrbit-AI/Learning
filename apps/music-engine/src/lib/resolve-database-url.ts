/**
 * Same behavior as `@mindorbit/db/resolve-database-url` (kept local so ESM/tsx can load without workspace subpath issues).
 * @see https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/pgbouncer
 */
export function resolvePrismaDatabaseUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (/[?&]pgbouncer=true(?:&|$)/i.test(trimmed)) {
    return trimmed;
  }

  const flag = process.env.PRISMA_TRANSACTION_POOL;
  if (flag === "false") {
    return trimmed;
  }

  const usePoolerMode = flag === "true" || /pooler\.supabase\.com/i.test(trimmed);

  if (!usePoolerMode) {
    return trimmed;
  }

  const sep = trimmed.includes("?") ? "&" : "?";
  return `${trimmed}${sep}pgbouncer=true`;
}
