import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { AnalyticsService, EVENT_TYPES, type EventType } from "@/services/analytics-service";
import { z } from "zod";

const ALLOWED_EVENTS = new Set(Object.values(EVENT_TYPES));

const schema = z.object({
  event: z.string().min(1),
  payload: z.record(z.unknown()).optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { event, payload } = schema.parse(body);
    if (!ALLOWED_EVENTS.has(event)) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }
    await AnalyticsService.track(session.user.id, event as EventType, payload);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
