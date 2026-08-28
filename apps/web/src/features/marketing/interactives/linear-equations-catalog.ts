import { GitBranch } from "lucide-react";
import type { InteractiveCatalogItem } from "./catalog";
import type { LineqLessonSeed } from "@mindorbit/content";

const LEVEL_ACCENT: Record<number, { accent: string; badge: string }> = {
  1: { accent: "from-sky-400/20 to-blue-500/10", badge: "bg-sky-500/15 text-sky-700 dark:text-sky-300" },
  2: { accent: "from-cyan-400/20 to-teal-500/10", badge: "bg-teal-500/15 text-teal-700 dark:text-teal-300" },
  3: { accent: "from-emerald-400/20 to-green-500/10", badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  4: { accent: "from-lime-400/20 to-green-500/10", badge: "bg-lime-600/15 text-lime-800 dark:text-lime-300" },
  5: { accent: "from-amber-400/20 to-orange-500/10", badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  6: { accent: "from-orange-400/20 to-red-500/10", badge: "bg-orange-500/15 text-orange-700 dark:text-orange-300" },
  7: { accent: "from-rose-400/20 to-pink-500/10", badge: "bg-rose-500/15 text-rose-700 dark:text-rose-300" },
  8: { accent: "from-fuchsia-400/20 to-purple-500/10", badge: "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300" },
  9: { accent: "from-violet-400/20 to-purple-500/10", badge: "bg-violet-500/15 text-violet-700 dark:text-violet-300" },
  10: { accent: "from-indigo-400/20 to-blue-500/10", badge: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300" },
  11: { accent: "from-blue-400/20 to-indigo-500/10", badge: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
  12: { accent: "from-teal-400/20 to-cyan-500/10", badge: "bg-teal-500/15 text-teal-700 dark:text-teal-300" },
  13: { accent: "from-zinc-400/20 to-slate-500/10", badge: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300" },
};

function primitivesForSeed(seed: LineqLessonSeed): InteractiveCatalogItem["primitives"] {
  const set = new Set<InteractiveCatalogItem["primitives"][number]>();
  for (const scene of [...seed.scenes, seed.finalMasteryCheck]) {
    switch (scene.type) {
      case "balance_scale":
        set.add("balance_scale");
        break;
      case "number_line":
        set.add("number_line");
        break;
      case "graph_plot":
        set.add("graph");
        set.add("coordinate_plane");
        break;
      case "drag_drop_sort":
        set.add("sequence_builder");
        set.add("drag");
        break;
      case "drag_drop_match":
        set.add("drop_zone");
        set.add("drag");
        break;
      case "gear":
        set.add("gear");
        break;
      case "multiple_choice":
      case "segment_select":
        set.add("multiple_choice");
        break;
      default:
        break;
    }
  }
  return [...set];
}

function sceneCategoriesForSeed(seed: LineqLessonSeed): InteractiveCatalogItem["sceneCategories"] {
  const set = new Set<InteractiveCatalogItem["sceneCategories"][number]>();
  for (const scene of [...seed.scenes, seed.finalMasteryCheck]) {
    if (scene.type === "number_line" || scene.type === "graph_plot") set.add("spatial");
    else if (scene.type === "multiple_choice" || scene.type === "segment_select") set.add("selection");
    else if (scene.type === "gear") set.add("simulation");
    else set.add("construction");
  }
  return [...set];
}

export function lineqLessonToCatalogItem(seed: LineqLessonSeed): InteractiveCatalogItem {
  const style = LEVEL_ACCENT[seed.lineqTrackLevel] ?? LEVEL_ACCENT[1]!;
  return {
    id: seed.id,
    title: seed.title,
    subject: "Algebra",
    topic: seed.topic,
    level: seed.level === "beginner" ? "Beginner" : "Intermediate",
    description: seed.scenes[0]?.prompt ?? seed.title,
    primitives: primitivesForSeed(seed),
    sceneCategories: sceneCategoriesForSeed(seed),
    durationMin: 8 + seed.scenes.length * 2,
    icon: GitBranch,
    accent: style.accent,
    badge: style.badge,
  };
}

export function buildLinearEquationsCatalogItems(seeds: LineqLessonSeed[]): InteractiveCatalogItem[] {
  return seeds.map(lineqLessonToCatalogItem);
}
