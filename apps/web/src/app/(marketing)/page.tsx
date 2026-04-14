import Link from "next/link";
import { Button } from "@mindorbit/ui";
import {
  Brain,
  Target,
  Zap,
  Users,
  ArrowRight,
  Sparkles,
  LineChart,
} from "lucide-react";
import { PRO_PRICE_MONTHLY } from "@mindorbit/lib";
import { LandingPricingSection } from "@/features/marketing/landing-pricing-section";

const FEATURES = [
  {
    icon: Target,
    title: "Diagnostic first",
    desc: "Short assessments pinpoint gaps so you never study what you already know.",
  },
  {
    icon: Brain,
    title: "Mastery map",
    desc: "See concepts as a graph—prerequisites, strength, and what to tackle next.",
  },
  {
    icon: Zap,
    title: "Learning missions",
    desc: "AI-generated missions target weak nodes and keep streaks meaningful.",
  },
  {
    icon: Users,
    title: "Community notes",
    desc: "Node-linked resources from the community, right where you need them.",
  },
  {
    icon: LineChart,
    title: "Insights (Pro)",
    desc: "Deeper analytics on progress, clusters, and where time pays off most.",
  },
  {
    icon: Sparkles,
    title: "Built for depth",
    desc: "From first diagnostic to mastery—one system instead of scattered tools.",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-[520px] w-[720px] rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute -right-1/4 top-40 h-[480px] w-[640px] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-px w-1/3 bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      </div>

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
          <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
              <Brain className="h-5 w-5 text-primary" />
            </span>
            MindOrbit Learn
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#pricing" className="transition-colors hover:text-foreground">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/auth/signin" className="hidden sm:block">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="gap-1.5">
                Get started
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 pb-16 pt-12 sm:pb-24 sm:pt-16 md:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Diagnose · Map · Master
            </p>
            <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl md:leading-[1.1]">
              Your{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-primary/65 bg-clip-text text-transparent">
                cognitive mastery
              </span>{" "}
              network
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Go beyond static notes. Run quick diagnostics, explore your mastery map, and follow
              AI-powered missions—so every study session moves the needle.
            </p>
            <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link href="/auth/signup" className="sm:flex-initial">
                <Button size="lg" className="h-12 w-full gap-2 px-8 sm:w-auto">
                  Start free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#pricing">
                <Button variant="outline" size="lg" className="h-12 w-full sm:w-auto">
                  View pricing
                </Button>
              </a>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Free tier includes core diagnostics and missions. Pro from{" "}
              <span className="font-medium text-foreground">
                ${PRO_PRICE_MONTHLY.toFixed(2)}/mo
              </span>{" "}
              for unlimited depth.
            </p>
          </div>
        </section>

        <section
          id="features"
          className="scroll-mt-24 border-y bg-muted/25 py-16 sm:py-24"
        >
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything in one learning loop
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                From the first diagnostic to long-term retention—MindOrbit connects the dots.
              </p>
            </div>
            <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="group rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all hover:border-primary/25 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold leading-snug">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <LandingPricingSection proPrice={PRO_PRICE_MONTHLY} />

        <section className="container mx-auto px-4 py-20 sm:py-28">
          <div className="relative overflow-hidden rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background px-6 py-14 text-center sm:px-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
            <h2 className="relative text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to map what you actually know?
            </h2>
            <p className="relative mx-auto mt-3 max-w-lg text-muted-foreground">
              Create a free account in minutes. Upgrade when you want the full map and unlimited
              missions.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/auth/signup">
                <Button size="lg" className="h-12 min-w-[200px] gap-2">
                  Create free account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="outline" size="lg" className="h-12 min-w-[140px]">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 text-center text-sm text-muted-foreground sm:flex-row sm:text-left">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Brain className="h-5 w-5 text-primary" />
            MindOrbit Learn
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <a href="#pricing" className="hover:text-foreground">
              Pricing
            </a>
            <Link href="/auth/signin" className="hover:text-foreground">
              Sign in
            </Link>
          </div>
          <p>© {new Date().getFullYear()} MindOrbit Learn</p>
        </div>
      </footer>
    </div>
  );
}
