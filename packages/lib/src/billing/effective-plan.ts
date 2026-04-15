import type { PlanTier } from "./plan-config";

export function effectivePlanTier(opts: {
  planTier: PlanTier;
  bonusProUntil: Date | null | undefined;
  now?: Date;
}): PlanTier {
  const now = opts.now ?? new Date();
  if (opts.planTier === "PRO") return "PRO";
  if (opts.bonusProUntil && opts.bonusProUntil > now) return "PRO";
  return "FREE";
}
