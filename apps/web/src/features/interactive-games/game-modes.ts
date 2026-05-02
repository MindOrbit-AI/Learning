import type { LucideIcon } from "lucide-react";
import {
  Brain,
  Boxes,
  GitBranch,
  HelpCircle,
  LayoutGrid,
  Microscope,
  Puzzle,
  Rabbit,
  Swords,
  Target,
} from "lucide-react";

export const GAME_MODES = [
  "CONCEPT_BATTLE",
  "SPEED_RUN",
  "BUILD_SYSTEM",
  "FIND_MISTAKE",
  "PUZZLE_PATH",
  "SIMULATION_LAB",
  "DECISION_SIMULATOR",
  "LAB_ESCAPE_ROOM",
  "VISUAL_BUILDER",
  "ADAPTIVE_QUIZ",
] as const;

export type GameModeId = (typeof GAME_MODES)[number];

export type GameModeMeta = {
  id: GameModeId;
  label: string;
  cognitive: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  implemented: boolean;
};

export const GAME_MODE_CATALOG: GameModeMeta[] = [
  {
    id: "CONCEPT_BATTLE",
    label: "Concept Battle Arena",
    cognitive: "Recall · Fluency",
    description: "Timed duel with health, combos, and power-ups.",
    icon: Swords,
    accent: "from-rose-500/30 to-orange-500/20 border-rose-500/40",
    implemented: true,
  },
  {
    id: "SPEED_RUN",
    label: "Speed Run Mastery",
    cognitive: "Fluency · Pattern speed",
    description: "60-second burst mode with streak multipliers.",
    icon: Rabbit,
    accent: "from-cyan-500/30 to-blue-500/20 border-cyan-500/40",
    implemented: true,
  },
  {
    id: "ADAPTIVE_QUIZ",
    label: "Adaptive Quiz Engine",
    cognitive: "Concept mastery · Judgment",
    description: "Difficulty follows you — wrong answers unlock support.",
    icon: Brain,
    accent: "from-violet-500/30 to-fuchsia-500/20 border-violet-500/40",
    implemented: true,
  },
  {
    id: "BUILD_SYSTEM",
    label: "Build the System",
    cognitive: "Systems thinking",
    description: "Drag nodes and wire relationships — validate structure.",
    icon: Boxes,
    accent: "from-emerald-500/25 to-teal-500/15 border-emerald-500/35",
    implemented: true,
  },
  {
    id: "FIND_MISTAKE",
    label: "Find the Mistake",
    cognitive: "Error detection",
    description: "Spot the flaw, learn the fix, compare models.",
    icon: HelpCircle,
    accent: "from-amber-500/25 to-yellow-500/15 border-amber-500/35",
    implemented: true,
  },
  {
    id: "PUZZLE_PATH",
    label: "Puzzle Path",
    cognitive: "Sequential reasoning",
    description: "Skill-tree path — unlock nodes with proof.",
    icon: GitBranch,
    accent: "from-sky-500/25 to-indigo-500/15 border-sky-500/35",
    implemented: true,
  },
  {
    id: "SIMULATION_LAB",
    label: "Simulation Lab",
    cognitive: "Experimentation",
    description: "Tune variables and read cause → effect.",
    icon: Microscope,
    accent: "from-lime-500/20 to-emerald-500/15 border-lime-500/30",
    implemented: true,
  },
  {
    id: "DECISION_SIMULATOR",
    label: "Decision Simulator",
    cognitive: "Judgment · Ethics",
    description: "Branching scenarios with weighted consequences.",
    icon: Target,
    accent: "from-blue-500/25 to-purple-500/15 border-blue-500/35",
    implemented: true,
  },
  {
    id: "LAB_ESCAPE_ROOM",
    label: "Lab Escape Room",
    cognitive: "Recall under pressure",
    description: "Rooms, timers, clues embedded in questions.",
    icon: LayoutGrid,
    accent: "from-fuchsia-500/25 to-pink-500/15 border-fuchsia-500/35",
    implemented: true,
  },
  {
    id: "VISUAL_BUILDER",
    label: "Visual Builder Challenge",
    cognitive: "Visual reasoning",
    description: "Place diagram pieces — score accuracy and speed.",
    icon: Puzzle,
    accent: "from-indigo-500/25 to-cyan-500/15 border-indigo-500/35",
    implemented: true,
  },
];
