import type { Metadata } from "next";
import { DuoOurVision } from "@/features/marketing/duo-our-vision";

export const metadata: Metadata = {
  title: "Our vision",
  description:
    "See what's missing. Fix that — not everything. MindOrbit maps what your child knows, surfaces gaps and misconceptions, and routes them through a seven-stage learning loop that updates every time they practice.",
};

export default function OurVisionPage() {
  return <DuoOurVision />;
}
