import { Crosshair } from "lucide-react";
import type { InteractiveCatalogItem } from "./catalog";
import type { CoordLessonSeed } from "@mindorbit/content";

const LEVEL_ACCENT: Record<number, { accent: string; badge: string }> = {
  1: { accent: "from-blue-400/20 to-indigo-500/10", badge: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
  2: { accent: "from-indigo-400/20 to-violet-500/10", badge: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300" },
  3: { accent: "from-violet-400/20 to-purple-500/10", badge: "bg-violet-500/15 text-violet-700 dark:text-violet-300" },
  4: { accent: "from-fuchsia-400/20 to-pink-500/10", badge: "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300" },
  5: { accent: "from-pink-400/20 to-rose-500/10", badge: "bg-pink-500/15 text-pink-700 dark:text-pink-300" },
};

function primitivesForSeed(seed: CoordLessonSeed): InteractiveCatalogItem["primitives"] {
  const set = new Set<InteractiveCatalogItem["primitives"][number]>();
  for (const scene of [...seed.scenes, seed.finalMasteryCheck]) {
    switch (scene.type) {
      case "graph_plot":
        set.add("graph");
        set.add("coordinate_plane");
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

function sceneCategoriesForSeed(seed: CoordLessonSeed): InteractiveCatalogItem["sceneCategories"] {
  const set = new Set<InteractiveCatalogItem["sceneCategories"][number]>();
  for (const scene of [...seed.scenes, seed.finalMasteryCheck]) {
    if (scene.type === "graph_plot" || scene.type === "number_line") set.add("spatial");
    else if (scene.type === "multiple_choice" || scene.type === "segment_select") set.add("selection");
    else set.add("construction");
  }
  return [...set];
}

export function coordLessonToCatalogItem(seed: CoordLessonSeed): InteractiveCatalogItem {
  const style = LEVEL_ACCENT[seed.coordTrackLevel] ?? LEVEL_ACCENT[1]!;
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
    icon: Crosshair,
    accent: style.accent,
    badge: style.badge,
  };
}

export function buildCoordinatePlaneCatalogItems(seeds: CoordLessonSeed[]): InteractiveCatalogItem[] {
  return seeds.map(coordLessonToCatalogItem);
}
