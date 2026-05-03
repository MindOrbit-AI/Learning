/**
 * Transforms MissionSceneData[] into ILE Lesson format.
 * Parses contentJson and correctAnswerJson to produce typed block configs.
 */

import type { MissionSceneData } from "@mindorbit/types";
import type { Lesson, LessonStep } from "@/features/lesson-runtime/types/lesson.types";
import type {
  InteractiveBlockConfig,
  ConstructAnswerBlockConfig,
  NumberLineData,
  VisualProblemBlockConfig,
} from "@/features/lesson-blocks/types/block.types";
import { buildVisualProblemMergedCorrect } from "@/lib/mission-to-lesson/buildVisualProblemMerged";

function extractImageUrl(raw: unknown): string | undefined {
  if (typeof raw === "string" && (raw.startsWith("http") || raw.startsWith("/") || raw.startsWith("data:")))
    return raw;
  if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    const url = o.url ?? o.src ?? o.href;
    if (typeof url === "string") return url;
  }
  return undefined;
}

function isPlaceholderVisual(v: unknown): boolean {
  if (typeof v !== "string") return false;
  const s = v.replace(/\*/g, "").trim();
  return /URL_|placeholder|INSERT_|TODO|\[image\]/i.test(s);
}

function extractOptionLabel(o: Record<string, unknown> | string): string {
  if (typeof o === "string") return o.trim();
  const val = (o as Record<string, unknown>).label ?? (o as Record<string, unknown>).text ?? (o as Record<string, unknown>).value ?? (o as Record<string, unknown>).expression;
  if (val == null) return "";
  return typeof val === "string" ? val.trim() : String(val);
}

function normalizeOptions(raw: unknown): Array<{ id: string; label: string }> {
  const arr = Array.isArray(raw) ? raw : [];
  return arr.map((o, i) => {
    if (typeof o === "string") return { id: `opt-${i}`, label: o };
    const obj = o as Record<string, unknown>;
    return {
      id: String(obj.id ?? `opt-${i}`),
      label: extractOptionLabel(obj) || String(obj.id ?? `Option ${i + 1}`),
    };
  });
}

function parseCorrectAnswer(scene: MissionSceneData): unknown {
  if (!scene.correctAnswerJson?.trim()) return undefined;
  try {
    const parsed = JSON.parse(scene.correctAnswerJson);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return (
        parsed.value ??
        parsed.answer ??
        parsed.expression ??
        parsed.correctAnswer ??
        parsed.selectedIds ??
        parsed.optionId ??
        parsed.choiceId ??
        parsed.id ??
        parsed
      );
    }
    return parsed;
  } catch {
    return undefined;
  }
}

export function missionScenesToLesson(
  missionId: string,
  missionTitle: string,
  scenes: MissionSceneData[]
): Lesson {
  const steps: LessonStep[] = scenes.map((scene) => sceneToStep(scene));
  return {
    id: `lesson-${missionId}`,
    title: missionTitle,
    missionId,
    steps,
  };
}

function sceneToStep(scene: MissionSceneData): LessonStep {
  const content = scene.contentJson
    ? (JSON.parse(scene.contentJson) as Record<string, unknown>)
    : {};
  const correct = parseCorrectAnswer(scene);

  const block = sceneToBlock(scene.sceneType, content, correct, scene.prompt);
  if (!block) {
    return {
      id: scene.id,
      title: scene.title,
      instruction: scene.prompt,
      block: fallbackBlock(scene.prompt, correct),
      explanation: scene.explanation ?? undefined,
    };
  }

  return {
    id: scene.id,
    title: scene.title,
    instruction: scene.prompt,
    block,
    hints: [scene.hintLevel1, scene.hintLevel2, scene.hintLevel3]
      .filter((h): h is string => Boolean(h?.trim()))
      .map((text, i) => ({ level: i + 1, text })),
    feedback: { correct: scene.explanation ?? undefined, incorrect: scene.explanation ?? undefined },
    explanation: scene.explanation ?? undefined,
  };
}

