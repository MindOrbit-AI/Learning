"use client";

import Link from "next/link";
import { Button } from "@mindorbit/ui";
import { Lock, Sparkles } from "lucide-react";

export function LockedFeatureOverlay({
  title,
  message,
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-background/90 backdrop-blur-sm">
      <div className="rounded-full bg-muted p-4">
        <Lock className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="mt-4 font-semibold">{title ?? "Pro feature"}</p>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        {message ?? "Upgrade to Pro to unlock"}
      </p>
      <Button asChild className="mt-4 gap-2">
        <Link href="/pricing">
          <Sparkles className="h-4 w-4" />
          Upgrade to Pro
        </Link>
      </Button>
    </div>
  );
}
