import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";
import { subjectVisibilityWhere } from "@/lib/subject-visibility";

export async function GET() {
  const session = await getServerSession();
  const subjects = await prisma.subject.findMany({
    where: subjectVisibilityWhere(session?.user?.id as string | undefined),
    select: { id: true, title: true, slug: true },
  });
  return NextResponse.json({ subjects });
}
