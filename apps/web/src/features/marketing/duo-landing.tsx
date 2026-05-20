import { DuoLandingFaqSection } from "./duo-landing-faq-section";
import { DuoLandingFinalCta } from "./duo-landing-final-cta";
import { DuoLandingFooter } from "./duo-landing-footer";
import { DuoLandingHeader } from "./duo-landing-header";
import { DuoLandingHero } from "./duo-landing-hero";
import { DuoLandingHowSection } from "./duo-landing-how-section";
import { DuoLandingOutcomesSection } from "./duo-landing-outcomes-section";
import { DuoLandingPricingSection } from "./duo-landing-pricing-section";
import { DuoLandingSeeItSection } from "./duo-landing-see-it-section";
import { DuoLandingSocialProof } from "./duo-landing-social-proof";
import { DuoLandingStickyCta } from "./duo-landing-sticky-cta";
import { DuoLandingStruggleSection } from "./duo-landing-struggle-section";
import { DuoLandingSubjectsSection } from "./duo-landing-subjects-section";

export function DuoLanding() {
  return (
    <div className="min-h-screen overflow-x-hidden pb-20 md:pb-0">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[hsl(var(--duo-gold)_/_0.25)] blur-3xl" />
        <div className="absolute -right-16 top-40 h-64 w-64 rounded-full bg-[hsl(var(--duo-blue)_/_0.2)] blur-3xl" />
        <div className="absolute bottom-32 left-1/3 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <DuoLandingHeader />
      <DuoLandingStickyCta />

      <main>
        <DuoLandingHero />
        <DuoLandingStruggleSection />
        <DuoLandingSeeItSection />
        <DuoLandingHowSection />
        <DuoLandingSubjectsSection />
        <DuoLandingOutcomesSection />
        <DuoLandingSocialProof />
        <DuoLandingPricingSection />
        <DuoLandingFaqSection />
        <DuoLandingFinalCta />
      </main>

      <DuoLandingFooter />
    </div>
  );
}
