"use client";

import Link from "next/link";
import { Button } from "@mindorbit/ui";
import { AlertCircle, Sparkles } from "lucide-react";

export function UsageLimitBanner({
  message,
  feature,
}: {
  message: string;
  feature?: string;
}) {
  return (
    <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/50">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="font-medium text-amber-900 dark:text-amber-100">{message}</p>
            {feature && (
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                Upgrade to Pro for unlimited {feature}
              </p>
            )}
          </div>
        </div>
        <Button asChild size="sm" className="shrink-0 gap-2">
          <Link href="/pricing">
            <Sparkles className="h-4 w-4" />
            Upgrade
          </Link>
        </Button>
      </div>
    </div>
  );
}
