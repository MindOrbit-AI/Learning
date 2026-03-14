export type ValidationStatus = "correct" | "incorrect" | "partial";

export interface ValidationResult {
  isCorrect: boolean;
  status: ValidationStatus;
  score: number;
  message?: string;
  misconceptionCode?: string;
}
