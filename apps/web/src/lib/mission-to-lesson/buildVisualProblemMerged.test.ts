import { describe, expect, it } from "vitest";
import { DEFAULT_PLANT_REFERENCE_IMAGE_PATH } from "@/features/visual-problem-solving/plantReferenceArt";
import { buildVisualProblemMergedCorrect, syncVisualWorkspaceFromMergedVisual } from "./buildVisualProblemMerged";

describe("syncVisualWorkspaceFromMergedVisual", () => {
  it("overwrites stale part_model workspace fields from merged visual (totalParts, labels, refs)", () => {
    const out = syncVisualWorkspaceFromMergedVisual(
      {
        kind: "part_model",
        totalParts: 8,
        targetShadedCount: 1,
        cellLabels: ["a", "b", "c", "d", "e", "f", "g", "h"],
      },
      {
        kind: "part_model",
        totalParts: 6,
        targetShadedCount: 4,
        match: "count",
        cellLabels: ["Leaf 1", "Leaf 2", "Leaf 3", "Leaf 4", "Leaf 5", "Leaf 6"],
        referenceImages: [{ url: "https://example.com/p.jpg", label: "P" }],
      }
    );
    expect(out.totalParts).toBe(6);
    expect(out.targetShadedCount).toBe(4);
    expect(out.match).toBe("count");
    expect(out.cellLabels).toEqual(["Leaf 1", "Leaf 2", "Leaf 3", "Leaf 4", "Leaf 5", "Leaf 6"]);
    expect((out.referenceImages as { url: string }[])[0]?.url).toContain("example.com");
  });
});

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

  it("adds bundled plant reference for photosynthesis-style stems when none were provided", () => {
    const merged = buildVisualProblemMergedCorrect(
      {
        problemScenario: "In this illustration of a plant, light is absorbed by the leaves.",
        finalPrompt: "How many leaves are involved in photosynthesis?",
        visualWorkspace: { kind: "part_model", totalParts: 6, targetShadedCount: 4, match: "count" },
      },
      {
        answer: "4",
        visual: { kind: "part_model", totalParts: 6, targetShadedCount: 4, match: "count" },
      }
    );
    const o = JSON.parse(merged) as { visual: { referenceImages?: Array<{ url: string }> } };
    expect(o.visual.referenceImages?.length).toBe(1);
    expect(o.visual.referenceImages?.[0]?.url).toBe(DEFAULT_PLANT_REFERENCE_IMAGE_PATH);
  });

  it("does not override author referenceImages for plant-related stems", () => {
    const merged = buildVisualProblemMergedCorrect(
      {
        problemScenario: "Photosynthesis in green plants.",
        finalPrompt: "Count shaded parts.",
        visualWorkspace: { kind: "part_model", totalParts: 4, targetShadedCount: 2, match: "count" },
        referenceImages: [{ url: "https://example.com/custom.jpg", label: "Custom" }],
      },
      { answer: "2", visual: { kind: "part_model", totalParts: 4, targetShadedCount: 2, match: "count" } }
    );
    const o = JSON.parse(merged) as { visual: { referenceImages?: Array<{ url: string }> } };
    expect(o.visual.referenceImages?.length).toBe(1);
    expect(o.visual.referenceImages?.[0]?.url).toContain("example.com");
  });

  it("does not add plant reference for unrelated part_model stories", () => {
    const merged = buildVisualProblemMergedCorrect(
      {
        problemScenario: "A pizza has 8 equal slices. You ate 3.",
        finalPrompt: "What fraction of the pizza did you eat?",
        visualWorkspace: { kind: "part_model", totalParts: 8, targetShadedCount: 3, match: "count" },
      },
      { answer: "3/8", visual: { kind: "part_model", totalParts: 8, targetShadedCount: 3, match: "count" } }
    );
    const o = JSON.parse(merged) as { visual: { referenceImages?: unknown } };
    expect(o.visual.referenceImages).toBeUndefined();
  });
});
