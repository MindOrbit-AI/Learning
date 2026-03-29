"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mindorbit/ui";
import { CreditCard, Loader2, Sparkles, Calendar, XCircle } from "lucide-react";
import { PlanBadge } from "@/features/feature-gates/plan-badge";

const STATUS_LABELS: Record<string, string> = {
  INACTIVE: "Inactive",
  ACTIVE: "Active",
  CANCELED: "Canceled",
  PAST_DUE: "Past due",
  EXPIRED: "Expired",
  TRIALING: "Trialing",
};

export function BillingSettingsClient({
  planTier,
  subscriptionStatus,
  currentPeriodEnd,
  canceledAt,
  hasSubscriptionId,
  searchParams,
}: {
  planTier: "FREE" | "PRO";
  subscriptionStatus: string;
  currentPeriodEnd: string | null;
  canceledAt: string | null;
  hasSubscriptionId: boolean;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const [loading, setLoading] = useState(false);
  const upgraded = searchParams?.upgraded === "1";

  const handleManageBilling = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/billing/cancel", { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to cancel");
      }
      window.location.reload();
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription</p>
      </div>

      {upgraded && (
        <div className="rounded-2xl border-2 border-primary bg-primary/10 p-4">
          <p className="font-semibold text-primary">Welcome to Pro! Your features are now unlocked.</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Plan
          </CardTitle>
          <CardDescription>Your subscription status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Plan</span>
            <PlanBadge plan={planTier} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium">{STATUS_LABELS[subscriptionStatus] ?? subscriptionStatus}</span>
          </div>
          {currentPeriodEnd && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Renewal date</span>
              <span className="flex items-center gap-1 font-medium">
                <Calendar className="h-4 w-4" />
                {new Date(currentPeriodEnd).toLocaleDateString()}
              </span>
            </div>
          )}
          {canceledAt && (
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
              <XCircle className="h-4 w-4 shrink-0" />
              Subscription will end at period end
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {planTier === "FREE" && (
              <Button asChild>
                <Link href="/pricing" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Upgrade to Pro
                </Link>
              </Button>
            )}
            {planTier === "PRO" && hasSubscriptionId && (
              <>
                <Button onClick={handleManageBilling} disabled={loading} className="gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Manage billing
                </Button>
                {subscriptionStatus === "ACTIVE" && !canceledAt && (
                  <Button variant="outline" onClick={handleCancel} disabled={loading}>
                    Cancel plan
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
