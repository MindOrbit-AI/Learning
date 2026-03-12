import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { missionsService } from "@/services/missions-service";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await missionsService.completeMission(id, session.user.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 });
  }
}
