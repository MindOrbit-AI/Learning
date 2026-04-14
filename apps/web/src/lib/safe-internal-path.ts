/** Same-origin path only — avoids open-redirect issues with callback query params. */
export function safeInternalPath(raw: string | null | undefined, fallback: string): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) {
    return fallback;
  }
  return raw;
}
