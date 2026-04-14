import { NextResponse } from "next/server";
import { billingService } from "@/features/billing/billing.service";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature") ?? null;
  let payload: string;
  try {
    payload = await req.text();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const provider = billingService.getProvider();
  const event = await provider.handleWebhook(payload, signature);
  if (!event) {
    if (signature) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }
    return NextResponse.json({ received: true });
  }

  try {
    await billingService.processWebhookEvent(event);
  } catch (e) {
    console.error("Webhook processing error:", e);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
