/**
 * Safe, limited PEMDAS evaluation for mission content (no eval/Function).
 * Supports + - * /, parentheses, decimals. Unicode × ÷ − are normalized.
 */

function normalizeExpression(raw: string): string {
  return raw
    .replace(/\u00d7/g, "*")
    .replace(/\u00f7/g, "/")
    .replace(/\u2212/g, "-")
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/\s+/g, "");
}

type Tok =
  | { k: "num"; v: number }
  | { k: "op"; v: "+" | "-" | "*" | "/" }
  | { k: "(" }
  | { k: ")" }
  | { k: "end" };

function tokenize(s: string): Tok[] | null {
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i]!;
    if (c === "(") {
      out.push({ k: "(" });
      i++;
      continue;
    }
    if (c === ")") {
      out.push({ k: ")" });
      i++;
      continue;
    }
    if (/[0-9.]/.test(c)) {
      const start = i;
      while (i < s.length && /[0-9.]/.test(s[i]!)) i++;
      const v = Number(s.slice(start, i));
      if (!Number.isFinite(v)) return null;
      out.push({ k: "num", v });
      continue;
    }
    if (c === "+" || c === "-" || c === "*" || c === "/") {
      out.push({ k: "op", v: c });
      i++;
      continue;
    }
    return null;
  }
  out.push({ k: "end" });
  return out;
}

class Parser {
  private readonly toks: Tok[];
  private i = 0;

  constructor(toks: Tok[]) {
    this.toks = toks;
  }

  private peek(): Tok {
    return this.toks[this.i] ?? { k: "end" };
  }

  private eat(): Tok {
    return this.toks[this.i++] ?? { k: "end" };
  }

  parse(): number | null {
    const v = this.expr();
    if (v == null || !Number.isFinite(v)) return null;
    if (this.peek().k !== "end") return null;
    return v;
  }

  private expr(): number | null {
    let left = this.term();
    if (left == null) return null;
    while (true) {
      const t = this.peek();
      if (t.k !== "op" || (t.v !== "+" && t.v !== "-")) break;
      this.eat();
      const right = this.term();
      if (right == null) return null;
      left = t.v === "+" ? left + right : left - right;
    }
    return left;
  }

  private term(): number | null {
    let left = this.factor();
    if (left == null) return null;
    while (true) {
      const t = this.peek();
      if (t.k !== "op" || (t.v !== "*" && t.v !== "/")) break;
      this.eat();
      const right = this.factor();
      if (right == null) return null;
      if (t.v === "/" && right === 0) return null;
      left = t.v === "*" ? left * right : left / right;
    }
    return left;
  }

  private factor(): number | null {
    const t = this.peek();
    if (t.k === "op" && t.v === "+") {
      this.eat();
      return this.factor();
    }
    if (t.k === "op" && t.v === "-") {
      this.eat();
      const inner = this.factor();
      return inner == null ? null : -inner;
    }
    if (t.k === "(") {
      this.eat();
      const inner = this.expr();
      if (inner == null) return null;
      if (this.peek().k !== ")") return null;
      this.eat();
      return inner;
    }
    if (t.k === "num") {
      this.eat();
      return t.v;
    }
    return null;
  }
}

export function evaluateSanitizedArithmetic(expr: string): number | null {
  const norm = normalizeExpression(expr);
  if (!norm || !/[0-9]/.test(norm)) return null;
  if (!/^[0-9.+\-*/()]+$/.test(norm)) return null;
  const toks = tokenize(norm);
  if (!toks) return null;
  return new Parser(toks).parse();
}

/** Same intent as stemAsksNumericExpressionResult in buildVisualProblemMerged (keep in sync). */
function stemAsksNumericExpressionResult(stem: string): boolean {
  const s = stem.toLowerCase();
  if (/\bfinal\s+result\b/.test(s)) return true;
  if (/\bresult\s+of\s+(the\s+)?(following\s+)?expression\b/.test(s)) return true;
  if (/\bvalue\s+of\s+(the\s+)?(following\s+)?expression\b/.test(s)) return true;
  if (/\bwhat\s+is\s+the\s+(final\s+)?(numerical\s+)?result\b/.test(s)) return true;
  if (/\bevaluate\s+(the\s+)?expression\b/.test(s)) return true;
  if (/\bcompute\s+(the\s+)?value\b/.test(s)) return true;
  if (/\bcalculate\s+(the\s+)?value\b/.test(s)) return true;
  return false;
}

function buildStem(content: Record<string, unknown>): string {
  return [content.problemScenario, content.finalPrompt, content.title]
    .map((x) => String(x ?? ""))
    .join(" ");
}

function looksLikeArithmeticExpression(s: string): boolean {
  const t = s.trim();
  return t.length >= 3 && /[0-9]/.test(t) && (/[+\-*/×÷]/.test(t) || /\([0-9]/.test(t));
}

/** Pick the likeliest arithmetic span from authored content (bold, backticks, or explicit fields). */
export function extractArithmeticExpressionFromVisualProblemContent(
  content: Record<string, unknown>
): string | null {
  const eq = content.equation;
  if (typeof eq === "string" && eq.trim().length > 2) return eq.trim();
  const ex = content.expression;
  if (typeof ex === "string" && ex.trim().length > 2) return ex.trim();
  const scenario = String(content.problemScenario ?? "");
  /** Allow `*` for multiply inside `**...**` (previous `[^*]+` truncated e.g. `(7+3)*2`). */
  const bold = /\*\*((?:[^*]|\*(?!\*)){1,220}?)\*\*/g;
  let best: string | null = null;
  let m: RegExpExecArray | null;
  while ((m = bold.exec(scenario)) !== null) {
    const inner = m[1]!.trim();
    if (looksLikeArithmeticExpression(inner)) {
      if (!best || inner.length > best.length) best = inner;
    }
  }
  if (best) return best;
  const tick = scenario.match(/`([^`\n]{3,220})`/);
  if (tick && looksLikeArithmeticExpression(tick[1]!)) return tick[1]!.trim();
  return null;
}

function parseStoredNumeric(text: string): number | null {
  const t = text.trim().replace(/\s+/g, "");
  if (!/^-?\d+(?:[.,]\d+)?$/.test(t)) return null;
  return Number(t.replace(",", "."));
}

/**
 * When the prompt asks for a numeric expression result and the stored answer disagrees
 * with PEMDAS evaluation of the embedded expression, prefer the computed value (fixes common AI slips like 47 vs 48).
 */
export function correctTextAnswerIfExpressionEvalDiffers(
  content: Record<string, unknown>,
  textAnswer: string
): string {
  if (!stemAsksNumericExpressionResult(buildStem(content))) return textAnswer;
  const rawExpr = extractArithmeticExpressionFromVisualProblemContent(content);
  if (!rawExpr) return textAnswer;
  const computed = evaluateSanitizedArithmetic(rawExpr);
  if (computed == null || !Number.isFinite(computed)) return textAnswer;
  const canonical =
    Math.abs(computed - Math.round(computed)) < 1e-9 && Math.abs(Math.round(computed)) <= 1e12
      ? String(Math.round(computed))
      : String(computed);
  const trimmed = textAnswer.trim();
  if (!trimmed) return canonical;
  const stored = parseStoredNumeric(trimmed);
  if (stored == null) return textAnswer;
  if (Math.abs(stored - computed) < 1e-9) return textAnswer;
  return canonical;
}
