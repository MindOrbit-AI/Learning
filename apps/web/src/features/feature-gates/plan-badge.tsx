"use client";

import { Sparkles } from "lucide-react";

export function PlanBadge({ plan }: { plan: "FREE" | "PRO" }) {
  if (plan === "PRO") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-sm font-semibold text-primary">
        <Sparkles className="h-3.5 w-3.5" />
        Pro
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
      Free
    </span>
  );
}
