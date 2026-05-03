/**
 * Adapts legacy MissionScene rows into Micro-Interaction Engine steps (1:1 per scene for API compatibility).
 */

import type { MissionSceneData } from "@mindorbit/types";
import type { MicroInteractionType, RuntimeMicroStep } from "@/features/micro-engine/types";
import { defaultFeedbackWrong } from "@/features/micro-engine/validateMicroAnswer";
import { buildVisualProblemMergedCorrect } from "./buildVisualProblemMerged";
import { coerceDataTypeVisualWorkspace, parseVisualProblemCorrectForMerge } from "./coerceDataTypeVisualWorkspace";
import { sanitizeDragMatchPromptForTapUi } from "@/features/micro-engine/dragMatchPrompt";

function oneLine(text: string, max = 96): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t || "Think step by step.";
  const cut = t.slice(0, max);
  const sp = cut.lastIndexOf(" ");
  return (sp > 40 ? cut.slice(0, sp) : cut).trim() + "…";
}

/** Real MCQ stem often lives in contentJson; scene.prompt is frequently generic ("Select the correct answer"). */
function pickQuizStem(scene: MissionSceneData, content: Record<string, unknown>): string {
  const generic =
    /^(select (the )?correct answer|choose (one|an option|your answer)|pick (one|an answer))\s*\.?$/i;
  const strip = (s: string) => s.replace(/\s+/g, " ").trim();
  const push = (arr: string[], s: string) => {
    const t = strip(s);
    if (t) arr.push(t);
  };
  const candidates: string[] = [];
  for (const key of ["question", "stem", "problem", "prompt", "text", "description", "statement"] as const) {
    const v = content[key];
    if (typeof v === "string") push(candidates, v);
  }
  if (typeof content.visual === "string") push(candidates, content.visual);
  push(candidates, String(scene.prompt ?? ""));
  push(candidates, String(scene.title ?? ""));
  for (const c of candidates) {
    if (c.length > 0 && !generic.test(c)) return oneLine(c, 220);
  }
  const fallback = candidates.find((c) => c.length > 0);
  return oneLine(fallback || "Use the choices below.", 220);
}

/** drag_drop instructions often live in contentJson; scene.prompt may be a short duplicate or empty. */
function pickDragDropStem(scene: MissionSceneData, content: Record<string, unknown>): string {
  const strip = (s: string) => s.replace(/\s+/g, " ").trim();
  const push = (arr: string[], s: string) => {
    const t = strip(s);
    if (t) arr.push(t);
  };
  const candidates: string[] = [];
  for (const key of [
    "question",
    "instructions",
    "task",
    "stem",
    "problem",
    "description",
    "prompt",
    "text",
    "statement",
  ] as const) {
    const v = content[key];
    if (typeof v === "string") push(candidates, v);
  }
  push(candidates, String(scene.prompt ?? ""));
  push(candidates, String(scene.title ?? ""));
  const first = candidates.find((c) => c.length > 0);
  return oneLine(first || "Match each item to the correct target.", 280);
}

function parseContent(scene: MissionSceneData): Record<string, unknown> {
  if (!scene.contentJson?.trim()) return {};
  try {
    const o = JSON.parse(scene.contentJson) as Record<string, unknown>;
    return o && typeof o === "object" ? o : {};
  } catch {
    return {};
  }
}

function parseCorrect(scene: MissionSceneData): unknown {
  if (!scene.correctAnswerJson?.trim()) return undefined;
  try {
    const parsed = JSON.parse(scene.correctAnswerJson);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const o = parsed as Record<string, unknown>;
      return (
        o.value ??
        o.answer ??
        o.expression ??
        o.correctAnswer ??
        o.selectedIds ??
        o.optionId ??
        o.choiceId ??
        o.id ??
        parsed
      );
    }
    return parsed;
  } catch {
    return undefined;
  }
}

