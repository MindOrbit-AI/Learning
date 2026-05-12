/**
 * MindOrbit AI - Generic STEM puzzle generator spec + parser.
 *
 * AI generates the *content* (prompt, choices, answers, explanation, hints)
 * for one of five well-typed interaction modes. The page renders it.
 */

export type StemPuzzleDomain = "Math" | "Science" | "Technology" | "Engineering";

export type StemPuzzleMode = "choice" | "match" | "sort" | "reorder" | "numpad";

export type StemPuzzleDifficulty = "easy" | "medium" | "hard";

export interface StemPuzzleGenParams {
  id: string;
  title: string;
  domain: StemPuzzleDomain;
  subject: string;
  skill: string;
  grade: "K-8" | "9" | "10" | "11" | "12";
  difficulty: StemPuzzleDifficulty;
  mode: StemPuzzleMode;
}

export interface StemPuzzleSpec {
  mode: StemPuzzleMode;
  prompt: string;
  hint: string;
  hints: string[];
  explanation: string;
  choice?: { choices: string[]; answer: string };
  match?: { pairs: { left: string; right: string }[] };
  sort?: { categories: string[]; items: { label: string; category: string }[] };
  reorder?: { correctOrder: string[] };
  numpad?: { answer: string; allowDecimal?: boolean; allowMinus?: boolean };
}

function isNonEmptyString(value: unknown, minLen = 1): value is string {
  return typeof value === "string" && value.trim().length >= minLen;
}

function isStringArray(value: unknown, minLen = 1): value is string[] {
  if (!Array.isArray(value)) return false;
  if (value.length < minLen) return false;
  return value.every((entry) => typeof entry === "string" && entry.trim().length > 0);
}

/**
 * Validates an arbitrary LLM payload against the StemPuzzleSpec schema.
 * Returns null when the payload does not satisfy the strict per-mode contract.
 */
export function parseStemPuzzle(input: unknown, expectedMode: StemPuzzleMode): StemPuzzleSpec | null {
  if (!input || typeof input !== "object") return null;
  const o = input as Record<string, unknown>;

  if (!isNonEmptyString(o.prompt, 3)) return null;
  if (!isNonEmptyString(o.explanation, 5)) return null;

  const hint = isNonEmptyString(o.hint) ? (o.hint as string).trim() : "";
  const hintsRaw = Array.isArray(o.hints) ? (o.hints as unknown[]) : [];
  const hints = hintsRaw.filter((h): h is string => typeof h === "string" && h.trim().length > 0).slice(0, 4);
  const finalHint = hint || hints[0] || "Re-read the prompt.";
  const finalHints = hints.length > 0 ? hints : [finalHint];

  const base = {
    mode: expectedMode,
    prompt: (o.prompt as string).trim(),
    explanation: (o.explanation as string).trim(),
    hint: finalHint,
    hints: finalHints,
  };

  if (expectedMode === "choice") {
    const choiceObj = o.choice as Record<string, unknown> | undefined;
    if (!choiceObj) return null;
    const choices = choiceObj.choices;
    const answer = choiceObj.answer;
    if (!isStringArray(choices, 2)) return null;
    if (!isNonEmptyString(answer)) return null;
    const trimmedChoices = (choices as string[]).map((c) => c.trim());
    const trimmedAnswer = (answer as string).trim();
    if (!trimmedChoices.includes(trimmedAnswer)) return null;
    if (trimmedChoices.length < 2 || trimmedChoices.length > 6) return null;
    const unique = new Set(trimmedChoices);
    if (unique.size !== trimmedChoices.length) return null;
    return { ...base, choice: { choices: trimmedChoices, answer: trimmedAnswer } };
  }

  if (expectedMode === "match") {
    const matchObj = o.match as Record<string, unknown> | undefined;
    if (!matchObj || !Array.isArray(matchObj.pairs)) return null;
    const pairs: { left: string; right: string }[] = [];
    for (const raw of matchObj.pairs as unknown[]) {
      if (!raw || typeof raw !== "object") return null;
      const r = raw as Record<string, unknown>;
      if (!isNonEmptyString(r.left) || !isNonEmptyString(r.right)) return null;
      pairs.push({ left: (r.left as string).trim(), right: (r.right as string).trim() });
    }
    if (pairs.length < 3 || pairs.length > 6) return null;
    const leftUnique = new Set(pairs.map((p) => p.left));
    const rightUnique = new Set(pairs.map((p) => p.right));
    if (leftUnique.size !== pairs.length || rightUnique.size !== pairs.length) return null;
    return { ...base, match: { pairs } };
  }

  if (expectedMode === "sort") {
    const sortObj = o.sort as Record<string, unknown> | undefined;
    if (!sortObj) return null;
    const categories = sortObj.categories;
    const items = sortObj.items;
    if (!isStringArray(categories, 2)) return null;
    if (!Array.isArray(items)) return null;
    const cats = (categories as string[]).map((c) => c.trim());
    const trimmedItems: { label: string; category: string }[] = [];
    for (const raw of items as unknown[]) {
      if (!raw || typeof raw !== "object") return null;
      const r = raw as Record<string, unknown>;
      if (!isNonEmptyString(r.label) || !isNonEmptyString(r.category)) return null;
      const label = (r.label as string).trim();
      const category = (r.category as string).trim();
      if (!cats.includes(category)) return null;
      trimmedItems.push({ label, category });
    }
    if (trimmedItems.length < 4 || trimmedItems.length > 10) return null;
    const counts: Record<string, number> = {};
    for (const item of trimmedItems) counts[item.category] = (counts[item.category] ?? 0) + 1;
    if (cats.some((c) => (counts[c] ?? 0) === 0)) return null;
    return { ...base, sort: { categories: cats, items: trimmedItems } };
  }

  if (expectedMode === "reorder") {
    const reorderObj = o.reorder as Record<string, unknown> | undefined;
    if (!reorderObj) return null;
    const order = reorderObj.correctOrder;
    if (!isStringArray(order, 3)) return null;
    const trimmed = (order as string[]).map((s) => s.trim());
    if (trimmed.length > 8) return null;
    const unique = new Set(trimmed);
    if (unique.size !== trimmed.length) return null;
    return { ...base, reorder: { correctOrder: trimmed } };
  }

  if (expectedMode === "numpad") {
    const numpadObj = o.numpad as Record<string, unknown> | undefined;
    if (!numpadObj) return null;
    const answer = numpadObj.answer;
    if (!isNonEmptyString(answer)) return null;
    const trimmedAnswer = (answer as string).trim();
    if (!/^-?\d+(\.\d+)?$/.test(trimmedAnswer) && !/^[01]+$/.test(trimmedAnswer)) return null;
    return {
      ...base,
      numpad: {
        answer: trimmedAnswer,
        allowDecimal: numpadObj.allowDecimal === true || trimmedAnswer.includes("."),
        allowMinus: numpadObj.allowMinus === true || trimmedAnswer.startsWith("-"),
      },
    };
  }

  return null;
}

