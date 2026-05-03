import type { MissionSceneData } from "@mindorbit/types";
import { inferNumericTarget } from "@/features/visual-problem-solving/numberLineBounds";

function wantsDnaBasePairingTask(stem: string): boolean {
  const s = stem.toLowerCase();
  if (!/\bdna\b/.test(s)) return false;
  if (
    /\b(base\s*pairs?|pair\s+(the\s+)?bases|complementary\s+base|nitrogenous\s+bases)\b/.test(s)
  ) {
    return true;
  }
  if (/\badenine\b/.test(s) && /\bthymine\b/.test(s) && /\bcytosine\b/.test(s) && /\bguanine\b/.test(s)) {
    return true;
  }
  return false;
}

function parseSceneAnswerString(scene: MissionSceneData): string {
  if (!scene.correctAnswerJson?.trim()) return "";
  try {
    const p = JSON.parse(scene.correctAnswerJson) as unknown;
    if (typeof p === "string" || typeof p === "number") return String(p).trim();
    if (p && typeof p === "object" && !Array.isArray(p)) {
      const o = p as { answer?: unknown; text?: unknown };
      if (typeof o.answer === "string") return o.answer.trim();
      if (typeof o.text === "string") return o.text.trim();
      if (typeof o.answer === "number") return String(o.answer);
    }
  } catch {
    /* ignore */
  }
  return "";
}

/**
 * LLMs often emit tap-to-shade part_model for DNA complementary pairing. Replace with
 * `base_pair_select` so learners pair A↔T and C↔G explicitly.
 */
export function coerceDnaBasePairVisualWorkspace(
  content: Record<string, unknown>,
  scene: MissionSceneData
): { content: Record<string, unknown>; coerced: boolean } {
  const vw = (content.visualWorkspace ?? {}) as Record<string, unknown>;
  const vk = String(vw.kind ?? "part_model");
  if (vk !== "part_model" && vk !== "fraction_bar" && vk !== "pizza_model" && vk !== "area_model") {
    return { content, coerced: false };
  }

  const stem = [content.problemScenario, content.finalPrompt, scene.prompt, scene.title]
    .map((x) => String(x ?? ""))
    .join(" ");
  if (!wantsDnaBasePairingTask(stem)) return { content, coerced: false };

  const rawAns = parseSceneAnswerString(scene);
  const n = inferNumericTarget(rawAns.trim());
  // Four distinct bases → two complementary pairs; other numeric targets may be ladder-length drills.
  if (n != null && n !== 2) return { content, coerced: false };

  return {
    content: {
      ...content,
      visualWorkspace: {
        kind: "base_pair_select",
        tokens: [
          { id: "b0", label: "A" },
          { id: "b1", label: "T" },
          { id: "b2", label: "C" },
          { id: "b3", label: "G" },
        ],
        requiredCorrectPairs: 2,
      },
    },
    coerced: true,
  };
}

/** After DNA coercion, drop stale part_model from merged correct so build uses workspace kind. */
export function correctPayloadForDnaBasePairCoercion(
  scene: MissionSceneData,
  vpContent: Record<string, unknown>
): { answer: string } {
  let a = parseSceneAnswerString(scene).trim();
  if (!a) a = String(vpContent.expectedAnswer ?? "2").trim();
  if (!a) a = "2";
  return { answer: a };
}
