"use client";

import { useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@mindorbit/lib";
import { Check, RotateCcw } from "lucide-react";
import { FractionBar } from "@/components/primitives/FractionBar";
import { GraphPlot } from "@/components/primitives/GraphPlot";
import { DragDropSort } from "@/components/primitives/DragDropSort";
import { DragDropMatch } from "@/components/primitives/DragDropMatch";
import { SegmentSelect } from "@/components/primitives/SegmentSelect";
import { SliderControl } from "@/components/primitives/SliderControl";
import { GridModel } from "@/components/primitives/GridModel";
import { NumberLine } from "@/components/primitives/NumberLine";
import { BalanceScale } from "@/components/primitives/BalanceScale";
import { GearTrain } from "@/components/primitives/GearTrain";
import { ENGINE_PRIMITIVES, type EnginePrimitive } from "@/types/interactive-engine";
import { ENGINE_PRIMITIVE_META } from "./engine-catalog";

type DemoShellProps = {
  title: string;
  prompt: string;
  children: ReactNode;
  onReset?: () => void;
  success?: boolean;
  successMessage?: string;
};

function DemoShell({ title, prompt, children, onReset, success, successMessage }: DemoShellProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 shadow-xl">
      <div className="border-b border-white/10 px-4 py-3 sm:px-5">
        <p className="text-xs font-bold uppercase tracking-wide text-violet-300/90">{title}</p>
        <p className="mt-1 text-sm font-medium text-zinc-300">{prompt}</p>
      </div>
      <div className="px-4 py-6 sm:px-6 sm:py-8">{children}</div>
      <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 sm:px-5">
        {success ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-400">
            <Check className="h-4 w-4" />
            {successMessage ?? "Nice — you got it!"}
          </span>
        ) : (
          <span className="text-xs text-zinc-500">Try it — feedback is instant</span>
        )}
        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-bold text-zinc-400 transition hover:bg-white/5 hover:text-zinc-200"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        ) : null}
      </div>
    </div>
  );
}

/* ── 1. Drag ── */
function DragDemo() {
  const [x, setX] = useState(0);
  const success = x > 120;

  return (
    <DemoShell
      title="Drag"
      prompt="Drag the block to the right past the dashed line."
      success={success}
      successMessage="Net force to the right — motion!"
      onReset={() => setX(0)}
    >
      <div className="relative mx-auto h-24 max-w-md overflow-hidden rounded-xl bg-zinc-800/80 ring-1 ring-white/10">
        <div className="absolute left-1/2 top-0 h-full w-px border-l border-dashed border-violet-400/60" />
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 200 }}
          dragElastic={0.05}
          onDrag={(_, info) => setX(info.offset.x)}
          onDragEnd={(_, info) => setX(info.offset.x)}
          style={{ x }}
          className="absolute left-8 top-1/2 flex h-14 w-14 -translate-y-1/2 cursor-grab items-center justify-center rounded-xl border-2 border-amber-300/70 bg-gradient-to-br from-amber-400 to-orange-500 font-bold text-white shadow-lg active:cursor-grabbing"
        >
          F
        </motion.div>
      </div>
    </DemoShell>
  );
}

/* ── 2. Drop Zone ── */
const DROP_ITEMS = [
  { id: "reactant", label: "2H₂ + O₂" },
  { id: "product", label: "2H₂O" },
  { id: "catalyst", label: "Pt catalyst" },
];
const DROP_SLOTS = [
  { id: "before", label: "Before reaction" },
  { id: "after", label: "After reaction" },
];

function DropZoneDemo() {
  const [slots, setSlots] = useState<Record<string, string>>({});
  const success = slots.before === "reactant" && slots.after === "product";

  return (
    <DemoShell
      title="Drop Zone"
      prompt="Place the reactants in Before and the product in After."
      success={success}
      successMessage="Reactants → products — balanced formation of water!"
      onReset={() => setSlots({})}
    >
      <DragDropMatch
        items={DROP_ITEMS}
        slots={DROP_SLOTS}
        value={slots}
        onChange={setSlots}
      />
    </DemoShell>
  );
}

/* ── 3. Slider ── */
function SliderDemo() {
  const [force, setForce] = useState(2);
  const mass = 4;
  const acceleration = force / mass;
  const success = Math.abs(acceleration - 2) < 0.05;

  return (
    <DemoShell
      title="Slider"
      prompt={`Slide force (N) with mass = ${mass} kg until a = 2 m/s².`}
      success={success}
      successMessage={`F = ma → ${force} N → ${acceleration.toFixed(1)} m/s²`}
      onReset={() => setForce(2)}
    >
      <SliderControl min={0} max={12} step={0.5} value={force} onChange={setForce} label="Force (N)" />
    </DemoShell>
  );
}

