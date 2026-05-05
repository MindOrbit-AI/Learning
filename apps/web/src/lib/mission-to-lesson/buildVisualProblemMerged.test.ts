import { describe, expect, it } from "vitest";
import { buildVisualProblemMergedCorrect } from "./buildVisualProblemMerged";

describe("buildVisualProblemMergedCorrect", () => {
  it("synthesizes cellLabels from answer text for art pick questions without labels", () => {
    const merged = buildVisualProblemMergedCorrect(
      {
        problemScenario:
          "You are an art historian analyzing Renaissance paintings. Each painting exhibits distinct techniques.",
        finalPrompt: "Which two paintings showcase the use of perspective?",
        visualWorkspace: { kind: "part_model", totalParts: 3, targetShadedCount: 2, match: "count" },
      },
      {
        answer: "The Last Supper, School of Athens",
        visual: { kind: "part_model", totalParts: 3, targetShadedCount: 2, match: "count" },
      }
    );
    const o = JSON.parse(merged) as { visual: { kind: string; cellLabels: string[] } };
    expect(o.visual.kind).toBe("part_model");
    expect(o.visual.cellLabels?.length).toBe(3);
    expect(o.visual.cellLabels?.[0]).toMatch(/Last Supper|Supper/i);
    expect(o.visual.cellLabels?.[1]).toMatch(/School of Athens/i);
  });

  it("synthesizes cellLabels from scenario bold titles when answer is empty", () => {
    const merged = buildVisualProblemMergedCorrect(
      {
        problemScenario:
          "Compare **Mona Lisa**, **The Birth of Venus**, and **The Arnolfini Portrait** in the gallery.",
        finalPrompt: "Which two paintings show linear perspective most clearly?",
        visualWorkspace: { kind: "part_model", totalParts: 3, targetShadedCount: 2, match: "count" },
      },
      { answer: "", visual: { kind: "part_model", totalParts: 3, targetShadedCount: 2, match: "count" } }
    );
    const o = JSON.parse(merged) as { visual: { kind: string; cellLabels?: string[] } };
    expect(o.visual.kind).toBe("part_model");
    expect(o.visual.cellLabels).toEqual(["Mona Lisa", "The Birth of Venus", "The Arnolfini Portrait"]);
  });

  it("uses visual none when art pick stem has no inferable titles", () => {
    const merged = buildVisualProblemMergedCorrect(
      {
        problemScenario: "You are examining a collection of paintings from the Renaissance period.",
        finalPrompt: "Which two paintings show realistic features?",
        visualWorkspace: { kind: "part_model", totalParts: 3, targetShadedCount: 2, match: "count" },
      },
      { answer: "", visual: { kind: "part_model", totalParts: 3, targetShadedCount: 2, match: "count" } }
    );
    const o = JSON.parse(merged) as { visual: { kind: string } };
    expect(o.visual.kind).toBe("none");
  });

  it("synthesizes single-letter variable labels from the expression when the prompt asks for variables", () => {
    const merged = buildVisualProblemMergedCorrect(
      {
        problemScenario: "Consider the expression 2x + 3y - 7.",
        finalPrompt: "What are the variables in the expression?",
        visualWorkspace: { kind: "part_model", totalParts: 3, targetShadedCount: 2, match: "count" },
      },
      { answer: "x, y", visual: { kind: "part_model", totalParts: 3, targetShadedCount: 2, match: "count" } }
    );
    const o = JSON.parse(merged) as { visual: { kind: string; cellLabels: string[] } };
    expect(o.visual.kind).toBe("part_model");
    expect(o.visual.cellLabels[0]).toBe("x");
    expect(o.visual.cellLabels[1]).toBe("y");
    expect(o.visual.cellLabels[2]).toMatch(/^Part 3$/);
  });

  it("keeps part_model for a coherent fraction story", () => {
    const merged = buildVisualProblemMergedCorrect(
      {
        problemScenario: "A pizza has 8 equal slices. You ate 3.",
        finalPrompt: "What fraction of the pizza did you eat?",
        visualWorkspace: { kind: "part_model", totalParts: 8, targetShadedCount: 3, match: "count" },
      },
      { answer: "3/8", visual: { kind: "part_model", totalParts: 8, targetShadedCount: 3, match: "count" } }
    );
    const o = JSON.parse(merged) as { visual: { kind: string } };
    expect(o.visual.kind).toBe("part_model");
  });

  it("keeps part_model when cellLabels name each painting", () => {
    const labels = ["Mona Lisa", "School of Athens", "Last Supper"];
    const merged = buildVisualProblemMergedCorrect(
      {
        problemScenario: "Three famous Renaissance works are shown as tiles.",
        finalPrompt: "Which two paintings showcase the use of perspective?",
        visualWorkspace: {
          kind: "part_model",
          totalParts: 3,
          targetShadedCount: 2,
          match: "count",
          cellLabels: labels,
        },
      },
      {
        answer: "",
        visual: { kind: "part_model", totalParts: 3, targetShadedCount: 2, match: "count", cellLabels: labels },
      }
    );
    const o = JSON.parse(merged) as { visual: { kind: string; cellLabels: string[] } };
    expect(o.visual.kind).toBe("part_model");
    expect(o.visual.cellLabels).toEqual(labels);
  });

  it("passes referenceImages from contentJson into merged visual when synthesizing labels", () => {
    const merged = buildVisualProblemMergedCorrect(
      {
        problemScenario:
          "Three works hang side by side: **Mona Lisa**, **School of Athens**, and **The Last Supper**.",
        finalPrompt: "Which two paintings show realistic features?",
        visualWorkspace: { kind: "part_model", totalParts: 3, targetShadedCount: 2, match: "count" },
        referenceImages: [
          { url: "https://example.com/a.jpg", label: "Mona Lisa" },
          { url: "https://example.com/b.jpg", label: "School of Athens" },
        ],
      },
      { answer: "", visual: { kind: "part_model", totalParts: 3, targetShadedCount: 2, match: "count" } }
    );
    const o = JSON.parse(merged) as {
      visual: { kind: string; referenceImages?: Array<{ url: string; label?: string }> };
    };
    expect(o.visual.kind).toBe("part_model");
    expect(o.visual.referenceImages?.length).toBe(2);
    expect(o.visual.referenceImages?.[0]?.url).toContain("example.com");
  });
});
