/**
 * Retrieval-based review sessions — 3–5 varied items per due node.
 */

import { prisma } from "@mindorbit/db";

export interface ReviewSessionQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  sceneType?: string | null;
}

const MIN_QUESTIONS = 3;
const MAX_QUESTIONS = 5;

function parseOptions(optionsJson: string | null): string[] {
  if (!optionsJson) return [];
  try {
    const parsed = JSON.parse(optionsJson);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function fallbackQuestions(nodeTitle: string, description: string | null): ReviewSessionQuestion[] {
  const desc = description ?? nodeTitle;
  return [
    {
      id: "fallback-1",
      prompt: `Which statement best describes ${nodeTitle}?`,
      options: [
        desc.slice(0, 120),
        `A unrelated concept not connected to ${nodeTitle}`,
        `The opposite of what ${nodeTitle} means`,
        `None of the above`,
      ],
      correctAnswer: desc.slice(0, 120),
      explanation: `This concept is about: ${desc.slice(0, 200)}`,
      sceneType: "recall",
    },
    {
      id: "fallback-2",
      prompt: `When would you apply ${nodeTitle}?`,
      options: [
        `When solving problems that require ${nodeTitle.toLowerCase()}`,
        `Never — it is not used in practice`,
        `Only on multiple-choice tests with no real application`,
        `Only after mastering every other subject first`,
      ],
      correctAnswer: `When solving problems that require ${nodeTitle.toLowerCase()}`,
      explanation: `${nodeTitle} is a building block used in related problems.`,
      sceneType: "application",
    },
    {
      id: "fallback-3",
      prompt: `True or false: You can skip ${nodeTitle} and still master advanced topics that depend on it.`,
      options: ["True", "False"],
      correctAnswer: "False",
      explanation: `Gaps in ${nodeTitle} usually cause difficulty in connected concepts later.`,
      sceneType: "reasoning",
    },
  ];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export async function generateReviewSession(
  userId: string,
  reviewItemId: string
): Promise<{ questions: ReviewSessionQuestion[]; nodeTitle: string; nodeId: string; subjectId: string }> {
  const item = await prisma.reviewQueueItem.findUnique({
    where: { id: reviewItemId },
    include: { node: true },
  });

  if (!item || item.userId !== userId) {
    throw new Error("Review item not found");
  }

  const [diagnosticQs, calibratedQs] = await Promise.all([
    prisma.diagnosticQuestion.findMany({
      where: {
        nodeId: item.nodeId,
        status: "published",
        isCalibrated: false,
      },
      take: 10,
    }),
    prisma.diagnosticQuestion.findMany({
      where: {
        nodeId: item.nodeId,
        status: "published",
        isCalibrated: true,
      },
      take: 5,
    }),
  ]);

  const pool = shuffle([...calibratedQs, ...diagnosticQs]);
  const seenSceneTypes = new Set<string>();
  const selected: ReviewSessionQuestion[] = [];

  for (const q of pool) {
    if (selected.length >= MAX_QUESTIONS) break;
    const sceneType = q.sceneType ?? q.type;
    if (seenSceneTypes.has(sceneType) && selected.length >= MIN_QUESTIONS) continue;

    const options = parseOptions(q.optionsJson);
    if (options.length === 0 && q.type !== "short_answer") continue;

    selected.push({
      id: q.id,
      prompt: q.prompt,
      options: options.length > 0 ? options : [q.correctAnswer, "Incorrect option A", "Incorrect option B"],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      sceneType: q.sceneType,
    });
    seenSceneTypes.add(sceneType);
  }

  if (selected.length < MIN_QUESTIONS) {
    const fallbacks = fallbackQuestions(item.node.title, item.node.description);
    for (const fb of fallbacks) {
      if (selected.length >= MIN_QUESTIONS) break;
      if (!seenSceneTypes.has(fb.sceneType ?? "")) {
        selected.push(fb);
        seenSceneTypes.add(fb.sceneType ?? "");
      }
    }
  }

  return {
    questions: selected.slice(0, MAX_QUESTIONS),
    nodeTitle: item.node.title,
    nodeId: item.nodeId,
    subjectId: item.subjectId,
  };
}