/* ── 4. Number Line ── */
function NumberLineDemo() {
  const [values, setValues] = useState<number[]>([0.5]);
  const success = Math.abs((values[0] ?? 0) - 0.75) < 0.01;

  return (
    <DemoShell
      title="Number Line"
      prompt="Drag the marker to 0.75 on the line from 0 to 1."
      success={success}
      successMessage="0.75 — three quarters!"
      onReset={() => setValues([0.5])}
    >
      <NumberLine min={0} max={1} step={0.25} userPoints={values} onChange={setValues} />
    </DemoShell>
  );
}

/* ── 5. Graph ── */
function GraphDemo() {
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const success = points.some((p) => Math.abs(p.x - 2) < 0.6 && Math.abs(p.y - 4) < 0.6);

  return (
    <DemoShell
      title="Graph"
      prompt="Plot the point (2, 4) — force 2 N, acceleration 4 m/s²."
      success={success}
      successMessage="F = ma — proportional relationship!"
      onReset={() => setPoints([])}
    >
      <GraphPlot xMin={0} xMax={6} yMin={0} yMax={8} points={points} onChange={setPoints} className="mx-auto" />
    </DemoShell>
  );
}

/* ── 6. Coordinate Plane ── */
function CoordinatePlaneDemo() {
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const hasOrigin = points.some((p) => Math.abs(p.x) < 0.6 && Math.abs(p.y) < 0.6);
  const hasRiseRun = points.some((p) => Math.abs(p.x - 3) < 0.6 && Math.abs(p.y - 4) < 0.6);
  const success = hasOrigin && hasRiseRun;

  return (
    <DemoShell
      title="Coordinate Plane"
      prompt="Place (0, 0) and (3, 4) to model rise 4, run 3."
      success={success}
      successMessage="Slope = rise/run = 4/3!"
      onReset={() => setPoints([])}
    >
      <GraphPlot
        xMin={-1}
        xMax={5}
        yMin={-1}
        yMax={6}
        points={points}
        onChange={setPoints}
        lines={[
          { x1: -1, y1: 0, x2: 5, y2: 0 },
          { x1: 0, y1: -1, x2: 0, y2: 6 },
        ]}
        className="mx-auto"
      />
    </DemoShell>
  );
}

/* ── 7. Tiles ── */
function TilesDemo() {
  const [selected, setSelected] = useState<number[]>([]);
  const success = selected.length === 4;

  return (
    <DemoShell
      title="Tiles"
      prompt="Fill all 4 cells in this 2×2 Punnett square."
      success={success}
      successMessage="All four offspring genotypes mapped!"
      onReset={() => setSelected([])}
    >
      <GridModel rows={2} columns={2} selectedCells={selected} onChange={setSelected} />
    </DemoShell>
  );
}

/* ── 8. Balance Scale ── */
function BalanceScaleDemo() {
  const [left, setLeft] = useState<number[]>([]);
  const [right, setRight] = useState<number[]>([]);
  const success = left.includes(2) && left.includes(3) && right.includes(5) && left.length === 2 && right.length === 1;

  return (
    <DemoShell
      title="Balance Scale"
      prompt="Place 2 + 3 on the left and 5 on the right to balance the scale."
      success={success}
      successMessage="2 + 3 = 5 — balanced!"
      onReset={() => {
        setLeft([]);
        setRight([]);
      }}
    >
      <BalanceScale
        availableWeights={[1, 2, 3, 4, 5]}
        leftWeights={left}
        rightWeights={right}
        onChange={({ leftWeights, rightWeights }) => {
          setLeft(leftWeights);
          setRight(rightWeights);
        }}
      />
    </DemoShell>
  );
}

/* ── 9. Geometry Canvas ── */
function GeometryCanvasDemo() {
  const [picked, setPicked] = useState<string | null>(null);
  const success = picked === "hypotenuse";

  return (
    <DemoShell
      title="Geometry Canvas"
      prompt="Tap the hypotenuse of this 3-4-5 right triangle."
      success={success}
      successMessage="Hypotenuse c = 5 — opposite the right angle!"
      onReset={() => setPicked(null)}
    >
      <svg viewBox="0 0 280 200" className="mx-auto h-48 w-full max-w-sm">
        <polygon points="40,160 160,160 40,40" className="fill-violet-500/20 stroke-violet-400/60" strokeWidth="2" />
        <text x="95" y="178" className="fill-zinc-400 text-xs">a = 3</text>
        <text x="18" y="105" className="fill-zinc-400 text-xs">b = 4</text>
        {(["a", "b", "hypotenuse"] as const).map((side) => {
          const labels = { a: "Side a", b: "Side b", hypotenuse: "Hypotenuse c" };
          const positions = { a: { x: 100, y: 150 }, b: { x: 25, y: 100 }, hypotenuse: { x: 115, y: 85 } };
          const on = picked === side;
          return (
            <g key={side}>
              <circle
                cx={positions[side].x}
                cy={positions[side].y}
                r="18"
                className={cn(
                  "cursor-pointer transition",
                  on ? "fill-emerald-500/40 stroke-emerald-400" : "fill-zinc-800/80 stroke-white/20 hover:fill-violet-500/30",
                )}
                strokeWidth="2"
                onClick={() => setPicked(side)}
              />
              <text x={positions[side].x} y={positions[side].y + 4} textAnchor="middle" className="fill-zinc-200 text-[9px] font-bold pointer-events-none">
                {labels[side].split(" ")[0]}
              </text>
            </g>
          );
        })}
      </svg>
    </DemoShell>
  );
}

