import Link from "next/link";
import { ArrowRight, Brain } from "lucide-react";
import { Button } from "@mindorbit/ui";
import { DuoPrimaryLink } from "./duo-primary-link";

export function DuoLandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-4 sm:h-[4.25rem]">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-lg font-extrabold tracking-tight text-foreground"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 ring-2 ring-primary/25">
            <Brain className="h-5 w-5 text-primary" strokeWidth={2.5} />
          </span>
          MindOrbit
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-bold text-muted-foreground md:flex">
          <a href="#why" className="transition-colors hover:text-foreground">
            Why MindOrbit
          </a>
          <a href="#how" className="transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#pricing" className="transition-colors hover:text-foreground">
            Pricing
          </a>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/auth/signin"
            className="hidden text-sm font-bold text-[hsl(var(--duo-blue))] underline decoration-2 underline-offset-4 hover:opacity-90 sm:inline"
          >
            I HAVE AN ACCOUNT
          </Link>
          <div className="hidden sm:block">
            <DuoPrimaryLink href="/auth/signup">
              Get started
              <ArrowRight className="h-4 w-4" />
            </DuoPrimaryLink>
          </div>
          <Link href="/auth/signup" className="sm:hidden">
            <Button
              size="sm"
              className="h-11 rounded-2xl border-b-4 border-[#43a005] bg-[#58cc02] px-4 text-xs font-extrabold uppercase text-white hover:bg-[#58cc02] hover:brightness-105"
            >
              Start
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
