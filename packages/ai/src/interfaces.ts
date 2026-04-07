/**
 * MindOrbit AI - Interface abstractions for future LLM integration
 * AI Tutor: ConceptExplainer, MissionGenerator, PracticeGenerator
 */

import type { QuestionType } from "@mindorbit/types";

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
  | "transfer";

export interface MissionSceneSpec {
  sceneType: SceneType;
  title: string;
  prompt: string;
  contentJson?: Record<string, unknown>;
  correctAnswerJson?: string;
  explanation?: string;
  hintLevel1?: string;
  hintLevel2?: string;
  hintLevel3?: string;
  orderIndex: number;
}

export interface MissionSceneContent {
  title: string;
  missionType: "discover" | "repair" | "simulation" | "challenge" | "review";
  estimatedMinutes: number;
  scenes: MissionSceneSpec[];
}

export interface ConceptExplanation {
  summary: string;
  keyPoints: string[];
  examples: string[];
}

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

/** Extracted concept from ingested content */
export interface ExtractedConcept {
  title: string;
  description: string;
  slug: string;
  confidence: number;
}

/** Diagnostic question generated from content */
export interface ContentDiagnosticQuestion {
  prompt: string;
  type: "multiple_choice" | "short_answer" | "true_false";
  options: string[] | null;
  correctAnswer: string;
  explanation: string;
}

/** AI-generated subject structure (clusters, concepts, edges) for preview/save */
export interface GeneratedSubjectStructure {
  clusters: Array<{
    slug: string;
    title: string;
    description: string;
    orderIndex: number;
  }>;
  concepts: Array<{
    slug: string;
    title: string;
    description: string;
    clusterSlug: string;
    orderIndex: number;
    difficulty?: string;
  }>;
  edges: Array<{
    sourceSlug: string;
    targetSlug: string;
    relationshipType: "prerequisite" | "related" | "extends";
  }>;
}

/** Blocks for immersive multi-section reader (plain text, no markdown). */
export type ImmersiveContentBlock =
  | { type: "p"; text: string; hint?: boolean }
  | { type: "h2"; text: string };

export interface ImmersiveLessonSection {
  id: string;
  title: string;
  quizPending?: boolean;
  objectives: string[];
  blocks: ImmersiveContentBlock[];
}

/** Full payload for Learn-your-way-style reader UI */
export interface ImmersiveLessonContent {
  interestLabel: string;
  interestEmoji: string;
  gradeLabel: string;
  sections: ImmersiveLessonSection[];
}

export interface ImmersiveLessonParams {
  /** Main theme or chapter focus */
  topic: string;
  /** e.g. "Grade 10", "9th grade" */
  gradeLevel: string;
  /** Number of outline sections (2–8) */
  sectionCount?: number;
}

/** AI-generated summary from ingested content (no chunking) */
export interface ContentSummaryJson {
  title: string;
  flashcards: Array<{ front: string; back: string }>;
  shortSummary: string;
  deepSummary: string;
  quizzes: Array<{
    prompt: string;
    type: "multiple_choice" | "short_answer" | "true_false";
    options: string[] | null;
    correctAnswer: string;
    explanation: string;
  }>;
}

export interface AIProvider {
  summarizeNodeConcept(nodeTitle: string, nodeDescription: string): Promise<string>;
  generateMissionContent(params: MissionContentParams): Promise<MissionContent>;
  /** Generate scene-based interactive mission (Brilliant-style) */
  generateSceneMissionContent?(params: MissionContentParams): Promise<MissionSceneContent>;
  generatePracticeQuestions(nodeSlug: string, count: number): Promise<MissionContent["practiceQuestions"]>;
  generateReflectionPrompt(nodeTitle: string): Promise<string>;
  generateDiagnosticExplanation(questionPrompt: string, correctAnswer: string): Promise<string>;
  recommendResources(nodeId: string, userId: string): Promise<string[]>;

  /** Content Ingestion - extract concepts from raw text */
  extractConceptsFromContent(text: string): Promise<ExtractedConcept[]>;

  /** Content Ingestion - generate diagnostic questions from concept text */
  generateDiagnosticQuestionsFromContent(
    conceptText: string,
    conceptTitle: string,
    count?: number
  ): Promise<ContentDiagnosticQuestion[]>;

  /** Content Ingestion - extract text/description from image (diagrams, notes, screenshots) */
  extractTextFromImage(buffer: Buffer, mimeType: string): Promise<string>;

  /** Content Ingestion - summarize full content to JSON (flashcards, shortSummary, deepSummary, quizzes) - no chunking */
  summarizeContentToJson(content: string): Promise<ContentSummaryJson>;

  /** Subject Creation - generate a brief description for a subject from its title */
  generateSubjectDescription(title: string): Promise<string>;

  /** Subject Creation - generate clusters, concepts, and edges from subject title/description */
  generateSubjectStructure(title: string, description: string): Promise<GeneratedSubjectStructure>;

  /** Immersive reader — multi-section lesson with objectives and inline hint anchors */
  generateImmersiveLessonContent(params: ImmersiveLessonParams): Promise<ImmersiveLessonContent>;

  /** Content Ingestion - AI selects the most relevant subject for given content (e.g. Algebra, Physics) */
  selectMostRelevantSubject?(
    subjects: Array<{ id: string; slug: string; title: string; description: string }>,
    contentSummary: string
  ): Promise<string | null>;

  /** Content Ingestion - AI selects the most relevant cluster for given content summary */
  selectMostRelevantCluster(
    clusters: Array<{ id: string; title: string; description: string }>,
    contentSummary: string
  ): Promise<string | null>;

  /** Content Ingestion - AI selects the most relevant concept node from a cluster for given content */
  selectMostRelevantNode(
    nodes: Array<{ id: string; title: string; description: string }>,
    contentSummary: string
  ): Promise<string | null>;
}

/** ConceptExplainer - Node-aware concept explanation */
export interface ConceptExplainer {
  explain(params: { nodeTitle: string; nodeDescription: string; context?: string }): Promise<ConceptExplanation>;
}

/** MissionGenerator - Generate missions for weak nodes */
export interface MissionGenerator {
  generate(params: MissionContentParams): Promise<MissionContent>;
}

/** PracticeGenerator - Generate practice questions */
export interface PracticeGenerator {
  generate(nodeSlug: string, count: number): Promise<MissionContent["practiceQuestions"]>;
}
