import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@mindorbit/ui";
import { Check, Sparkles } from "lucide-react";

const FREE_MARKETING = [
  "Skill diagnostic",
  "Explore the map (limited topics)",
  "Practice sessions (limited)",
] as const;

const PRO_MARKETING = [
  "Full mastery map across your subject",
  "Unlimited training missions",
  "Deeper progress and insights",
] as const;

export function LandingPricingSection({ proPrice }: { proPrice: number }) {
  return (
    <section
      id="pricing"
      className="scroll-mt-24 border-y border-white/[0.06] bg-gradient-to-b from-zinc-950/80 to-background py-20 sm:py-28"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Simple. Transparent.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Try the diagnostic free. Upgrade when you are ready for the full path and unlimited practice.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
          <Card className="border-white/[0.08] bg-card/40 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Free</CardTitle>
              <CardDescription>Get clarity on what to learn first</CardDescription>
              <p className="text-2xl font-bold">
                $0
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {FREE_MARKETING.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full border-white/15 bg-transparent">
                <Link href="/auth/signup">Start Free Diagnostic</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="relative border-2 border-primary/40 bg-primary/[0.06] shadow-xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
              Pro
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                Pro
              </CardTitle>
              <CardDescription>Unlimited depth for serious learners</CardDescription>
              <p className="text-2xl font-bold">
                ${proPrice.toFixed(2)}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Annual billing available in-app with a discount.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {PRO_MARKETING.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full">
                <Link href="/auth/signup">Upgrade to Pro</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
