import type { Metadata } from "next";
import { ConversionLanding } from "@/features/marketing/conversion-landing";

export const metadata: Metadata = {
  title: { absolute: "MindOrbit — Build a mind that compounds" },
  description:
    "Find your child’s exact learning gaps in 15 minutes — not months of trial-and-error tutoring. MindOrbit Diagnostic™ with a clear roadmap.",
  openGraph: {
    title: "MindOrbit — Build a mind that compounds",
    description:
      "Find your child’s exact learning gaps in 15 minutes — not months of trial-and-error tutoring. MindOrbit Diagnostic™ with a clear roadmap.",
    url: "/",
  },
  twitter: {
    title: "MindOrbit — Build a mind that compounds",
    description:
      "Find your child’s exact learning gaps in 15 minutes — not months of trial-and-error tutoring. MindOrbit Diagnostic™ with a clear roadmap.",
  },
};

export default function LandingPage() {
  return <ConversionLanding />;
}