function fallbackBlock(prompt: string, correct: unknown): ConstructAnswerBlockConfig {
  return {
    type: "construct-answer",
    placeholder: "Type your answer...",
    correctAnswer: correct != null ? String(correct) : "",
  };
}

function sceneToBlock(
  sceneType: string,
  content: Record<string, unknown>,
  correct: unknown,
  prompt: string
): InteractiveBlockConfig | null {
  switch (sceneType) {
    case "observe": {
      const rawNumLine = content.numberLine as unknown;
      let numberLine: NumberLineData | undefined;
      if (rawNumLine && typeof rawNumLine === "object" && "min" in rawNumLine && "max" in rawNumLine && Array.isArray((rawNumLine as Record<string, unknown>).segments)) {
        const n = rawNumLine as { min: number; max: number; segments: Array<{ start: number; end: number; startFilled?: boolean; endFilled?: boolean }> };
        numberLine = {
          min: Number(n.min),
          max: Number(n.max),
          segments: n.segments.map((s) => ({
            start: Number(s.start),
            end: Number(s.end),
            startFilled: Boolean(s.startFilled),
            endFilled: Boolean(s.endFilled),
          })),
        };
      }
      const promptLower = prompt.toLowerCase();
      const needsNumberLine = /number line|graph|inequalit|graphed/.test(promptLower);
      const hasVisual = content.visual || content.imageUrl || content.image || content.graph || numberLine;
      if (needsNumberLine && !hasVisual && !numberLine) {
        numberLine = {
          min: 0,
          max: 8,
          segments: [
            { start: 0, end: 3, startFilled: false, endFilled: false },
            { start: 5, end: 8, startFilled: false, endFilled: false },
          ],
        };
      }
      const imageUrl =
        extractImageUrl(content.imageUrl) ??
        extractImageUrl(content.image) ??
        extractImageUrl(content.graph);

      const visual = content.visual as string | undefined;
      return {
        type: "observe",
        visual: visual && !isPlaceholderVisual(visual) ? visual : undefined,
        description: content.description as string | undefined,
        imageUrl,
        numberLine,
      };
    }

    case "reveal":
      return {
        type: "reveal",
        content: (content.visual ?? content.description ?? content.text ?? "") as string,
        label: (content.label as string) ?? "Reveal",
      };

    case "predict": {
      const options = normalizeOptions(content.options);
      if (options.length === 0)
        return {
          type: "construct-answer",
          placeholder: "Type your answer...",
          correctAnswer: correct != null ? String(correct) : "",
        };
      const correctId = resolveCorrectId(options, correct);
      return {
        type: "multiple-choice",
        options,
        correctId,
        shuffle: true,
      };
    }

    case "micro_quiz": {
      const options = normalizeOptions(content.options);
      if (options.length === 0)
        return {
          type: "construct-answer",
          placeholder: "Type your answer...",
          correctAnswer: correct != null ? String(correct) : "",
        };
      const correctId = resolveCorrectId(options, correct);
      return {
        type: "multiple-choice",
        options,
        correctId,
        shuffle: true,
      };
    }

    case "drag_drop": {
      const items = (content.items ?? []) as Array<{ id: string; label: string }>;
      const slots = (content.slots ?? []) as Array<{ id: string; label?: string }>;
      const correctSlots = parseDragDropCorrect(items, slots, correct);
      return {
        type: "drag-drop",
        items,
        slots,
        correctSlots,
      };
    }

    case "sort_sequence": {
      const rawItems = content.items ?? content.steps ?? content.statement ?? [];
      const arr = Array.isArray(rawItems) ? rawItems : [];
      const items = arr.map((it, i) => {
        if (typeof it === "string") return { id: `item-${i}`, label: it };
        const o = it as Record<string, unknown>;
        return {
          id: String(o.id ?? `item-${i}`),
          label: String(o.label ?? o.text ?? o.step ?? o.content ?? it),
        };
      });
      const correctOrder = Array.isArray(correct)
        ? correct.map(String)
        : items.map((i) => i.id);
      return {
        type: "drag-sequence",
        items,
        correctOrder: correctOrder.length === items.length ? correctOrder : items.map((i) => i.id),
      };
    }

    case "tap_highlight": {
      const targets = (content.targets ?? []) as Array<{ id: string; label: string }>;
      const correctIds = Array.isArray(correct) ? correct.map(String) : [];
      return {
        type: "tap-highlight",
        targets,
        correctIds,
        highlightOrder: content.highlightOrder as boolean | undefined,
      };
    }

    case "find_error": {
      const raw = content.statements ?? content.steps ?? [];
      const arr = Array.isArray(raw) ? raw : [];
      const statements = arr.map((s, i) => {
        if (typeof s === "string") return { id: `stmt-${i}`, text: s, hasError: false };
        const o = s as Record<string, unknown>;
        return {
          id: String(o.id ?? `stmt-${i}`),
          text: String(o.text ?? o.content ?? o.step ?? s),
          hasError: Boolean(o.hasError),
        };
      });
      const correctId = correct != null ? String(correct) : statements.find((s) => s.hasError)?.id ?? statements[0]?.id ?? "";
      return {
        type: "find-error",
        statements,
        correctId,
      };
    }

    case "construct_answer":
      return {
        type: "construct-answer",
        placeholder: (content.placeholder as string) ?? "Type your answer...",
        expectedFormat: content.expectedFormat as string | undefined,
        correctAnswer: correct != null ? String(correct) : "",
      };

    case "visual_problem": {
      const spec = buildVisualProblemMergedCorrect(content, correct);
      const block: VisualProblemBlockConfig = {
        type: "visual-problem",
        problemScenario: String(content.problemScenario ?? prompt),
        finalPrompt: String(content.finalPrompt ?? prompt),
        visualWorkspace: (content.visualWorkspace as Record<string, unknown>) ?? {},
        correctSpec: spec,
        masterySkill: (content.masterySkill as string) ?? undefined,
      };
      return block;
    }

    case "reflect":
      return {
        type: "reflect",
        prompt,
      };

    case "transfer": {
      const options = normalizeOptions(content.options);
      if (options.length > 0) {
        const correctId = resolveCorrectId(options, correct);
        return {
          type: "multiple-choice",
          options,
          correctId,
        };
      }
      return {
        type: "construct-answer",
        placeholder: "Your answer...",
        correctAnswer: correct != null ? String(correct) : "",
      };
    }

    case "slider_experiment": {
      const min = Number(content.min) ?? 0;
      const max = Number(content.max) ?? 100;
      const step = Number(content.step) ?? 1;
      const targetValue = typeof correct === "number" ? correct : undefined;
      return {
        type: "slider",
        min,
        max,
        step,
        initialValue: (content.initialValue as number) ?? (min + max) / 2,
        targetValue,
        unit: content.unit as string | undefined,
      };
    }

    case "manipulate":
    case "simulate":
    default:
      return {
        type: "construct-answer",
        placeholder: "Your response...",
        correctAnswer: correct != null ? String(correct) : "",
      };
  }
}

function resolveCorrectId(
  options: Array<{ id: string; label: string }>,
  correct: unknown
): string {
  if (correct == null) return options[0]?.id ?? "";
  const c = String(correct).trim();
  const byId = options.find((o) => o.id === c || o.label === c);
  if (byId) return byId.id;
  const byLabel = options.find((o) => o.label.toLowerCase() === c.toLowerCase());
  return byLabel?.id ?? options[0]?.id ?? "";
}

function parseDragDropCorrect(
  items: Array<{ id: string; label: string }>,
  slots: Array<{ id: string; label?: string }>,
  correct: unknown
): Record<string, string> {
  const result: Record<string, string> = {};
  if (Array.isArray(correct)) {
    slots.forEach((slot, i) => {
      const itemId = correct[i];
      if (typeof itemId === "string" && items.some((it) => it.id === itemId)) {
        result[slot.id] = itemId;
      }
    });
  } else if (correct && typeof correct === "object") {
    const obj = correct as Record<string, string>;
    slots.forEach((slot) => {
      const itemId = obj[slot.id];
      if (typeof itemId === "string") result[slot.id] = itemId;
    });
  }
  return result;
}
