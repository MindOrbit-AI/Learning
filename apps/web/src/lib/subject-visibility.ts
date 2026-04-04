import type { Prisma, SubjectStatus } from "@prisma/client";

export type SubjectVisibilityFields = {
  createdById: string | null;
  status: SubjectStatus;
};

/**
 * Subjects listed for a user:
 * - Platform subjects (createdById null)
 * - Subjects they created
 * - Published subjects from others that they added to their library
 */
export function subjectVisibilityWhere(userId: string | undefined): Prisma.SubjectWhereInput {
  if (!userId) {
    return { createdById: null };
  }
  return {
    OR: [
      { createdById: null },
      { createdById: userId },
      {
        libraryAdds: { some: { userId } },
      },
    ],
  };
}

/**
 * Whether the user may use a subject (detail, diagnostics, mastery map, etc.).
 * - Platform subjects: anyone (including guests)
 * - User-created: owner always; others if published (share link) or they added it to their library
 */
export function canViewSubject(
  subject: SubjectVisibilityFields,
  userId: string | undefined,
  options?: { hasAdded?: boolean }
): boolean {
  if (subject.createdById === null) return true;
  if (!userId) return false;
  if (subject.createdById === userId) return true;
  if (options?.hasAdded) return true;
  if (subject.status === "published") return true;
  return false;
}
