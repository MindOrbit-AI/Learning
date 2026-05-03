/** DNA-style complementary pairing (single-letter symbols, case-insensitive). */
export function isComplementaryBasePair(a: string, b: string): boolean {
  const x = a.trim().toUpperCase();
  const y = b.trim().toUpperCase();
  if (x.length !== 1 || y.length !== 1) return false;
  const s = new Set([x, y]);
  return (s.has("A") && s.has("T")) || (s.has("C") && s.has("G"));
}

export type BasePairToken = { id: string; label: string };

export function normalizeBasePairTokens(raw: unknown): BasePairToken[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return [
      { id: "b0", label: "A" },
      { id: "b1", label: "T" },
      { id: "b2", label: "C" },
      { id: "b3", label: "G" },
    ];
  }
  return raw.map((item, i) => {
    if (typeof item === "string") {
      return { id: `b${i}`, label: item.trim().toUpperCase().slice(0, 3) };
    }
    const o = item as Record<string, unknown>;
    const label = String(o.label ?? o.letter ?? o.symbol ?? o.id ?? "?").trim();
    return { id: String(o.id ?? `b${i}`), label: label || "?" };
  });
}

/** `pairs` entries are token ids [id1, id2]. */
export function basePairSelectSatisfied(
  expected: Record<string, unknown>,
  got: Record<string, unknown>
): { ok: boolean; vars: Record<string, string | number> } {
  const tokens = normalizeBasePairTokens(expected.tokens);
  const idToLabel = new Map(tokens.map((t) => [t.id, t.label] as const));
  const required = Number(expected.requiredCorrectPairs);
  const needPairs = Number.isFinite(required) && required > 0 ? Math.round(required) : Math.max(1, Math.floor(tokens.length / 2));

  const raw = got.pairs;
  const pairs: [string, string][] = [];
  if (Array.isArray(raw)) {
    for (const p of raw) {
      if (Array.isArray(p) && p.length === 2) pairs.push([String(p[0]), String(p[1])]);
    }
  }

  const vars: Record<string, string | number> = {
    total: needPairs,
    shaded: pairs.length,
    expected: needPairs,
  };

  if (pairs.length !== needPairs) return { ok: false, vars };

  const used = new Set<string>();
  for (const [i, j] of pairs) {
    if (!idToLabel.has(i) || !idToLabel.has(j)) return { ok: false, vars };
    if (i === j) return { ok: false, vars };
    if (used.has(i) || used.has(j)) return { ok: false, vars };
    used.add(i);
    used.add(j);
    const la = idToLabel.get(i)!;
    const lb = idToLabel.get(j)!;
    if (!isComplementaryBasePair(la, lb)) return { ok: false, vars };
  }

  if (used.size !== tokens.length) return { ok: false, vars };

  return { ok: true, vars: { ...vars, shaded: pairs.length } };
}
