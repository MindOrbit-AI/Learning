"use client";

import type { NumberLineData } from "@/features/lesson-blocks/types/block.types";

interface NumberLineGraphProps {
  data: NumberLineData;
  width?: number;
  height?: number;
}

/**
 * Renders inequalities on a number line as an SVG.
 * Filled circle = inclusive (≤/≥), open circle = exclusive (</>).
 */
export function NumberLineGraph({
  data,
  width = 400,
  height = 80,
}: NumberLineGraphProps) {
  const { min, max, segments } = data;
  const range = max - min || 1;
  const padding = 24;
  const lineY = height / 2;
  const scaleX = (x: number) =>
    padding + ((x - min) / range) * (width - padding * 2);
  const tickStep = range <= 2 ? 0.5 : range <= 10 ? 1 : Math.ceil(range / 10);
  const ticks: number[] = [];
  for (let t = Math.ceil(min / tickStep) * tickStep; t <= max; t += tickStep) {
    ticks.push(t);
  }
  if (ticks[0] !== min) ticks.unshift(min);
  if (ticks[ticks.length - 1] !== max) ticks.push(max);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full max-w-md"
      preserveAspectRatio="xMidYMid meet"
    >
      <line
        x1={padding}
        y1={lineY}
        x2={width - padding}
        y2={lineY}
        stroke="currentColor"
        strokeWidth={2}
      />
      {ticks.map((t) => {
        const x = scaleX(t);
        return (
          <g key={t}>
            <line
              x1={x}
              y1={lineY}
              x2={x}
              y2={lineY + 8}
              stroke="currentColor"
              strokeWidth={1.5}
            />
            <text
              x={x}
              y={lineY + 22}
              textAnchor="middle"
              className="fill-foreground text-xs font-medium"
            >
              {t}
            </text>
          </g>
        );
      })}
      {segments.map((seg, i) => {
        const x1 = scaleX(seg.start);
        const x2 = scaleX(seg.end);
        const r = 6;
        return (
          <g key={i}>
            <line
              x1={x1}
              y1={lineY}
              x2={x2}
              y2={lineY}
              stroke="var(--primary)"
              strokeWidth={4}
              strokeLinecap="round"
            />
            {seg.startFilled ? (
              <circle cx={x1} cy={lineY} r={r} fill="var(--primary)" />
            ) : (
              <circle
                cx={x1}
                cy={lineY}
                r={r}
                fill="var(--background)"
                stroke="var(--primary)"
                strokeWidth={2}
              />
            )}
            {seg.endFilled ? (
              <circle cx={x2} cy={lineY} r={r} fill="var(--primary)" />
            ) : (
              <circle
                cx={x2}
                cy={lineY}
                r={r}
                fill="var(--background)"
                stroke="var(--primary)"
                strokeWidth={2}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
