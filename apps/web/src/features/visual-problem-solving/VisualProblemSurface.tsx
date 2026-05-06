"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@mindorbit/ui";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { RuntimeMicroStep } from "@/features/micro-engine/types";
import { formatMicroStepCorrectAnswer } from "@/features/micro-engine/formatCorrectAnswerLabel";
import {
  canonicalSlotFillExpected,
  enrichNodeLinkNodesWithEdgeEndpoints,
  normalizeNodeList,
  syncVisualWorkspaceFromMergedVisual,
} from "@/lib/mission-to-lesson/buildVisualProblemMerged";
import { seededShuffle } from "@/lib/deterministicShuffle";
import { stripMathTeachingLabel } from "./mathLabelDisplay";
import { DEFAULT_PLANT_REFERENCE_IMAGE_PATH } from "./plantReferenceArt";
import { PlantPartReferenceIllustration } from "./PlantPartReferenceIllustration";
import { expandNumberLineBounds, inferNumericTarget } from "./numberLineBounds";
import { NumberLine } from "@/components/primitives/NumberLine";
import { hasRenderableTriangleDiagrams, TriangleDiagramPair } from "./TriangleDiagramPair";
import { BasePairSelectBoard } from "./BasePairSelectBoard";
import { normalizeBasePairTokens } from "./basePairSelectValidation";
import { SlotFillBoard } from "./SlotFillBoard";
import { visualPhaseSatisfied } from "./validateVisualProblem";

type Props = {
  step: RuntimeMicroStep;
  disabled: boolean;
  shakeToken: number;
  onCommit: (payload: unknown) => void;
  revealCorrect?: boolean;
};

