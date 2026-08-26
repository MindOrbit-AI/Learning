import Link from "next/link";
import { ArrowRight, BookOpen, Users } from "lucide-react";
import { MasteryMapVisual } from "./mastery-map-visual";
import { DuoPrimaryLink } from "./duo-primary-link";
import { ScrollReveal } from "./scroll-reveal";

const PATHS = [
  {
    href: "/practice-lessons",
    icon: BookOpen,
    title: "Practice lessons",
    detail: "10 free interactive lessons",
  },
  {
    href: "/parents",
    icon: Users,
    title: "For parents",
    detail: "Track gaps & progress",
  },
] as const;

export function DuoLandingHero() {
  return (
    <section className="relative border-b border-border/60 bg-background pb-14 pt-12 sm:pb-20 sm:pt-16">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
          <ScrollReveal className="min-w-0">
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
              Find the gap before the test does
            </h1>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground sm:text-xl">
              A free diagnostic shows what&apos;s weak, how topics connect, and what to study first.
            </p>

            <div className="mt-8">
              <DuoPrimaryLink href="/try-diagnostic">
                Start free diagnostic
                <ArrowRight className="h-4 w-4" />
              </DuoPrimaryLink>
              <p className="mt-3 text-sm text-muted-foreground">
                No account required · results on the next screen
              </p>
            </div>

            <nav
              className="mt-10 grid gap-3 sm:grid-cols-2 sm:max-w-md"
              aria-label="Explore MindOrbit"
            >
              {PATHS.map(({ href, icon: Icon, title, detail }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex flex-col rounded-2xl border border-border/80 bg-card/50 px-4 py-3.5 transition hover:border-primary/30 hover:bg-card"
                >
                  <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <Icon
                      className="h-4 w-4 shrink-0 text-primary"
                      strokeWidth={2.25}
                      aria-hidden
                    />
                    {title}
                    <ArrowRight
                      className="ml-auto h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-60"
                      aria-hidden
                    />
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">{detail}</span>
                </Link>
              ))}
            </nav>

            <p className="mt-8 text-sm text-muted-foreground">
              Already learning with us?{" "}
              <Link
                href="/auth/signin"
                className="font-semibold text-[hsl(var(--duo-blue))] underline decoration-2 underline-offset-2 hover:opacity-90"
              >
                Sign in
              </Link>
            </p>
          </ScrollReveal>

          <ScrollReveal className="relative mx-auto w-full min-w-0 max-w-md lg:max-w-none" delay={0.08}>
            <MasteryMapVisual variant="hero" />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
