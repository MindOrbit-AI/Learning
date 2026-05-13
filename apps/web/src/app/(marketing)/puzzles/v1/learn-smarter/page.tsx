import type { Metadata } from "next";
import { ConversionLanding } from "@/features/marketing/conversion-landing";
import { defaultOgImages, defaultTwitterImages } from "@/lib/og-defaults";

export const metadata: Metadata = {
  title: { absolute: "MindOrbit — Build a mind that compounds" },
  description:
    "Find your child’s exact learning gaps in 15 minutes — not months of trial-and-error tutoring. MindOrbit Diagnostic™ with a clear roadmap.",
  openGraph: {
    title: "MindOrbit — Build a mind that compounds",
    description:
      "Find your child’s exact learning gaps in 15 minutes — not months of trial-and-error tutoring. MindOrbit Diagnostic™ with a clear roadmap.",
    url: "/",
    images: defaultOgImages,
  },
  twitter: {
    title: "MindOrbit — Build a mind that compounds",
    description:
      "Find your child’s exact learning gaps in 15 minutes — not months of trial-and-error tutoring. MindOrbit Diagnostic™ with a clear roadmap.",
    images: defaultTwitterImages,
  },
};

export default function LandingPage() {
  return <ConversionLanding />;
}
