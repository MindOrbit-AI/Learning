import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@mindorbit/db";
import { writeAuditLog } from "@/lib/audit";

const layoutSchema = z.object({
  positions: z.record(z.string(), z.object({ x: z.number(), y: z.number() })),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subjectId } = await params;
  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
  if (!subject) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = layoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  for (const [nodeId, pos] of Object.entries(parsed.data.positions)) {
    await prisma.conceptNode.update({
      where: { id: nodeId, subjectId },
      data: { positionX: pos.x, positionY: pos.y },
    });
  }

  await writeAuditLog({
    actorUserId: session.user.id,
    entityType: "MasteryMap",
    entityId: subjectId,
    action: "save_layout",
    after: { positionsCount: Object.keys(parsed.data.positions).length },
  });

  return NextResponse.json({ success: true });
}
