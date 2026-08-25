import type { ReactNode } from "react";
import { DuoLandingFooter } from "@/features/marketing/duo-landing-footer";
import { DuoLandingHeader } from "@/features/marketing/duo-landing-header";

export function BlogShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[hsl(var(--duo-gold)_/_0.25)] blur-3xl" />
        <div className="absolute -right-16 top-40 h-64 w-64 rounded-full bg-[hsl(var(--duo-blue)_/_0.2)] blur-3xl" />
        <div className="absolute bottom-32 left-1/3 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <DuoLandingHeader />
      <main>{children}</main>
      <DuoLandingFooter />
    </div>
  );
}
