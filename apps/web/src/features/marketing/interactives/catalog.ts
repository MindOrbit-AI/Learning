import type { LucideIcon } from "lucide-react";
import {
  Atom,
  Beaker,
  Dna,
  FlaskConical,
  GitBranch,
  Leaf,
  LineChart,
  Triangle,
  Zap,
  Calculator,
  Microscope,
  Scale,
  Cog,
} from "lucide-react";
import type { SceneCategory } from "@/types/scene";
import type { EnginePrimitive } from "@/types/interactive-engine";
import { ENGINE_PRIMITIVE_COUNT } from "./engine-catalog";
import { MATH_FRACTIONS_CURRICULUM_SEEDS, MATH_ALGEBRA_CURRICULUM_SEEDS } from "@mindorbit/content";
import { buildFractionsCatalogItems } from "./fractions-catalog";
import { buildAlgebraCatalogItems } from "./algebra-catalog";

export type { EnginePrimitive };
export { ENGINE_PRIMITIVE_COUNT, ENGINE_PRIMITIVE_META, engineLabel } from "./engine-catalog";
export type { EngineFilter } from "./engine-catalog";

export type InteractiveSubject = "Math" | "Physics" | "Biology" | "Chemistry";

export type InteractiveCatalogItem = {
  id: string;
  title: string;
  subject: InteractiveSubject;
  topic: string;
  level: "Beginner" | "Intermediate";
  description: string;
  /** Engine primitives used in this lesson's JSON scenes. */
  primitives: EnginePrimitive[];
  sceneCategories: SceneCategory[];
  durationMin: number;
  icon: LucideIcon;
  accent: string;
  badge: string;
};

export const SUBJECT_META: Record<
  InteractiveSubject,
  { slug: string; description: string; icon: LucideIcon; accent: string; badge: string }
