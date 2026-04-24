/**
 * Single source of truth for the key used to encrypt NextAuth JWT cookies.
 * Must match between `authOptions`, `getServerSession`, and `getToken` (middleware).
 */
export function getAuthSecret(): string {
  const envSecret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? "";
  if (envSecret) return envSecret;
  if (process.env.NODE_ENV !== "production") {
    return "__mindorbit_local_nextauth_secret_not_for_production__";
  }
  throw new Error("NEXTAUTH_SECRET or AUTH_SECRET must be set in production.");
}