export function VisualProblemSurface({
  step,
  disabled,
  shakeToken,
  onCommit,
  revealCorrect = false,
}: Props) {
  const ws = useMemo(() => {
    const raw = (step.interactionConfig.visualWorkspace ?? {}) as Record<string, unknown>;
    try {
      const o = JSON.parse(step.correctAnswer) as { visual?: Record<string, unknown> };
      if (o.visual && typeof o.visual === "object") {
        return syncVisualWorkspaceFromMergedVisual(raw, o.visual);
      }
    } catch {
      /* keep raw workspace */
    }
    return raw;
  }, [step.interactionConfig.visualWorkspace, step.correctAnswer]);
  /** Triangle specs are often merged into `correctAnswer.visual` only; mirror them for the diagram layer. */
  const workspaceForTriangles = useMemo(() => {
    const base = { ...ws };
    try {
      const o = JSON.parse(step.correctAnswer) as { visual?: Record<string, unknown> };
      const v = o.visual;
      if (!v || typeof v !== "object") return base;
      const next = { ...base };
      if (v.diagramTriangles != null) next.diagramTriangles = v.diagramTriangles;
      if (v.triangleA != null) next.triangleA = v.triangleA;
      if (v.triangleB != null) next.triangleB = v.triangleB;
      return next;
    } catch {
      return base;
    }
  }, [ws, step.correctAnswer]);
  const kind = String(ws.kind ?? "part_model");
  const timelineTarget = useMemo(() => {
    try {
      const o = JSON.parse(step.correctAnswer) as { visual?: { correctOrder?: string[] } };
      const fromAnswer = o.visual?.correctOrder;
      if (Array.isArray(fromAnswer) && fromAnswer.length > 0) return fromAnswer;
    } catch {
      /* ignore */
    }
    return Array.isArray(ws.correctOrder) ? (ws.correctOrder as string[]) : [];
  }, [step.correctAnswer, ws]);
  const [text, setText] = useState("");
  const [visualPayload, setVisualPayload] = useState<Record<string, unknown>>({});

  const setPartVisual = useCallback((ids: string[]) => {
    setVisualPayload({ kind: "part_model", shadedPartIds: ids });
  }, []);
  const setLineVisual = useCallback((value: number) => {
    setVisualPayload({ kind: "number_line", value });
  }, []);
  const setTimelineVisual = useCallback((order: string[]) => {
    setVisualPayload({ kind: "timeline", order });
  }, []);
  const setLinkVisual = useCallback((patch: Record<string, unknown>) => {
    setVisualPayload((prev) => ({ ...prev, ...patch, kind: "node_link" }));
  }, []);
  const setSlotFillVisual = useCallback((patch: Record<string, unknown>) => {
    setVisualPayload((prev) => ({ ...prev, ...patch, kind: "slot_fill" }));
  }, []);
  const setBasePairVisual = useCallback((pairs: [string, string][]) => {
    setVisualPayload({ kind: "base_pair_select", pairs });
  }, []);

  useEffect(() => {
    setText("");
    setVisualPayload({});
  }, [step.id, shakeToken]);

  const visualOkLocal = useMemo(
    () => visualPhaseSatisfied(step.correctAnswer, visualPayload),
    [step.correctAnswer, visualPayload]
  );

  /** Shown when node-link has enough edges but topology/order does not match the answer key yet. */
  const nodeLinkWrongTopology = useMemo(() => {
    if (kind !== "node_link" && kind !== "cause_effect_link") return false;
    if (visualOkLocal) return false;
    const need = parseNodeLinkExpectedEdgeCount(step.correctAnswer);
    const edges = visualPayload.edges as unknown;
    const have = Array.isArray(edges)
      ? (edges as unknown[]).filter((x) => Array.isArray(x) && x.length === 2).length
      : 0;
    return need > 0 && have >= need;
  }, [kind, visualOkLocal, step.correctAnswer, visualPayload]);

  const slotFillWrongOrderHint = useMemo(() => {
    if (kind !== "slot_fill" || visualOkLocal) return false;
    const assign = visualPayload.slotAssignments as Record<string, unknown> | undefined;
    if (!assign || typeof assign !== "object") return false;
    try {
      const o = JSON.parse(step.correctAnswer) as { visual?: Record<string, unknown> };
      const v = o.visual;
      if (!v || String(v.kind ?? "") !== "slot_fill") return false;
      const { slots } = canonicalSlotFillExpected(v);
      if (slots.length === 0) return false;
      const filled = slots.filter((s) => {
        const id = s.id;
        const val = id ? assign[id] : undefined;
        return val != null && String(val).trim().length > 0;
      }).length;
      return filled === slots.length;
    } catch {
      return false;
    }
  }, [kind, visualOkLocal, step.correctAnswer, visualPayload]);

  const numberLineSlider = useMemo(() => {
    if (kind !== "number_line") return null;
    let min = Number(ws.min ?? 0);
    let max = Number(ws.max ?? 10);
    let sliderStep = Number(ws.step ?? 0.5);
    let target = Number(ws.targetValue ?? NaN);
    try {
      const o = JSON.parse(step.correctAnswer) as {
        visual?: Record<string, unknown>;
        answer?: string | null;
      };
      const v = o.visual;
      if (v) {
        if (v.min != null) min = Number(v.min);
        if (v.max != null) max = Number(v.max);
        if (v.step != null) sliderStep = Number(v.step);
        if (v.targetValue != null) target = Number(v.targetValue);
      }
      if (!Number.isFinite(target) && o.answer != null) {
        const fromAnswer = inferNumericTarget(String(o.answer));
        if (fromAnswer != null) target = fromAnswer;
      }
    } catch {
      /* ignore */
    }
    if (!Number.isFinite(target)) target = (min + max) / 2;
    return expandNumberLineBounds({ min, max, step: sliderStep, targetValue: target });
  }, [kind, step.correctAnswer, ws]);

  const partModelTotal = useMemo(() => {
    const isPartKind =
      kind === "part_model" ||
      kind === "fraction_bar" ||
      kind === "pizza_model" ||
      kind === "area_model";
    if (!isPartKind) return 8;
    try {
      const o = JSON.parse(step.correctAnswer) as { visual?: { totalParts?: unknown } };
      const v = o.visual;
      if (v && typeof v === "object") {
        const tp = (v as { totalParts?: unknown }).totalParts;
        if (tp != null && Number.isFinite(Number(tp))) return Math.max(1, Math.round(Number(tp)));
      }
    } catch {
      /* ignore */
    }
    const t = Number(ws.totalParts ?? 8);
    return Math.max(1, Math.round(t));
  }, [kind, step.correctAnswer, ws]);

  const showTriangleHint = useMemo(() => {
    const scenario = String(step.interactionConfig.problemScenario ?? "");
    return /\btriangle/i.test(scenario) && !hasRenderableTriangleDiagrams(workspaceForTriangles);
  }, [step.interactionConfig.problemScenario, workspaceForTriangles]);

  /** Scenario text describes DnD but this workspace is tap-to-shade tiles only. */
  const partModelDragDropCopyMismatch = useMemo(() => {
    const isPart =
      kind === "part_model" ||
      kind === "fraction_bar" ||
      kind === "pizza_model" ||
      kind === "area_model";
    if (!isPart) return false;
    const s = String(step.interactionConfig.problemScenario ?? "");
    return /\b(drag|drop|draggable|slot)\b/i.test(s);
  }, [kind, step.interactionConfig.problemScenario]);

  const partModelTargetShaded = useMemo(() => {
    const isPart =
      kind === "part_model" ||
      kind === "fraction_bar" ||
      kind === "pizza_model" ||
      kind === "area_model";
    if (!isPart) return null;
    try {
      const o = JSON.parse(step.correctAnswer) as { visual?: { targetShadedCount?: unknown } };
      const t = o.visual?.targetShadedCount;
      if (t != null && Number.isFinite(Number(t))) return Math.round(Number(t));
    } catch {
      /* ignore */
    }
    const w = Number(ws.targetShadedCount ?? NaN);
    return Number.isFinite(w) ? Math.round(w) : null;
  }, [kind, step.correctAnswer, ws]);

  const partModelMatchMode = useMemo(() => {
    const isPart =
      kind === "part_model" ||
      kind === "fraction_bar" ||
      kind === "pizza_model" ||
      kind === "area_model";
    if (!isPart) return "count";
    try {
      const o = JSON.parse(step.correctAnswer) as { visual?: { match?: unknown } };
      const v = o.visual;
      if (v && typeof v === "object" && (v as { match?: unknown }).match != null) {
        return String((v as { match: unknown }).match);
      }
    } catch {
      /* ignore */
    }
    return String(ws.match ?? "count");
  }, [kind, step.correctAnswer, ws]);

  /**
   * For bundled plant art: when the story is about shading **k** of **n** equal parts (count mode),
   * show **k** leaves in the reference so the illustration matches the expected quantity (not all n tap targets).
   */
  const plantReferenceDisplayedLeafCount = useMemo(() => {
    if (partModelMatchMode === "exact") return undefined;
    const total = partModelTotal;
    let target: number | null = partModelTargetShaded;
    if (target == null || !Number.isFinite(target)) {
      try {
        const o = JSON.parse(step.correctAnswer) as { answer?: unknown };
        const a = o.answer;
        if (a != null && /^\s*\d+\s*$/.test(String(a))) target = parseInt(String(a).trim(), 10);
      } catch {
        /* ignore */
      }
    }
    if (target == null || !Number.isFinite(target)) return undefined;
    const t = Math.round(Number(target));
    if (t < 1 || t >= total) return undefined;
    return t;
  }, [partModelMatchMode, partModelTotal, partModelTargetShaded, step.correctAnswer]);

  /** Optional per-cell symbols (e.g. letters in a grid); falls back to 1..n when missing. */
  const partModelCellLabels = useMemo(() => {
    const isPart =
      kind === "part_model" ||
      kind === "fraction_bar" ||
      kind === "pizza_model" ||
      kind === "area_model";
    if (!isPart) return undefined;
    let raw: unknown;
    try {
      const o = JSON.parse(step.correctAnswer) as { visual?: { cellLabels?: unknown } };
      const v = o.visual;
      if (v && typeof v === "object" && Array.isArray((v as { cellLabels?: unknown }).cellLabels)) {
        raw = (v as { cellLabels: unknown[] }).cellLabels;
      }
    } catch {
      /* ignore */
    }
    if (raw == null) raw = ws.cellLabels ?? ws.partLabels ?? ws.labels;
    if (!Array.isArray(raw)) return undefined;
    const n = partModelTotal;
    const out: string[] = [];
    for (let i = 0; i < n; i++) {
      const v = raw[i];
      out.push(v != null && String(v).trim() !== "" ? String(v) : String(i + 1));
    }
    return out;
  }, [kind, partModelTotal, step.correctAnswer, ws]);

  const partModelGridCols = useMemo(() => {
    const isPart =
      kind === "part_model" ||
      kind === "fraction_bar" ||
      kind === "pizza_model" ||
      kind === "area_model";
    if (!isPart) return null;
    let c = NaN;
    try {
      const o = JSON.parse(step.correctAnswer) as { visual?: { gridCols?: unknown; cols?: unknown } };
      const v = o.visual;
      if (v && typeof v === "object") {
        c = Number((v as { gridCols?: unknown }).gridCols ?? (v as { cols?: unknown }).cols ?? NaN);
      }
    } catch {
      /* ignore */
    }
    if (!Number.isFinite(c)) c = Number(ws.gridCols ?? ws.cols ?? NaN);
    if (!Number.isFinite(c) || c < 1) return null;
    return Math.min(16, Math.round(c));
  }, [kind, step.correctAnswer, ws]);

  /** Optional HTTPS artwork thumbnails from mission content or merged `correctAnswer.visual`. */
  const artworkReferenceImages = useMemo(() => {
    const isPart =
      kind === "part_model" ||
      kind === "fraction_bar" ||
      kind === "pizza_model" ||
      kind === "area_model";
    if (!isPart) return [] as Array<{ url: string; label?: string }>;
    const isRenderableRefUrl = (u: string) =>
      /^https?:\/\//i.test(u) || (u.startsWith("/") && !u.startsWith("//"));
    const parseList = (raw: unknown): Array<{ url: string; label?: string }> => {
      if (!Array.isArray(raw) || raw.length === 0) return [];
      const out: Array<{ url: string; label?: string }> = [];
      for (const x of raw) {
        if (typeof x === "string") {
          const u = x.trim();
          if (isRenderableRefUrl(u)) out.push({ url: u });
        } else if (x && typeof x === "object") {
          const o = x as Record<string, unknown>;
          const u = String(o.url ?? o.src ?? "").trim();
          if (!isRenderableRefUrl(u)) continue;
          const label = o.label != null ? String(o.label).trim() : undefined;
          out.push(label ? { url: u, label } : { url: u });
        }
      }
      return out;
    };
    const fromWs = parseList(ws.referenceImages);
    if (fromWs.length > 0) return fromWs;
    try {
      const o = JSON.parse(step.correctAnswer) as { visual?: { referenceImages?: unknown } };
      return parseList(o.visual?.referenceImages);
    } catch {
      return [];
    }
  }, [kind, step.correctAnswer, ws]);

  /** Story promises letters / 2D grid but CMS did not supply cellLabels. */
  const partModelLetterGridMismatch = useMemo(() => {
    const isPart =
      kind === "part_model" ||
      kind === "fraction_bar" ||
      kind === "pizza_model" ||
      kind === "area_model";
    if (!isPart) return false;
    const stem = `${String(step.interactionConfig.problemScenario ?? "")} ${String(step.prompt ?? "")}`;
    const wantsLetters = /\b(letter|2d|two[-\s]?dimensional|grid|matrix)\b/i.test(stem);
    const hasCellLabels =
      Array.isArray(ws.cellLabels) ||
      Array.isArray(ws.partLabels) ||
      Array.isArray(ws.labels) ||
      (() => {
        try {
          const o = JSON.parse(step.correctAnswer) as { visual?: { cellLabels?: unknown } };
          return Array.isArray(o.visual?.cellLabels);
        } catch {
          return false;
        }
      })();
    return wantsLetters && !hasCellLabels;
  }, [kind, step.interactionConfig.problemScenario, step.prompt, step.correctAnswer, ws]);

  const allowEmptyAnswer = useMemo(() => {
    try {
      const o = JSON.parse(step.correctAnswer) as { answer?: string | null };
      return String(o.answer ?? "").trim() === "";
    } catch {
      return step.interactionConfig.answerOptional === true;
    }
  }, [step.correctAnswer, step.interactionConfig.answerOptional]);

  const nodeWorkspaceNodesJson = JSON.stringify(ws.nodes ?? []);
  const nodeLinkNodes = useMemo(() => {
    const base = normalizeNodeList(ws.nodes);
    if (kind !== "node_link" && kind !== "cause_effect_link") return base;
    try {
      const o = JSON.parse(step.correctAnswer) as { visual?: Record<string, unknown> };
      const v = o.visual;
      if (v && typeof v === "object") {
        return enrichNodeLinkNodesWithEdgeEndpoints(base, v);
      }
    } catch {
      /* ignore */
    }
    return enrichNodeLinkNodesWithEdgeEndpoints(base, ws);
  }, [kind, step.id, step.correctAnswer, nodeWorkspaceNodesJson, ws]);

  const wsItemsKey = JSON.stringify(ws.items ?? []);
  const wsSlotsKey = JSON.stringify(ws.slots ?? []);
  const basePairModel = useMemo(() => {
    if (kind !== "base_pair_select") return null;
    try {
      const o = JSON.parse(step.correctAnswer) as { visual?: { tokens?: unknown } };
      const tokens = normalizeBasePairTokens(o.visual?.tokens ?? ws.tokens);
      return { tokens };
    } catch {
      return { tokens: normalizeBasePairTokens(ws.tokens) };
    }
  }, [kind, step.correctAnswer, ws.tokens]);

  const slotFillModel = useMemo(() => {
    if (kind !== "slot_fill") return null;
    try {
      const o = JSON.parse(step.correctAnswer) as { visual?: Record<string, unknown> };
      const v = o.visual;
      const merged: Record<string, unknown> = {
        items: v?.items ?? ws.items,
        slots: v?.slots ?? ws.slots,
        correctOrder: v?.correctOrder ?? ws.correctOrder ?? [],
        slotCount: v?.slotCount ?? ws.slotCount,
      };
      const { slots, items } = canonicalSlotFillExpected(merged);
      return { items, slots };
    } catch {
      const merged: Record<string, unknown> = {
        items: ws.items,
        slots: ws.slots,
        correctOrder: ws.correctOrder ?? [],
        slotCount: ws.slotCount,
      };
      const { slots, items } = canonicalSlotFillExpected(merged);
      return { items, slots };
    }
  }, [kind, step.correctAnswer, ws, wsItemsKey, wsSlotsKey]);

  const [solutionPeek, setSolutionPeek] = useState(false);
  useEffect(() => {
    setSolutionPeek(false);
  }, [step.id, shakeToken]);
  useEffect(() => {
    if (revealCorrect) setSolutionPeek(false);
  }, [revealCorrect]);

  const solutionSummary = useMemo(() => formatMicroStepCorrectAnswer(step), [step]);

  const canPeekSolution =
    !disabled &&
    !revealCorrect &&
    (kind === "node_link" ||
      kind === "cause_effect_link" ||
      (kind === "slot_fill" && slotFillModel != null) ||
      kind === "timeline" ||
      kind === "base_pair_select");

  const submit = useCallback(() => {
    const payload = JSON.stringify({ visual: visualPayload, text });
    onCommit(payload);
  }, [visualPayload, text, onCommit]);

  return (
    <motion.div
      key={shakeToken}
      animate={shakeToken ? { x: [0, -6, 6, 0] } : {}}
      className="touch-manipulation space-y-6"
    >
      <div className="relative z-10 touch-manipulation rounded-2xl border border-primary/20 bg-primary/[0.04] p-4">
        {revealCorrect ? (
          <p className="mb-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-center text-sm font-semibold leading-snug text-emerald-900 dark:text-emerald-100">
            Correct answer: {formatMicroStepCorrectAnswer(step)}
          </p>
        ) : null}
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80">
          {kind === "none" ? "Your answer" : kind === "base_pair_select" ? "Pair the bases" : "Visual workspace"}
        </p>
        {kind === "none" ? (
          <p className="mb-4 text-center text-sm leading-snug text-muted-foreground">
            Answer using the scenario and question above. This step does not include a grid or other on-screen model.
          </p>
        ) : null}
        {kind !== "none" &&
        (kind === "part_model" ||
          kind === "fraction_bar" ||
          kind === "pizza_model" ||
          kind === "area_model") &&
        artworkReferenceImages.length === 0 ? (
          <p className="mb-3 text-center text-xs leading-snug text-muted-foreground">
            If the story refers to a picture or diagram, use the labeled cells below as that model — this step does not
            show a separate illustration unless the mission attaches reference art.
          </p>
        ) : null}
        {kind !== "none" ? <TriangleDiagramPair workspace={workspaceForTriangles} /> : null}
        {kind !== "none" && showTriangleHint ? (
          <p className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs leading-snug text-amber-950 dark:text-amber-50">
            Drawn triangles will show here once this mission includes valid side lengths for the triangles in the
            story. <span className="font-semibold">Regenerate the mission</span> to get the latest layout, or use the
            numbered parts below for now.
          </p>
        ) : null}
        {kind !== "none" && partModelDragDropCopyMismatch ? (
          <p className="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs leading-snug text-amber-950 dark:text-amber-50">
            This step uses a <span className="font-semibold">tap-to-select grid</span> (numbered cells), not drag-and-drop.
            Tap cells on or off until the shaded count matches what the story asks for
            {partModelTargetShaded != null ? (
              <>
                {" "}
                (here: <span className="font-semibold">{partModelTargetShaded}</span> of {partModelTotal} cells)
              </>
            ) : null}{" "}
            — then the answer field unlocks.
          </p>
        ) : null}
        {kind !== "none" && partModelLetterGridMismatch ? (
          <p className="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs leading-snug text-amber-950 dark:text-amber-50">
            The story mentions letters or a grid, but this mission did not include{" "}
            <span className="font-mono text-[10px]">visualWorkspace.cellLabels</span>. Until content is regenerated with
            one label per cell (row-major), cells stay numbered — tap the cell that matches the letter position in your
            head, or use <span className="font-semibold">Regenerate</span> on the mastery map.
          </p>
        ) : null}
        {kind !== "none" && kind === "slot_fill" && slotFillModel ? (
          <p className="mb-3 text-center text-sm leading-snug text-muted-foreground">
            Drag each type card into the slot for the matching variable. Fill every slot to unlock the answer field.
          </p>
        ) : null}
        {kind === "base_pair_select" && basePairModel ? (
          <BasePairSelectBoard
            key={`${step.id}-${shakeToken}-bp`}
            tokens={basePairModel.tokens}
            shuffleSeed={`${step.sourceSceneId}::${step.id}::${shakeToken}`}
            disabled={disabled}
            onChange={setBasePairVisual}
          />
        ) : null}
        {kind !== "none" &&
        (kind === "part_model" ||
          kind === "fraction_bar" ||
          kind === "pizza_model" ||
          kind === "area_model") &&
        artworkReferenceImages.length > 0 ? (
          <div className="mb-4 flex flex-wrap justify-center gap-4">
            {artworkReferenceImages.map((img, i) => (
              <figure key={`${img.url}-${i}`} className="max-w-[min(100%,min(36rem,100%))] shrink-0">
                {img.url === DEFAULT_PLANT_REFERENCE_IMAGE_PATH ? (
                  <>
                    <PlantPartReferenceIllustration
                      totalParts={partModelTotal}
                      referenceLeafCount={plantReferenceDisplayedLeafCount}
                      cellLabels={partModelCellLabels}
                      gridCols={partModelGridCols}
                      className="mx-auto"
                    />
                    {img.label ? (
                      <figcaption className="mt-1.5 text-center text-[11px] font-medium leading-snug text-muted-foreground">
                        {img.label}
                      </figcaption>
                    ) : null}
                  </>
                ) : (
                  <>
                    <img
                      src={img.url}
                      alt={img.label ?? `Artwork ${i + 1}`}
                      className="mx-auto max-h-44 w-full max-w-[200px] rounded-xl border border-muted bg-muted/20 object-contain shadow-sm"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    {img.label ? (
                      <figcaption className="mt-1.5 text-center text-[11px] font-medium leading-snug text-muted-foreground">
                        {img.label}
                      </figcaption>
                    ) : null}
                  </>
                )}
              </figure>
            ))}
          </div>
        ) : null}
        {kind !== "none" &&
        (kind === "part_model" ||
          kind === "fraction_bar" ||
          kind === "pizza_model" ||
          kind === "area_model") ? (
          <PartModel
            total={partModelTotal}
            disabled={disabled}
            onChange={setPartVisual}
            cellLabels={partModelCellLabels}
            gridCols={partModelGridCols}
          />
        ) : null}
        {kind !== "none" && kind === "number_line" && numberLineSlider ? (
          <NumberLinePicker
            min={numberLineSlider.min}
            max={numberLineSlider.max}
            step={numberLineSlider.step}
            disabled={disabled}
            onChange={setLineVisual}
          />
        ) : null}
        {kind !== "none" && kind === "timeline" ? (
          <TimelineOrder
            items={(ws.items as Array<{ id: string; label: string }>) ?? []}
            target={timelineTarget}
            shuffleSeed={`${step.sourceSceneId}::${step.id}::${shakeToken}`}
            disabled={disabled}
            onChange={setTimelineVisual}
          />
        ) : null}
        {kind !== "none" && (kind === "node_link" || kind === "cause_effect_link") ? (
          <NodeLinkPicker
            nodes={nodeLinkNodes}
            expectedJson={step.correctAnswer}
            disabled={disabled}
            onChange={setLinkVisual}
          />
        ) : null}
        {kind !== "none" && kind === "slot_fill" && slotFillModel ? (
          <SlotFillBoard
            key={`${step.id}-${shakeToken}-slotfill`}
            items={slotFillModel.items}
            slots={slotFillModel.slots}
            disabled={disabled}
            onChange={setSlotFillVisual}
          />
        ) : null}
      </div>

      {canPeekSolution ? (
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => setSolutionPeek((p) => !p)}
            aria-expanded={solutionPeek}
            className="rounded-xl border border-muted-foreground/25 bg-muted/30 px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-muted/50"
          >
            {solutionPeek ? "Hide solution" : "Reveal solution"}
          </button>
          {solutionPeek ? (
            <div className="w-full max-w-lg rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2.5 text-center text-emerald-950 dark:text-emerald-50">
              <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-200">
                Expected solution
              </p>
              <p className="mt-1 font-mono text-[13px] font-semibold leading-snug">{solutionSummary}</p>
              <p className="mt-2 text-[11px] leading-snug text-emerald-900/85 dark:text-emerald-100/85">
                Your workspace above is unchanged — use this only if you are stuck.
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        className={cn(
          "space-y-2 transition-opacity",
          !visualOkLocal && "pointer-events-none opacity-40"
        )}
      >
        <p className="text-xs font-semibold text-muted-foreground">
          {visualOkLocal
            ? kind === "none"
              ? "Type your answer below."
              : kind === "base_pair_select"
                ? "Type how many complementary pairs you locked (A↔T and C↔G)."
                : "Now answer using the model you built."
            : nodeLinkWrongTopology
              ? "You have the right number of links, but the flow does not match the expected diagram yet. Clear or redraw links until it matches — then the answer field unlocks."
              : slotFillWrongOrderHint
                ? "Every slot is filled, but the order does not match the expected array yet. Drag cards back to the bank or swap them between slots."
                : "Finish the visual first — then the question unlocks."}
        </p>
        <input
          type="text"
          value={text}
          disabled={disabled || !visualOkLocal}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            allowEmptyAnswer
              ? String(step.interactionConfig.answerPlaceholder ?? "Optional — add a label if the prompt asks for one")
              : String(step.interactionConfig.answerPlaceholder ?? "Type your answer…")
          }
          className="w-full rounded-2xl border-2 border-muted bg-background px-4 py-3 text-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
        <button
          type="button"
          disabled={disabled || !visualOkLocal || (!allowEmptyAnswer && !text.trim())}
          onClick={submit}
          className="w-full rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-40"
        >
          Check answer
        </button>
      </div>
    </motion.div>
  );
}

function PartModel({
  total,
  disabled,
  onChange,
  cellLabels,
  gridCols,
}: {
  total: number;
  disabled: boolean;
  onChange: (ids: string[]) => void;
  /** One entry per part index 0..n-1 (row-major); shown inside each cell. */
  cellLabels?: string[];
  /** When set, fixes column count for a 2D-style layout. */
  gridCols?: number | null;
}) {
  const n = Math.max(1, Math.round(total));
  const dense = n > 24;
  const extraDense = n > 60;
  const fixedCols = gridCols != null && gridCols > 0 ? gridCols : null;
  const [shaded, setShaded] = useState<Set<string>>(new Set());

  useEffect(() => {
    setShaded(new Set());
  }, [n]);

  useEffect(() => {
    onChange([...shaded]);
  }, [shaded, onChange]);

  const toggle = (id: string) => {
    if (disabled) return;
    setShaded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="relative z-10 mt-3 space-y-2">
      <p className="text-sm text-muted-foreground">
        {cellLabels?.length
          ? "Click or tap cells to shade them (each toggles on or off)."
          : "Click or tap parts to shade the model (each part toggles on or off)."}
      </p>
      <div
        className={cn(
          "rounded-lg border border-muted/30 bg-background/40 p-2",
          n > 36 && "max-h-[min(22rem,48vh)] overflow-y-auto overscroll-contain"
        )}
      >
        <div
          className={cn("grid gap-1.5", !fixedCols && extraDense && "grid-cols-10", !fixedCols && dense && !extraDense && "grid-cols-6 sm:grid-cols-8", !fixedCols && !dense && "grid-cols-4 sm:grid-cols-6")}
          style={fixedCols ? { gridTemplateColumns: `repeat(${fixedCols}, minmax(0, 1fr))` } : undefined}
        >
          {Array.from({ length: n }, (_, i) => {
            const id = String(i);
            const on = shaded.has(id);
            const display = cellLabels?.[i] != null ? stripMathTeachingLabel(cellLabels[i]!) : String(i + 1);
            return (
              <button
                key={id}
                type="button"
                disabled={disabled}
                aria-pressed={on}
                aria-label={`Cell ${display}, ${on ? "shaded" : "not shaded"}`}
                onClick={() => toggle(id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle(id);
                  }
                }}
                className={cn(
                  "cursor-pointer rounded-lg border-2 font-bold transition touch-manipulation select-none active:scale-[0.97]",
                  extraDense && "h-7 min-w-0 px-0 text-[10px]",
                  dense && !extraDense && "h-9 min-w-[2.25rem] text-xs",
                  !dense && "h-12 min-w-[2.75rem] text-sm sm:min-w-[3rem]",
                  on
                    ? "border-amber-500 bg-amber-500/25 text-amber-950 dark:text-amber-50"
                    : "border-muted bg-background hover:border-primary/40"
                )}
              >
                {display}
              </button>
            );
          })}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {shaded.size} of {n} shaded
      </p>
    </div>
  );
}

function NumberLinePicker({
  min,
  max,
  step,
  disabled,
  onChange,
}: {
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  onChange: (v: number) => void;
}) {
  const mid = Math.round(((min + max) / 2) / step) * step;
  const [val, setVal] = useState(mid);

  useEffect(() => {
    setVal(mid);
  }, [min, max, step, mid]);

  useEffect(() => {
    onChange(val);
  }, [val, onChange]);

  return (
    <div className="mt-3 space-y-3">
      <p className="text-sm text-muted-foreground">
        Drag the marker on the number line to the value that fits the story, then type that same number in the answer
        box below.
      </p>
      <NumberLine
        className={cn(disabled && "pointer-events-none opacity-45")}
        min={min}
        max={max}
        step={step}
        userPoints={[val]}
        onChange={(pts) => setVal(Number(pts[0] ?? mid))}
      />
      <p className="text-center font-mono text-lg font-bold tabular-nums">{val}</p>
    </div>
  );
}

function TimelineOrder({
  items,
  target,
  shuffleSeed,
  disabled,
  onChange,
}: {
  items: Array<{ id: string; label: string }>;
  target: string[];
  shuffleSeed: string;
  disabled: boolean;
  onChange: (order: string[]) => void;
}) {
  const itemsKey = JSON.stringify(items.map((i) => ({ id: i.id, label: i.label })));
  const initialOrder = useMemo(() => {
    const ids = (JSON.parse(itemsKey) as Array<{ id: string }>).map((i) => i.id);
    const baseSeed = `${shuffleSeed}::${itemsKey}`;
    let shuffled = seededShuffle(ids, baseSeed);
    let guard = 0;
    while (target.length && shuffled.join(",") === target.join(",") && guard++ < 24) {
      shuffled = seededShuffle(ids, `${baseSeed}#${guard}`);
    }
    return shuffled;
  }, [itemsKey, target, shuffleSeed]);

  const [order, setOrder] = useState<string[]>(initialOrder);

  useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);

  useEffect(() => {
    onChange(order);
  }, [order, onChange]);

  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= order.length) return;
    setOrder((prev) => {
      const next = [...prev];
      const t = next[idx] as string;
      next[idx] = next[j] as string;
      next[j] = t;
      return next;
    });
  };

  return (
    <div className="mt-3 space-y-2">
      <p className="text-sm text-muted-foreground">Reorder events into the correct sequence.</p>
      {order.map((id, idx) => {
        const it = items.find((x) => x.id === id);
        return (
          <div
            key={`${id}-${idx}`}
            className="flex items-center gap-2 rounded-2xl border border-muted bg-card px-3 py-2"
          >
            <span className="flex-1 text-sm font-medium">{it?.label ?? id}</span>
            <button
              type="button"
              disabled={disabled}
              className="rounded-lg p-1 hover:bg-muted"
              aria-label="Move up"
              onClick={() => move(idx, -1)}
            >
              <ChevronUp className="h-5 w-5" />
            </button>
            <button
              type="button"
              disabled={disabled}
              className="rounded-lg p-1 hover:bg-muted"
              aria-label="Move down"
              onClick={() => move(idx, 1)}
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

const NODE_DRAG_MIME = "application/x-mindorbit-node-id";

function countNodeLinkEdges(v: Record<string, unknown>): number {
  const countList = (arr: unknown): number => {
    if (!Array.isArray(arr) || arr.length === 0) return 0;
    return arr.filter((x) => {
      if (Array.isArray(x) && x.length === 2) return true;
      if (x && typeof x === "object") {
        const o = x as Record<string, unknown>;
        if (o.from != null && o.to != null) return true;
        if (o.fromId != null && o.toId != null) return true;
      }
      return false;
    }).length;
  };
  const nCe = countList(v.correctEdges);
  if (nCe > 0) return nCe;
  const cel = v.correctEdge as unknown;
  if (Array.isArray(cel) && cel.length > 0) {
    if (cel.length === 2 && typeof cel[0] !== "object") return 1;
    const n = countList(cel);
    if (n > 0) return n;
  }
  const chain = v.chain as unknown;
  if (Array.isArray(chain) && chain.length >= 2) return chain.length - 1;
  const n = Number(v.expectedEdgeCount ?? v.edgeCount ?? NaN);
  if (Number.isFinite(n) && n > 0) return Math.min(32, Math.floor(n));
  return 1;
}

function parseNodeLinkExpectedEdgeCount(expectedJson: string): number {
  try {
    const o = JSON.parse(expectedJson) as Record<string, unknown>;
    const v =
      typeof o.visual === "object" && o.visual !== null
        ? (o.visual as Record<string, unknown>)
        : (o as Record<string, unknown>);
    return countNodeLinkEdges(v);
  } catch {
    return 1;
  }
}

function NodeLinkPicker({
  nodes,
  expectedJson,
  disabled,
  onChange,
}: {
  nodes: Array<{ id: string; label: string }>;
  expectedJson: string;
  disabled: boolean;
  onChange: (patch: Record<string, unknown>) => void;
}) {
  const expectedEdgeCount = useMemo(() => parseNodeLinkExpectedEdgeCount(expectedJson), [expectedJson]);

  const [pickFrom, setPickFrom] = useState<string | null>(null);
  const [edges, setEdges] = useState<[string, string][]>([]);
  const [draggingFrom, setDraggingFrom] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const dragSourceRef = useRef<string | null>(null);
  /** Browsers often emit a click on the drop target right after drop; ignore it for tap-to-link. */
  const ignoreClickUntilRef = useRef(0);

  const nodesKey = JSON.stringify(nodes.map((n) => ({ id: n.id, label: n.label })));

  useEffect(() => {
    setPickFrom(null);
    setEdges([]);
    setDraggingFrom(null);
    setDragOverId(null);
    dragSourceRef.current = null;
  }, [expectedJson, nodesKey]);

  useEffect(() => {
    onChange({ edges });
  }, [edges, onChange]);

  const labelOf = (id: string) => stripMathTeachingLabel(nodes.find((n) => n.id === id)?.label ?? id);

  const pushEdges = (next: [string, string][]) => {
    setEdges(next);
  };

  const commitEdge = useCallback(
    (from: string, to: string) => {
      if (from === to) return;
      setEdges((prev) => {
        const base = prev.length >= expectedEdgeCount ? [] : prev;
        const pair: [string, string] = [from, to];
        const next: [string, string][] =
          expectedEdgeCount <= 1
            ? [pair]
            : (() => {
                const acc = [...base, pair];
                return acc.length > expectedEdgeCount ? acc.slice(0, expectedEdgeCount) : acc;
              })();
        return next;
      });
    },
    [expectedEdgeCount]
  );

  const handleNodePointer = (nodeId: string) => {
    if (disabled || nodes.length === 0) return;
    if (edges.length >= expectedEdgeCount) {
      pushEdges([]);
      setPickFrom(nodeId);
      return;
    }
    if (!pickFrom) {
      setPickFrom(nodeId);
      return;
    }
    if (pickFrom === nodeId) {
      setPickFrom(null);
      return;
    }
    commitEdge(pickFrom, nodeId);
    setPickFrom(null);
  };

  const onDragStart = (e: React.DragEvent, nodeId: string) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    /** Do not clear here: `commitEdge` already replaces when full; clearing on drag start breaks when expected edge count was underestimated. */
    dragSourceRef.current = nodeId;
    setDraggingFrom(nodeId);
    try {
      e.dataTransfer.setData(NODE_DRAG_MIME, nodeId);
      e.dataTransfer.setData("text/plain", nodeId);
      e.dataTransfer.effectAllowed = "link";
    } catch {
      /* ignore */
    }
  };

  const onDragEnd = () => {
    dragSourceRef.current = null;
    setDraggingFrom(null);
    setDragOverId(null);
  };

  const onDragOverNode = (e: React.DragEvent, nodeId: string) => {
    if (disabled) return;
    const from = dragSourceRef.current;
    if (!from) return;
    if (nodeId === from) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "link";
    setDragOverId(nodeId);
  };

  const onDragLeaveNode = (e: React.DragEvent) => {
    const related = e.relatedTarget as Node | null;
    if (related && e.currentTarget.contains(related)) return;
    setDragOverId(null);
  };

  const onDropOnNode = (e: React.DragEvent, toId: string) => {
    e.preventDefault();
    let from = "";
    try {
      from = e.dataTransfer.getData(NODE_DRAG_MIME) || e.dataTransfer.getData("text/plain");
    } catch {
      /* ignore */
    }
    if (!from) from = dragSourceRef.current ?? "";
    dragSourceRef.current = null;
    setDraggingFrom(null);
    setDragOverId(null);
    if (!from || from === toId) return;
    ignoreClickUntilRef.current = Date.now() + 450;
    commitEdge(from, toId);
    setPickFrom(null);
  };

  return (
    <div className="mt-3 space-y-3">
      <p className="text-sm text-muted-foreground">
        {expectedEdgeCount <= 1
          ? "Drag one bubble onto another to draw an arrow (start → end). Direction matters."
          : `Drag to link in order: ${expectedEdgeCount} arrows (${edges.length}/${expectedEdgeCount} done). Drag the next “from” onto its “to”.`}
      </p>
      <p className="text-xs text-muted-foreground">
        Keyboard / touch fallback: tap a start bubble, then tap where it should point.
      </p>
      {edges.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {edges.map(([from, to], i) => (
            <span
              key={`${from}-${to}-${i}`}
              className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-950 dark:text-cyan-100"
            >
              {labelOf(from)} → {labelOf(to)}
            </span>
          ))}
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              setPickFrom(null);
              pushEdges([]);
            }}
            className="text-xs font-medium text-primary underline-offset-2 hover:underline"
          >
            Clear links
          </button>
        </div>
      ) : null}
      {nodes.length === 0 ? (
        <p className="text-sm text-amber-800 dark:text-amber-200">
          This problem has no nodes to connect yet (generator data issue).
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        {nodes.map((n, idx) => {
          const shown = stripMathTeachingLabel(n.label);
          const shortVar = shown.length > 0 && shown.length <= 2 && /^[a-z]$/i.test(shown);
          return (
          <div
            key={`${idx}-${n.id}`}
            draggable={!disabled}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-grabbed={draggingFrom === n.id}
            aria-label={`${shown}, drag onto another bubble or tap to connect`}
            onDragStart={(e) => onDragStart(e, n.id)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => onDragOverNode(e, n.id)}
            onDragLeave={onDragLeaveNode}
            onDrop={(e) => onDropOnNode(e, n.id)}
            onClick={() => {
              if (Date.now() < ignoreClickUntilRef.current) return;
              handleNodePointer(n.id);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleNodePointer(n.id);
              }
            }}
            className={cn(
              "flex h-14 cursor-grab select-none items-center justify-center rounded-full border-2 px-4 text-base font-bold transition touch-manipulation active:cursor-grabbing border-muted bg-background hover:border-primary/40",
              shortVar ? "min-w-[3.75rem] px-5 text-2xl leading-none tracking-tight" : "min-w-[3.25rem]",
              pickFrom === n.id && "border-cyan-500 bg-cyan-500/15 ring-2 ring-cyan-500/35",
              draggingFrom === n.id && "border-violet-500 bg-violet-500/15 ring-2 ring-violet-400/40",
              dragOverId === n.id &&
                dragSourceRef.current &&
                dragSourceRef.current !== n.id &&
                "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-400/50"
            )}
          >
            <span className="pointer-events-none font-mono text-foreground">{shown}</span>
          </div>
          );
        })}
      </div>
      {pickFrom && !draggingFrom ? (
        <p className="text-xs font-medium text-cyan-700 dark:text-cyan-300">
          Selected “{labelOf(pickFrom)}” — tap the bubble it points to, or drag onto it next time.
        </p>
      ) : draggingFrom ? (
        <p className="text-xs font-medium text-violet-700 dark:text-violet-300">
          Dragging from “{labelOf(draggingFrom)}” — drop on the target bubble.
        </p>
      ) : null}
    </div>
  );
}