function normalizeOptions(raw: unknown): Array<{ id: string; label: string }> {
  const arr = Array.isArray(raw) ? raw : [];
  return arr.map((o, i) => {
    if (typeof o === "string") return { id: `opt-${i}`, label: o };
    const obj = o as Record<string, unknown>;
    const label =
      String(obj.label ?? obj.text ?? obj.value ?? obj.expression ?? obj.id ?? `Option ${i + 1}`).trim();
    return { id: String(obj.id ?? `opt-${i}`), label: label || `Option ${i + 1}` };
  });
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

function visualFromContent(content: Record<string, unknown>): {
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
} {
  const diagram = (content.equation as string) ?? (content.visual as string) ?? (content.imageUrl as string);
  if (typeof diagram === "string" && diagram.length > 0) {
    return {
      before: { diagramSnippet: oneLine(diagram, 140), dim: true },
      after: { diagramSnippet: oneLine(diagram, 140), dim: false },
    };
  }
  return { before: null, after: null };
}

function sceneToMicroStep(scene: MissionSceneData): RuntimeMicroStep {
  const content = parseContent(scene);
  const correct = parseCorrect(scene);
  const fbOk = oneLine(scene.explanation ?? "Nice — that locks in.", 120);
  const fbBad = oneLine(scene.explanation ?? defaultFeedbackWrong("tap_choice"), 120);
  const { before, after } = visualFromContent(content);

  const base = (type: MicroInteractionType, patch: Partial<RuntimeMicroStep>): RuntimeMicroStep => ({
    id: scene.id,
    sourceSceneId: scene.id,
    orderIndex: scene.orderIndex,
    type,
    prompt: oneLine(scene.prompt || scene.title),
    interactionConfig: {},
    correctAnswer: "",
    feedbackCorrect: fbOk,
    feedbackWrong: fbBad,
    visualStateBefore: before,
    visualStateAfter: after,
    masterySkill: scene.title,
    ...patch,
  });

  switch (scene.sceneType) {
    case "observe": {
      const detail =
        (content.description as string) ||
        (content.text as string) ||
        (typeof content.visual === "string" ? content.visual : "") ||
        scene.title;
      return base("reveal_step", {
        prompt: oneLine(scene.title || "Notice this"),
        interactionConfig: {
          mode: "observe",
          headline: scene.title,
          detail: oneLine(detail, 220),
          imageUrl: (content.imageUrl as string) ?? (content.image as string),
          autoAdvanceMs: 2400,
        },
        correctAnswer: "__timer__",
        feedbackCorrect: "Onward.",
        feedbackWrong: "",
        visualStateBefore: before,
        visualStateAfter: after,
      });
    }

    case "reveal": {
      const full = String(content.visual ?? content.description ?? content.text ?? "");
      return base("reveal_step", {
        interactionConfig: {
          mode: "reveal",
          teaser: oneLine(full, 48),
          full,
          label: String(content.label ?? "Reveal"),
        },
        correctAnswer: "__tap__",
        feedbackCorrect: "Unlocked.",
        feedbackWrong: "",
      });
    }

    case "predict":
    case "micro_quiz":
    case "transfer": {
      const options = normalizeOptions(content.options);
      if (options.length === 0) {
        return base("fill_blank", {
          interactionConfig: {
            placeholder: String(content.placeholder ?? "Type it…"),
            loose: true,
          },
          correctAnswer: correct != null ? String(correct) : "",
          feedbackWrong: oneLine(defaultFeedbackWrong("fill_blank"), 120),
        });
      }
      const correctId = resolveCorrectId(options, correct);
      return base("tap_choice", {
        prompt: pickQuizStem(scene, content),
        interactionConfig: { options, layout: "grid" },
        correctAnswer: correctId,
        feedbackWrong: oneLine(defaultFeedbackWrong("tap_choice"), 120),
      });
    }

    case "find_error": {
      const raw = content.statements ?? content.steps ?? [];
      const arr = Array.isArray(raw) ? raw : [];
      const statements = arr.map((s, i) => {
        if (typeof s === "string") return { id: `stmt-${i}`, text: s, hasError: false };
        const o = s as Record<string, unknown>;
        return {
          id: String(o.id ?? `stmt-${i}`),
          text: String(o.text ?? o.content ?? o.step ?? ""),
          hasError: Boolean(o.hasError),
        };
      });
      const options = statements.map((s) => ({ id: s.id, label: oneLine(s.text, 72) }));
      const correctId =
        correct != null ? String(correct) : statements.find((s) => s.hasError)?.id ?? statements[0]?.id ?? "";
      return base("tap_choice", {
        prompt: oneLine(scene.prompt || "Which line breaks?"),
        interactionConfig: { options, layout: "stack", variant: "find_error" },
        correctAnswer: correctId,
        feedbackWrong: oneLine(defaultFeedbackWrong("tap_choice"), 120),
      });
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
      const order = correctOrder.length === items.length ? correctOrder : items.map((i) => i.id);
      return base("sequence_order", {
        interactionConfig: { items },
        correctAnswer: JSON.stringify(order),
        feedbackWrong: oneLine(defaultFeedbackWrong("sequence_order"), 120),
      });
    }

    case "drag_drop": {
      const rawItems = (content.items ?? content.draggables ?? []) as unknown[];
      const items = (Array.isArray(rawItems) ? rawItems : []).map((it, i) => {
        if (typeof it === "string") return { id: `item-${i}`, label: it };
        const o = it as Record<string, unknown>;
        return {
          id: String(o.id ?? o.key ?? `item-${i}`),
          label: String(o.label ?? o.text ?? o.value ?? o.id ?? `Item ${i + 1}`),
        };
      });
      const rawSlots = (content.slots ?? content.dropZones ?? content.targets ?? []) as unknown[];
      let slots = (Array.isArray(rawSlots) ? rawSlots : []).map((z, i) => {
        if (typeof z === "string") return { id: `slot-${i}`, label: z };
        const o = z as Record<string, unknown>;
        return {
          id: String(o.id ?? o.key ?? `slot-${i}`),
          label: o.label != null ? String(o.label) : undefined,
        };
      });

      const map: Record<string, string> = {};
      if (Array.isArray(correct)) {
        if (slots.length === 0 && correct.length > 0) {
          slots = correct.map((_, i) => ({ id: `drop-${i}`, label: `Target ${i + 1}` }));
        }
        slots.forEach((slot, i) => {
          const itemId = correct[i];
          if (typeof itemId === "string" && items.some((it) => it.id === itemId)) {
            map[slot.id] = itemId;
          }
        });
      } else if (correct && typeof correct === "object") {
        const obj = correct as Record<string, string>;
        if (slots.length === 0 && Object.keys(obj).length > 0) {
          slots = Object.keys(obj).map((id) => ({ id, label: id }));
        }
        slots.forEach((slot) => {
          const itemId = obj[slot.id];
          if (typeof itemId === "string") map[slot.id] = itemId;
        });
      }
      return base("drag_match", {
        prompt: sanitizeDragMatchPromptForTapUi(pickDragDropStem(scene, content)),
        interactionConfig: { items, slots },
        correctAnswer: JSON.stringify(map),
        feedbackWrong: oneLine(defaultFeedbackWrong("drag_match"), 120),
      });
    }

    case "slider_experiment": {
      const min = Number(content.min) ?? 0;
      const max = Number(content.max) ?? 100;
      const step = Number(content.step) ?? 1;
      const target = typeof correct === "number" ? correct : Number(correct) || (min + max) / 2;
      return base("slider_adjust", {
        interactionConfig: {
          min,
          max,
          step,
          unit: content.unit as string | undefined,
          tolerance: 2,
        },
        correctAnswer: String(target),
        feedbackWrong: oneLine(defaultFeedbackWrong("slider_adjust"), 120),
      });
    }

    case "tap_highlight": {
      const targets = (content.targets ?? []) as Array<{ id: string; label: string }>;
      const correctIds = Array.isArray(correct) ? correct.map(String) : [];
      return base("visual_toggle", {
        interactionConfig: { targets },
        correctAnswer: JSON.stringify(correctIds.slice().sort()),
        feedbackWrong: oneLine(defaultFeedbackWrong("visual_toggle"), 120),
      });
    }

    case "reflect":
      return base("fill_blank", {
        interactionConfig: { placeholder: "One line…", acceptAny: true },
        correctAnswer: "",
        feedbackCorrect: "Captured.",
        feedbackWrong: "",
      });

    case "visual_problem": {
      const { content: vpContent, coerced: dataTypeSlotCoerced } = coerceDataTypeVisualWorkspace(
        content,
        scene
      );
      let correctForVp: unknown = parseVisualProblemCorrectForMerge(scene) ?? correct;
      if (dataTypeSlotCoerced) {
        correctForVp = { answer: "" };
      }
      const merged = buildVisualProblemMergedCorrect(vpContent, correctForVp);
      const vw = (vpContent.visualWorkspace ?? {}) as Record<string, unknown>;
      const defaultPartWorkspace: Record<string, unknown> = { kind: "part_model", totalParts: 8 };
      let visualWorkspaceOut: Record<string, unknown> =
        (vpContent.visualWorkspace as Record<string, unknown> | undefined) ?? defaultPartWorkspace;
      let effectiveKind = String(vw.kind ?? "part_model");
      try {
        const parsed = JSON.parse(merged) as { visual?: { kind?: unknown } };
        const mk = String(parsed?.visual?.kind ?? "");
        if (mk === "none") {
          visualWorkspaceOut = { kind: "none" };
          effectiveKind = "none";
        }
      } catch {
        /* keep workspace from content */
      }
      const defWrongV =
        effectiveKind === "none"
          ? oneLine("There is no on-screen model for this step — focus on the scenario and your written answer.", 140)
          : effectiveKind === "slot_fill"
            ? oneLine("Drag one item into each slot in the correct order before the text answer unlocks.", 140)
            : effectiveKind === "node_link" || effectiveKind === "cause_effect_link"
              ? oneLine("Draw every arrow in the correct order so the flow matches the story.", 140)
              : oneLine("Adjust the model first — count shaded parts against the total.", 140);
      const defWrongA =
        effectiveKind === "none"
          ? oneLine(
              String(
                vpContent.feedbackWrongAnswer ??
                  "Re-read the question and scenario, then adjust your answer."
              ),
              140
            )
          : effectiveKind === "slot_fill"
            ? oneLine(
                "Your slots match the variables; if the prompt asks for a written summary, type the same type names in order.",
                140
              )
            : oneLine(
                "Your picture matches the story; rewrite the fraction or value to match the shaded model.",
                140
              );
      const defCorrect = oneLine(
        String(
          vpContent.feedbackCorrect ??
            scene.explanation ??
            "You matched the visual and the symbolic answer."
        ),
        220
      );
      return base("visual_problem", {
        prompt: oneLine(String(vpContent.finalPrompt ?? scene.prompt ?? scene.title)),
        interactionConfig: {
          problemScenario: String(vpContent.problemScenario ?? scene.title ?? ""),
          visualWorkspace: visualWorkspaceOut,
          answerPlaceholder: String(vpContent.answerPlaceholder ?? "Final answer…"),
          feedbackWrongVisual: String(vpContent.feedbackWrongVisual ?? defWrongV),
          feedbackWrongAnswer: String(vpContent.feedbackWrongAnswer ?? defWrongA),
          feedbackCorrect: String(vpContent.feedbackCorrect ?? defCorrect),
          looseText: vpContent.looseText !== false,
        },
        correctAnswer: merged,
        feedbackCorrect: defCorrect,
        feedbackWrong: oneLine(String(vpContent.feedbackWrong ?? "Try again — model or answer."), 120),
        masterySkill: String(content.masterySkill ?? `visual_reasoning:${effectiveKind}`),
        // Scenario is shown in MicroInteractionEngine only; avoid duplicating it in MicroVisualLayer.
        visualStateBefore: null,
        visualStateAfter: null,
      });
    }

    case "construct_answer":
    case "manipulate":
    case "simulate":
    default:
      return base("fill_blank", {
        interactionConfig: {
          placeholder: String(content.placeholder ?? "Short answer…"),
          loose: true,
        },
        correctAnswer: correct != null ? String(correct) : "",
        feedbackWrong: oneLine(defaultFeedbackWrong("fill_blank"), 120),
      });
  }
}

export function scenesToMicroSteps(scenes: MissionSceneData[]): RuntimeMicroStep[] {
  return [...scenes].sort((a, b) => a.orderIndex - b.orderIndex).map(sceneToMicroStep);
}
