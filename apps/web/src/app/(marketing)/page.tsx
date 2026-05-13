import type { Metadata } from "next";
import { DuoLanding } from "@/features/marketing/duo-landing";
import { defaultOgImages, defaultTwitterImages } from "@/lib/og-defaults";

export const metadata: Metadata = {
  title: { absolute: "MindOrbit — We engineer how your brain learns." },
  description:
    "Free diagnostic, a clear mastery map, and practice that targets your weak spots—like a game, but your progress is real.",
  openGraph: {
    title: "MindOrbit — We engineer how your brain learns.",
    description:
      "Free diagnostic, a clear mastery map, and practice that targets your weak spots—like a game, but your progress is real.",
    url: "/",
    images: defaultOgImages,
  },
  twitter: {
    title: "MindOrbit — We engineer how your brain learns.",
    description:
      "Free diagnostic, a clear mastery map, and practice that targets your weak spots—like a game, but your progress is real.",
    images: defaultTwitterImages,
  },
};

export default function LandingPage() {
  return <DuoLanding />;
}
