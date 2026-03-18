import type { Prisma } from "@prisma/client";

/**
 * Subjects are visible when:
 * - createdById is null (platform/seed subjects) → everyone sees
 * - createdById matches current user (user-created) → only creator sees
 */
export function subjectVisibilityWhere(userId: string | undefined): Prisma.SubjectWhereInput {
  if (!userId) {
    return { createdById: null };
  }
  return {
    OR: [{ createdById: null }, { createdById: userId }],
  };
}

/** Check if user can view a subject (e.g. for detail page) */
export function canViewSubject(
  subject: { createdById: string | null },
  userId: string | undefined
): boolean {
  if (subject.createdById === null) return true;
  return userId != null && subject.createdById === userId;
}
