"use client";

import { useId, useMemo } from "react";
import { cn } from "@mindorbit/lib";

export type PlotPoint = { x: number; y: number };

export type GraphPlotProps = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  /** Optional reference geometry. */
  lines?: { x1: number; y1: number; x2: number; y2: number }[];
  /** Learner-placed points (axis coordinates). */
  points: PlotPoint[];
  onChange: (points: PlotPoint[]) => void;
  className?: string;
};

const PAD = 36;

function integerTicks(min: number, max: number): number[] {
  const lo = Math.ceil(min);
  const hi = Math.floor(max);
  if (hi < lo) return [min];
  const out: number[] = [];
  for (let v = lo; v <= hi; v++) out.push(v);
  if (out.length > 14) {
    const step = Math.ceil((hi - lo + 1) / 10);
    const sparse: number[] = [];
    for (let v = lo; v <= hi; v += step) sparse.push(v);
    if (sparse[sparse.length - 1] !== hi) sparse.push(hi);
    return sparse;
  }
  return out;
}

export function GraphPlot({
  xMin,
  xMax,
  yMin,
  yMax,
  lines = [],
  points,
  onChange,
  className,
}: GraphPlotProps) {
  const gid = useId().replace(/:/g, "");
  const w = 340;
  const h = 240;

  const project = useMemo(() => {
    return (x: number, y: number) => {
      const px = PAD + ((x - xMin) / (xMax - xMin || 1)) * (w - PAD * 2);
      const py = PAD + (1 - (y - yMin) / (yMax - yMin || 1)) * (h - PAD * 2);
      return { px, py };
    };
  }, [xMax, xMin, yMax, yMin]);

  const xTicks = useMemo(() => integerTicks(xMin, xMax), [xMin, xMax]);
  const yTicks = useMemo(() => integerTicks(yMin, yMax), [yMin, yMax]);

  const toData = (svgX: number, svgY: number) => {
    const innerW = w - PAD * 2;
    const innerH = h - PAD * 2;
    const x = xMin + ((svgX - PAD) / innerW) * (xMax - xMin);
    const y = yMax - ((svgY - PAD) / innerH) * (yMax - yMin);
    return {
      x: Number(x.toFixed(3)),
      y: Number(y.toFixed(3)),
    };
  };

  const bottomY = h - PAD;
  const leftX = PAD;

  return (
    <div className={cn("w-full max-w-md", className)}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full touch-none select-none rounded-2xl bg-zinc-900/80 ring-1 ring-white/10"
        onPointerDown={(e) => {
          const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const sx = ((e.clientX - rect.left) / rect.width) * w;
          const sy = ((e.clientY - rect.top) / rect.height) * h;
          onChange([toData(sx, sy)]);
        }}
      >
        <defs>
          <linearGradient id={`axisGrad-${gid}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {xTicks.map((xv) => {
          const { px } = project(xv, yMin);
          return (
            <line
              key={`gx-${xv}`}
              x1={px}
              y1={PAD}
              x2={px}
              y2={bottomY}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          );
        })}
        {yTicks.map((yv) => {
          const { py } = project(xMin, yv);
          return (
            <line
              key={`gy-${yv}`}
              x1={PAD}
              y1={py}
              x2={w - PAD}
              y2={py}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          );
        })}

        {lines.map((ln, i) => {
          const a = project(ln.x1, ln.y1);
          const b = project(ln.x2, ln.y2);
          return (
            <line
              key={i}
              x1={a.px}
              y1={a.py}
              x2={b.px}
              y2={b.py}
              stroke={`url(#axisGrad-${gid})`}
              strokeWidth={2}
              strokeDasharray="6 4"
            />
          );
        })}

        <line
          x1={PAD}
          y1={bottomY}
          x2={w - PAD}
          y2={bottomY}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={2}
        />
        <line x1={leftX} y1={PAD} x2={leftX} y2={bottomY} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />

        {/* X tick labels */}
        {xTicks.map((xv) => {
          const { px } = project(xv, yMin);
          return (
            <text
              key={`xlab-${xv}`}
              x={px}
              y={bottomY + 14}
              textAnchor="middle"
              className="fill-zinc-400"
              style={{ fontSize: 10, fontFamily: "ui-monospace, monospace" }}
            >
              {xv}
            </text>
          );
        })}

        {/* Y tick labels */}
        {yTicks.map((yv) => {
          const { py } = project(xMin, yv);
          return (
            <text
              key={`ylab-${yv}`}
              x={leftX - 8}
              y={py}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-zinc-400"
              style={{ fontSize: 10, fontFamily: "ui-monospace, monospace" }}
            >
              {yv}
            </text>
          );
        })}

        <text x={w / 2} y={h - 4} textAnchor="middle" className="fill-zinc-500" style={{ fontSize: 9 }}>
          x-axis
        </text>
        <text
          x={10}
          y={(PAD + bottomY) / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-zinc-500"
          style={{ fontSize: 9 }}
          transform={`rotate(-90, 10, ${(PAD + bottomY) / 2})`}
        >
          y-axis
        </text>

        {points.map((p, idx) => {
          const { px, py } = project(p.x, p.y);
          const label = `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`;
          const tx = Math.min(Math.max(px + 12, PAD + 8), w - PAD - 100);
          const ty = Math.max(py - 14, PAD + 14);
          return (
            <g key={idx}>
              <line
                x1={px}
                y1={py}
                x2={px}
                y2={bottomY}
                stroke="rgba(244,114,182,0.35)"
                strokeWidth={1}
                strokeDasharray="4 3"
              />
              <line
                x1={leftX}
                y1={py}
                x2={px}
                y2={py}
                stroke="rgba(244,114,182,0.35)"
                strokeWidth={1}
                strokeDasharray="4 3"
              />
              <circle cx={px} cy={py} r={10} fill="#f472b6" stroke="#fff" strokeWidth={2} />
              <text
                x={tx}
                y={ty}
                className="fill-violet-100"
                style={{
                  fontSize: 11,
                  fontFamily: "ui-monospace, monospace",
                  paintOrder: "stroke fill",
                  stroke: "rgb(24 24 27)",
                  strokeWidth: 4,
                }}
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>

      {points.length > 0 ? (
        <div className="mt-3 rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-2.5 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Placed point</p>
          <p className="mt-1 font-mono text-sm text-violet-100">
            {points.map((p, i) => (
              <span key={i}>
                {i > 0 ? " · " : null}
                P{i + 1} = ({p.x.toFixed(2)}, {p.y.toFixed(2)})
              </span>
            ))}
          </p>
        </div>
      ) : (
        <p className="mt-3 text-center text-xs text-zinc-500">Tap the grid to set (x, y)</p>
      )}
    </div>
  );
}
