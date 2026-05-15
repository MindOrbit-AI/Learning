import type {
  DifficultyFilter,
  DomainFilter,
  Grade,
  GradeFilter,
  InteractionFilter,
  LockFilter,
  SubjectFilter,
} from "./types";

export const STORAGE_KEY = "mindorbit.stem-puzzles.arcade.v3";
export const COLOR_MODE_STORAGE_KEY = "mindorbit.stem-puzzles.color-mode";
export const XP_PER_WIN = 14;
export const LEVEL_XP = 100;
export const MAX_ENERGY = 5;
export const ENERGY_REGEN_MS = 5 * 60 * 1000;
export const GRADE_BASE_XP: Record<Grade, number> = {
  "K-8": 0,
  "9": 0,
  "10": 500,
  "11": 1200,
  "12": 2500,
};

export const GRADE_SORT_RANK: Record<Grade, number> = {
  "K-8": 0,
  "9": 1,
  "10": 2,
  "11": 3,
  "12": 4,
};

export const BOSS_CATEGORY_THRESHOLD = 5;
export const MASTERY_CATEGORY_THRESHOLD = 8;
export const INTERACTION_OPTIONS: readonly InteractionFilter[] = [
  "All",
  "Multiple choice",
  "Drag and drop",
  "Slider",
  "Graph plot",
  "Matching cards",
  "Order steps",
  "Fill in number",
  "Drawing",
  "Rotate",
  "Build with tiles",
  "Region select",
  "Move on grid",
  "Balance",
  "Unlock",
  "Sort categories",
  "Connect pathways",
  "Sequence processes",
  "Build systems",
  "Code Trace",
  "Circuit Builder",
  "Design Challenge",
  "Simulation",
  "Coloring puzzle",
];

export const GRADE_OPTIONS: readonly GradeFilter[] = ["All", "9", "10", "11", "12", "K-8"];
export const MATH_SUBJECTS: readonly SubjectFilter[] = [
  "All",
  "MathFoundations",
  "Algebra",
  "Geometry",
  "Trigonometry",
  "Precalculus",
  "Calculus",
  "Statistics",
  "Probability",
  "NumberTheory",
  "FinancialMath",
  "Arithmetic",
  "Logic",
];
export const SCIENCE_SUBJECT_OPTIONS: readonly SubjectFilter[] = [
  "All",
  "Biology",
  "Chemistry",
  "Physics",
  "EarthScience",
  "Astronomy",
  "Genetics",
  "Ecology",
  "Anatomy",
  "EnvironmentalScience",
  "GeneralScience",
];
export const TECH_SUBJECT_OPTIONS: readonly SubjectFilter[] = [
  "All",
  "CodingLogic",
  "Algorithms",
  "AIML",
  "Cybersecurity",
  "Databases",
  "RoboticsProgramming",
  "WebDev",
  "APIs",
  "Networks",
  "DigitalSystems",
];
export const ENGINEERING_SUBJECT_OPTIONS: readonly SubjectFilter[] = [
  "All",
  "MechanicalEng",
  "ElectricalEng",
  "CivilEng",
  "AerospaceEng",
  "Robotics",
  "StructuralDesign",
  "MaterialsScience",
  "Circuits",
  "SystemsEng",
  "DesignThinking",
];
export const DIFFICULTY_OPTIONS: readonly DifficultyFilter[] = ["All", "easy", "medium", "hard"];
export const DOMAIN_OPTIONS: readonly DomainFilter[] = ["All", "Math", "Science", "Technology", "Engineering"];
export const LOCK_OPTIONS: readonly LockFilter[] = ["All", "Unlocked", "Locked"];
/** Grid catalog: puzzles per page (3 columns × 4 rows at xl). */
export const CATALOG_PAGE_SIZE = 12;
