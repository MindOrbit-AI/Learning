import { describe, expect, it } from "vitest";
import { diagnoseVisualProblem } from "@/features/visual-problem-solving/validateVisualProblem";
import {
  correctTextAnswerIfExpressionEvalDiffers,
  evaluateSanitizedArithmetic,
  extractArithmeticExpressionFromVisualProblemContent,
} from "./arithmetic-expression-eval";

describe("evaluateSanitizedArithmetic", () => {
  it("evaluates (8+2)*5-6/3 as 48", () => {
    expect(evaluateSanitizedArithmetic("(8+2)*5-6/3")).toBe(48);
  });

  it("evaluates (7+3)*2-4/2 as 18", () => {
    expect(evaluateSanitizedArithmetic("(7+3)*2-4/2")).toBe(18);
  });

  it("normalizes unicode operators", () => {
    expect(evaluateSanitizedArithmetic("(8+2)×5-6÷3")).toBe(48);
  });
});

describe("correctTextAnswerIfExpressionEvalDiffers", () => {
  it("replaces a wrong stored integer with PEMDAS result", () => {
    const out = correctTextAnswerIfExpressionEvalDiffers(
      {
        problemScenario: "Solve **(8+2)×5-6÷3**.",
        finalPrompt: "What is the final result of the expression?",
      },
      "47"
    );
    expect(out).toBe("48");
  });

  it("does not change a correct stored answer", () => {
    const out = correctTextAnswerIfExpressionEvalDiffers(
      {
        problemScenario: "**(8+2)×5-6÷3**",
        finalPrompt: "What is the final result of the expression?",
      },
      "48"
    );
    expect(out).toBe("48");
  });

  it("fills canonical answer when stored is empty", () => {
    const out = correctTextAnswerIfExpressionEvalDiffers(
      {
        problemScenario: "You have **(7 + 3) × 2 - 4 ÷ 2**. Find the value.",
        finalPrompt: "What is the final result of the expression?",
      },
      ""
    );
    expect(out).toBe("18");
  });

  it("extracts bold expressions that contain ASCII multiply", () => {
    const expr = extractArithmeticExpressionFromVisualProblemContent({
      problemScenario: "Compute **(7+3)*2-4/2** now.",
    });
    expect(expr).toBe("(7+3)*2-4/2");
    expect(evaluateSanitizedArithmetic(expr!)).toBe(18);
  });

  it("does not change answers when the stem is not an expression-result question", () => {
    const out = correctTextAnswerIfExpressionEvalDiffers(
      {
        problemScenario: "**(8+2)×5-6÷3**",
        finalPrompt: "How many operators appear in the expression?",
      },
      "47"
    );
    expect(out).toBe("47");
  });
});

describe("extractArithmeticExpressionFromVisualProblemContent", () => {
  it("prefers equation field", () => {
    expect(
      extractArithmeticExpressionFromVisualProblemContent({
        problemScenario: "Other text",
        equation: "1+2*3",
      })
    ).toBe("1+2*3");
  });
});

describe("visual_problem numeric text matching", () => {
  it("treats 18 and 18.0 as equal when looseText is true", () => {
    const correct = JSON.stringify({ answer: "18", visual: { kind: "none" } });
    const d = diagnoseVisualProblem(correct, JSON.stringify({ visual: {}, text: "18.0" }), true);
    expect(d.ok).toBe(true);
  });
});
