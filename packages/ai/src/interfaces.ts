/**
 * MindOrbit AI - Interface abstractions for future LLM integration
 * AI Tutor: ConceptExplainer, MissionGenerator, PracticeGenerator
 */

import type { QuestionType } from "@mindorbit/types";

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
