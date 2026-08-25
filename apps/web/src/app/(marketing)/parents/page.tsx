import type { Metadata } from "next";
import { DuoParentsLanding } from "@/features/marketing/duo-parents-landing";
import { defaultOgImages, defaultTwitterImages } from "@/lib/og-defaults";

export const metadata: Metadata = {
  title: { absolute: "MindOrbit for Parents — Find what's holding your child back" },
  description:
    "Free five-minute Learning Gap Scan for grades 6–8. Discover hidden gaps, see how topics connect, and get a personalized mastery path—no credit card required.",
  openGraph: {
    title: "MindOrbit for Parents — Find what's holding your child back",
    description:
      "Free five-minute Learning Gap Scan for grades 6–8. Discover hidden gaps, see how topics connect, and get a personalized mastery path—no credit card required.",
    url: "/parents",
    images: defaultOgImages,
  },
  twitter: {
    title: "MindOrbit for Parents — Find what's holding your child back",
    description:
      "Free five-minute Learning Gap Scan for grades 6–8. Discover hidden gaps, see how topics connect, and get a personalized mastery path—no credit card required.",
    images: defaultTwitterImages,
  },
};

export default function ParentsPage() {
  return <DuoParentsLanding />;
}
