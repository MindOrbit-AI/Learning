/** FNV-1a 32-bit — same input yields same output on server and client. */
export function hashUint32(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

/** Fisher–Yates with a seeded PRNG (SSR-safe). */
export function seededShuffle<T>(arr: T[], seed: string): T[] {
  const out = [...arr];
  let state = hashUint32(seed) || 1;
  const rand = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const ti = out[i] as T;
    const tj = out[j] as T;
    out[i] = tj;
    out[j] = ti;
  }
  return out;
}
