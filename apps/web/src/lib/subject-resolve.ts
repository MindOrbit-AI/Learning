import type { PrismaClient } from "@mindorbit/db";

/** Map high-level catalog labels to existing `Subject.slug` rows. */
export async function resolveSubjectIdForCatalogLabel(
  prisma: PrismaClient,
  label: string,
): Promise<string | null> {
  const slug =
    label.toLowerCase() === "math"
      ? "algebra"
      : label
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
  const row = await prisma.subject.findFirst({
    where: { slug },
    select: { id: true },
  });
  return row?.id ?? null;
}
