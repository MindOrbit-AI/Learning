/**
 * OpenAI Provider - Real LLM integration
 * Set OPENAI_API_KEY in env to enable. Falls back to mock provider when unset.
 */

import OpenAI from "openai";
import type {
  AIProvider,
  MissionContent,
  MissionContentParams,
  ExtractedConcept,
  ContentDiagnosticQuestion,
  ContentSummaryJson,
} from "./interfaces";
import type { QuestionType } from "@mindorbit/types";
import { mockAIProvider } from "./mock-provider";

const MODEL = "gpt-4o-mini";

function getClient(): OpenAI | null {
  const key = typeof process !== "undefined" ? process.env.OPENAI_API_KEY : undefined;
  if (!key?.trim()) return null;
  return new OpenAI({ apiKey: key });
}

async function chat(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  options?: { jsonMode?: boolean }
): Promise<string> {
  const client = getClient();
  if (!client) throw new Error("OPENAI_API_KEY is not set");
  const res = await client.chat.completions.create({
    model: MODEL,
    messages,
    ...(options?.jsonMode && { response_format: { type: "json_object" } }),
  });
  const content = res.choices[0]?.message?.content?.trim();
  if (!content) throw new Error("Empty response from OpenAI");
  return content;
}

function createOpenAIProvider(): AIProvider {
  const client = getClient();
  if (!client) return mockAIProvider;

  return {
    async summarizeNodeConcept(nodeTitle: string, nodeDescription: string): Promise<string> {
      const content = await chat([
        {
          role: "system",
          content:
            "You are an educational assistant. Summarize concepts concisely in 1-2 sentences for learners.",
        },
        {
          role: "user",
          content: `Summarize this concept in 1-2 sentences:\n\n**${nodeTitle}**\n\n${nodeDescription.slice(0, 500)}`,
        },
      ]);
      return content;
    },

    async generateMissionContent(params: MissionContentParams): Promise<MissionContent> {
      const content = await chat(
        [
          {
            role: "system",
            content: `You generate learning missions for educational concepts. Return a JSON object with:
- title: engaging mission title
- explanation: 2-3 paragraph explanation of the concept
- example: worked example
- reflectionPrompt: prompt for student reflection
- variationPrompt: prompt to try a variation
- estimatedMinutes: number (10-25)
- practiceQuestions: array of { prompt, type: "multiple_choice"|"short_answer"|"true_false", options: string[]|null, correctAnswer, explanation, orderIndex }`,
          },
          {
            role: "user",
            content: `Create a mission for: ${params.nodeTitle} (slug: ${params.nodeSlug})`,
          },
        ],
        { jsonMode: true }
      );
      try {
        const parsed = JSON.parse(content) as Partial<MissionContent>;
        const questions = (parsed.practiceQuestions ?? []).slice(0, 5).map((q, i) => ({
          prompt: (q as { prompt?: string }).prompt ?? "Explain this concept.",
          type: ((q as { type?: string }).type ?? "multiple_choice") as QuestionType,
          options: (q as { options?: string[] | null }).options ?? null,
          correctAnswer: (q as { correctAnswer?: string }).correctAnswer ?? "",
          explanation: (q as { explanation?: string }).explanation ?? "",
          orderIndex: i,
        }));
        return {
          title: parsed.title ?? `Master ${params.nodeTitle}`,
          explanation: parsed.explanation ?? "",
          example: parsed.example ?? "",
          reflectionPrompt: parsed.reflectionPrompt ?? "What was the key insight?",
          variationPrompt: parsed.variationPrompt ?? "Try a variation.",
          estimatedMinutes: parsed.estimatedMinutes ?? 15,
          practiceQuestions: questions,
        };
      } catch {
        return mockAIProvider.generateMissionContent(params);
      }
    },

    async generatePracticeQuestions(
      nodeSlug: string,
      count: number
    ): Promise<MissionContent["practiceQuestions"]> {
      const content = await chat(
        [
          {
            role: "system",
            content: `Return JSON: { "questions": [ { "prompt", "type": "multiple_choice"|"short_answer"|"true_false", "options": string[]|null, "correctAnswer", "explanation" } ] }`,
          },
          {
            role: "user",
            content: `Generate ${count} practice questions for concept slug: ${nodeSlug}`,
          },
        ],
        { jsonMode: true }
      );
      try {
        const parsed = JSON.parse(content) as { questions?: Array<Record<string, unknown>> };
        const qs = (parsed.questions ?? []).slice(0, count);
        return qs.map((q, i) => ({
          prompt: (q.prompt as string) ?? "Explain.",
          type: (q.type as QuestionType) ?? "multiple_choice",
          options: (q.options as string[] | null) ?? null,
          correctAnswer: (q.correctAnswer as string) ?? "",
          explanation: (q.explanation as string) ?? "",
          orderIndex: i,
        }));
      } catch {
        return mockAIProvider.generatePracticeQuestions(nodeSlug, count);
      }
    },

    async generateReflectionPrompt(nodeTitle: string): Promise<string> {
      const content = await chat([
        {
          role: "system",
          content: "You write reflection prompts for learners. One sentence, question format.",
        },
        {
          role: "user",
          content: `Write a reflection prompt for someone who just learned: ${nodeTitle}`,
        },
      ]);
      return content;
    },

    async generateDiagnosticExplanation(
      questionPrompt: string,
      correctAnswer: string
    ): Promise<string> {
      const content = await chat([
        {
          role: "system",
          content:
            "You explain why an answer is correct in 1-2 sentences for learners.",
        },
        {
          role: "user",
          content: `Question: ${questionPrompt}\nCorrect answer: ${correctAnswer}\nExplain why this is correct.`,
        },
      ]);
      return content;
    },

    async recommendResources(nodeId: string, _userId: string): Promise<string[]> {
      return [];
    },

    async extractConceptsFromContent(text: string): Promise<ExtractedConcept[]> {
      const truncated = text.slice(0, 8000);
      const content = await chat(
        [
          {
            role: "system",
            content: `Extract distinct learning concepts from the text. Return JSON: { "concepts": [ { "title", "description", "slug" (URL-safe), "confidence" (0-1) } ] }`,
          },
          {
            role: "user",
            content: truncated,
          },
        ],
        { jsonMode: true }
      );
      try {
        const parsed = JSON.parse(content) as { concepts?: Array<Record<string, unknown>> };
        const concepts = (parsed.concepts ?? []).slice(0, 20);
        return concepts.map((c) => ({
          title: (c.title as string) ?? "Unknown",
          description: (c.description as string) ?? "",
          slug: (c.slug as string) ?? "concept",
          confidence: Math.min(1, Math.max(0, (c.confidence as number) ?? 0.7)),
        }));
      } catch {
        return mockAIProvider.extractConceptsFromContent(text);
      }
    },

    async generateDiagnosticQuestionsFromContent(
      conceptText: string,
      conceptTitle: string,
      count = 3
    ): Promise<ContentDiagnosticQuestion[]> {
      const truncated = conceptText.slice(0, 3000);
      const content = await chat(
        [
          {
            role: "system",
            content: `Generate diagnostic questions from the concept content. Return JSON: { "questions": [ { "prompt", "type": "multiple_choice"|"short_answer"|"true_false", "options": string[]|null, "correctAnswer", "explanation" } ] }`,
          },
          {
            role: "user",
            content: `Concept: ${conceptTitle}\n\nContent:\n${truncated}\n\nGenerate ${count} questions.`,
          },
        ],
        { jsonMode: true }
      );
      try {
        const parsed = JSON.parse(content) as { questions?: Array<Record<string, unknown>> };
        const qs = (parsed.questions ?? []).slice(0, count);
        return qs.map((q) => ({
          prompt: (q.prompt as string) ?? "",
          type: (q.type as ContentDiagnosticQuestion["type"]) ?? "multiple_choice",
          options: (q.options as string[] | null) ?? null,
          correctAnswer: (q.correctAnswer as string) ?? "",
          explanation: (q.explanation as string) ?? "",
        }));
      } catch {
        return mockAIProvider.generateDiagnosticQuestionsFromContent(
          conceptText,
          conceptTitle,
          count
        );
      }
    },

    async summarizeContentToJson(content: string): Promise<ContentSummaryJson> {
      const truncated = content.slice(0, 12000);
      const result = await chat(
        [
          {
            role: "system",
            content: `You are an educational assistant. Analyze the given content and return a JSON object with:
- title: concise, descriptive title for the content (max ~60 chars)
- flashcards: array of { front: string, back: string } - 5-10 key flashcards for study
- shortSummary: 2-4 sentence concise overview
- deepSummary: detailed 2-4 paragraph summary covering main concepts
- quizzes: array of 3-5 quiz questions, each with { prompt, type: "multiple_choice"|"short_answer"|"true_false", options: string[]|null, correctAnswer, explanation }`,
          },
          {
            role: "user",
            content: `Summarize this content:\n\n${truncated}`,
          },
        ],
        { jsonMode: true }
      );
      try {
        const parsed = JSON.parse(result) as Partial<ContentSummaryJson>;
        const flashcards = (parsed.flashcards ?? []).slice(0, 15).map((f) => ({
          front: (f as { front?: string }).front ?? "",
          back: (f as { back?: string }).back ?? "",
        }));
        const quizzes = (parsed.quizzes ?? []).slice(0, 5).map((q) => ({
          prompt: (q as { prompt?: string }).prompt ?? "",
          type: ((q as { type?: string }).type ?? "multiple_choice") as ContentSummaryJson["quizzes"][0]["type"],
          options: (q as { options?: string[] | null }).options ?? null,
          correctAnswer: (q as { correctAnswer?: string }).correctAnswer ?? "",
          explanation: (q as { explanation?: string }).explanation ?? "",
        }));
        return {
          title: parsed.title ?? "",
          flashcards,
          shortSummary: parsed.shortSummary ?? "",
          deepSummary: parsed.deepSummary ?? "",
          quizzes,
        };
      } catch {
        return mockAIProvider.summarizeContentToJson(content);
      }
    },

    async extractTextFromImage(buffer: Buffer, mimeType: string): Promise<string> {
      const base64 = buffer.toString("base64");
      const url = `data:${mimeType};base64,${base64}`;
      const res = await client.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "You extract educational content from images. For diagrams, charts, handwritten notes, or textbook screenshots: transcribe all visible text, describe diagrams/formulas in detail, and summarize the main learning concepts. Return plain text suitable for concept extraction.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Extract all text and describe the educational content in this image in detail." },
              { type: "image_url", image_url: { url } },
            ],
          },
        ],
      });
      const content = res.choices[0]?.message?.content?.trim();
      return content ?? "";
    },
  };
}

let _cached: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (_cached) return _cached;
  _cached = createOpenAIProvider();
  return _cached;
}

export const openAIProvider: AIProvider = createOpenAIProvider();
