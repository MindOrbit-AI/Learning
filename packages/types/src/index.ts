/**
 * MindOrbit Learn - Shared Domain Types
 */

export type NodeState = "mastered" | "weak" | "missing" | "learning" | "untouched";

export type QuestionType = "multiple_choice" | "short_answer" | "true_false";

export type MissionStatus = "not_started" | "in_progress" | "completed";

export type MissionType = "discover" | "repair" | "simulation" | "challenge" | "review";

export type SceneType =
  | "observe"
  | "manipulate"
  | "predict"
  | "reveal"
  | "simulate"
  | "drag_drop"
  | "slider_experiment"
  | "tap_highlight"
  | "sort_sequence"
  | "find_error"
  | "construct_answer"
  | "micro_quiz"
  | "reflect"
  | "transfer"
  | "visual_problem";

export type MistakeCategory =
  | "prerequisite_gap"
  | "concept_confusion"
  | "calculation_error"
  | "procedural_error"
  | "careless_error"
  | "terminology_confusion";

export type ResourceType =
  | "note"
  | "summary"
  | "flashcard_set"
  | "diagram"
  | "walkthrough"
  | "mini_lesson";

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

/** Mission scene for interactive Brilliant-style learning */
export interface MissionSceneData {
  id: string;
  missionId: string;
  sceneType: SceneType;
  title: string;
  prompt: string;
  contentJson: string | null;
  interactionModel: string | null;
  validationRulesJson: string | null;
  correctAnswerJson: string | null;
  explanation: string | null;
  hintLevel1: string | null;
  hintLevel2: string | null;
  hintLevel3: string | null;
  orderIndex: number;
}

/** Generic content structure for scene content_json */
export interface SceneContentBase {
  visual?: string;
  elements?: unknown[];
  [key: string]: unknown;
}

/** Drag-drop scene content */
export interface DragDropContent extends SceneContentBase {
  items: Array<{ id: string; label: string; correctPosition?: number }>;
  slots: Array<{ id: string; label?: string }>;
}

/** Slider experiment content */
export interface SliderContent extends SceneContentBase {
  min: number;
  max: number;
  step: number;
  initialValue?: number;
  unit?: string;
  labels?: { left?: string; right?: string };
}

/** Tap/highlight scene content */
export interface TapHighlightContent extends SceneContentBase {
  targets: Array<{ id: string; label: string; region?: string }>;
  highlightOrder?: boolean;
}

/** Sort sequence content */
export interface SortSequenceContent extends SceneContentBase {
  items: Array<{ id: string; label: string; correctOrder: number }>;
}
