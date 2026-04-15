import type { Metadata } from "next";
import { DuoLanding } from "@/features/marketing/duo-landing";

export const metadata: Metadata = {
  title: { absolute: "MindOrbit — Learn smarter, step by step" },
  description:
    "Free diagnostic, a clear mastery map, and practice that targets your weak spots—like a game, but your progress is real.",
  openGraph: {
    title: "MindOrbit — Learn smarter, step by step",
    description:
      "Free diagnostic, a clear mastery map, and practice that targets your weak spots—like a game, but your progress is real.",
    url: "/",
  },
  twitter: {
    title: "MindOrbit — Learn smarter, step by step",
    description:
      "Free diagnostic, a clear mastery map, and practice that targets your weak spots—like a game, but your progress is real.",
  },
};

export default function LandingPage() {
  return <DuoLanding />;
}
