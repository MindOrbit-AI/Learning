import type { GenerateSongDifficulty, LlmMusicPayload, MusicLearningAsset } from "../models/types.js";

const STYLE_SET = new Set(["hip-hop", "trap", "lo-fi"]);
const TONE_SET = new Set(["emotional", "uplifting", "calm"]);

function clampBpm(n: number): number {
  if (Number.isNaN(n)) return 100;
  return Math.min(140, Math.max(90, Math.round(n)));
}

function normalizeStyle(s: string): string {
  const v = s.trim().toLowerCase();
  if (STYLE_SET.has(v)) return v;
  if (v.includes("trap")) return "trap";
  if (v.includes("lo-fi") || v.includes("lofi")) return "lo-fi";
  return "hip-hop";
}

function normalizeTone(s: string): string {
  const v = s.trim().toLowerCase();
  if (TONE_SET.has(v)) return v;
  if (v.includes("calm")) return "calm";
  if (v.includes("lift")) return "uplifting";
  return "emotional";
}

function normalizeLines(lines: unknown): string[] {
  if (!Array.isArray(lines)) return [];
  return lines
    .map((l) => (typeof l === "string" ? l.trim() : String(l)))
    .filter((l) => l.length > 0);
}

export function normalizeLlmPayload(
  raw: LlmMusicPayload,
  conceptId: string,
  difficulty: GenerateSongDifficulty
): MusicLearningAsset {
  const verse = typeof raw.rap?.verse === "string" ? raw.rap.verse.trim() : "";
  const hook = typeof raw.rap?.hook === "string" ? raw.rap.hook.trim() : "";
  const bpm = clampBpm(Number(raw.rap?.bpm));
  const style = normalizeStyle(typeof raw.rap?.style === "string" ? raw.rap.style : "hip-hop");

  const chantLines = normalizeLines(raw.chant?.lines);
  const rhythmPattern =
    typeof raw.chant?.rhythmPattern === "string" && raw.chant.rhythmPattern.trim()
      ? raw.chant.rhythmPattern.trim()
      : "clap-rest-clap";

  const lyrics = typeof raw.melody?.lyrics === "string" ? raw.melody.lyrics.trim() : "";
  const tone = normalizeTone(typeof raw.melody?.tone === "string" ? raw.melody.tone : "uplifting");

  const boost =
    typeof raw.reinforcement?.boost === "string" && raw.reinforcement.boost.trim()
      ? raw.reinforcement.boost.trim()
      : difficulty === "beginner"
        ? "5-minute recall: read the hook aloud three times, then close the book and repeat."
        : "5-minute drill: write the hook from memory, check, repeat twice.";

  const recall =
    typeof raw.reinforcement?.recall === "string" && raw.reinforcement.recall.trim()
      ? raw.reinforcement.recall.trim()
      : hook.slice(0, 80) || `Lock in: ${conceptId.slice(0, 8)}…`;

  return {
    conceptId,
    rap: { verse: verse || hook, hook: hook || verse, bpm, style },
    chant: {
      lines: chantLines.length ? chantLines : [hook || verse || "Repeat the core idea."],
      rhythmPattern,
    },
    melody: {
      lyrics: lyrics || hook || verse,
      tone,
    },
    reinforcement: { boost, recall },
  };
}