/* ── 10. Simulation ── */
function SimulationDemo() {
  const [temp, setTemp] = useState(20);
  const hue = Math.min(100, temp * 2);
  const success = temp >= 80;

  return (
    <DemoShell
      title="Simulation"
      prompt="Heat the beaker to at least 80°C by sliding temperature."
      success={success}
      successMessage={`${temp}°C — water boils at 100°C!`}
      onReset={() => setTemp(20)}
    >
      <div className="mx-auto flex max-w-xs flex-col items-center gap-4">
        <div
          className="relative h-32 w-20 rounded-b-2xl border-2 border-white/20 transition-colors duration-300"
          style={{ backgroundColor: `hsl(${220 - hue}, 70%, ${35 + hue * 0.15}%)` }}
        >
          <div
            className="absolute bottom-0 left-0 right-0 rounded-b-xl bg-cyan-400/60 transition-all duration-300"
            style={{ height: `${Math.min(90, temp)}%` }}
          />
        </div>
        <SliderControl min={20} max={100} step={5} value={temp} onChange={setTemp} label="Temperature (°C)" />
      </div>
    </DemoShell>
  );
}

/* ── 11. Matching ── */
const MATCH_PAIRS = [
  { id: "a", term: "Adenine", def: "Pairs with T" },
  { id: "b", term: "Guanine", def: "Pairs with C" },
  { id: "c", term: "Thymine", def: "Pairs with A" },
  { id: "d", term: "Cytosine", def: "Pairs with G" },
];

function MatchingDemo() {
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());

  const makeDeck = () =>
    MATCH_PAIRS.flatMap((p) => [
      { key: `${p.id}-t`, pairId: p.id, text: p.term },
      { key: `${p.id}-d`, pairId: p.id, text: p.def },
    ]).sort(() => Math.random() - 0.5);

  const [deck, setDeck] = useState(makeDeck);

  const onCard = (key: string, pairId: string) => {
    if (matched.has(pairId)) return;
    if (!selected) {
      setSelected(key);
      return;
    }
    const first = deck.find((c) => c.key === selected);
    const second = deck.find((c) => c.key === key);
    if (first && second && first.pairId === pairId && first.key !== key) {
      setMatched((prev) => new Set(prev).add(pairId));
    }
    setSelected(null);
  };

  return (
    <DemoShell
      title="Matching"
      prompt="Match each DNA base to its complementary pair."
      success={matched.size === MATCH_PAIRS.length}
      successMessage="All base pairs matched!"
      onReset={() => {
        setMatched(new Set());
        setSelected(null);
        setDeck(makeDeck());
      }}
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {deck.map((card) => (
          <button
            key={card.key}
            type="button"
            disabled={matched.has(card.pairId)}
            onClick={() => onCard(card.key, card.pairId)}
            className={cn(
              "min-h-[4rem] rounded-xl border-2 px-2 py-2 text-xs font-semibold transition",
              matched.has(card.pairId) && "border-emerald-400/50 bg-emerald-500/15 text-emerald-200 opacity-60",
              selected === card.key && "border-violet-400/80 bg-violet-500/25 text-violet-100",
              !matched.has(card.pairId) && selected !== card.key &&
                "border-white/15 bg-zinc-800/80 text-zinc-200 hover:border-violet-400/35",
            )}
          >
            {card.text}
          </button>
        ))}
      </div>
    </DemoShell>
  );
}

/* ── 12. Sequence Builder ── */
const PHASES = [
  "Prophase — chromosomes condense",
  "Metaphase — line up at middle",
  "Anaphase — chromatids separate",
  "Telophase — nuclei reform",
];

