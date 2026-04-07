import type {
  ImmersiveContentBlock,
  ImmersiveLessonContent,
  ImmersiveLessonSection,
} from "./interfaces";

function slugify(s: string, fallback: string): string {
  const x = s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
  return x || fallback;
}

function clampText(s: string, max: number): string {
  const t = typeof s === "string" ? s.trim() : "";
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function firstGrapheme(s: string): string {
  const t = s.trim();
  if (!t) return "📚";
  const chars = [...t];
  return chars[0] ?? "📚";
}

function normalizeBlock(raw: unknown): ImmersiveContentBlock | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const type = o.type === "h2" ? "h2" : o.type === "p" ? "p" : null;
  if (!type) return null;
  const text = clampText(String(o.text ?? ""), 4000);
  if (!text) return null;
  if (type === "h2") return { type: "h2", text };
  const hint = Boolean(o.hint);
  return { type: "p", text, ...(hint ? { hint: true } : {}) };
}

function normalizeSection(raw: unknown, index: number): ImmersiveLessonSection | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const title = clampText(String(o.title ?? `Section ${index + 1}`), 200);
  const id = slugify(String(o.id ?? title), `section-${index}`);
  const objectivesIn = Array.isArray(o.objectives) ? o.objectives : [];
  const objectives = objectivesIn
    .map((x) => clampText(String(x), 500))
    .filter(Boolean)
    .slice(0, 6);
  const blocksIn = Array.isArray(o.blocks) ? o.blocks : [];
  const blocks: ImmersiveContentBlock[] = [];
  for (const b of blocksIn) {
    const nb = normalizeBlock(b);
    if (nb) blocks.push(nb);
  }
  if (objectives.length === 0) {
    objectives.push(`Explain core ideas from: ${title}.`);
  }
  if (blocks.length === 0) {
    blocks.push({
      type: "p",
      text: `This section introduces ${title}. Read carefully and use the quick checks where they appear.`,
    });
  }
  const quizPending = Boolean(o.quizPending);
  return {
    id,
    title,
    ...(quizPending ? { quizPending: true } : {}),
    objectives,
    blocks,
  };
}

/**
 * Coerce arbitrary JSON from the model into a safe ImmersiveLessonContent shape.
 */
export function normalizeImmersiveLesson(
  raw: unknown,
  fallbacks: { topic: string; gradeLevel: string }
): ImmersiveLessonContent {
  const obj = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const interestLabel = clampText(
    String(obj.interestLabel ?? fallbacks.topic.split(",")[0]?.trim() ?? "General study"),
    80
  );
  const interestEmoji =
    obj.interestEmoji != null && String(obj.interestEmoji).trim()
      ? firstGrapheme(String(obj.interestEmoji))
      : "📚";
  const gradeLabel = clampText(String(obj.gradeLabel ?? fallbacks.gradeLevel), 40);
  const sectionsIn = Array.isArray(obj.sections) ? obj.sections : [];
  const sections: ImmersiveLessonSection[] = [];
  let i = 0;
  for (const s of sectionsIn) {
    const ns = normalizeSection(s, i);
    if (ns) {
      sections.push(ns);
      i++;
    }
  }
  if (sections.length === 0) {
    sections.push({
      id: "intro",
      title: fallbacks.topic.slice(0, 120) || "Introduction",
      quizPending: true,
      objectives: [`Describe the main ideas of ${fallbacks.topic}.`],
      blocks: [
        {
          type: "p",
          text: `This lesson explores ${fallbacks.topic} at a level appropriate for ${fallbacks.gradeLevel}.`,
          hint: true,
        },
        { type: "h2", text: "Core ideas" },
        {
          type: "p",
          text: "Work through each section in order. Use the question markers for quick checks.",
        },
      ],
    });
  }
  return { interestLabel, interestEmoji, gradeLabel, sections };
}
