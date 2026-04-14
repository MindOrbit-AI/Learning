import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";
import { subjectVisibilityWhere } from "@/lib/subject-visibility";

/** User's library (created + UserSubjectAdd). Use `?scope=published` for filter dropdowns (e.g. community). */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("scope") === "published") {
    const subjects = await prisma.subject.findMany({
      where: { status: "published" },
      select: { id: true, title: true, slug: true },
      orderBy: { title: "asc" },
    });
    return NextResponse.json({ subjects });
  }

  const session = await getServerSession();
  const subjects = await prisma.subject.findMany({
    where: subjectVisibilityWhere(session?.user?.id as string | undefined),
    select: { id: true, title: true, slug: true },
    orderBy: { title: "asc" },
  });
  return NextResponse.json({ subjects });
}
