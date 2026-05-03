/**
 * Mission Engine - Create missions for weak / learning nodes
 */

import { prisma } from "@mindorbit/db";
import { getAIProvider } from "@mindorbit/ai";

export async function createMissionsForWeakNodes(
  userId: string,
  subjectId: string,
  nodeIds: string[]
) {
  const created: string[] = [];
  for (const nodeId of nodeIds) {
    const node = await prisma.conceptNode.findUnique({
      where: { id: nodeId },
    });
    if (!node) continue;

    const existing = await prisma.mission.findFirst({
      where: {
        userId,
        nodeId,
        status: { in: ["not_started", "in_progress"] },
      },
    });
    if (existing) continue;

    const content = await getAIProvider().generateMissionContent({
      nodeId: node.id,
      nodeSlug: node.slug,
      nodeTitle: node.title,
    });

    const exampleValue =
      content.example == null
        ? null
        : typeof content.example === "string"
          ? content.example
          : JSON.stringify(content.example);

    const mission = await prisma.mission.create({
      data: {
        userId,
        subjectId,
        nodeId,
        title: content.title,
        explanation: content.explanation,
        example: exampleValue,
        reflectionPrompt: content.reflectionPrompt,
        variationPrompt: content.variationPrompt,
        estimatedMinutes: content.estimatedMinutes,
        status: "not_started",
      },
    });

    for (const t of content.practiceQuestions) {
      await prisma.missionTask.create({
        data: {
          missionId: mission.id,
          type: t.type,
          prompt: t.prompt,
          optionsJson: t.options ? JSON.stringify(t.options) : null,
          correctAnswer: t.correctAnswer,
          explanation: t.explanation,
          orderIndex: t.orderIndex,
        },
      });
    }
    created.push(mission.id);
  }
  return created;
}
