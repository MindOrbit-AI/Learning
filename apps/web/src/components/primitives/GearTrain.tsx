"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@mindorbit/lib";

export type GearTrainProps = {
  /** Teeth on the input (left) gear. */
  driverTeeth: number;
  /** Teeth on the output (right) gear. */
  drivenTeeth: number;
  /** Driver rotation in degrees (0–360). */
  driverAngle?: number;
  onDriverAngleChange?: (degrees: number) => void;
  /** When set, learner picks driven gear size from these options. */
  drivenTeethOptions?: number[];
  onDrivenTeethChange?: (teeth: number) => void;
  /** When set, learner picks driver gear size from these options. */
  driverTeethOptions?: number[];
  onDriverTeethChange?: (teeth: number) => void;
  /** Optional algebra equation shown above the train (e.g. `d = 3g`). */
  equation?: string;
  disabled?: boolean;
  className?: string;
};

/** Stable decimal formatting so SSR and client SVG paths match. */
function svgNum(n: number): number {
  return Number(n.toFixed(3));
}

function gearPath(teeth: number, outerR: number, innerR: number): string {
  const points: string[] = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a0 = i * step;
    const a1 = a0 + step * 0.25;
    const a2 = a0 + step * 0.75;
    const a3 = a0 + step;
    const push = (a: number, r: number) => {
      points.push(
        `${svgNum(r * Math.cos(a - Math.PI / 2))},${svgNum(r * Math.sin(a - Math.PI / 2))}`,
      );
    };
    push(a0, innerR);
    push(a1, outerR);
    push(a2, outerR);
    push(a3, innerR);
  }
  return `M ${points.join(" L ")} Z`;
}

function GearSvg({
  teeth,
  angle,
  cx,
  cy,
  size,
  label,
  accent,
}: {
  teeth: number;
  angle: number;
  cx: number;
  cy: number;
  size: number;
  label: string;
  accent: string;
}) {
  const outerR = svgNum(size / 2);
  const innerR = svgNum(outerR * 0.72);
  const holeR = svgNum(outerR * 0.22);
  const d = gearPath(teeth, outerR, innerR);

  return (
    <g transform={`translate(${svgNum(cx)}, ${svgNum(cy)}) rotate(${svgNum(angle)})`}>
      <path d={d} fill={accent} stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      <circle r={holeR} fill="#18181b" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <text
        y={outerR + 16}
        textAnchor="middle"
        className="fill-zinc-400 text-[10px] font-bold"
        transform={`rotate(${-angle})`}
      >
        {label} ({teeth}T)
      </text>
    </g>
  );
}

export function GearTrain({
  driverTeeth,
  drivenTeeth,
  driverAngle = 0,
  onDriverAngleChange,
  drivenTeethOptions,
  onDrivenTeethChange,
  driverTeethOptions,
  onDriverTeethChange,
  equation,
  disabled,
  className,
}: GearTrainProps) {
  const gid = useId().replace(/:/g, "");
  const ratio = drivenTeeth / driverTeeth;
  const drivenAngle = svgNum((-driverAngle * driverTeeth) / drivenTeeth);

  const driverSize = svgNum(Math.min(88, 28 + driverTeeth * 2.2));
  const drivenSize = svgNum(Math.min(100, 28 + drivenTeeth * 2.2));
  const gap = svgNum((driverSize + drivenSize) / 2 - 4);

  return (
    <div className={cn("mx-auto w-full max-w-lg space-y-5", className)}>
      {equation ? (
        <div className="rounded-xl border border-violet-400/25 bg-violet-500/10 px-4 py-2.5 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-violet-300/80">Equation</p>
          <p className="mt-0.5 font-mono text-lg font-bold tabular-nums text-violet-100">{equation}</p>
        </div>
      ) : null}

      <svg viewBox="0 0 320 160" className="mx-auto h-44 w-full max-w-sm" aria-label="Gear train">
        <GearSvg
          teeth={driverTeeth}
          angle={driverAngle}
          cx={160 - gap}
          cy={72}
          size={driverSize}
          label="Driver"
          accent={`url(#${gid}-driver)`}
        />
        <GearSvg
          teeth={drivenTeeth}
          angle={drivenAngle}
          cx={160 + gap}
          cy={72}
          size={drivenSize}
          label="Driven"
          accent={`url(#${gid}-driven)`}
        />
        <defs>
          <linearGradient id={`${gid}-driver`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id={`${gid}-driven`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>
      </svg>

      <div className="rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-3 text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">Gear ratio</p>
        <p className="mt-1 text-lg font-extrabold tabular-nums text-violet-200">
          {driverTeeth}:{drivenTeeth}{" "}
          <span className="text-sm font-medium text-zinc-400">
            (driver turns {ratio.toFixed(2)}× per driven turn)
          </span>
        </p>
      </div>

      {onDriverAngleChange ? (
        <div className="space-y-2">
          <label className="block text-center text-xs font-medium text-zinc-500">
            Rotate driver
          </label>
          <input
            type="range"
            min={0}
            max={360}
            step={1}
            value={driverAngle}
            disabled={disabled}
            onChange={(e) => onDriverAngleChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-700 accent-violet-500 disabled:opacity-50"
          />
        </div>
      ) : null}

      {drivenTeethOptions && onDrivenTeethChange ? (
        <div className="space-y-2">
          <p className="text-center text-xs font-medium text-zinc-500">Driven gear (d)</p>
          <div className="flex flex-wrap justify-center gap-2">
            {drivenTeethOptions.map((t) => (
              <motion.button
                key={t}
                type="button"
                disabled={disabled}
                whileTap={{ scale: disabled ? 1 : 0.97 }}
                onClick={() => onDrivenTeethChange(t)}
                className={cn(
                  "min-w-[3.5rem] rounded-xl border-2 px-3 py-2 text-sm font-bold tabular-nums transition",
                  drivenTeeth === t
                    ? "border-cyan-400/80 bg-cyan-500/20 text-cyan-100"
                    : "border-white/15 bg-zinc-800/80 text-zinc-300 hover:border-violet-400/35",
                )}
              >
                {t}T
              </motion.button>
            ))}
          </div>
        </div>
      ) : null}

      {driverTeethOptions && onDriverTeethChange ? (
        <div className="space-y-2">
          <p className="text-center text-xs font-medium text-zinc-500">Driver gear (g)</p>
          <div className="flex flex-wrap justify-center gap-2">
            {driverTeethOptions.map((t) => (
              <motion.button
                key={t}
                type="button"
                disabled={disabled}
                whileTap={{ scale: disabled ? 1 : 0.97 }}
                onClick={() => onDriverTeethChange(t)}
                className={cn(
                  "min-w-[3.5rem] rounded-xl border-2 px-3 py-2 text-sm font-bold tabular-nums transition",
                  driverTeeth === t
                    ? "border-violet-400/80 bg-violet-500/20 text-violet-100"
                    : "border-white/15 bg-zinc-800/80 text-zinc-300 hover:border-cyan-400/35",
                )}
              >
                {t}T
              </motion.button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
