"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mindorbit/ui";
import { Loader2, Lock, Map, Sparkles, Zap } from "lucide-react";
import { PRO_PRICE_MONTHLY } from "@mindorbit/lib";

export function DiagnosticPostPaywall({
  subjectTitle,
  subjectId,
}: {
  subjectTitle: string;
  subjectId: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }

  return (
    <Card className="relative overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/[0.08] via-background to-muted/30">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      <CardHeader className="relative">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-widest">Pro</span>
        </div>
        <CardTitle className="text-xl sm:text-2xl">Unlock your full mastery plan</CardTitle>
        <CardDescription className="text-base">
          You have real gaps in {subjectTitle}. Upgrade to see the complete map, unlimited training,
          and advanced insights—not just a snapshot.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative space-y-6">
        <div className="relative overflow-hidden rounded-xl border border-dashed border-primary/25 bg-muted/40 p-4">
          <div className="pointer-events-none select-none blur-[2px] opacity-70">
            <div className="flex h-28 items-end justify-between gap-1 px-2">
              {[0.35, 0.55, 0.42, 0.68, 0.5, 0.72, 0.45].map((h, i) => (
                <div
                  key={i}
                  className="w-full rounded-t bg-primary/40"
                  style={{ height: `${h * 100}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-2 w-2 rounded-full bg-primary/30" />
              ))}
            </div>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/55 backdrop-blur-[1px]">
            <Lock className="h-8 w-8 text-primary" aria-hidden />
            <p className="text-center text-sm font-medium">Full mastery map locked</p>
          </div>
        </div>

        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Map className="h-4 w-4 shrink-0 text-primary" />
            <span>Full interactive map for every concept in this subject</span>
          </li>
          <li className="flex items-center gap-2">
            <Zap className="h-4 w-4 shrink-0 text-primary" />
            <span>Unlimited missions targeting your weak nodes</span>
          </li>
          <li className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0 text-primary" />
            <span>Advanced insights and progress analytics</span>
          </li>
        </ul>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button className="gap-2 sm:min-w-[200px]" onClick={handleUpgrade} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Upgrade to Pro — ${PRO_PRICE_MONTHLY.toFixed(2)}/mo
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/mastery-map?subject=${subjectId}`}>Preview limited map</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
