import type { Metadata } from "next";
import { DuoLanding } from "@/features/marketing/duo-landing";
import { defaultOgImages, defaultTwitterImages } from "@/lib/og-defaults";

export const metadata: Metadata = {
  title: { absolute: "MindOrbit — See how you actually think (grades 6–12)" },
  description:
    "Free 5-minute diagnostic for middle and high school students. Find learning gaps, fix weak foundations, and get a clear path to mastery.",
  openGraph: {
    title: "MindOrbit — See how you actually think (grades 6–12)",
    description:
      "Free 5-minute diagnostic for middle and high school students. Find learning gaps, fix weak foundations, and get a clear path to mastery.",
    url: "/",
    images: defaultOgImages,
  },
  twitter: {
    title: "MindOrbit — See how you actually think (grades 6–12)",
    description:
      "Free 5-minute diagnostic for middle and high school students. Find learning gaps, fix weak foundations, and get a clear path to mastery.",
    images: defaultTwitterImages,
  },
};

export default function LandingPage() {
  return <DuoLanding />;
}
