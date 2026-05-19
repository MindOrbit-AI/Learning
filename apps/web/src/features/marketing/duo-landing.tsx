import { DuoLandingFinalCta } from "./duo-landing-final-cta";
import { DuoLandingFooter } from "./duo-landing-footer";
import { DuoLandingHeader } from "./duo-landing-header";
import { DuoLandingHero } from "./duo-landing-hero";
import { DuoLandingOutcomesSection } from "./duo-landing-outcomes-section";
import { DuoLandingHowSection } from "./duo-landing-how-section";
import { DuoLandingPricingSection } from "./duo-landing-pricing-section";
import { DuoLandingQuoteSection } from "./duo-landing-quote-section";
import { DuoLandingStruggleSection } from "./duo-landing-struggle-section";

export function DuoLanding() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[hsl(var(--duo-gold)_/_0.25)] blur-3xl" />
        <div className="absolute -right-16 top-40 h-64 w-64 rounded-full bg-[hsl(var(--duo-blue)_/_0.2)] blur-3xl" />
        <div className="absolute bottom-32 left-1/3 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <DuoLandingHeader />

      <main>
        <DuoLandingHero />
        <DuoLandingStruggleSection />
        <DuoLandingOutcomesSection />
        <DuoLandingHowSection />
        <DuoLandingQuoteSection />
        <DuoLandingPricingSection />
        <DuoLandingFinalCta />
      </main>

      <DuoLandingFooter />
    </div>
  );
}
