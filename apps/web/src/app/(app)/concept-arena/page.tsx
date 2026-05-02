import { ConceptArenaClient } from "@/features/concept-arena/concept-arena-client";

export const metadata = {
  title: "Concept Battle Arena | MindOrbit",
  description: "Real-time concept duels with mastery-aware questions.",
};

export default function ConceptArenaPage() {
  return <ConceptArenaClient />;
}
