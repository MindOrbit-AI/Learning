/**
 * OpenAI Provider - Real LLM integration
 * Set OPENAI_API_KEY (direct OpenAI) or AI_GATEWAY_API_KEY (Vercel AI Gateway).
 * Optional: OPENAI_BASE_URL, OPENAI_MODEL, AI_GATEWAY_BASE_URL.
 * Falls back to mock provider when neither key is set.
 */

import OpenAI from "openai";
import type {
  AIProvider,
  MissionContent,
  MissionContentParams,
  MissionSceneContent,
  ExtractedConcept,
  ContentDiagnosticQuestion,
  ContentSummaryJson,
  GeneratedSubjectStructure,
  InteractiveGameConfigJson,
  InteractiveGameGenerationParams,
} from "./interfaces";
import type { QuestionType } from "@mindorbit/types";
import { mockAIProvider } from "./mock-provider";

export type ResolvedLlm = { client: OpenAI; model: string };

/** Resolve OpenAI-compatible client: direct API key first, else Vercel AI Gateway. */
export function resolveLlm(): ResolvedLlm | null {
  if (typeof process === "undefined") return null;

  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  const gatewayKey = process.env.AI_GATEWAY_API_KEY?.trim();

  if (openaiKey) {
    const baseURL = process.env.OPENAI_BASE_URL?.trim() || undefined;
    const client = new OpenAI({ apiKey: openaiKey, baseURL });
    const envModel = process.env.OPENAI_MODEL?.trim();
    const model =
      envModel && envModel.length > 0
        ? envModel
        : baseURL?.includes("ai-gateway.vercel.sh")
          ? "openai/gpt-4o-mini"
          : "gpt-4o-mini";
    return { client, model };
  }

  if (gatewayKey) {
    const baseURL = process.env.AI_GATEWAY_BASE_URL?.trim() || "https://ai-gateway.vercel.sh/v1";
    const model = process.env.OPENAI_MODEL?.trim() || "openai/gpt-4o-mini";
    return { client: new OpenAI({ apiKey: gatewayKey, baseURL }), model };
  }

  return null;
}

async function chatLLM(
  llm: ResolvedLlm,
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  options?: { jsonMode?: boolean; maxTokens?: number }
): Promise<string> {
  const res = await llm.client.chat.completions.create({
    model: llm.model,
    messages,
    ...(options?.jsonMode && { response_format: { type: "json_object" } }),
    ...(options?.maxTokens != null && { max_tokens: options.maxTokens }),
  });
  const content = res.choices[0]?.message?.content?.trim();
  if (!content) throw new Error("Empty response from OpenAI");
  return content;
}

