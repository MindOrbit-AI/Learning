"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mindorbit/ui";
import { Check, Loader2, Sparkles } from "lucide-react";
import { PlanBadge } from "@/features/feature-gates/plan-badge";
import {
  FREE_FEATURES,
  PRO_FEATURES,
  PRICING_COMPARISON_ROWS,
} from "@/features/pricing/pricing-data";

export function PricingPageClient({
  currentPlan,
  proPrice,
}: {
  currentPlan: "FREE" | "PRO";
  proPrice: number;
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "pricing_viewed" }),
    }).catch(() => {});
  }, []);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Upgrade your learning system
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Unlock full mastery maps, unlimited missions, advanced insights, and unlimited subject creation.
        </p>
        {currentPlan && (
          <div className="mt-4 flex justify-center">
            <PlanBadge plan={currentPlan} />
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 border-muted">
          <CardHeader>
            <CardTitle className="text-xl">Free</CardTitle>
            <CardDescription>Get started with core features</CardDescription>
            <p className="text-2xl font-bold">
              $0<span className="text-sm font-normal text-muted-foreground">/month</span>
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          </CardContent>
        </Card>

        <Card className="relative border-2 border-primary bg-primary/5">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
            Pro
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-primary" />
              Pro
            </CardTitle>
            <CardDescription>Full access to everything</CardDescription>
            <p className="text-2xl font-bold">
              ${proPrice.toFixed(2)}
              <span className="text-sm font-normal text-muted-foreground">/month</span>
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            {currentPlan === "PRO" ? (
              <Button asChild variant="secondary" className="w-full">
                <Link href="/settings/billing">Manage billing</Link>
              </Button>
            ) : (
              <Button
                className="w-full gap-2"
                onClick={handleUpgrade}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Upgrade to Pro
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-6">
        <h3 className="font-bold">Compare plans</h3>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left font-medium">Feature</th>
              <th className="py-2 text-center">Free</th>
              <th className="py-2 text-center">Pro</th>
            </tr>
          </thead>
          <tbody>
            {PRICING_COMPARISON_ROWS.map((row) => (
              <tr key={row.feature} className="border-b last:border-0">
                <td className="py-2">{row.feature}</td>
                <td className="text-center">{row.free}</td>
                <td className="text-center">{row.pro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
