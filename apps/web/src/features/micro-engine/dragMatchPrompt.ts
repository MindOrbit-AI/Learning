/**
 * `drag_match` maps from scene type `drag_drop` but the UI is tap-to-select (card, then target), not HTML drag-and-drop.
 * Normalize common LLM stems so the headline matches what learners actually do.
 */
export function sanitizeDragMatchPromptForTapUi(prompt: string): string {
  let s = prompt.replace(/\s+/g, " ").trim();
  if (!s) return s;
  s = s.replace(/\bdrag[-\s]?and[-\s]?drop\s+to\b/gi, "Tap to");
  s = s.replace(/\bdrag[-\s]?and[-\s]?drop\b/gi, "Tap to match");
  s = s.replace(/\bdrag\s+each\b/gi, "Tap each");
  return s;
}
