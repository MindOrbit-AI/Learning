import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { createMasteryShareToken } from "@/services/mastery-share-service";
import { getSiteUrl } from "@/lib/site-url";
import { AnalyticsService, EVENT_TYPES } from "@/services/analytics-service";

export async function POST() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await createMasteryShareToken(session.user.id);
  const origin = getSiteUrl();
  const shareUrl = `${origin}/share/mastery/${token}`;

  await AnalyticsService.track(session.user.id, EVENT_TYPES.mastery_report_shared, {
    tokenPrefix: token.slice(0, 8),
  });

  return NextResponse.json({ token, shareUrl });
}