> = {
  Math: {
    slug: "math",
    description:
      "Plot coordinates, shade fractions, build proofs step-by-step — math that clicks when you manipulate it.",
    icon: Calculator,
    accent: "from-blue-400/20 to-indigo-500/10",
    badge: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  },
  Physics: {
    slug: "physics",
    description:
      "Model forces, wire circuits, and plot energy — see Newton's laws and conservation in motion.",
    icon: Atom,
    accent: "from-amber-400/20 to-orange-500/10",
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  Biology: {
    slug: "biology",
    description:
      "Pair DNA bases, fill Punnett squares, and trace evolution — genetics and life science you can touch.",
    icon: Dna,
    accent: "from-emerald-400/20 to-green-500/10",
    badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
  Chemistry: {
    slug: "chemistry",
    description:
      "Track periodic trends, balance equations, and compare bonds — chemistry through visual models.",
    icon: FlaskConical,
    accent: "from-teal-400/20 to-cyan-500/10",
    badge: "bg-teal-500/15 text-teal-700 dark:text-teal-300",
  },
};

export const INTERACTIVE_CATALOG: InteractiveCatalogItem[] = [
  {
    id: "lesson-gear-ratios-intro",
    title: "Gear ratios intro",
    subject: "Math",
    topic: "Ratios & proportions",
    level: "Beginner",
    description: "Mesh gears, spin the driver, and predict output speed from tooth counts — 12:36 = 1:3.",
    primitives: ["gear", "multiple_choice", "simulation"],
    sceneCategories: ["simulation", "selection"],
    durationMin: 10,
    icon: Cog,
    accent: "from-violet-400/20 to-purple-500/10",
    badge: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  },
  {
    id: "lesson-gear-algebra",
    title: "Algebra with gears",
    subject: "Math",
    topic: "Linear equations",
    level: "Beginner",
    description: "Treat tooth counts as variables — solve d = 3g, g + 18 = d, and proportions by meshing gears.",
    primitives: ["gear", "multiple_choice", "simulation"],
    sceneCategories: ["simulation", "selection"],
    durationMin: 12,
    icon: Cog,
    accent: "from-indigo-400/20 to-violet-500/10",
    badge: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  },
  {
    id: "lesson-quadratic-equations-drag",
    title: "Quadratic equations by drag & drop",
    subject: "Math",
    topic: "Quadratic equations",
    level: "Beginner",
    description:
      "Factor, complete the square, and use the discriminant — reorder steps, match roots, plot vertices, and drag coefficients.",
    primitives: ["drag", "drop_zone", "sequence_builder", "graph", "coordinate_plane", "multiple_choice"],
    sceneCategories: ["construction", "spatial", "selection"],
    durationMin: 18,
    icon: GitBranch,
    accent: "from-rose-400/20 to-pink-500/10",
    badge: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  },
  {
    id: "lesson-balance-scale-equality",
    title: "Balance scale & equality",
    subject: "Math",
    topic: "Equality & operations",
    level: "Beginner",
    description: "Level the scale with equal totals — 2 + 3 = 5 and the balance property of equality.",
    primitives: ["balance_scale", "multiple_choice"],
    sceneCategories: ["construction", "selection"],
    durationMin: 10,
    icon: Scale,
    accent: "from-amber-400/20 to-orange-500/10",
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  {
    id: "lesson-balance-one-step-equations",
    title: "One-step equations on a balance",
    subject: "Math",
    topic: "Linear equations",
    level: "Beginner",
    description: "Solve x + 3 = 7 and 2x = 8 by placing weights on a balance — algebra you can see.",
    primitives: ["balance_scale", "multiple_choice", "math_input"],
    sceneCategories: ["construction", "selection"],
    durationMin: 12,
    icon: Scale,
    accent: "from-orange-400/20 to-amber-500/10",
    badge: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  },
  {
    id: "lesson-balance-fraction-equivalence",
    title: "Equivalent fractions on a balance",
    subject: "Math",
    topic: "Fractions",
    level: "Beginner",
    description: "Prove 1/2 = 2/4 and 3/6 = 1/2 with unit weights on a level scale.",
    primitives: ["balance_scale", "multiple_choice"],
    sceneCategories: ["construction", "selection"],
    durationMin: 10,
    icon: Scale,
    accent: "from-yellow-400/20 to-amber-500/10",
    badge: "bg-yellow-600/15 text-yellow-800 dark:text-yellow-300",
  },
  {
    id: "lesson-fractions-parts-of-whole",
    title: "Fractions as parts of a whole",
    subject: "Math",
    topic: "Fractions",
    level: "Beginner",
    description: "Shade bar models, compare parts, and build fraction intuition visually.",
    primitives: ["tiles", "number_line", "multiple_choice"],
    sceneCategories: ["construction", "selection"],
    durationMin: 8,
    icon: Scale,
    accent: "from-sky-400/20 to-blue-500/10",
    badge: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  },
  ...buildFractionsCatalogItems(MATH_FRACTIONS_CURRICULUM_SEEDS),
  ...buildAlgebraCatalogItems(MATH_ALGEBRA_CURRICULUM_SEEDS),
  {
    id: "lesson-decimals-on-the-line",
    title: "Decimals on the number line",
    subject: "Math",
    topic: "Decimals",
    level: "Beginner",
    description: "Place tenths and hundredths on scales and compare decimal magnitudes.",
    primitives: ["number_line", "tiles", "math_input", "multiple_choice"],
    sceneCategories: ["spatial", "selection"],
    durationMin: 8,
    icon: LineChart,
    accent: "from-blue-400/20 to-indigo-500/10",
    badge: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  },
  {
    id: "lesson-slope-from-points",
    title: "Slope from two points",
    subject: "Math",
    topic: "Linear functions",
    level: "Beginner",
    description: "Plot rise and run, read slope from graphs, and connect to rate of change.",
    primitives: ["graph", "coordinate_plane", "number_line", "tiles"],
    sceneCategories: ["spatial", "construction"],
    durationMin: 10,
    icon: LineChart,
    accent: "from-indigo-400/20 to-violet-500/10",
    badge: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  },
  {
    id: "lesson-linear-equations-graph",
    title: "Linear equations from graphs",
    subject: "Math",
    topic: "Linear equations",
    level: "Beginner",
    description: "Place intercepts and slope points, then write y = mx + b from what you see.",
    primitives: ["graph", "coordinate_plane", "sequence_builder", "math_input", "tiles"],
    sceneCategories: ["spatial", "construction"],
    durationMin: 10,
    icon: LineChart,
    accent: "from-blue-400/20 to-indigo-500/10",
    badge: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  },
  {
    id: "lesson-pythagorean-theorem",
    title: "Pythagorean theorem visual",
    subject: "Math",
    topic: "Right triangles",
    level: "Beginner",
    description: "Plot 3-4-5 triangles, build a² + b² = c² step-by-step, and model square areas.",
    primitives: ["coordinate_plane", "geometry_canvas", "tiles", "sequence_builder", "math_input"],
    sceneCategories: ["spatial", "construction"],
    durationMin: 10,
    icon: Triangle,
    accent: "from-indigo-400/20 to-violet-500/10",
    badge: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  },
  {
    id: "lesson-forces-free-body",
    title: "Forces & free-body basics",
    subject: "Physics",
    topic: "Forces",
    level: "Beginner",
    description: "Balance forces, read F = ma graphs, and predict friction direction.",
    primitives: ["multiple_choice", "sequence_builder", "graph", "tiles", "number_line", "simulation"],
    sceneCategories: ["selection", "construction", "spatial"],
    durationMin: 10,
    icon: Zap,
    accent: "from-amber-400/20 to-orange-500/10",
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  {
    id: "lesson-measurement-order-and-sense",
    title: "Measurement & unit sense",
    subject: "Physics",
    topic: "Measurement",
    level: "Beginner",
    description: "Order SI prefixes, compare magnitudes, and build measurement intuition.",
    primitives: ["sequence_builder", "multiple_choice", "number_line", "matching"],
    sceneCategories: ["construction", "selection"],
    durationMin: 8,
    icon: Scale,
    accent: "from-yellow-400/20 to-amber-500/10",
    badge: "bg-yellow-600/15 text-yellow-800 dark:text-yellow-300",
  },
  {
    id: "lesson-circuits-series-parallel",
    title: "Series vs parallel circuits",
    subject: "Physics",
    topic: "Electric circuits",
    level: "Beginner",
    description: "Compare one-path series loops to parallel branches and model current flow.",
    primitives: ["multiple_choice", "matching", "drop_zone", "tiles", "simulation"],
    sceneCategories: ["selection", "construction"],
    durationMin: 10,
    icon: Atom,
    accent: "from-cyan-400/20 to-sky-500/10",
    badge: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300",
  },
  {
    id: "lesson-work-energy-basics",
    title: "Work & energy basics",
    subject: "Physics",
    topic: "Work & energy",
    level: "Beginner",
    description: "Connect force and displacement to work, plot kinetic energy, and model conservation.",
    primitives: ["graph", "number_line", "tiles", "simulation", "slider"],
    sceneCategories: ["spatial", "simulation"],
    durationMin: 10,
    icon: Zap,
    accent: "from-yellow-400/20 to-amber-500/10",
    badge: "bg-yellow-600/15 text-yellow-800 dark:text-yellow-300",
  },
  {
    id: "lesson-dna-base-pairing",
    title: "DNA base pairing",
    subject: "Biology",
    topic: "DNA structure",
    level: "Beginner",
    description: "Build complementary strands and apply Chargaff's rules with hands-on visual steps.",
    primitives: ["tiles", "sequence_builder", "matching", "drag"],
    sceneCategories: ["construction"],
    durationMin: 10,
    icon: Dna,
    accent: "from-emerald-400/20 to-green-500/10",
    badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "lesson-mitosis-sequence",
    title: "Mitosis: order the story",
    subject: "Biology",
    topic: "Cell division",
    level: "Beginner",
    description: "Name phases, drag mitosis steps into order, and connect chromosome behavior.",
    primitives: ["sequence_builder", "tiles", "number_line", "multiple_choice", "drag"],
    sceneCategories: ["construction", "selection"],
    durationMin: 10,
    icon: Microscope,
    accent: "from-green-400/20 to-emerald-500/10",
    badge: "bg-green-600/15 text-green-800 dark:text-green-300",
  },
  {
    id: "lesson-photosynthesis-story",
    title: "Photosynthesis story",
    subject: "Biology",
    topic: "Photosynthesis",
    level: "Beginner",
    description: "Trace light reactions and Calvin cycle inputs with interactive concept maps.",
    primitives: ["drop_zone", "sequence_builder", "tiles", "graph", "multiple_choice", "matching"],
    sceneCategories: ["construction", "selection"],
    durationMin: 10,
    icon: Leaf,
    accent: "from-lime-400/20 to-green-500/10",
    badge: "bg-lime-600/15 text-lime-800 dark:text-lime-300",
  },
  {
    id: "lesson-punnett-square-basics",
    title: "Punnett square basics",
    subject: "Biology",
    topic: "Genetics",
    level: "Beginner",
    description: "Fill Punnett grids, predict 3:1 ratios, and calculate offspring probabilities.",
    primitives: ["tiles", "matching", "drag", "multiple_choice", "simulation"],
    sceneCategories: ["construction", "selection"],
    durationMin: 10,
    icon: GitBranch,
    accent: "from-violet-400/20 to-purple-500/10",
    badge: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  },
  {
    id: "lesson-natural-selection",
    title: "Natural selection basics",
    subject: "Biology",
    topic: "Evolution",
    level: "Beginner",
    description: "Model variation, struggle, and differential survival across generations.",
    primitives: ["sequence_builder", "tiles", "number_line", "matching", "simulation"],
    sceneCategories: ["construction"],
    durationMin: 10,
    icon: Leaf,
    accent: "from-green-400/20 to-lime-500/10",
    badge: "bg-green-600/15 text-green-800 dark:text-green-300",
  },
  {
    id: "lesson-electron-filling-order",
    title: "Electron filling order",
    subject: "Chemistry",
    topic: "Atomic structure",
    level: "Beginner",
    description: "Order subshells, place electrons in orbitals, and read the periodic table.",
    primitives: ["sequence_builder", "tiles", "drop_zone", "multiple_choice", "matching"],
    sceneCategories: ["construction", "selection"],
    durationMin: 10,
    icon: Atom,
    accent: "from-purple-400/20 to-violet-500/10",
    badge: "bg-purple-500/15 text-purple-700 dark:text-purple-300",
  },
  {
    id: "lesson-periodic-trends-visual",
    title: "Periodic trends on the table",
    subject: "Chemistry",
    topic: "Periodic trends",
    level: "Beginner",
    description: "Track atomic radius, ionization energy, and electronegativity across periods and groups.",
    primitives: ["simulation", "slider", "number_line", "tiles", "matching", "multiple_choice"],
    sceneCategories: ["simulation", "selection"],
    durationMin: 10,
    icon: FlaskConical,
    accent: "from-teal-400/20 to-emerald-500/10",
    badge: "bg-teal-500/15 text-teal-700 dark:text-teal-300",
  },
  {
    id: "lesson-chemical-bonding-basics",
    title: "Ionic vs covalent bonding",
    subject: "Chemistry",
    topic: "Chemical bonding",
    level: "Beginner",
    description: "Compare electron transfer and sharing, and classify bonds by electronegativity.",
    primitives: ["multiple_choice", "slider", "tiles", "number_line", "simulation"],
    sceneCategories: ["selection", "simulation"],
    durationMin: 10,
    icon: Beaker,
    accent: "from-lime-400/20 to-green-500/10",
    badge: "bg-lime-600/15 text-lime-800 dark:text-lime-300",
  },
  {
    id: "lesson-balancing-equations-visual",
    title: "Balancing equations visually",
    subject: "Chemistry",
    topic: "Stoichiometry",
    level: "Intermediate",
    description: "Count atoms on each side and balance coefficients with grid models.",
    primitives: ["tiles", "number_line", "drag", "multiple_choice", "math_input", "balance_scale"],
    sceneCategories: ["construction", "selection"],
    durationMin: 12,
    icon: Beaker,
    accent: "from-orange-400/20 to-amber-500/10",
    badge: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  },
  {
    id: "lesson-limiting-reagent-reasoning",
    title: "Limiting reagent reasoning",
    subject: "Chemistry",
    topic: "Stoichiometry",
    level: "Intermediate",
    description: "Compare mole ratios visually to find which reactant runs out first.",
    primitives: ["tiles", "drag", "graph", "simulation", "balance_scale"],
    sceneCategories: ["construction", "spatial"],
    durationMin: 12,
    icon: FlaskConical,
    accent: "from-cyan-400/20 to-teal-500/10",
    badge: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300",
  },
  {
    id: "lesson-calorimetry-and-delta-h",
    title: "Calorimetry & ΔH",
    subject: "Chemistry",
    topic: "Thermochemistry",
    level: "Intermediate",
    description: "Read energy diagrams, compare exothermic vs endothermic, and estimate heat flow.",
    primitives: ["graph", "number_line", "tiles", "simulation", "slider"],
    sceneCategories: ["spatial", "simulation"],
    durationMin: 12,
    icon: Zap,
    accent: "from-rose-400/20 to-orange-500/10",
    badge: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  },
  {
    id: "lesson-acid-dilution-and-lab-flow",
    title: "Acid dilution & lab flow",
    subject: "Chemistry",
    topic: "Lab skills",
    level: "Beginner",
    description: "Order safe lab steps and model dilution ratios before touching real glassware.",
    primitives: ["sequence_builder", "number_line", "tiles", "multiple_choice", "simulation", "drop_zone"],
    sceneCategories: ["construction", "simulation"],
    durationMin: 10,
    icon: Beaker,
    accent: "from-amber-400/20 to-yellow-500/10",
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
];

export type SubjectFilter = "All" | InteractiveSubject;

export type FractionLevelFilter = "All" | 1 | 2 | 3 | 4 | 5;

export function interactivesForFractionLevel(level: FractionLevelFilter) {
  const fractionItems = INTERACTIVE_CATALOG.filter((i) => i.topic.startsWith("Fractions (Level"));
  if (level === "All") return fractionItems;
  return fractionItems.filter((i) => i.topic === `Fractions (Level ${level})`);
}

export type AlgebraLevelFilter = "All" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export function interactivesForAlgebraLevel(level: AlgebraLevelFilter) {
  const algebraItems = INTERACTIVE_CATALOG.filter((i) => i.topic.startsWith("Algebra (Level"));
  if (level === "All") return algebraItems;
  return algebraItems.filter((i) => i.topic === `Algebra (Level ${level})`);
}

export function lessonHref(lessonId: string) {
  return `/lesson/${lessonId}`;
}

export function interactivesForSubject(subject: SubjectFilter) {
  if (subject === "All") return INTERACTIVE_CATALOG;
  return INTERACTIVE_CATALOG.filter((item) => item.subject === subject);
}

export function interactivesBySubject() {
  const groups = new Map<InteractiveSubject, InteractiveCatalogItem[]>();
  for (const item of INTERACTIVE_CATALOG) {
    const list = groups.get(item.subject) ?? [];
    list.push(item);
    groups.set(item.subject, list);
  }
  return groups;
}

export function countBySubject(subject: InteractiveSubject) {
  return INTERACTIVE_CATALOG.filter((i) => i.subject === subject).length;
}
