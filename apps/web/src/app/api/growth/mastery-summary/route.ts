import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import {
  buildMasteryShareSummary,
  getMasterySnapshotForUser,
} from "@/services/mastery-share-service";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snapshot = await getMasterySnapshotForUser(session.user.id);
  if (!snapshot) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    snapshot,
    summaryText: buildMasteryShareSummary(snapshot),
  });
}
