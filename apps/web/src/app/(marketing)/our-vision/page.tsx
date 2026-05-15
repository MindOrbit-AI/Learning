import type { Metadata } from "next";
import { DuoOurVision } from "@/features/marketing/duo-our-vision";

export const metadata: Metadata = {
  title: "Our vision",
  description:
    "MindOrbit is the Cognitive Operating System for the next generation—mapping understanding, closing reasoning gaps, and building durable intelligence.",
};

export default function OurVisionPage() {
  return <DuoOurVision />;
}
