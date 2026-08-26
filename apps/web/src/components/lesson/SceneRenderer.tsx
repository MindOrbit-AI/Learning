"use client";

import type { Scene, SceneUserInput } from "@/types/scene";
import { FractionBar } from "@/components/primitives/FractionBar";
import { NumberLine } from "@/components/primitives/NumberLine";
import { GridModel } from "@/components/primitives/GridModel";
import { DragDropSort } from "@/components/primitives/DragDropSort";
import { DragDropMatch } from "@/components/primitives/DragDropMatch";
import { GraphPlot } from "@/components/primitives/GraphPlot";
import { ConceptMap, type ConceptEdge, type ConceptNode } from "@/components/primitives/ConceptMap";
import { SliderControl } from "@/components/primitives/SliderControl";
import { VennTwo, type VennTwoRegionId } from "@/components/primitives/VennTwo";
import { SegmentSelect } from "@/components/primitives/SegmentSelect";
import { BalanceScale } from "@/components/primitives/BalanceScale";
import { GearTrain } from "@/components/primitives/GearTrain";
import { Button } from "@/components/ui/Button";
import { cn } from "@mindorbit/lib";

type Props = {
  scene: Scene;
  userInput: SceneUserInput;
  onUserInput: (next: SceneUserInput) => void;
  disabled?: boolean;
  className?: string;
};