function createOpenAIProvider(): AIProvider {
  const llm = resolveLlm();
  if (!llm) return mockAIProvider;

  return {
    async summarizeNodeConcept(nodeTitle: string, nodeDescription: string): Promise<string> {
      const content = await chatLLM(llm, [
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
      const content = await chatLLM(llm,
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

    async generateSceneMissionContent(params: MissionContentParams): Promise<MissionSceneContent> {
      const content = await chatLLM(llm,
        [
          {
            role: "system",
            content: `You generate Brilliant-style interactive mission scenes. Return JSON:
{
  "title": "engaging title",
  "missionType": "discover"|"repair"|"simulation"|"challenge"|"review",
  "estimatedMinutes": 10-25,
  "scenes": [
    {
      "sceneType": "observe"|"predict"|"reveal"|"micro_quiz"|"drag_drop"|"sort_sequence"|"find_error"|"construct_answer"|"reflect"|"transfer",
      "title": "scene title",
      "prompt": "short prompt",
      "contentJson": { ... scene-specific structure ... },
      "correctAnswerJson": "optional JSON string for validation",
      "explanation": "optional",
      "hintLevel1": "optional",
      "hintLevel2": "optional",
      "hintLevel3": "optional",
      "orderIndex": 0
    }
  ]
}
Scene types: observe (visual intro), predict (choose before reveal), micro_quiz (mcq), sort_sequence (reorder steps), find_error (tap wrong step), construct_answer (type answer), reflect (open-ended), transfer (apply to new scenario).
For sort_sequence: contentJson MUST have "items" where EACH step is a valid, necessary step in the solution—no wrong steps (e.g. "set to zero" for linear equations), no redundant equivalents (use EITHER "divide by 2" OR "multiply by 1/2", not both). Items: [{ "id": "1", "label": "Step text", "correctOrder": 0 }, ...]. correctAnswerJson: ["1","2","3","4"] MUST be the exact correct order of item ids. The explanation MUST describe these same steps in order. When the steps solve a specific equation or expression (e.g. order of operations, solving for x), contentJson MUST also include "equation" with that expression (e.g. "(5+4) × 6 × 9 ÷ 3 + 18 - 7" or "2x + 3 = 11").
For find_error, contentJson MUST have: "statements": [{ "id": "1", "text": "step text", "hasError": true/false }, ...]. correctAnswerJson: "2" (id of step with error).
For micro_quiz/predict, contentJson MUST have: "options": [{ "id": "a", "label": "Answer A" }, ...]. correctAnswerJson is REQUIRED: use the option id (e.g. "a") or the exact label (e.g. "5" for numeric answers). Never omit correctAnswerJson for quiz scenes.
For construct_answer, correctAnswerJson: "13" or "x+7" (the exact expected answer as string).
Use simple values for correctAnswerJson, not nested objects.`,
          },
          {
            role: "user",
            content: `Create a scene-based mission for: ${params.nodeTitle} (slug: ${params.nodeSlug})`,
          },
        ],
        { jsonMode: true }
      );
      try {
        const parsed = JSON.parse(content) as Partial<MissionSceneContent>;
        const scenes = (parsed.scenes ?? []).map((s, i) => ({
          sceneType: (s.sceneType ?? "observe") as MissionSceneContent["scenes"][0]["sceneType"],
          title: s.title ?? `Step ${i + 1}`,
          prompt: s.prompt ?? "",
          contentJson: s.contentJson ?? {},
          correctAnswerJson: s.correctAnswerJson,
          explanation: s.explanation,
          hintLevel1: s.hintLevel1,
          hintLevel2: s.hintLevel2,
          hintLevel3: s.hintLevel3,
          orderIndex: i,
        }));
        return {
          title: parsed.title ?? `Master ${params.nodeTitle}`,
          missionType: (parsed.missionType ?? "discover") as MissionSceneContent["missionType"],
          estimatedMinutes: parsed.estimatedMinutes ?? 15,
          scenes,
        };
      } catch {
        return (mockAIProvider as AIProvider).generateSceneMissionContent?.(params) ?? {
          title: `Master ${params.nodeTitle}`,
          missionType: "discover",
          estimatedMinutes: 15,
          scenes: [],
        };
      }
    },

    async generatePracticeQuestions(
      nodeSlug: string,
      count: number
    ): Promise<MissionContent["practiceQuestions"]> {
      const content = await chatLLM(llm,
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
      const content = await chatLLM(llm, [
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
      const content = await chatLLM(llm, [
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
      const content = await chatLLM(llm,
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
      const content = await chatLLM(llm,
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
      const result = await chatLLM(llm,
        [
          {
            role: "system",
            content: `You are an expert study guide creator. Given document text, produce a JSON object with exactly these keys (no extra keys):
- title: string, a short descriptive title for the study set (e.g. "Introduction to Photosynthesis", "World War II Key Events"). Max ~60 chars.
- category: string, a short subject/category that best fits the content. Use a single, common label such as: "Biology", "Chemistry", "Physics", "Mathematics", "History", "Geography", "Literature", "Language", "Computer Science", "Business", "Economics", "Psychology", "Philosophy", "Art", "Music", "Other". Pick the single best fit; if unclear, use "General".
- shortSummary: string, a short summary of the content.
- deepSummary: string, HTML content (use <h2>, <h3>, <p>, <ul>, <li>, <strong>). Summarize the document into a clear study guide.
  - Preserve any emojis from the source text and use emojis in the study guide where they help (e.g. in section headings, bullet points, or key terms). Keep the tone engaging and scannable.
  - When the source refers to figures, diagrams, charts, or images (e.g. "Figure 1", "see diagram below", "as shown in the chart"), include a short descriptive note in the study guide and use an appropriate emoji to represent the visual (e.g. 📊 for charts/graphs, 📈 for trends, 🖼️ for figures, 📷 for photos, 📉 for declines). Example: "<p>📊 <strong>Figure:</strong> The diagram shows the process flow from A to B.</p>". This helps readers recall where visuals appeared in the original.
- flashcards: array of { "front": string, "back": string }, 10-20 items. Cover the main concepts, terms, and facts from the document. Front = question or term, back = answer. Prefer 15+ items when the content supports it.
- quizQuestions: array of { "question": string, "options": string[], "correctIndex": number }, 8-15 items. Cover key concepts and facts; prefer 10+ when content supports it. correctIndex is 0-based.
- knowledgeMap: Build a hierarchical concept map that reflects the document's real structure and helps with studying.
  - nodes: Array of { "id": string (e.g. "n1", "n2"), "label": string, "description": string, "level": number }.
  - level 0 = main themes/big ideas (2-4 nodes): use short, specific labels drawn from the document (e.g. "Photosynthesis", "Game theory in relationships", "Pitch deck structure"). description = one sentence on why this theme matters or what it covers.
  - level 1 = sub-concepts (3-8 nodes): key topics or concepts that belong under the main themes. Labels = concise noun phrases. description = brief definition or how it connects to the theme.
  - level 2 = details (0-6 nodes): specific facts, examples, or terms that support level-1 concepts. description = short clarification or example.
  - Every node must have a non-empty "description" that is useful for recall.
  - edges: Array of { "from": node id, "to": node id }. Only include edges where there is a real conceptual relationship: e.g. "part of", "leads to", "depends on", "example of". Prefer edges from level-0 to level-1 and level-1 to level-2 so the map reads top-down. 4-15 edges total.
Return only valid JSON, no markdown code fence.
- quizzes: array of 5-10 quiz questions, each with { prompt, type: "multiple_choice"|"short_answer"|"true_false", options: string[]|null, correctAnswer, explanation }`,
          },
          {
            role: "user",
            content: `Summarize this content:\n\n${truncated}`,
          },
        ],
        { jsonMode: true, maxTokens: 16384 }
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

    async generateSubjectDescription(title: string): Promise<string> {
      const content = await chatLLM(llm, [
        {
          role: "system",
          content:
            "You are an expert curriculum designer. Given a subject title, write a brief 2-3 sentence description of the subject and what learners will master. Be concise and educational.",
        },
        {
          role: "user",
          content: `Write a brief description for the subject: ${title}`,
        },
      ]);
      return content.trim();
    },

    async generateSubjectStructure(
      title: string,
      description: string
    ): Promise<GeneratedSubjectStructure> {
      const content = await chatLLM(llm,
        [
          {
            role: "system",
            content: `You are an expert curriculum designer. Given a subject title and description, generate a learning graph structure.

Return JSON with exactly these keys:
- clusters: array of { slug (URL-safe, e.g. "foundations"), title, description, orderIndex (0-based) }
- concepts: array of { slug (URL-safe), title, description, clusterSlug (must match a cluster slug), orderIndex (0-based), difficulty?: "easy"|"medium"|"hard" }
- edges: array of { sourceSlug, targetSlug, relationshipType: "prerequisite"|"related"|"extends" }

Rules:
- Create 3-6 clusters that logically divide the subject
- Create 8-20 concepts distributed across clusters
- Each concept must reference an existing clusterSlug
- Edges use concept slugs; prerequisite = A must come before B; related = conceptually linked; extends = B builds on A
- Ensure prerequisite edges form a sensible learning path (foundational concepts first)
- All slugs: lowercase, hyphenated, [a-z0-9-] only`,
          },
          {
            role: "user",
            content: `Subject: ${title}\n\n${description}\n\nGenerate the full structure.`,
          },
        ],
        { jsonMode: true }
      );
      try {
        const parsed = JSON.parse(content) as Partial<GeneratedSubjectStructure>;
        const clusters = (parsed.clusters ?? []).map((c, i) => ({
          slug: (c.slug as string) ?? `cluster-${i}`,
          title: (c.title as string) ?? "Untitled Cluster",
          description: (c.description as string) ?? "",
          orderIndex: (c.orderIndex as number) ?? i,
        }));
        const concepts = (parsed.concepts ?? []).map((c, i) => ({
          slug: (c.slug as string) ?? `concept-${i}`,
          title: (c.title as string) ?? "Untitled Concept",
          description: (c.description as string) ?? "",
          clusterSlug: (c.clusterSlug as string) ?? clusters[0]?.slug ?? "main",
          orderIndex: (c.orderIndex as number) ?? i,
          difficulty: (c.difficulty as string) ?? "medium",
        }));
        const edges = (parsed.edges ?? []).map((e) => ({
          sourceSlug: (e.sourceSlug as string) ?? "",
          targetSlug: (e.targetSlug as string) ?? "",
          relationshipType: ((e.relationshipType as string) ?? "prerequisite") as
            | "prerequisite"
            | "related"
            | "extends",
        }));
        return { clusters, concepts, edges };
      } catch {
        return mockAIProvider.generateSubjectStructure(title, description);
      }
    },

    async extractTextFromImage(buffer: Buffer, mimeType: string): Promise<string> {
      const base64 = buffer.toString("base64");
      const url = `data:${mimeType};base64,${base64}`;
      const res = await llm.client.chat.completions.create({
        model: llm.model,
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

    async selectMostRelevantSubject(
      subjects: Array<{ id: string; slug: string; title: string; description: string }>,
      contentSummary: string
    ): Promise<string | null> {
      if (subjects.length === 0) return null;
      if (subjects.length === 1) return subjects[0]?.id ?? null;
      const list = subjects.map((s) => `- ${s.id}: ${s.title} (${s.slug}) - ${s.description}`).join("\n");
      const content = await chatLLM(llm,
        [
          {
            role: "system",
            content: `You select the single most relevant academic subject for the given content. Return ONLY the subject id, nothing else. Match by topic (e.g. algebra video → Algebra, physics lecture → Physics). If none fits well, return the first one.`,
          },
          {
            role: "user",
            content: `Subjects:\n${list}\n\nContent summary:\n${contentSummary.slice(0, 2000)}\n\nReturn the subject id:`,
          },
        ],
        {}
      );
      const id = content.trim();
      return subjects.some((s) => s.id === id) ? id : subjects[0]?.id ?? null;
    },

    async selectMostRelevantCluster(
      clusters: Array<{ id: string; title: string; description: string }>,
      contentSummary: string
    ): Promise<string | null> {
      if (clusters.length === 0) return null;
      if (clusters.length === 1) return clusters[0]?.id ?? null;
      const list = clusters.map((c) => `- ${c.id}: ${c.title} (${c.description})`).join("\n");
      const content = await chatLLM(llm,
        [
          {
            role: "system",
            content: `You select the single most relevant cluster for given content. Return ONLY the cluster id, nothing else. If none fits well, return the first one.`,
          },
          {
            role: "user",
            content: `Clusters:\n${list}\n\nContent summary:\n${contentSummary.slice(0, 1500)}\n\nReturn the cluster id:`,
          },
        ],
        {}
      );
      const id = content.trim();
      return clusters.some((c) => c.id === id) ? id : clusters[0]?.id ?? null;
    },

    async selectMostRelevantNode(
      nodes: Array<{ id: string; title: string; description: string }>,
      contentSummary: string
    ): Promise<string | null> {
      if (nodes.length === 0) return null;
      if (nodes.length === 1) return nodes[0]?.id ?? null;
      const list = nodes.map((n) => `- ${n.id}: ${n.title} (${n.description})`).join("\n");
      const content = await chatLLM(llm,
        [
          {
            role: "system",
            content: `You select the single most relevant concept node for given content. Return ONLY the node id, nothing else. If none fits well, return the first one.`,
          },
          {
            role: "user",
            content: `Nodes:\n${list}\n\nContent summary:\n${contentSummary.slice(0, 1500)}\n\nReturn the node id:`,
          },
        ],
        {}
      );
      const id = content.trim();
      return nodes.some((n) => n.id === id) ? id : nodes[0]?.id ?? null;
    },

    async generateInteractiveGameConfig(
      params: InteractiveGameGenerationParams
    ): Promise<InteractiveGameConfigJson> {
      const system = `You are MindOrbit's Interactive Game Generator.
Generate a playable educational game. Return ONLY valid JSON (no markdown).

Universal envelope (always include these top-level keys):
{
  "title": string,
  "description": string,
  "subject": string,
  "topic": string,
  "gradeLevel": string,
  "gameMode": string,
  "estimatedMinutes": number,
  "concepts": [{ "name": string, "skill": string, "difficulty": "easy"|"medium"|"hard" }],
  "scoring": { "basePoints": number, "speedBonus": boolean, "streakBonus": boolean, "maxScore": number },
  "gameConfig": object
}

Rules:
- Age-appropriate for the grade level.
- Teach through interaction; include immediate feedback strings.
- At least one misconception trap (plausible wrong reasoning).
- Include scoring that fits the mode.
- gameMode in output must equal: ${params.gameMode}

Mode-specific gameConfig shapes:
- CONCEPT_BATTLE: playerHealth, opponentHealth, rounds[{question,choices,correctAnswer,feedback,damage,concept,difficulty}], powerUps
- SPEED_RUN: durationSeconds, questions[{question,choices,correctAnswer,feedback,concept,difficulty}]
- BUILD_SYSTEM: components[{id,label,description}], correctConnections[{from,to,relationship}], distractors, validationRules
- FIND_MISTAKE: scenario, flawedExplanation, mistakes[{id,text,whyWrong,correction,concept,primary?:boolean}] (exactly one primary:true OR set correctMistakeId to the flawed claim id), correctMistakeId (id string, optional if one primary), correctVersion
- PUZZLE_PATH: nodes array in play order; each {id,title,challenge,choices[],correctAnswer (exact string matching one choice),unlockAfter (ids of prior nodes required; first node []),concept}
- SIMULATION_LAB: variables[{id,label,min,max,default}], goal, rules[{condition,result}], idealSettings, feedbackStates
- DECISION_SIMULATOR: initialScenario, states[{id,narrative,choices[{text,nextStateId,effect,scoreDelta,concept}]}], endings
- LAB_ESCAPE_ROOM: rooms[{id,title,clue,puzzle,choices,correctAnswer,unlockCode,concept}], timeLimitSeconds
- VISUAL_BUILDER: items[{id,label,category}], dropZones[{id,label,acceptedItems: itemId[]}], diagramGoal — each item id appears in exactly one zone’s acceptedItems; a zone may list multiple ids (multiset). Partition must match items.
- ADAPTIVE_QUIZ: startingDifficulty, questions[{question,choices,correctAnswer,feedback,concept,difficulty,followUpIfWrong}], adaptiveRules

Use 4–8 questions for quiz-like modes unless the mode needs fewer.`;

      const user = JSON.stringify({
        subject: params.subjectTitle,
        topic: params.topic,
        gradeLevel: params.gradeLevel,
        learningGoal: params.learningGoal,
        gameMode: params.gameMode,
      });

      try {
        const content = await chatLLM(llm,
          [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          { jsonMode: true, maxTokens: 4096 }
        );
        const parsed = JSON.parse(content) as InteractiveGameConfigJson;
        if (parsed && typeof parsed === "object" && parsed.gameConfig != null) {
          return parsed;
        }
      } catch {
        /* fall through */
      }
      return mockAIProvider.generateInteractiveGameConfig(params);
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
