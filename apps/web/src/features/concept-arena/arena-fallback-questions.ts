export type ArenaCategory = "math" | "science" | "business" | "coding" | "mixed";

export type FallbackQuestion = {
  prompt: string;
  options: [string, string, string, string];
  correctAnswer: string;
  explanation?: string;
};

const MATH: FallbackQuestion[] = [
  {
    prompt: "What is the derivative of x² with respect to x?",
    options: ["x", "2x", "x²", "2x²"],
    correctAnswer: "2x",
    explanation: "Power rule: d/dx(x^n) = n·x^(n−1).",
  },
  {
    prompt: "Solve: 3x + 7 = 22",
    options: ["3", "5", "7", "9"],
    correctAnswer: "5",
  },
  {
    prompt: "What is √(64)?",
    options: ["6", "7", "8", "9"],
    correctAnswer: "8",
  },
  {
    prompt: "A line with slope 2 passes through (0,3). What is its y-intercept?",
    options: ["0", "1", "2", "3"],
    correctAnswer: "3",
  },
];

const SCIENCE: FallbackQuestion[] = [
  {
    prompt: "What is the chemical symbol for water?",
    options: ["O₂", "H₂O", "CO₂", "NaCl"],
    correctAnswer: "H₂O",
  },
  {
    prompt: "Which organelle is the powerhouse of the cell?",
    options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi"],
    correctAnswer: "Mitochondria",
  },
  {
    prompt: "Speed of light in vacuum is approximately?",
    options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "340 m/s"],
    correctAnswer: "3×10⁸ m/s",
  },
  {
    prompt: "DNA uses which bases?",
    options: ["A,T,G,C", "A,U,G,C", "A,T,P,Q", "X,Y,Z,W"],
    correctAnswer: "A,T,G,C",
  },
];

const BUSINESS: FallbackQuestion[] = [
  {
    prompt: "What does ROI stand for?",
    options: [
      "Return on Investment",
      "Rate of Interest",
      "Revenue on Inventory",
      "Risk of Inaction",
    ],
    correctAnswer: "Return on Investment",
  },
  {
    prompt: "Break-even point is when…",
    options: [
      "Revenue equals total costs",
      "Profit is maximized",
      "Debt is zero",
      "Market share is 50%",
    ],
    correctAnswer: "Revenue equals total costs",
  },
  {
    prompt: "A SWOT analysis examines…",
    options: [
      "Strengths, Weaknesses, Opportunities, Threats",
      "Sales, Workflow, Output, Timing",
      "Supply, Warehousing, Orders, Transport",
      "Strategy, Wins, Objectives, Tactics",
    ],
    correctAnswer: "Strengths, Weaknesses, Opportunities, Threats",
  },
  {
    prompt: "Cash flow statement tracks…",
    options: [
      "Inflows and outflows of cash",
      "Only net income",
      "Only assets",
      "Only liabilities",
    ],
    correctAnswer: "Inflows and outflows of cash",
  },
];

const CODING: FallbackQuestion[] = [
  {
    prompt: "Time complexity of binary search on a sorted array?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: "O(log n)",
  },
  {
    prompt: "Which structure is FIFO?",
    options: ["Stack", "Queue", "Heap", "Trie"],
    correctAnswer: "Queue",
  },
  {
    prompt: "HTTP 404 means…",
    options: ["Server error", "Not found", "Unauthorized", "Created"],
    correctAnswer: "Not found",
  },
  {
    prompt: "In SQL, which clause filters rows?",
    options: ["SELECT", "WHERE", "ORDER BY", "JOIN"],
    correctAnswer: "WHERE",
  },
];

const BY_CATEGORY: Record<ArenaCategory, FallbackQuestion[]> = {
  math: MATH,
  science: SCIENCE,
  business: BUSINESS,
  coding: CODING,
  mixed: [...MATH, ...SCIENCE, ...BUSINESS.slice(0, 2), ...CODING.slice(0, 2)],
};

export function getFallbackPool(category: ArenaCategory): FallbackQuestion[] {
  return BY_CATEGORY[category] ?? BY_CATEGORY.mixed;
}

export function categoryToSubjectSlugs(category: ArenaCategory): string[] {
  switch (category) {
    case "math":
      return ["sat-math", "algebra", "geometry"];
    case "science":
      return ["biology", "physics", "chemistry"];
    case "coding":
      return ["computer-science"];
    case "business":
      return [];
    case "mixed":
    default:
      return ["sat-math", "algebra", "computer-science", "biology", "physics"];
  }
}
