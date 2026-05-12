import type { WeightScalePuzzleSpec } from "./interfaces";

function isPosInt(n: unknown): n is number {
  return typeof n === "number" && Number.isInteger(n) && n > 0;
}

/** Parse and validate LLM or JSON input; returns null if inconsistent. */
export function parseWeightScalePuzzle(input: unknown): WeightScalePuzzleSpec | null {
  if (!input || typeof input !== "object") return null;
  const o = input as Record<string, unknown>;

  const question = o.question;
  if (typeof question !== "string" || question.trim().length === 0) return null;

  const rc = o.referenceCircles;
  const rb = o.referenceBlockWeight;
  const rt = o.referenceTotal;
  const tc = o.targetCircles;
  const ts = o.targetSquares;
  const tt = o.targetTotal;
  const correctAnswer = o.correctAnswer;

  if (!isPosInt(rc) || !isPosInt(rb) || !isPosInt(rt) || !isPosInt(tc) || !isPosInt(ts) || !isPosInt(tt)) {
    return null;
  }
  if (!isPosInt(correctAnswer)) return null;

  const numer = rt - rb;
  if (numer <= 0 || numer % rc !== 0) return null;
  const circleW = numer / rc;
  if (circleW <= 0) return null;

  const rem = tt - tc * circleW;
  if (rem <= 0 || rem % ts !== 0) return null;
  const squareW = rem / ts;
  if (squareW !== correctAnswer) return null;

  const choicesRaw = o.choices;
  if (!Array.isArray(choicesRaw) || choicesRaw.length !== 4) return null;
  const choices: number[] = [];
  for (const c of choicesRaw) {
    if (!isPosInt(c)) return null;
    choices.push(c);
  }
  const uniq = new Set(choices);
  if (uniq.size !== 4) return null;
  if (!choices.includes(correctAnswer)) return null;

  const sorted = [...choices].sort((a, b) => a - b);
  const explanation = o.explanation;
  if (typeof explanation !== "string" || explanation.trim().length < 10) return null;

  return {
    question: question.trim(),
    referenceCircles: rc,
    referenceBlockWeight: rb,
    referenceTotal: rt,
    targetCircles: tc,
    targetSquares: ts,
    targetTotal: tt,
    choices: sorted,
    correctAnswer,
    explanation: explanation.trim(),
  };
}
