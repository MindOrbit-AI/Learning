import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";
import { PricingPageClient } from "@/features/pricing/pricing-page-client";
import { PRO_PRICE_MONTHLY, effectivePlanTier } from "@mindorbit/lib";

export default async function PricingPage() {
  const session = await getServerSession();
  let planTier: "FREE" | "PRO" = "FREE";
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { planTier: true, bonusProUntil: true },
    });
    planTier = effectivePlanTier({
      planTier: (user?.planTier ?? "FREE") as "FREE" | "PRO",
      bonusProUntil: user?.bonusProUntil,
    });
  } else {
    redirect("/auth/signin?callbackUrl=/pricing");
  }

  return (
    <PricingPageClient
      currentPlan={planTier}
      proPrice={PRO_PRICE_MONTHLY}
    />
  );
}
