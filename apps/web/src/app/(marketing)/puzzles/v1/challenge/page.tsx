import type { Metadata } from "next";
import { PhaseAChallengeFlow } from "@/features/challenge/phase-a-challenge-flow";

export const metadata: Metadata = {
  title: "Battle mode (demo)",
  description:
    "Pick a challenge, get matched with a practice opponent, and try a listening question—Phase A demo with no live multiplayer.",
  robots: { index: false, follow: false },
};

export default function ChallengeDemoPage() {
  return <PhaseAChallengeFlow />;
}
