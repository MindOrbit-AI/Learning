import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@mindorbit/db";
import { writeAuditLog } from "@/lib/audit";

const moderateSchema = z.object({
  action: z.enum(["approve", "reject", "archive", "flag"]),
  reason: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = moderateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const resource = await prisma.resource.findUnique({ where: { id } });
  if (!resource) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const statusMap = {
    approve: "approved",
    reject: "rejected",
    archive: "archived",
    flag: "flagged",
  } as const;
  const newStatus = statusMap[parsed.data.action];

  const updated = await prisma.resource.update({
    where: { id },
    data: {
      status: newStatus,
      flagReason: parsed.data.action === "flag" ? parsed.data.reason : null,
    },
  });

  await writeAuditLog({
    actorUserId: session.user.id,
    entityType: "Resource",
    entityId: id,
    action: parsed.data.action,
    before: resource,
    after: updated,
  });

  return NextResponse.json(updated);
}
