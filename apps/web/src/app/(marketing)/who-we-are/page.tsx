import type { Metadata } from "next";
import { DuoWhoWeAre } from "@/features/marketing/duo-who-we-are";

export const metadata: Metadata = {
  title: "Who we are",
  description:
    "Meet the team behind MindOrbit—educators, engineers, and learning scientists building the Cognitive Operating System for durable understanding in the AI era.",
};

export default function WhoWeArePage() {
  return <DuoWhoWeAre />;
}