function SequenceBuilderDemo() {
  const [items, setItems] = useState(() => [...PHASES].sort(() => Math.random() - 0.5));
  const success = items.every((item, i) => item === PHASES[i]);

  return (
    <DemoShell
      title="Sequence Builder"
      prompt="Drag mitosis phases into the correct order."
      success={success}
      successMessage="Perfect cell-cycle sequence!"
      onReset={() => setItems([...PHASES].sort(() => Math.random() - 0.5))}
    >
      <DragDropSort items={items} onChange={setItems} />
    </DemoShell>
  );
}

/* ── 13. Math Input ── */
function MathInputDemo() {
  const [value, setValue] = useState("");
  const n = value.trim().replace(/\s+/g, "");
  const success = n === "1" || n === "1.0" || n === "4/4";

  return (
    <DemoShell
      title="Math Input"
      prompt="What is ¾ + ¼? Type your answer."
      success={success}
      successMessage="1 — four quarters make a whole!"
      onReset={() => setValue("")}
    >
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Your answer"
        className="mx-auto block h-12 w-full max-w-xs rounded-xl border-2 border-white/15 bg-zinc-800/80 px-4 text-center text-lg font-bold tabular-nums text-zinc-100 placeholder:text-zinc-600 focus:border-violet-400/60 focus:outline-none"
      />
    </DemoShell>
  );
}

/* ── 14. Multiple Choice ── */
function MultipleChoiceDemo() {
  const [choice, setChoice] = useState("");
  const success = choice === "covalent";

  return (
    <DemoShell
      title="Multiple Choice"
      prompt="Two atoms share electrons equally. What bond type is this?"
      success={success}
      successMessage="Covalent — shared electrons!"
      onReset={() => setChoice("")}
    >
      <SegmentSelect
        choice={choice}
        onChange={setChoice}
        segments={[
          { id: "ionic", label: "Ionic" },
          { id: "covalent", label: "Covalent" },
          { id: "metallic", label: "Metallic" },
        ]}
      />
    </DemoShell>
  );
}

/* ── Gear ── */
function GearDemo() {
  const [drivenTeeth, setDrivenTeeth] = useState(24);
  const [driverAngle, setDriverAngle] = useState(0);
  const driverTeeth = 12;
  const success = drivenTeeth === 36;

  return (
    <DemoShell
      title="Gear"
      prompt="A 12-tooth driver needs a 1:3 ratio. Select the driven gear (36T)."
      success={success}
      successMessage="12:36 = 1:3 — the driver spins 3× faster!"
      onReset={() => {
        setDrivenTeeth(24);
        setDriverAngle(0);
      }}
    >
      <GearTrain
        driverTeeth={driverTeeth}
        drivenTeeth={drivenTeeth}
        driverAngle={driverAngle}
        drivenTeethOptions={[24, 36, 48]}
        onDriverAngleChange={setDriverAngle}
        onDrivenTeethChange={setDrivenTeeth}
      />
    </DemoShell>
  );
}

const DEMO_COMPONENTS: Record<string, () => ReactNode> = {
  drag: DragDemo,
  "drop-zone": DropZoneDemo,
  slider: SliderDemo,
  "number-line": NumberLineDemo,
  graph: GraphDemo,
  "coordinate-plane": CoordinatePlaneDemo,
  tiles: TilesDemo,
  "balance-scale": BalanceScaleDemo,
  "geometry-canvas": GeometryCanvasDemo,
  simulation: SimulationDemo,
  matching: MatchingDemo,
  "sequence-builder": SequenceBuilderDemo,
  "math-input": MathInputDemo,
  "multiple-choice": MultipleChoiceDemo,
  gear: GearDemo,
};

export function EngineDemo({ demoId }: { demoId: string }) {
  const Demo = DEMO_COMPONENTS[demoId];
  if (!Demo) return null;
  return <Demo />;
}

export function EngineDemoGrid({ activePrimitive }: { activePrimitive: EnginePrimitive | "All" }) {
  const primitives = useMemo(() => {
    if (activePrimitive === "All") return [...ENGINE_PRIMITIVES];
    return [activePrimitive];
  }, [activePrimitive]);

  return (
    <div
      className={cn(
        "grid gap-6",
        primitives.length === 1 ? "mx-auto max-w-xl" : "sm:grid-cols-2 xl:grid-cols-3",
      )}
    >
      {primitives.map((primitive) => {
        const meta = ENGINE_PRIMITIVE_META[primitive];
        return (
          <div key={primitive}>
            {activePrimitive === "All" ? (
              <h3 className="mb-3 text-sm font-extrabold text-zinc-200">{meta.label}</h3>
            ) : null}
            <EngineDemo demoId={meta.demoId} />
          </div>
        );
      })}
    </div>
  );
}

/** @deprecated Use EngineDemoGrid */
export function InteractionDemoGrid({ activeKind }: { activeKind: EnginePrimitive | "All" }) {
  return <EngineDemoGrid activePrimitive={activeKind} />;
}
