/** Keeps a slider range wide enough to include the correct value (fixes AI max too low, e.g. work = 250 J). */

export function inferNumericTarget(text: string): number | null {
  const t = text.trim();
  if (/^\d+(\.\d+)?$/.test(t)) return Number(t);
  return null;
}

export function expandNumberLineBounds(input: {
  min: number;
  max: number;
  step: number;
  targetValue: number;
}): { min: number; max: number; step: number } {
  let min = Number(input.min);
  let max = Number(input.max);
  let step = Number(input.step);
  const target = Number(input.targetValue);

  if (!Number.isFinite(step) || step <= 0) step = 1;
  if (!Number.isFinite(min)) min = 0;
  if (!Number.isFinite(max)) max = 10;
  if (!Number.isFinite(target)) return { min, max, step };

  const pad = Math.max(step, Math.abs(target) * 0.05, 1);
  if (max < target + pad) max = target + pad;
  if (min > target - pad) min = target - pad;
  if (min >= max) {
    min = Math.min(0, target - 2 * pad);
    max = Math.max(target + 2 * pad, 10);
  }
  return { min, max, step };
}
