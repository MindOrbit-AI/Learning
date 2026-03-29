"use client";

import Link from "next/link";
import { Button } from "@mindorbit/ui";
import { Sparkles } from "lucide-react";

export function UpgradeBanner({ message }: { message?: string }) {
  return (
    <div className="rounded-2xl border-2 border-primary/30 bg-primary/10 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-medium">
          {message ?? "Upgrade to Pro to unlock unlimited access and advanced features."}
        </p>
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
