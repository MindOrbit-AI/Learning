import type { Metadata } from "next";
import { DuoLanding } from "@/features/marketing/duo-landing";
import { defaultOgImages, defaultTwitterImages } from "@/lib/og-defaults";

export const metadata: Metadata = {
  title: { absolute: "MindOrbit — Find the gap before the test does" },
  description:
    "Free ~5-minute diagnostic for grades 6–12. See learning gaps, how topics connect, and what to study first—no signup on the try flow.",
  openGraph: {
    title: "MindOrbit — Find the gap before the test does",
    description:
      "Free ~5-minute diagnostic for grades 6–12. See learning gaps, how topics connect, and what to study first—no signup on the try flow.",
    url: "/",
    images: defaultOgImages,
  },
  twitter: {
    title: "MindOrbit — Find the gap before the test does",
    description:
      "Free ~5-minute diagnostic for grades 6–12. See learning gaps, how topics connect, and what to study first—no signup on the try flow.",
    images: defaultTwitterImages,
  },
};

export default function LandingPage() {
  return <DuoLanding />;
}
