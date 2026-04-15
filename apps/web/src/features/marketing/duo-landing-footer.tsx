import Link from "next/link";
import { Brain } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

export function DuoLandingFooter() {
  return (
    <footer className="border-t-2 border-border bg-secondary/30 py-10">
      <ScrollReveal className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 text-center text-sm font-semibold text-muted-foreground sm:flex-row sm:text-left">
        <div className="flex items-center gap-2 font-extrabold text-foreground">
          <Brain className="h-5 w-5 text-primary" strokeWidth={2.5} />
          MindOrbit
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a href="#why" className="hover:text-foreground">
            Why MindOrbit
          </a>
          <a href="#how" className="hover:text-foreground">
            How it works
          </a>
          <a href="#pricing" className="hover:text-foreground">
            Pricing
          </a>
          <Link href="/auth/signin" className="hover:text-foreground">
            Sign in
          </Link>
        </div>
        <p>© {new Date().getFullYear()} MindOrbit</p>
      </ScrollReveal>
    </footer>
  );
}
