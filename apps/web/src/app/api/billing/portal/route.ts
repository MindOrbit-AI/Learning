import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { billingService } from "@/features/billing/billing.service";

export async function POST() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = await billingService.createPortalSession(session.user.id);
    return NextResponse.json({ url });
  } catch (e) {
    console.error("Portal error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create portal session" },
      { status: 500 }
    );
  }
}
