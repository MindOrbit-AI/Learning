import { inferNumericTarget } from "./numberLineBounds";

/**
 * When authors shade the discount rate on a 100-part grid (e.g. 20 for "20% off")
 * but the symbolic answer is the dollar amount ("10"), treat the expected count
 * as the numeric answer so the visual gate matches what learners type.
 */
export function reconcilePartModelCountTarget(
  total: number,
  targetFromExpected: number,
  symbolicAnswer: string,
  match: string
): number {
  if (match !== "count") return targetFromExpected;
  if (!Number.isFinite(total) || total <= 0 || !Number.isFinite(targetFromExpected)) return targetFromExpected;
  const av = inferNumericTarget(symbolicAnswer);
  if (av == null || !Number.isInteger(av) || av < 0 || av > total) return targetFromExpected;
  if (av === targetFromExpected) return av;
  if (total === 100 && av > 0 && targetFromExpected > av) {
    const k = targetFromExpected / av;
    if (Number.isInteger(k) && k >= 2 && k <= 50) return av;
  }
  return targetFromExpected;
}
