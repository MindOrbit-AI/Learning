import { Percent } from "lucide-react";
import type { InteractiveCatalogItem } from "./catalog";
import type { PercentLessonSeed } from "@mindorbit/content";

const LEVEL_ACCENT: Record<number, { accent: string; badge: string }> = {
  1: { accent: "from-emerald-400/20 to-green-500/10", badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  2: { accent: "from-teal-400/20 to-cyan-500/10", badge: "bg-teal-500/15 text-teal-700 dark:text-teal-300" },
  3: { accent: "from-cyan-400/20 to-sky-500/10", badge: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300" },
  4: { accent: "from-sky-400/20 to-blue-500/10", badge: "bg-sky-500/15 text-sky-700 dark:text-sky-300" },
  5: { accent: "from-blue-400/20 to-indigo-500/10", badge: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
};

function primitivesForSeed(seed: PercentLessonSeed): InteractiveCatalogItem["primitives"] {
  const set = new Set<InteractiveCatalogItem["primitives"][number]>();
  for (const scene of [...seed.scenes, seed.finalMasteryCheck]) {
    switch (scene.type) {
      case "fraction_bar":
      case "grid_model":
        set.add("tiles");
        break;
      case "number_line":
        set.add("number_line");
        break;
      case "drag_drop_sort":
        set.add("sequence_builder");
        set.add("drag");
        break;
      case "drag_drop_match":
        set.add("drop_zone");
        set.add("drag");
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

function sceneCategoriesForSeed(seed: PercentLessonSeed): InteractiveCatalogItem["sceneCategories"] {
  const set = new Set<InteractiveCatalogItem["sceneCategories"][number]>();
  for (const scene of [...seed.scenes, seed.finalMasteryCheck]) {
    if (scene.type === "number_line") set.add("spatial");
    else if (scene.type === "multiple_choice" || scene.type === "segment_select") set.add("selection");
    else set.add("construction");
  }
  return [...set];
}

export function percentLessonToCatalogItem(seed: PercentLessonSeed): InteractiveCatalogItem {
  const style = LEVEL_ACCENT[seed.percentTrackLevel] ?? LEVEL_ACCENT[1]!;
  return {
    id: seed.id,
    title: seed.title,
    subject: "Math",
    topic: seed.topic,
    level: seed.level === "beginner" ? "Beginner" : "Intermediate",
    description: seed.scenes[0]?.prompt ?? seed.title,
    primitives: primitivesForSeed(seed),
    sceneCategories: sceneCategoriesForSeed(seed),
    durationMin: 8 + seed.scenes.length * 2,
    icon: Percent,
    accent: style.accent,
    badge: style.badge,
  };
}

export function buildPercentsCatalogItems(seeds: PercentLessonSeed[]): InteractiveCatalogItem[] {
  return seeds.map(percentLessonToCatalogItem);
}
