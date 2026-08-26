import type { Metadata } from "next";
import { InteractivesLanding } from "@/features/marketing/interactives/interactives-landing";
import { defaultOgImages, defaultTwitterImages } from "@/lib/og-defaults";

export const metadata: Metadata = {
  title: { absolute: "Interactive Catalog — Learn by doing | MindOrbit" },
  description:
    "Browse 21+ hands-on interactives across math, physics, biology, and chemistry. Drag, plot, sort, and experiment — Brilliant-style learning with instant feedback. No login required.",
  openGraph: {
    title: "Interactive Catalog — Learn by doing | MindOrbit",
    description:
      "Browse 21+ hands-on interactives across math, physics, biology, and chemistry. Drag, plot, sort, and experiment — Brilliant-style learning with instant feedback.",
    url: "/interactives",
    images: defaultOgImages,
  },
  twitter: {
    title: "Interactive Catalog — Learn by doing | MindOrbit",
    description:
      "Browse 21+ hands-on interactives across math, physics, biology, and chemistry. Drag, plot, sort, and experiment — Brilliant-style learning with instant feedback.",
    images: defaultTwitterImages,
  },
};

export default function InteractivesPage() {
  return <InteractivesLanding />;
}
