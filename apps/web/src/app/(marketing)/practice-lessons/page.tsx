import type { Metadata } from "next";
import { PracticeLessonsLanding } from "@/features/marketing/practice-lessons-landing";
import { defaultOgImages, defaultTwitterImages } from "@/lib/og-defaults";

export const metadata: Metadata = {
  title: { absolute: "Interactive Practice Lessons — Learn by doing | MindOrbit" },
  description:
    "Ten free hands-on practice lessons in physics, biology, chemistry, and math. No login required — drag, plot, and model concepts, then prove mastery with visual checkpoints.",
  openGraph: {
    title: "Interactive Practice Lessons — Learn by doing | MindOrbit",
    description:
      "Ten free hands-on practice lessons in physics, biology, chemistry, and math. No login required — drag, plot, and model concepts, then prove mastery with visual checkpoints.",
    url: "/practice-lessons",
    images: defaultOgImages,
  },
  twitter: {
    title: "Interactive Practice Lessons — Learn by doing | MindOrbit",
    description:
      "Ten free hands-on practice lessons in physics, biology, chemistry, and math. No login required — drag, plot, and model concepts, then prove mastery with visual checkpoints.",
    images: defaultTwitterImages,
  },
};

export default function PracticeLessonsPage() {
  return <PracticeLessonsLanding />;
}
