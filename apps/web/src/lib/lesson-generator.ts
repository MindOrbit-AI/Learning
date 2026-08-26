import { visualLessonSchema } from "./lesson-schema";
import { lessonPassesVisualInteractionRule } from "./scene-registry";
import type { VisualLesson } from "@/types/lesson";

export const VISUAL_LESSON_SYSTEM_PROMPT = `You are MindOrbit’s Visual Problem Solving Engine.

Generate Brilliant-style interactive lessons where students solve by manipulating visuals.

Every lesson must be a sequence of scenes.

Each scene must include:
- A visual workspace
- A required user interaction
- A validation rule
- Feedback that references the visual action
- A mastery target

Do not create passive textbook explanations.
Do not rely only on multiple choice or true/false.
The learner must build, shade, drag, connect, place, sort, or label something before answering.
Scene types include: fraction_bar, number_line, grid_model, drag_drop_sort, drag_drop_match, graph_plot, concept_map, multiple_choice, slider, venn_two, true_false, segment_select, balance_scale, gear.

Return valid JSON only.`;

export type GenerateLessonInput = {
  subject: string;
  topic: string;
  level: "beginner" | "intermediate" | "advanced";
  userId: string;
};

/**
 * Stub: swap for an LLM call that returns JSON, then `assertValidGeneratedLesson`.
 * Today returns `null` so callers fall back to curated seeds.
 */
export async function generateLessonFromModel(_input: GenerateLessonInput): Promise<VisualLesson | null> {
  return null;
}

export function assertValidGeneratedLesson(lesson: unknown): VisualLesson {
  const parsed = visualLessonSchema.parse(lesson);
  if (!lessonPassesVisualInteractionRule(parsed)) {
    throw new Error(
      "Generated lesson rejected: fewer than 70% of scenes require visual manipulation (non–multiple-choice).",
    );
  }
  return parsed;
}

export async function generateOrRejectLesson(
  input: GenerateLessonInput,
  fallback: VisualLesson,
): Promise<VisualLesson> {
  const generated = await generateLessonFromModel(input);
  if (!generated) return fallback;
  return assertValidGeneratedLesson(generated);
}
