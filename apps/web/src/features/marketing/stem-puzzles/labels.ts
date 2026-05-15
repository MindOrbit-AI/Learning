import type { Grade, InteractionTypeKey, Mode, PuzzleMeta, SubjectFilter } from "./types";

export function gradeLabel(grade: Grade) {
  return grade === "K-8" ? "K–8" : `Gr ${grade}`;
}

export function interactionLabel(mode: Mode) {
  const labels: Record<Mode, string> = {
    choice: "Tap",
    drag: "Drag",
    slider: "Slide",
    match: "Match",
    path: "Path",
    rotate: "Rotate",
    reorder: "Rearrange",
    swipe: "Swipe",
    numpad: "Numpad",
    sort: "Sort",
    coloring: "Color",
  };
  return labels[mode];
}

export function metaInteractionDisplay(meta: PuzzleMeta): InteractionTypeKey {
  if (meta.displayInteraction) return meta.displayInteraction;
  const map: Record<Mode, InteractionTypeKey> = {
    choice: "Multiple choice",
    drag: "Drag and drop",
    slider: "Slider",
    match: "Matching cards",
    path: "Drawing",
    rotate: "Rotate",
    reorder: "Order steps",
    swipe: "Unlock",
    numpad: "Fill in number",
    sort: "Sort categories",
    coloring: "Coloring puzzle",
  };
  return map[meta.interactionHint];
}
export function subjectEmoji(subject: SubjectFilter) {
  const icons: Record<SubjectFilter, string> = {
    All: "✨",
    MathFoundations: "🏗️",
    Arithmetic: "🔢",
    Algebra: "⚖️",
    Geometry: "📐",
    Trigonometry: "🌊",
    Precalculus: "🌀",
    Calculus: "🔭",
    Statistics: "📊",
    Logic: "🧠",
    Probability: "🎲",
    NumberTheory: "🧮",
    FinancialMath: "💰",
    Biology: "🧬",
    Chemistry: "🧪",
    Physics: "🪐",
    EarthScience: "🌍",
    GeneralScience: "🔬",
    Astronomy: "🌌",
    Genetics: "🧬",
    Ecology: "🌿",
    Anatomy: "🫀",
    EnvironmentalScience: "🌱",
    CodingLogic: "🧑‍💻",
    Algorithms: "🧠",
    AIML: "🤖",
    Cybersecurity: "🛡️",
    Databases: "💾",
    RoboticsProgramming: "🦿",
    WebDev: "🌐",
    APIs: "🔗",
    Networks: "📡",
    DigitalSystems: "⚡",
    MechanicalEng: "⚙️",
    ElectricalEng: "💡",
    CivilEng: "🌉",
    AerospaceEng: "🚀",
    Robotics: "🦾",
    StructuralDesign: "🏗️",
    MaterialsScience: "🪵",
    Circuits: "🔌",
    SystemsEng: "🧭",
    DesignThinking: "🎨",
  };
  return icons[subject];
}

export const SUBJECT_DISPLAY_OVERRIDES: Partial<Record<SubjectFilter, string>> = {
  MathFoundations: "Math Foundations",
  EarthScience: "Earth Science",
  GeneralScience: "General Science",
  NumberTheory: "Number Theory",
  FinancialMath: "Financial Math",
  EnvironmentalScience: "Environmental Sci",
  CodingLogic: "Coding Logic",
  AIML: "AI & ML",
  RoboticsProgramming: "Robotics Prog",
  WebDev: "Web Dev",
  DigitalSystems: "Digital Systems",
  MechanicalEng: "Mechanical",
  ElectricalEng: "Electrical",
  CivilEng: "Civil",
  AerospaceEng: "Aerospace",
  StructuralDesign: "Structural",
  MaterialsScience: "Materials",
  SystemsEng: "Systems Eng",
  DesignThinking: "Design Thinking",
};

export function subjectLabel(subject: SubjectFilter) {
  return SUBJECT_DISPLAY_OVERRIDES[subject] ?? subject;
}
