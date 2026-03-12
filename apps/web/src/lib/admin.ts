/**
 * Admin RBAC helpers
 */
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"] as const;
const SUPER_ADMIN_ROLES = ["SUPER_ADMIN"] as const;

export function isAdminRole(role: string | undefined): role is "ADMIN" | "SUPER_ADMIN" {
  return role != null && ADMIN_ROLES.includes(role as "ADMIN" | "SUPER_ADMIN");
}

export function isSuperAdminRole(role: string | undefined): boolean {
  return role != null && SUPER_ADMIN_ROLES.includes(role as "SUPER_ADMIN");
}

/**
 * Require admin access. Use in server components and API routes.
 * Returns the session if admin, otherwise null.
 */
export async function requireAdmin() {
  const session = await getServerSession();
  if (!session?.user?.id) return null;
  const role = session.user.role;
  if (!isAdminRole(role)) return null;
  return session;
}

/**
 * Require super admin access. Use for user role management, settings.
 */
export async function requireSuperAdmin() {
  const session = await getServerSession();
  if (!session?.user?.id) return null;
  if (!isSuperAdminRole(session.user.role)) return null;
  return session;
}

/**
 * Fetch user with role from DB (session may be stale).
 */
export async function getUserRole(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role ?? null;
}
