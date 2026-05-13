import type { Metadata } from "next";
import { BiologyQuizClient } from "@/features/biology-quiz/biology-quiz-client";

export const metadata: Metadata = {
  title: "Biology Quiz — Junior Biologist",
  description:
    "Interactive middle school quiz on cells, photosynthesis, and classification — three difficulty levels with a nature-themed growing plant progress tracker.",
  openGraph: {
    title: "MindOrbit — Biology Nature Lab Quiz",
    description:
      "Grow your plant from 🌱 to 🌳 as you master cell structure, photosynthesis, and animal classification.",
    url: "/biology-quiz",
  },
};

export default function BiologyQuizPage() {
  return <BiologyQuizClient />;
}
