import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";
import { missionsService } from "@/services/missions-service";
import { z } from "zod";

const schema = z.object({
  nodeId: z.string().min(1),
  sceneBased: z.boolean().optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { nodeId, sceneBased } = schema.parse(body);

    const node = await prisma.conceptNode.findUnique({
      where: { id: nodeId },
    });
    if (!node) {
      return NextResponse.json({ error: "Node not found" }, { status: 404 });
    }

    const missionId = await missionsService.generateMission(nodeId, session.user.id, {
      sceneBased: sceneBased ?? false,
    });
    if (!missionId) {
      return NextResponse.json(
        { error: "Mission already exists or failed to create" },
        { status: 400 }
      );
    }

    return NextResponse.json({ missionId });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: e.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to generate mission" }, { status: 500 });
  }
}
