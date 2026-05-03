"use client";

import { useMemo } from "react";

export type TriangleSpec = {
  edges: [number, number, number];
  label?: string;
};

function verticesFromConsecutiveSides(a: number, b: number, c: number): [number, number][] | null {
  const s01 = Math.max(a, 0.001);
  const s12 = Math.max(b, 0.001);
  const s20 = Math.max(c, 0.001);
  if (s01 + s12 <= s20 || s12 + s20 <= s01 || s20 + s01 <= s12) return null;
  const v0: [number, number] = [0, 0];
  const v1: [number, number] = [s01, 0];
  const x = (s20 * s20 - s12 * s12 + s01 * s01) / (2 * s01);
  const y2 = s20 * s20 - x * x;
  if (y2 < -1e-4) return null;
  const y = Math.sqrt(Math.max(0, y2));
  const v2: [number, number] = [x, y];
  return [v0, v1, v2];
}

function TriangleSvg({ spec, size = 140 }: { spec: TriangleSpec; size?: number }) {
  const pts = useMemo(() => {
    const [e0, e1, e2] = [...spec.edges].map((x) => Number(x)) as [number, number, number];
    const raw = verticesFromConsecutiveSides(e0, e1, e2);
    if (!raw) return null;
    const xs = raw.map((p) => p[0]);
    const ys = raw.map((p) => p[1]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const w = Math.max(maxX - minX, 1);
    const h = Math.max(maxY - minY, 1);
    const pad = w * 0.12;
    const scale = (size - pad * 2) / Math.max(w, h);
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const map = (p: [number, number]): [number, number] => {
      const nx = (p[0] - cx) * scale + size / 2;
      const ny = (cy - p[1]) * scale + size / 2 * 0.95;
      return [nx, ny];
    };
    const m = raw.map(map);
    return { m, e0, e1, e2 };
  }, [spec.edges[0], spec.edges[1], spec.edges[2], size]);

  if (!pts) {
    return (
      <div className="flex h-36 w-36 items-center justify-center rounded-xl border border-dashed border-muted-foreground/40 bg-muted/30 p-2 text-center text-[10px] text-muted-foreground">
        Invalid side lengths (triangle inequality).
      </div>
    );
  }

  const d = `M ${pts.m[0]![0]} ${pts.m[0]![1]} L ${pts.m[1]![0]} ${pts.m[1]![1]} L ${pts.m[2]![0]} ${pts.m[2]![1]} Z`;
  const edgeLabel = `${pts.e0} · ${pts.e1} · ${pts.e2}`;

  return (
    <figure className="flex flex-col items-center gap-2">
      {spec.label ? (
        <figcaption className="text-xs font-bold text-foreground">{spec.label}</figcaption>
      ) : null}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible text-primary"
        aria-hidden
      >
        <path
          d={d}
          className="fill-primary/15 stroke-primary"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
      </svg>
      <p className="max-w-[9rem] text-center text-[10px] font-medium tabular-nums text-muted-foreground">
        Sides {edgeLabel}
      </p>
    </figure>
  );
}

export function normalizeTriangles(ws: Record<string, unknown>): TriangleSpec[] {
  const raw = ws.diagramTriangles;
  if (Array.isArray(raw)) {
    const mapped: (TriangleSpec | null)[] = raw.map((t) => {
      const o = t as Record<string, unknown>;
      const e = o.edges as number[] | undefined;
      if (!Array.isArray(e) || e.length < 3) return null;
      return {
        edges: [Number(e[0]), Number(e[1]), Number(e[2])] as [number, number, number],
        label: o.label != null ? String(o.label) : undefined,
      };
    });
    return mapped.filter((x): x is TriangleSpec => x != null);
  }
  const out: TriangleSpec[] = [];
  const pushTri = (key: string) => {
    const o = ws[key] as Record<string, unknown> | undefined;
    if (!o || !Array.isArray(o.edges) || (o.edges as number[]).length < 3) return;
    const e = o.edges as number[];
    out.push({
      edges: [Number(e[0]), Number(e[1]), Number(e[2])],
      label: o.label != null ? String(o.label) : undefined,
    });
  };
  pushTri("triangleA");
  pushTri("triangleB");
  return out;
}

/** True when the workspace has at least one triangle with three numeric side lengths. */
export function hasRenderableTriangleDiagrams(ws: Record<string, unknown>): boolean {
  return normalizeTriangles(ws).length > 0;
}

export function TriangleDiagramPair({ workspace }: { workspace: Record<string, unknown> }) {
  const specs = useMemo(() => normalizeTriangles(workspace), [workspace]);
  if (specs.length === 0) return null;

  return (
    <div className="mb-5 rounded-xl border border-slate-300/60 bg-slate-50/80 px-4 py-4 dark:border-slate-600/60 dark:bg-slate-950/40">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
        Diagram (side lengths)
      </p>
      <div className="flex flex-wrap items-start justify-center gap-8">
        {specs.map((spec, i) => (
          <TriangleSvg key={`${spec.edges.join("-")}-${i}`} spec={spec} size={150} />
        ))}
      </div>
    </div>
  );
}
