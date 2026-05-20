"use client";

import { ArrowRight } from "lucide-react";
import { DuoPrimaryLink } from "./duo-primary-link";

/** Mobile-only sticky bar so the primary CTA stays reachable while scrolling. */
export function DuoLandingStickyCta() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
      role="region"
      aria-label="Quick action"
    >
      <DuoPrimaryLink href="/try-diagnostic" className="h-12 w-full min-w-0 text-xs sm:text-sm">
        Run free diagnostic
        <ArrowRight className="h-4 w-4" aria-hidden />
      </DuoPrimaryLink>
    </div>
  );
}

