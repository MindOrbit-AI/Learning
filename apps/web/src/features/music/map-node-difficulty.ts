import type { GenerateSongDifficulty } from "./types";

/** Maps DB ConceptNode.difficulty strings to music generation tiers. */
export function mapNodeDifficultyToSong(raw: string): GenerateSongDifficulty {
  const d = raw.toLowerCase();
  if (d === "easy" || d === "low" || d === "beginner") return "beginner";
  if (d === "hard" || d === "high" || d === "advanced") return "advanced";
  return "intermediate";
}
