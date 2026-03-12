/**
 * MindOrbit AI - Interface abstractions for future LLM integration
 */

import type { QuestionType } from "@mindorbit/types";

export interface MissionContent {
  title: string;
  explanation: string;
  example: string;
  reflectionPrompt: string;
  variationPrompt: string;
  estimatedMinutes: number;
  practiceQuestions: Array<{
    prompt: string;
    type: QuestionType;
    options: string[] | null;
    correctAnswer: string;
    explanation: string;
    orderIndex: number;
  }>;
}

export interface MissionContentParams {
  nodeId: string;
  nodeSlug: string;
  nodeTitle: string;
}

export interface AIProvider {
  summarizeNodeConcept(nodeTitle: string, nodeDescription: string): Promise<string>;
  generateMissionContent(params: MissionContentParams): Promise<MissionContent>;
  generatePracticeQuestions(nodeSlug: string, count: number): Promise<MissionContent["practiceQuestions"]>;
  generateReflectionPrompt(nodeTitle: string): Promise<string>;
  generateDiagnosticExplanation(questionPrompt: string, correctAnswer: string): Promise<string>;
  recommendResources(nodeId: string, userId: string): Promise<string[]>;
}
