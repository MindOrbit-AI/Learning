import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";
import { BillingSettingsClient } from "@/features/billing/billing-settings-client";
import { subscriptionService } from "@/features/billing/subscription.service";

export default async function BillingSettingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const session = await getServerSession();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      planTier: true,
      subscriptionStatus: true,
      currentPeriodEnd: true,
      canceledAt: true,
      billingSubscriptionId: true,
      billingCustomerId: true,
    },
  });

  const state = await subscriptionService.getSubscriptionState(session.user.id);

  return (
    <BillingSettingsClient
      planTier={user?.planTier ?? "FREE"}
      subscriptionStatus={user?.subscriptionStatus ?? "INACTIVE"}
      currentPeriodEnd={state?.currentPeriodEnd?.toISOString() ?? null}
      canceledAt={user?.canceledAt?.toISOString() ?? null}
      hasSubscriptionId={!!user?.billingSubscriptionId}
      hasBillingCustomer={!!user?.billingCustomerId}
      searchParams={params}
    />
  );
}
