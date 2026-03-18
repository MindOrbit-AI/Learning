import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";
import { subjectVisibilityWhere } from "@/lib/subject-visibility";

export async function GET(req: Request) {
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({
      subjects: [],
      nodes: [],
      resources: [],
      creators: [],
    });
  }

  const term = `%${q}%`;
  const visibilityWhere = subjectVisibilityWhere(session?.user?.id as string | undefined);

  const [subjects, nodes, resources, creators] = await Promise.all([
    prisma.subject.findMany({
      where: {
        AND: [
          visibilityWhere,
          {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          },
        ],
      },
      select: { id: true, title: true, slug: true },
      take: 10,
    }),
    prisma.conceptNode.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
        subject: visibilityWhere,
      },
      include: { subject: { select: { title: true } } },
      take: 10,
    }),
    prisma.resource.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, title: true },
      take: 10,
    }),
    prisma.user.findMany({
      where: {
        name: { contains: q, mode: "insensitive" },
      },
      select: { id: true, name: true },
      take: 10,
    }),
  ]);

  return NextResponse.json({
    subjects,
    nodes: nodes.map((n) => ({
      id: n.id,
      title: n.title,
      subjectTitle: n.subject.title,
    })),
    resources,
    creators,
  });
}
