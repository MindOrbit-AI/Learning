import type { Metadata } from "next";
import { DuoWhoWeAre } from "@/features/marketing/duo-who-we-are";

export const metadata: Metadata = {
  title: "Who we are",
  description:
    "Meet MindOrbit—built for students who want clear next steps, honest diagnostics, and practice that respects their time.",
};

export default function WhoWeArePage() {
  return <DuoWhoWeAre />;
}