/** Deterministic, offline fallback when no LLM is available. */
export function mockStemPuzzle(params: StemPuzzleGenParams): StemPuzzleSpec {
  const { mode, subject, skill, title, difficulty } = params;
  if (mode === "choice") {
    return {
      mode,
      prompt: `${title}: pick the option that best matches ${skill}.`,
      hint: `Skim each option through the lens of ${subject}.`,
      hints: [`Skim each option through the lens of ${subject}.`, "Eliminate obvious distractors first."],
      explanation: `In ${subject}, ${skill.toLowerCase()} is the key reasoning step.`,
      choice: {
        choices: [`${title} A`, `${title} B`, `${title} C`, `${title} D`],
        answer: `${title} A`,
      },
    };
  }
  if (mode === "match") {
    return {
      mode,
      prompt: `${title}: pair the cards for ${skill}.`,
      hint: `Look for canonical ${subject} pairings.`,
      hints: [`Look for canonical ${subject} pairings.`, "Match definitions to terms."],
      explanation: `Each pair reflects a standard ${subject} relationship.`,
      match: {
        pairs: [
          { left: `${subject} A`, right: "Definition A" },
          { left: `${subject} B`, right: "Definition B" },
          { left: `${subject} C`, right: "Definition C" },
        ],
      },
    };
  }
  if (mode === "sort") {
    return {
      mode,
      prompt: `${title}: sort each card into the right bucket.`,
      hint: `Apply your ${subject} categorization rules.`,
      hints: [`Apply your ${subject} categorization rules.`, "Place every card before checking."],
      explanation: `Each ${subject} example belongs in its bucket by construction.`,
      sort: {
        categories: ["Group A", "Group B"],
        items: [
          { label: `${subject} 1`, category: "Group A" },
          { label: `${subject} 2`, category: "Group A" },
          { label: `${subject} 3`, category: "Group B" },
          { label: `${subject} 4`, category: "Group B" },
        ],
      },
    };
  }
  if (mode === "reorder") {
    return {
      mode,
      prompt: `${title}: order the steps for ${skill}.`,
      hint: `Recall the canonical ${subject} sequence.`,
      hints: [`Recall the canonical ${subject} sequence.`, "Start with the earliest step."],
      explanation: `The steps proceed in standard ${subject} order.`,
      reorder: { correctOrder: ["Step 1", "Step 2", "Step 3", "Step 4"] },
    };
  }
  const seed = difficulty === "hard" ? 27 : difficulty === "medium" ? 14 : 7;
  return {
    mode: "numpad",
    prompt: `${title}: type the integer answer.`,
    hint: `Reason about ${skill} numerically.`,
    hints: [`Reason about ${skill} numerically.`, "Re-read the units."],
    explanation: `The expected answer is ${seed}.`,
    numpad: { answer: String(seed) },
  };
}
