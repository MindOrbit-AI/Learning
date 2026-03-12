import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";
import { z } from "zod";
import { AnalyticsService, EVENT_TYPES } from "@/services/analytics-service";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(["note", "summary", "flashcard_set", "diagram", "walkthrough", "mini_lesson"]),
  subjectId: z.string(),
  clusterId: z.string(),
  nodeId: z.string(),
  contentJson: z.string(),
});

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const resource = await prisma.resource.create({
      data: {
        userId: session.user.id,
        subjectId: data.subjectId,
        clusterId: data.clusterId,
        nodeId: data.nodeId,
        type: data.type,
        title: data.title,
        description: data.description ?? null,
        contentJson: data.contentJson,
      },
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: { xp: { increment: 10 } },
    });

    await AnalyticsService.track(session.user.id, EVENT_TYPES.resource_uploaded, {
      resourceId: resource.id,
      type: data.type,
      nodeId: data.nodeId,
    });

    return NextResponse.json({ id: resource.id });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: e.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
