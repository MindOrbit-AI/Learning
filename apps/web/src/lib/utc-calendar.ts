/** Calendar boundaries in UTC for streaks and weekly goals */

export function startOfUtcDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
}

export function endOfUtcDay(d: Date): Date {
  const x = startOfUtcDay(d);
  x.setUTCDate(x.getUTCDate() + 1);
  return x;
}

export function startOfUtcWeek(d: Date): Date {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = x.getUTCDay();
  const daysFromMonday = (day + 6) % 7;
  x.setUTCDate(x.getUTCDate() - daysFromMonday);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

export function utcDayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addUtcDays(d: Date, delta: number): Date {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + delta);
  return x;
}
