import { z } from "zod";

const validationRuleSchema: z.ZodType<import("@/types/scene").ValidationRule> = z.discriminatedUnion(
  "type",
  [
    z.object({ type: z.literal("exact_selection"), expected: z.array(z.number()) }),
    z.object({ type: z.literal("count_match"), expectedCount: z.number() }),
    z.object({ type: z.literal("ordered_sequence"), expectedOrder: z.array(z.string()) }),
    z.object({
      type: z.literal("point_match"),
      expectedPoint: z.object({ x: z.number(), y: z.number() }),
      tolerance: z.number().optional(),
    }),
    z.object({ type: z.literal("choice_match"), expectedChoice: z.string() }),
    z.object({ type: z.literal("balance_match"), left: z.array(z.number()), right: z.array(z.number()) }),
    z.object({ type: z.literal("balance_sum"), targetSum: z.number() }),
    z.object({
      type: z.literal("gear_match"),
      driverTeeth: z.number(),
      drivenTeeth: z.number(),
    }),
    z.object({
      type: z.literal("slot_match"),
      expected: z.record(z.string()),
    }),
  ],
);

export const sceneSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum([
    "fraction_bar",
    "number_line",
    "grid_model",
    "drag_drop_sort",
    "drag_drop_match",
    "graph_plot",
    "concept_map",
    "multiple_choice",
    "slider",
    "venn_two",
    "true_false",
    "segment_select",
    "balance_scale",
    "gear",
  ]),
  prompt: z.string(),
  visualPrompt: z.string(),
  data: z.record(z.unknown()),
  interaction: z.enum([
    "tap_to_fill",
    "drag_to_place",
    "reorder",
    "place_point",
    "connect_nodes",
    "select_choice",
  ]),
  validation: validationRuleSchema,
  feedback: z.object({
    correct: z.string(),
    incorrect: z.string(),
    hint: z.string().optional(),
  }),
  masteryTarget: z.object({
    conceptNodeId: z.string(),
    skill: z.string(),
  }),
});

export type SceneSchemaIn = z.infer<typeof sceneSchema>;
