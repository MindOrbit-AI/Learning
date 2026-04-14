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
import {
  FREE_FEATURES,
  PRO_FEATURES,
  PRICING_COMPARISON_ROWS,
} from "@/features/pricing/pricing-data";

export function LandingPricingSection({ proPrice }: { proPrice: number }) {
  return (
    <section
      id="pricing"
      className="scroll-mt-24 border-y bg-gradient-to-b from-muted/30 to-background py-20 sm:py-28"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Start free. Scale when you are ready.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Same plans you see in the app—no surprises. Upgrade to Pro anytime for unlimited
            diagnostics, missions, and the full mastery map.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
          <Card className="border-2 border-muted shadow-sm transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Free</CardTitle>
              <CardDescription>Core learning loops for every student</CardDescription>
              <p className="text-2xl font-bold">
                $0
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/signup">Start free</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="relative border-2 border-primary bg-primary/[0.04] shadow-md">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
              Most popular
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                Pro
              </CardTitle>
              <CardDescription>Everything unlocked for serious mastery</CardDescription>
              <p className="text-2xl font-bold">
                ${proPrice.toFixed(2)}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full">
                <Link href="/auth/signup">Create account</Link>
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                After signup, upgrade to Pro from Billing or the Pricing page in the app.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border-2 border-primary/15 bg-card shadow-sm">
          <div className="border-b bg-muted/40 px-6 py-4">
            <h3 className="font-semibold">Compare plans</h3>
          </div>
          <div className="overflow-x-auto px-4 py-2 sm:px-6">
            <table className="w-full min-w-[320px] text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-3 pr-4 font-medium">Feature</th>
                  <th className="py-3 px-2 text-center font-medium">Free</th>
                  <th className="py-3 pl-2 text-center font-medium">Pro</th>
                </tr>
              </thead>
              <tbody>
                {PRICING_COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} className="border-b border-border/60 last:border-0">
                    <td className="py-3 pr-4">{row.feature}</td>
                    <td className="px-2 py-3 text-center text-muted-foreground">{row.free}</td>
                    <td className="px-2 py-3 text-center">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