export function SceneRenderer({ scene, userInput, onUserInput, disabled, className }: Props) {
  const d = scene.data;

  switch (scene.type) {
    case "fraction_bar": {
      const total = typeof d.totalParts === "number" ? d.totalParts : 8;
      const selected = (userInput.selectedPartIndices as number[]) ?? [];
      return (
        <div className={cn("flex justify-center py-4", className)}>
          <FractionBar
            totalParts={total}
            selectedParts={selected}
            onChange={(selectedPartIndices) => onUserInput({ ...userInput, selectedPartIndices })}
          />
        </div>
      );
    }
    case "number_line": {
      const min = typeof d.min === "number" ? d.min : 0;
      const max = typeof d.max === "number" ? d.max : 1;
      const step = typeof d.step === "number" ? d.step : 0.125;
      const values = (userInput.values as number[]) ?? [(min + max) / 2];
      return (
        <div className={cn("flex justify-center py-6", className)}>
          <NumberLine
            min={min}
            max={max}
            step={step}
            userPoints={values}
            onChange={(vals) => onUserInput({ ...userInput, values: vals, points: vals.map((x) => ({ x, y: 0 })) })}
          />
        </div>
      );
    }
    case "grid_model": {
      const rows = typeof d.rows === "number" ? d.rows : 4;
      const columns = typeof d.columns === "number" ? d.columns : 4;
      const selected = (userInput.selectedCellIndices as number[]) ?? [];
      return (
        <div className={cn("flex justify-center py-4", className)}>
          <GridModel
            rows={rows}
            columns={columns}
            selectedCells={selected}
            onChange={(selectedCellIndices) => onUserInput({ ...userInput, selectedCellIndices })}
          />
        </div>
      );
    }
    case "drag_drop_sort": {
      const items = (d.items as string[]) ?? [];
      const order = (userInput.order as string[]) ?? items;
      return (
        <div className={cn("mx-auto max-w-md py-4", className)}>
          <DragDropSort items={order.length ? order : items} onChange={(o) => onUserInput({ ...userInput, order: o })} />
        </div>
      );
    }
    case "drag_drop_match": {
      const items = (d.items as { id: string; label: string }[]) ?? [];
      const slots = (d.slots as { id: string; label: string }[]) ?? [];
      const slotsValue = (userInput.slots as Record<string, string>) ?? {};
      return (
        <div className={cn("mx-auto max-w-md py-4", className)}>
          <DragDropMatch
            items={items}
            slots={slots}
            value={slotsValue}
            disabled={disabled}
            onChange={(next) => onUserInput({ ...userInput, slots: next })}
          />
        </div>
      );
    }
    case "graph_plot": {
      const xMin = typeof d.xMin === "number" ? d.xMin : -5;
      const xMax = typeof d.xMax === "number" ? d.xMax : 5;
      const yMin = typeof d.yMin === "number" ? d.yMin : -5;
      const yMax = typeof d.yMax === "number" ? d.yMax : 5;
      const pts = (userInput.points as { x: number; y: number }[]) ?? [];
      return (
        <div className={cn("flex justify-center py-4", className)}>
          <GraphPlot
            xMin={xMin}
            xMax={xMax}
            yMin={yMin}
            yMax={yMax}
            lines={(d.lines as { x1: number; y1: number; x2: number; y2: number }[]) ?? []}
            points={pts}
            onChange={(points) => onUserInput({ ...userInput, points })}
          />
        </div>
      );
    }
    case "concept_map": {
      const nodes = (d.nodes as ConceptNode[]) ?? [];
      const templateEdges = (d.edges as ConceptEdge[]) ?? [];
      const userEdges = (userInput.edges as ConceptEdge[]) ?? [];
      return (
        <div className={cn("py-2", className)}>
          <ConceptMap
            nodes={nodes}
            edges={templateEdges}
            userEdges={userEdges}
            onChange={(edges) => onUserInput({ ...userInput, edges })}
          />
        </div>
      );
    }
    case "multiple_choice": {
      const choices = (d.choices as string[]) ?? [];
      const choice = (userInput.choice as string) ?? "";
      return (
        <div className={cn("mx-auto flex max-w-lg flex-col gap-2 py-4", className)}>
          {choices.map((c) => (
            <Button
              key={c}
              type="button"
              variant={choice === c ? "primary" : "secondary"}
              className="w-full justify-start text-left"
              disabled={disabled}
              onClick={() => onUserInput({ ...userInput, choice: c })}
            >
              {c}
            </Button>
          ))}
        </div>
      );
    }
    case "slider": {
      const min = typeof d.min === "number" ? d.min : 0;
      const max = typeof d.max === "number" ? d.max : 10;
      const step = typeof d.step === "number" ? d.step : 1;
      const mid = min + (max - min) / 2;
      const raw = userInput.value;
      const value = typeof raw === "number" && Number.isFinite(raw) ? raw : mid;
      return (
        <div className={cn("flex justify-center py-6", className)}>
          <SliderControl
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            label={typeof d.sliderLabel === "string" ? d.sliderLabel : undefined}
            onChange={(v) =>
              onUserInput({
                ...userInput,
                value: v,
                points: [{ x: v, y: 0 }],
              })
            }
          />
        </div>
      );
    }
    case "venn_two": {
      const labelA = typeof d.labelA === "string" ? d.labelA : "Set A";
      const labelB = typeof d.labelB === "string" ? d.labelB : "Set B";
      const choice = ((userInput.choice as string) ?? "") as VennTwoRegionId | "";
      return (
        <div className={cn("flex justify-center py-4", className)}>
          <VennTwo
            labelA={labelA}
            labelB={labelB}
            choice={choice}
            disabled={disabled}
            onChange={(region) => onUserInput({ ...userInput, choice: region })}
          />
        </div>
      );
    }
    case "true_false": {
      const choice = (userInput.choice as string) ?? "";
      return (
        <div className={cn("mx-auto flex max-w-md flex-col gap-3 py-6", className)}>
          <div className="grid grid-cols-2 gap-3">
            {(["True", "False"] as const).map((c) => (
              <Button
                key={c}
                type="button"
                variant={choice === c ? "primary" : "secondary"}
                className="min-h-14 w-full text-base font-semibold"
                disabled={disabled}
                onClick={() => onUserInput({ ...userInput, choice: c })}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>
      );
    }
    case "segment_select": {
      const segments = (d.segments as { id: string; label: string }[]) ?? [];
      const choice = (userInput.choice as string) ?? "";
      return (
        <div className={cn("flex justify-center py-4", className)}>
          <SegmentSelect
            segments={segments}
            choice={choice}
            disabled={disabled}
            onChange={(id) => onUserInput({ ...userInput, choice: id })}
          />
        </div>
      );
    }
    case "balance_scale": {
      const weights = (d.weights as number[]) ?? [1, 2, 3, 4, 5];
      const fixedLeft = (d.fixedLeft as number[]) ?? [];
      const fixedRight = (d.fixedRight as number[]) ?? [];
      const leftWeights = (userInput.leftWeights as number[]) ?? [...fixedLeft];
      const rightWeights = (userInput.rightWeights as number[]) ?? [...fixedRight];
      const unit = typeof d.unit === "string" ? d.unit : "";
      return (
        <div className={cn("flex justify-center py-4", className)}>
          <BalanceScale
            availableWeights={weights}
            leftWeights={leftWeights}
            rightWeights={rightWeights}
            lockedLeftCount={fixedLeft.length}
            lockedRightCount={fixedRight.length}
            unit={unit}
            disabled={disabled}
            onChange={({ leftWeights: l, rightWeights: r }) =>
              onUserInput({ ...userInput, leftWeights: l, rightWeights: r })
            }
          />
        </div>
      );
    }
    case "gear": {
      const driverOptions = (d.driverOptions as number[]) ?? undefined;
      const drivenOptions = (d.drivenOptions as number[]) ?? [24, 36, 48];
      const fixedDriver = typeof d.driverTeeth === "number" ? d.driverTeeth : undefined;
      const fixedDriven = typeof d.fixedDrivenTeeth === "number" ? d.fixedDrivenTeeth : undefined;
      const defaultDriven =
        typeof d.defaultDrivenTeeth === "number" ? d.defaultDrivenTeeth : drivenOptions[0];
      const defaultDriver =
        typeof d.defaultDriverTeeth === "number" ? d.defaultDriverTeeth : driverOptions?.[0];
      const driverTeeth =
        typeof userInput.driverTeeth === "number"
          ? userInput.driverTeeth
          : (fixedDriver ?? defaultDriver ?? 12);
      const drivenTeeth =
        typeof userInput.drivenTeeth === "number"
          ? userInput.drivenTeeth
          : (fixedDriven ?? defaultDriven);
      const driverAngle = typeof userInput.driverAngle === "number" ? userInput.driverAngle : 0;
      const equation = typeof d.equation === "string" ? d.equation : undefined;
      return (
        <div className={cn("flex justify-center py-4", className)}>
          <GearTrain
            driverTeeth={driverTeeth}
            drivenTeeth={drivenTeeth}
            driverAngle={driverAngle}
            equation={equation}
            drivenTeethOptions={
              fixedDriven ? undefined : drivenOptions.length > 1 ? drivenOptions : undefined
            }
            driverTeethOptions={driverOptions}
            disabled={disabled}
            onDriverAngleChange={(deg) =>
              onUserInput({
                ...userInput,
                driverAngle: deg,
                driverTeeth,
                drivenTeeth,
              })
            }
            onDrivenTeethChange={(teeth) =>
              onUserInput({
                ...userInput,
                drivenTeeth: teeth,
                driverTeeth,
                driverAngle,
              })
            }
            onDriverTeethChange={(teeth) =>
              onUserInput({
                ...userInput,
                driverTeeth: teeth,
                drivenTeeth,
                driverAngle,
              })
            }
          />
        </div>
      );
    }
    default:
      return <p className="text-center text-sm text-zinc-500">Unsupported scene type.</p>;
  }
}
