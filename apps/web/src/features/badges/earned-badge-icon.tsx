import { cn } from "@mindorbit/ui";
import {
  CalendarDays,
  CircleCheck,
  Crosshair,
  Flame,
  FlaskConical,
  Medal,
  Star,
  Target,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";

type BadgeStyle = {
  Icon: LucideIcon;
  /** Outer metal rim */
  ring: string;
  /** Inner enamel / face */
  face: string;
  iconClass: string;
};

type DefaultBadgeFrame = Pick<BadgeStyle, "ring" | "face" | "iconClass">;

const BADGE_STYLES: Record<string, BadgeStyle> = {
  "first-diagnostic": {
    Icon: Target,
    ring: "from-zinc-200 via-zinc-400 to-zinc-700 dark:from-zinc-500 dark:via-zinc-600 dark:to-zinc-900",
    face: "from-sky-300 via-sky-500 to-blue-800 dark:from-sky-600 dark:via-sky-700 dark:to-blue-950",
    iconClass: "text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]",
  },
  "7-day-streak": {
    Icon: Flame,
    ring: "from-orange-200 via-amber-500 to-orange-900 dark:from-orange-700 dark:via-amber-800 dark:to-orange-950",
    face: "from-amber-300 via-orange-500 to-red-700 dark:from-amber-600 dark:via-orange-700 dark:to-red-950",
    iconClass: "text-amber-50 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]",
  },
  "mission-finisher": {
    Icon: CircleCheck,
    ring: "from-emerald-200 via-emerald-400 to-emerald-800 dark:from-emerald-600 dark:via-emerald-700 dark:to-emerald-950",
    face: "from-emerald-300 via-green-500 to-emerald-900 dark:from-emerald-600 dark:via-green-700 dark:to-emerald-950",
    iconClass: "text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]",
  },
  "mission-veteran": {
    Icon: Medal,
    ring: "from-amber-100 via-amber-400 to-amber-900 dark:from-amber-600 dark:via-amber-700 dark:to-amber-950",
    face: "from-amber-200 via-amber-500 to-yellow-900 dark:from-amber-700 dark:via-yellow-800 dark:to-amber-950",
    iconClass: "text-amber-950 dark:text-amber-100 drop-shadow-[0_1px_1px_rgba(255,255,255,0.25)]",
  },
  "mission-legend": {
    Icon: Trophy,
    ring: "from-yellow-200 via-amber-500 to-yellow-900 dark:from-yellow-600 dark:via-amber-700 dark:to-yellow-950",
    face: "from-yellow-300 via-amber-400 to-amber-900 dark:from-yellow-600 dark:via-amber-600 dark:to-amber-950",
    iconClass: "text-amber-950 dark:text-amber-50 drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]",
  },
  "challenge-taker": {
    Icon: Zap,
    ring: "from-violet-200 via-violet-500 to-indigo-900 dark:from-violet-600 dark:via-indigo-700 dark:to-violet-950",
    face: "from-violet-400 via-indigo-500 to-purple-900 dark:from-violet-600 dark:via-indigo-700 dark:to-purple-950",
    iconClass: "text-violet-50 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]",
  },
  "scene-sharp": {
    Icon: Crosshair,
    ring: "from-slate-200 via-slate-400 to-slate-800 dark:from-slate-500 dark:via-slate-600 dark:to-slate-900",
    face: "from-cyan-300 via-teal-500 to-cyan-900 dark:from-cyan-600 dark:via-teal-700 dark:to-cyan-950",
    iconClass: "text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]",
  },
  "weekly-warrior": {
    Icon: CalendarDays,
    ring: "from-indigo-200 via-indigo-400 to-indigo-900 dark:from-indigo-600 dark:via-indigo-700 dark:to-indigo-950",
    face: "from-indigo-300 via-blue-500 to-indigo-900 dark:from-indigo-600 dark:via-blue-700 dark:to-indigo-950",
    iconClass: "text-indigo-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]",
  },
  "top-contributor": {
    Icon: Star,
    ring: "from-amber-200 via-yellow-500 to-amber-900 dark:from-amber-600 dark:via-yellow-700 dark:to-amber-950",
    face: "from-yellow-200 via-amber-400 to-yellow-800 dark:from-amber-700 dark:via-yellow-700 dark:to-amber-950",
    iconClass: "text-amber-950 dark:text-amber-50 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]",
  },
  "stoichiometry-master": {
    Icon: FlaskConical,
    ring: "from-teal-200 via-teal-400 to-teal-900 dark:from-teal-600 dark:via-teal-700 dark:to-teal-950",
    face: "from-teal-300 via-emerald-500 to-teal-900 dark:from-teal-600 dark:via-emerald-700 dark:to-teal-950",
    iconClass: "text-teal-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]",
  },
};

const DEFAULT_FRAME: DefaultBadgeFrame = {
  ring: "from-amber-200 via-amber-500 to-amber-900 dark:from-amber-700 dark:via-amber-800 dark:to-amber-950",
  face: "from-amber-100 via-amber-300 to-amber-700 dark:from-amber-800 dark:via-amber-900 dark:to-amber-950",
  iconClass: "",
};

const SIZE_CLASSES = {
  sm: "h-9 w-9 [&_svg]:h-[15px] [&_svg]:w-[15px] text-[15px]",
  md: "h-12 w-12 [&_svg]:h-5 [&_svg]:w-5 text-lg",
  lg: "h-16 w-16 [&_svg]:h-7 [&_svg]:w-7 text-2xl",
} as const;

export type EarnedBadgeModel = {
  slug: string;
  icon: string;
  title?: string;
  description?: string;
};

export function EarnedBadgeIcon({
  badge,
  size = "md",
  className,
}: {
  badge: EarnedBadgeModel;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
}) {
  const mapped = BADGE_STYLES[badge.slug];
  const frame: DefaultBadgeFrame = mapped ?? DEFAULT_FRAME;
  const Icon = mapped?.Icon;

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 rounded-full p-[2.5px] shadow-[0_2px_6px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.45)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.12)]",
        "bg-gradient-to-br",
        frame.ring,
        SIZE_CLASSES[size],
        className,
      )}
      title={badge.description ?? badge.title}
    >
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-b shadow-[inset_0_2px_8px_rgba(255,255,255,0.35),inset_0_-3px_10px_rgba(0,0,0,0.22)] dark:shadow-[inset_0_2px_6px_rgba(255,255,255,0.12),inset_0_-4px_12px_rgba(0,0,0,0.35)]",
          frame.face,
        )}
      >
        <span
          className="pointer-events-none absolute left-[18%] top-[12%] h-[28%] w-[42%] rounded-full bg-white/35 blur-md dark:bg-white/15"
          aria-hidden
        />
        {Icon ? (
          <Icon className={cn(frame.iconClass)} strokeWidth={2.25} aria-hidden />
        ) : (
          <span className="leading-none drop-shadow-sm" role="img" aria-hidden>
            {badge.icon}
          </span>
        )}
      </div>
    </div>
  );
}
