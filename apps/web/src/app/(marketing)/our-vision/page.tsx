import type { Metadata } from "next";
import { DuoOurVision } from "@/features/marketing/duo-our-vision";

export const metadata: Metadata = {
  title: "Our vision",
  description:
    "MindOrbit is building the Cognitive Operating System for the AI era—mapping understanding, diagnosing gaps in reasoning, and developing durable intelligence at scale.",
};

export default function OurVisionPage() {
  return <DuoOurVision />;
}
