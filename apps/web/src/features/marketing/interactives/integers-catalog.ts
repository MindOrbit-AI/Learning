import { Minus } from "lucide-react";
import type { InteractiveCatalogItem } from "./catalog";
import type { IntegerLessonSeed } from "@mindorbit/content";

const LEVEL_ACCENT: Record<number, { accent: string; badge: string }> = {
  1: { accent: "from-rose-400/20 to-red-500/10", badge: "bg-rose-500/15 text-rose-700 dark:text-rose-300" },
  2: { accent: "from-orange-400/20 to-amber-500/10", badge: "bg-orange-500/15 text-orange-700 dark:text-orange-300" },
  3: { accent: "from-yellow-400/20 to-lime-500/10", badge: "bg-yellow-600/15 text-yellow-800 dark:text-yellow-300" },
  4: { accent: "from-lime-400/20 to-green-500/10", badge: "bg-lime-600/15 text-lime-800 dark:text-lime-300" },
  5: { accent: "from-emerald-400/20 to-teal-500/10", badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  6: { accent: "from-teal-400/20 to-cyan-500/10", badge: "bg-teal-500/15 text-teal-700 dark:text-teal-300" },
  7: { accent: "from-cyan-400/20 to-sky-500/10", badge: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300" },
  8: { accent: "from-sky-400/20 to-blue-500/10", badge: "bg-sky-500/15 text-sky-700 dark:text-sky-300" },
};

function primitivesForSeed(seed: IntegerLessonSeed): InteractiveCatalogItem["primitives"] {
  const set = new Set<InteractiveCatalogItem["primitives"][number]>();
  for (const scene of [...seed.scenes, seed.finalMasteryCheck]) {
    switch (scene.type) {
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

function sceneCategoriesForSeed(seed: IntegerLessonSeed): InteractiveCatalogItem["sceneCategories"] {
  const set = new Set<InteractiveCatalogItem["sceneCategories"][number]>();
  for (const scene of [...seed.scenes, seed.finalMasteryCheck]) {
    if (scene.type === "number_line") set.add("spatial");
    else if (scene.type === "multiple_choice" || scene.type === "segment_select") set.add("selection");
    else set.add("construction");
  }
  return [...set];
}

export function integerLessonToCatalogItem(seed: IntegerLessonSeed): InteractiveCatalogItem {
  const style = LEVEL_ACCENT[seed.integerTrackLevel] ?? LEVEL_ACCENT[1]!;
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
    icon: Minus,
    accent: style.accent,
    badge: style.badge,
  };
}

export function buildIntegersCatalogItems(seeds: IntegerLessonSeed[]): InteractiveCatalogItem[] {
  return seeds.map(integerLessonToCatalogItem);
}
