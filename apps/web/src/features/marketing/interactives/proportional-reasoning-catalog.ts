import { GitBranch } from "lucide-react";
import type { InteractiveCatalogItem } from "./catalog";
import type { PropLessonSeed } from "@mindorbit/content";

const LEVEL_ACCENT: Record<number, { accent: string; badge: string }> = {
  1: { accent: "from-orange-400/20 to-amber-500/10", badge: "bg-orange-500/15 text-orange-700 dark:text-orange-300" },
  2: { accent: "from-amber-400/20 to-yellow-500/10", badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  3: { accent: "from-yellow-400/20 to-lime-500/10", badge: "bg-yellow-600/15 text-yellow-800 dark:text-yellow-300" },
  4: { accent: "from-lime-400/20 to-green-500/10", badge: "bg-lime-600/15 text-lime-800 dark:text-lime-300" },
  5: { accent: "from-green-400/20 to-emerald-500/10", badge: "bg-green-600/15 text-green-800 dark:text-green-300" },
  6: { accent: "from-emerald-400/20 to-teal-500/10", badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  7: { accent: "from-teal-400/20 to-cyan-500/10", badge: "bg-teal-500/15 text-teal-700 dark:text-teal-300" },
};

function primitivesForSeed(seed: PropLessonSeed): InteractiveCatalogItem["primitives"] {
  const set = new Set<InteractiveCatalogItem["primitives"][number]>();
  for (const scene of [...seed.scenes, seed.finalMasteryCheck]) {
    switch (scene.type) {
      case "fraction_bar":
      case "grid_model":
        set.add("tiles");
        break;
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

function sceneCategoriesForSeed(seed: PropLessonSeed): InteractiveCatalogItem["sceneCategories"] {
  const set = new Set<InteractiveCatalogItem["sceneCategories"][number]>();
  for (const scene of [...seed.scenes, seed.finalMasteryCheck]) {
    if (scene.type === "graph_plot" || scene.type === "number_line") set.add("spatial");
    else if (scene.type === "multiple_choice" || scene.type === "segment_select") set.add("selection");
    else set.add("construction");
  }
  return [...set];
}

export function propLessonToCatalogItem(seed: PropLessonSeed): InteractiveCatalogItem {
  const style = LEVEL_ACCENT[seed.propTrackLevel] ?? LEVEL_ACCENT[1]!;
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
    icon: GitBranch,
    accent: style.accent,
    badge: style.badge,
  };
}

export function buildProportionalReasoningCatalogItems(seeds: PropLessonSeed[]): InteractiveCatalogItem[] {
  return seeds.map(propLessonToCatalogItem);
}
