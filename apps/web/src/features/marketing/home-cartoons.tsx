import type { SVGProps } from "react";

type SvgProps = SVGProps<SVGSVGElement>;

function svgProps(className: string | undefined): Pick<SvgProps, "className" | "aria-hidden"> {
  return { className, "aria-hidden": true };
}

/** Floating star mascot — hero decoration */
export function CartoonHeroStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" {...svgProps(className)}>
      <path
        d="M60 12l8 22 23 2-18 15 6 22-19-11-19 11 6-22-18-15 23-2 8-22z"
        className="fill-primary/20 stroke-primary"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <circle cx={46} cy={52} r={5} className="fill-zinc-950 stroke-primary" strokeWidth={2} />
      <circle cx={74} cy={52} r={5} className="fill-zinc-950 stroke-primary" strokeWidth={2} />
      <path
        d="M48 72c8 6 16 6 24 0"
        className="stroke-primary"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <circle cx={60} cy={96} r={10} className="fill-emerald-500/15 stroke-emerald-500/50" strokeWidth={2} />
    </svg>
  );
}

/** Ringed planet — hero decoration */
export function CartoonHeroPlanet({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" {...svgProps(className)}>
      <ellipse
        cx={60}
        cy={88}
        rx={44}
        ry={10}
        className="stroke-primary/35"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <circle cx={60} cy={52} r={28} className="fill-primary/15 stroke-primary/60" strokeWidth={2.5} />
      <path
        d="M36 48c10-6 22-6 32 0"
        className="stroke-primary/40"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <ellipse
        cx={60}
        cy={52}
        rx={40}
        ry={12}
        className="stroke-primary/25"
        strokeWidth={2}
        transform="rotate(-18 60 52)"
      />
      <circle cx={72} cy={44} r={6} className="fill-emerald-400/30" />
    </svg>
  );
}

export function CartoonStepDiagnose({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" {...svgProps(className)}>
      <circle cx={48} cy={48} r={22} className="fill-zinc-900/80 stroke-primary" strokeWidth={2.5} />
      <path
        d="M64 64l18 18"
        className="stroke-primary"
        strokeWidth={4}
        strokeLinecap="round"
      />
      <circle cx={48} cy={48} r={10} className="stroke-primary/60" strokeWidth={2} />
      <path d="M44 46h8M48 42v8" className="stroke-primary" strokeWidth={2.5} strokeLinecap="round" />
      <path
        d="M22 88c6-10 18-16 30-16s24 6 30 16"
        className="stroke-emerald-500/50"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CartoonStepMap({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" {...svgProps(className)}>
      <path
        d="M20 78 L42 38 L64 52 L86 28 L100 44"
        className="stroke-primary/50"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={42} cy={38} r={7} className="fill-primary/25 stroke-primary" strokeWidth={2} />
      <circle cx={64} cy={52} r={7} className="fill-primary stroke-zinc-950" strokeWidth={2} />
      <circle cx={86} cy={28} r={7} className="fill-primary/25 stroke-primary" strokeWidth={2} />
      <path
        d="M24 24l8-4v10l-8 4z"
        className="fill-emerald-500/20 stroke-emerald-500/60"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path d="M28 20v6" className="stroke-emerald-500/70" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

export function CartoonStepTrain({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" {...svgProps(className)}>
      <path
        d="M60 18 L72 48 L54 48 L60 18Z"
        className="fill-primary/30 stroke-primary"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <path
        d="M48 52h24l-4 28H52l-4-28Z"
        className="fill-zinc-900/90 stroke-primary"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path
        d="M52 88c0 6 4 10 8 10s8-4 8-10"
        className="stroke-primary/60"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M44 62h32M50 72h20"
        className="stroke-primary/35"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M60 100v8M52 104h16"
        className="stroke-emerald-500/50"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <circle cx={34} cy={40} r={3} className="fill-primary/40" />
      <circle cx={88} cy={36} r={2.5} className="fill-primary/30" />
    </svg>
  );
}

export function CartoonStepReinforce({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" {...svgProps(className)}>
      <path
        d="M60 28a32 32 0 1 0 0 56"
        className="stroke-primary"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M88 60a32 32 0 1 0-56 0"
        className="stroke-emerald-500/55"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M72 44c-6 10-18 14-28 10"
        className="stroke-primary/45"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle cx={60} cy={54} r={10} className="fill-primary/20 stroke-primary" strokeWidth={2} />
      <path
        d="M56 54l3 3 6-7"
        className="stroke-primary"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Problem section — fuzzy thought bubble */
export function CartoonProblemBrainFog({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" {...svgProps(className)}>
      <path
        d="M38 78c-12-8-10-28 4-34 2-14 16-24 30-22 10 14 8 32-4 42-8 6-20 8-30 14z"
        className="fill-zinc-800/80 stroke-primary/35"
        strokeWidth={2}
      />
      <path
        d="M52 48c4-2 8-2 12 0M46 58h14"
        className="stroke-primary/50"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M66 28c0-4 3-6 6-6s6 2 6 6c0 4-3 6-6 8-1 1-2 2-2 4"
        className="stroke-primary/60"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
      <path d="M72 46v4" className="stroke-primary/60" strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={82} cy={30} r={6} className="fill-zinc-800/60 stroke-primary/25" strokeWidth={1.5} />
      <circle cx={94} cy={22} r={4} className="fill-zinc-800/50 stroke-primary/20" strokeWidth={1.5} />
    </svg>
  );
}

/** Problem section — happy lightbulb moment */
export function CartoonProblemAha({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" {...svgProps(className)}>
      <path
        d="M60 22c14 0 26 12 26 26 0 10-6 18-12 24-4 4-8 8-8 14H44c0-6-4-10-8-14-6-6-12-14-12-24 0-14 12-26 26-26z"
        className="fill-primary/15 stroke-primary"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <path
        d="M48 86h24v8H48z"
        className="fill-zinc-800 stroke-primary/40"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path d="M52 98h16" className="stroke-primary/35" strokeWidth={2} strokeLinecap="round" />
      <path
        d="M44 34l4 4M76 34l-4 4M60 30v6"
        className="stroke-emerald-400/60"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}
