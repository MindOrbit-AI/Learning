import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";
import { AdvancedInsightsClient } from "@/features/advanced-insights/advanced-insights-client";
import { featureGateService } from "@/features/billing/feature-gate.service";

export default async function InsightsPage() {
  const session = await getServerSession();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { planTier: true, bonusProUntil: true },
  });

  const hasAccess = featureGateService.canAccessAdvancedInsights(user);

  return <AdvancedInsightsClient hasAccess={hasAccess} />;
}
