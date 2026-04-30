import OpenAI from "openai";
import { z } from "zod";
import type { GenerateSongRequest, MusicLearningAsset } from "../models/types.js";
import { buildMusicPrompt } from "../prompts/music.prompt.js";
import { normalizeLlmPayload } from "../utils/normalize-asset.js";
import { extractJsonObject } from "../utils/parse-json.js";

const llmSchema = z.object({
  rap: z.object({
    verse: z.string(),
    hook: z.string(),
    bpm: z.union([z.number(), z.string()]),
    style: z.string(),
  }),
  chant: z
    .object({
      lines: z.array(z.union([z.string(), z.number()])).optional(),
      rhythmPattern: z.string().optional(),
    })
    .optional(),
  melody: z.object({
    lyrics: z.string(),
    tone: z.string(),
  }),
  reinforcement: z.object({
    boost: z.string(),
    recall: z.string(),
  }),
});

function normalizeSecret(value: string | undefined): string | undefined {
  if (value == null) return undefined;
  const t = value.trim().replace(/^\uFEFF/, "");
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1).trim();
  }
  return t;
}

function getClient(): OpenAI {
  const apiKey = normalizeSecret(process.env.OPENAI_API_KEY);
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  const baseURL = normalizeSecret(process.env.OPENAI_BASE_URL);
  const organization =
    normalizeSecret(process.env.OPENAI_ORG_ID) ?? normalizeSecret(process.env.OPENAI_ORGANIZATION) ?? null;
  const project = normalizeSecret(process.env.OPENAI_PROJECT_ID) ?? null;

  return new OpenAI({
    apiKey,
    ...(baseURL ? { baseURL } : {}),
    ...(organization ? { organization } : {}),
    ...(project ? { project } : {}),
  });
}

export async function generateMusicAssets(concept: GenerateSongRequest): Promise<MusicLearningAsset> {
  const client = getClient();
  const model = process.env.OPENAI_MUSIC_MODEL ?? "gpt-4o-mini";
  const prompt = buildMusicPrompt(concept);

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.85,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You output only valid JSON objects matching the user schema. No markdown fences, no commentary.",
      },
      { role: "user", content: prompt },
    ],
  });

  const text = completion.choices[0]?.message?.content;
  if (!text) {
    throw new Error("Empty LLM response");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJsonObject(text)) as unknown;
  } catch {
    throw new Error("LLM returned non-JSON content");
  }

  const validated = llmSchema.safeParse(parsed);
  if (!validated.success) {
    throw new Error(`LLM JSON failed validation: ${validated.error.message}`);
  }

  return normalizeLlmPayload(validated.data, concept.conceptId, concept.difficulty);
}
