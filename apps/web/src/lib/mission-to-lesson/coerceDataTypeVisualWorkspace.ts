import type { MissionSceneData } from "@mindorbit/types";

type TypeEntry = { id: string; label: string; aliases: string[] };

const TYPE_ENTRIES: TypeEntry[] = [
  { id: "dtype_string", label: "String", aliases: ["string", "str", "text"] },
  { id: "dtype_int", label: "Integer", aliases: ["integer", "int", "whole", "long"] },
  { id: "dtype_float", label: "Float", aliases: ["float", "double", "decimal", "real", "number"] },
  { id: "dtype_bool", label: "Boolean", aliases: ["boolean", "bool"] },
];

function normTypePhrase(s: string): string | null {
  const t = s.trim().toLowerCase();
  for (const e of TYPE_ENTRIES) {
    if (e.aliases.includes(t)) return e.id;
    if (t === e.id) return e.id;
  }
  return null;
}

function inferTypeFromLiteral(raw: string): string {
  const v = raw.trim();
  if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) return "dtype_string";
  if (/^(true|false)$/i.test(v)) return "dtype_bool";
  if (/^-?\d+$/.test(v)) return "dtype_int";
  if (/^-?\d+\.\d+([eE][+-]?\d+)?$/.test(v) || /^-?\d+[eE][+-]?\d+$/i.test(v)) return "dtype_float";
  return "dtype_string";
}

/** Pull `name = 'Alice'` / `age = 30` style pairs from scenario text (including backtick-wrapped snippets). */
export function parseVariableAssignments(scenario: string): Array<{ name: string; literal: string }> {
  const cleaned = scenario.replace(/`/g, "");
  const re =
    /\b([a-zA-Z_]\w*)\s*=\s*('[^']*'|"[^"]*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false)\b/g;
  const out: Array<{ name: string; literal: string }> = [];
  const seen = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(cleaned)) !== null) {
    const name = m[1]!;
    if (seen.has(name)) continue;
    seen.add(name);
    out.push({ name, literal: m[2]! });
  }
  return out;
}

function wantsDataTypePerVariableTask(stem: string): boolean {
  const s = stem.toLowerCase();
  if (/\bdata types?\b/.test(s)) return true;
  if (/\btypes?\s+for\s+each\s+variable\b/.test(s)) return true;
  if (/\b(fill in|choose|select)\s+the\s+data\s+types?\b/.test(s)) return true;
  if (/\beach\s+variable'?s\s+data\s+type\b/.test(s)) return true;
  if (/\bwhat\s+(is|are)\s+the\s+data\s+types?\b/.test(s)) return true;
  return false;
}

function typesFromAnswerString(answer: string, slotCount: number): string[] | null {
  const parts = answer
    .split(/[,;]+|\s+and\s+/i)
    .map((x) => x.trim())
    .filter(Boolean);
  if (parts.length !== slotCount) return null;
  const mapped: string[] = [];
  for (const p of parts) {
    const id = normTypePhrase(p);
    if (id) mapped.push(id);
    else {
      const lit = inferTypeFromLiteral(p);
      mapped.push(lit);
    }
  }
  return mapped.length === slotCount ? mapped : null;
}

function itemListForOrder(order: string[]): Array<{ id: string; label: string }> {
  const used = new Set(order);
  const items = TYPE_ENTRIES.filter((e) => used.has(e.id)).map((e) => ({ id: e.id, label: e.label }));
  const distractor = TYPE_ENTRIES.find((e) => !used.has(e.id));
  if (distractor) items.push({ id: distractor.id, label: distractor.label });
  return items;
}

/**
 * LLMs often emit tap-to-shade part_model for "data type per variable" tasks. Rewrite to slot_fill using
 * literals in problemScenario so the workspace matches the story.
 */
export function coerceDataTypeVisualWorkspace(
  content: Record<string, unknown>,
  scene: MissionSceneData
): { content: Record<string, unknown>; coerced: boolean } {
  const vw = (content.visualWorkspace ?? {}) as Record<string, unknown>;
  const kind = String(vw.kind ?? "part_model");
  if (kind !== "part_model" && kind !== "fraction_bar" && kind !== "pizza_model" && kind !== "area_model") {
    return { content, coerced: false };
  }
  if (Array.isArray(vw.cellLabels) && (vw.cellLabels as unknown[]).length > 0) {
    return { content, coerced: false };
  }

  const stem = [content.problemScenario, content.finalPrompt, scene.prompt, scene.title]
    .map((x) => String(x ?? ""))
    .join(" ");
  if (!wantsDataTypePerVariableTask(stem)) return { content, coerced: false };

  const scenario = String(content.problemScenario ?? "");
  const vars = parseVariableAssignments(scenario);
  if (vars.length === 0) return { content, coerced: false };

  let correctOrder = vars.map((v) => inferTypeFromLiteral(v.literal));

  let answerStr = "";
  try {
    if (scene.correctAnswerJson?.trim()) {
      const parsed = JSON.parse(scene.correctAnswerJson) as Record<string, unknown>;
      if (typeof parsed.answer === "string") answerStr = parsed.answer;
      else if (typeof parsed.text === "string") answerStr = parsed.text;
    }
  } catch {
    /* ignore */
  }
  if (answerStr.trim()) {
    const fromAnswer = typesFromAnswerString(answerStr, vars.length);
    if (fromAnswer) correctOrder = fromAnswer;
  }

  const items = itemListForOrder(correctOrder);
  const slots = vars.map((v, i) => ({ id: String(i), label: v.name }));

  return {
    content: {
      ...content,
      visualWorkspace: {
        kind: "slot_fill",
        items,
        slots,
        slotCount: slots.length,
        correctOrder,
      },
    },
    coerced: true,
  };
}

/** Pass full correctAnswerJson object into merge so explicit `visual` is not dropped when `answer` exists. */
export function parseVisualProblemCorrectForMerge(scene: MissionSceneData): unknown {
  if (!scene.correctAnswerJson?.trim()) return undefined;
  try {
    const parsed = JSON.parse(scene.correctAnswerJson);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
    return parsed;
  } catch {
    return undefined;
  }
}
