import { z } from "zod";
import { sceneSchema } from "./scene-schema";

export const visualLessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  subject: z.string(),
  topic: z.string(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  scenes: z.array(sceneSchema).min(1),
  finalMasteryCheck: sceneSchema,
});

export type VisualLessonIn = z.infer<typeof visualLessonSchema>;
