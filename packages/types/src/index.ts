/**
 * MindOrbit Learn - Shared Domain Types
 */

export type NodeState = "mastered" | "weak" | "missing" | "learning" | "untouched";

export type QuestionType = "multiple_choice" | "short_answer" | "true_false";

export type MissionStatus = "not_started" | "in_progress" | "completed";

export type ResourceType =
  | "note"
  | "summary"
  | "flashcard_set"
  | "diagram"
  | "walkthrough";

export type ReviewStatus = "pending" | "in_progress" | "completed";

export type RelationshipType = "prerequisite" | "related" | "extends";

export interface SubjectSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  clusterCount: number;
  nodeCount: number;
}

export interface ClusterSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  orderIndex: number;
  nodeCount: number;
}

export interface ConceptNodeSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  orderIndex: number;
  state?: NodeState;
}

export interface DiagnosticQuestionData {
  id: string;
  nodeId: string;
  prompt: string;
  type: QuestionType;
  options: string[] | null;
  correctAnswer: string;
  explanation: string;
  difficulty: string;
}

export interface MissionTemplate {
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
