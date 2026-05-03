/** Strip common LaTeX wrappers for on-screen matching and display. */
export function stripMathTeachingLabel(raw: string): string {
  let t = String(raw ?? "").trim();
  if (t.startsWith("$") && t.endsWith("$") && t.length >= 2) {
    t = t.slice(1, -1).trim();
  } else if (t.startsWith("\\(") && t.endsWith("\\)") && t.length >= 4) {
    t = t.slice(2, -2).trim();
  } else if (t.startsWith("\\[") && t.endsWith("\\]") && t.length >= 4) {
    t = t.slice(2, -2).trim();
  }
  t = t.replace(/\\mathrm\{([^}]*)\}/g, "$1").replace(/\\,/g, " ");
  t = t.trim();
  return t.length > 0 ? t : String(raw ?? "").trim();
}
