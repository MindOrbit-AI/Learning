"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState, type DragEvent, type ReactNode, type TouchEvent } from "react";

type Difficulty = "easy" | "medium" | "hard";
type DifficultyFilter = Difficulty | "All";
type Result = "idle" | "correct" | "wrong";
type Mode = "choice" | "drag" | "slider" | "match" | "path" | "rotate" | "reorder" | "swipe";
type Grade = "K-8" | "9" | "10" | "11" | "12";
type GradeFilter = Grade | "All";
type Subject =
  | "Arithmetic"
  | "Algebra"
  | "Geometry"
  | "Trigonometry"
  | "Precalculus"
  | "Calculus"
  | "Statistics"
  | "Logic";
type SubjectFilter = Subject | "All";

type PuzzleId =
  | "weightScale"
  | "fractionPizza"
  | "numberMachine"
  | "patternBlocks"
  | "areaBuilder"
  | "gridPath"
  | "waterFill"
  | "treasureEquations"
  | "monsterMerge"
  | "clock"
  | "balanceBeam"
  | "diceProbability"
  | "coordinateTreasure"
  | "shapeFolding"
  | "lightBeam"
  | "bridgeWeight"
  | "resourceManagement"
  | "numberPyramid"
  | "snakePath"
  | "equationMatch"
  | "multiplicationArray"
  | "sudokuMini"
  | "magicSquare"
  | "memoryMatch"
  | "tangram"
  | "primeCatcher"
  | "fractionBars"
  | "decimalSlider"
  | "ratioRecipe"
  | "escapeRoom"
  | "linearBalance"
  | "slopeRunner"
  | "graphLine"
  | "functionRule"
  | "inequalityGate"
  | "systemsScale"
  | "exponentMatch"
  | "scientificNotation"
  | "pythagoreanPath"
  | "angleChase"
  | "triangleCongruence"
  | "coordinateGeometry"
  | "scatterPlot"
  | "probabilitySpinner"
  | "boxPlot"
  | "similarTriangles"
  | "triangleProof"
  | "circleTheorem"
  | "transformationsGrid"
  | "areaVolume"
  | "rightTriangleSolver"
  | "quadraticLauncher"
  | "parabolaMatch"
  | "factoringTiles"
  | "polynomialPuzzle"
  | "radicalSimplify"
  | "rationalMatch"
  | "complexPlane"
  | "conditionalTree"
  | "geometricConstruction"
  | "quadraticSystems"
  | "polynomialRoots"
  | "syntheticDivision"
  | "asymptoteHunt"
  | "exponentialGrowth"
  | "logarithmUnlock"
  | "sequenceBuilder"
  | "patternMachine"
  | "unitCircle"
  | "sineWave"
  | "lawOfSines"
  | "matrixTransform"
  | "vectorNav"
  | "conicMatch"
  | "regressionModel"
  | "limitExplorer"
  | "derivativeSlope"
  | "tangentLine"
  | "optimization"
  | "relatedRates"
  | "integralArea"
  | "riemannSum"
  | "accumulation"
  | "differentialFlow"
  | "parametric"
  | "polarMatch"
  | "probDistribution"
  | "zScore"
  | "confidenceInterval"
  | "hypothesisTest";

type VisualKind =
  | "scale"
  | "pizza"
  | "machine"
  | "pattern"
  | "area"
  | "grid"
  | "water"
  | "icon"
  | "clock"
  | "beam"
  | "coordinate"
  | "fold"
  | "laser"
  | "pyramid"
  | "array"
  | "smallGrid"
  | "bars";

interface PuzzleMeta {
  id: PuzzleId;
  title: string;
  short: string;
  emoji: string;
  gradient: string;
  grade: Grade;
  subject: Subject;
  skill: string;
  estMin: number;
  interactionHint: Mode;
}

interface Visual {
  kind: VisualKind;
  icon?: string;
  title?: string;
  subtitle?: string;
  numbers?: number[];
  target?: number | string;
  slices?: number;
  filled?: number;
  examples?: { input: number; output: number }[];
  query?: number;
  sequence?: number[];
  width?: number;
  height?: number;
  cols?: number;
  rows?: number;
  tiles?: string[];
  jugs?: { label: string; fill: number; cap: number }[];
  hour?: number;
  minute?: number;
  left?: string | [number, number];
  right?: string | [number, number];
  tilt?: -1 | 0 | 1;
  targetX?: number;
  targetY?: number;
  grid?: (number | null)[][];
}

interface Puzzle {
  id: string;
  type: PuzzleId;
  title: string;
  emoji: string;
  difficulty: Difficulty;
  mode: Mode;
  prompt: string;
  hint: string;
  explanation: string;
  visual: Visual;
  choices?: string[];
  answer?: string;
  slider?: { min: number; max: number; step: number; initial: number; target: number };
  dragItems?: string[];
  dropLabel?: string;
  pairs?: { left: string; right: string }[];
  pathTiles?: string[];
  correctPath?: number[];
  targetRotation?: number;
  rotationStep?: number;
  tiles?: string[];
  correctOrder?: string[];
  swipeTarget?: "left" | "right" | "up" | "down";
  swipeLabels?: string[];
}

interface PlayState {
  choice: string | null;
  slider: number;
  dropped: string | null;
  matches: Record<string, string>;
  pendingLeft: string | null;
  path: number[];
  rotation: number;
  order: string[];
  swipe: string | null;
  touchStart: { x: number; y: number } | null;
}

const STORAGE_KEY = "mindorbit.math-puzzles.arcade.v2";
const XP_PER_WIN = 14;
const LEVEL_XP = 100;

function m(
  id: PuzzleId,
  title: string,
  short: string,
  emoji: string,
  gradient: string,
  grade: Grade,
  subject: Subject,
  skill: string,
  estMin: number,
  interactionHint: Mode,
): PuzzleMeta {
  return { id, title, short, emoji, gradient, grade, subject, skill, estMin, interactionHint };
}

const METAS: PuzzleMeta[] = [
  m("weightScale", "Weight Scale", "Solve hidden weights", "⚖️", "from-amber-400 to-orange-500", "K-8", "Algebra", "Solve for unknown weights", 2, "choice"),
  m("fractionPizza", "Fraction Pizza", "Build and compare slices", "🍕", "from-rose-400 to-red-500", "K-8", "Arithmetic", "Recognize fraction parts", 2, "choice"),
  m("numberMachine", "Number Machine", "Find the hidden rule", "⚙️", "from-sky-400 to-blue-600", "K-8", "Algebra", "Spot function rules", 2, "choice"),
  m("patternBlocks", "Pattern Blocks", "Continue the sequence", "🧩", "from-violet-400 to-fuchsia-600", "K-8", "Logic", "Continue visual patterns", 2, "choice"),
  m("areaBuilder", "Area Builder", "Count tiles and edges", "🟩", "from-emerald-400 to-green-600", "K-8", "Geometry", "Compute rectangular area", 2, "choice"),
  m("gridPath", "Grid Path", "Walk through operations", "🎯", "from-cyan-400 to-teal-600", "K-8", "Arithmetic", "Chain operations", 2, "path"),
  m("waterFill", "Water Fill Puzzle", "Pour to the target", "💧", "from-blue-400 to-cyan-600", "K-8", "Arithmetic", "Reason about volume", 2, "drag"),
  m("treasureEquations", "Treasure Chest Equations", "Crack the lock", "💎", "from-yellow-300 to-amber-600", "K-8", "Algebra", "Solve one-step equations", 2, "choice"),
  m("monsterMerge", "Monster Merge Math", "Combine creature values", "👾", "from-lime-400 to-emerald-600", "K-8", "Arithmetic", "Combine quantities", 2, "choice"),
  m("clock", "Clock Puzzle", "Read the time", "🕒", "from-indigo-400 to-purple-600", "K-8", "Arithmetic", "Read analog clocks", 2, "choice"),
  m("balanceBeam", "Balance Beam Puzzle", "Level the beam", "🪵", "from-orange-300 to-stone-600", "K-8", "Algebra", "Compare weights", 2, "choice"),
  m("diceProbability", "Dice Probability", "Predict the chance", "🎲", "from-red-400 to-pink-600", "K-8", "Statistics", "Simple probability", 2, "choice"),
  m("coordinateTreasure", "Coordinate Treasure Hunt", "Find the point", "🗺️", "from-teal-400 to-cyan-700", "K-8", "Geometry", "Read coordinates", 2, "choice"),
  m("shapeFolding", "Shape Folding Puzzle", "Fold in your mind", "📦", "from-fuchsia-400 to-violet-700", "K-8", "Geometry", "Visualize rotation", 2, "rotate"),
  m("lightBeam", "Light Beam Reflection", "Aim the mirror", "🔦", "from-yellow-200 to-sky-500", "K-8", "Geometry", "Reason about reflection", 2, "rotate"),
  m("bridgeWeight", "Bridge Weight Puzzle", "Stay under limit", "🌉", "from-slate-300 to-slate-700", "K-8", "Arithmetic", "Sum within a limit", 2, "choice"),
  m("resourceManagement", "Resource Management", "Spend wisely", "🪙", "from-amber-300 to-lime-600", "K-8", "Arithmetic", "Budget resources", 2, "choice"),
  m("numberPyramid", "Missing Number Pyramid", "Build upward", "🔺", "from-red-300 to-orange-600", "K-8", "Arithmetic", "Sum upward chains", 2, "choice"),
  m("snakePath", "Arithmetic Snake Path", "Draw the value trail", "🐍", "from-green-400 to-teal-700", "K-8", "Arithmetic", "Sum number paths", 2, "path"),
  m("equationMatch", "Equation Match Puzzle", "Pair equations", "🔗", "from-blue-400 to-indigo-700", "K-8", "Algebra", "Pair equation values", 2, "match"),
  m("multiplicationArray", "Multiplication Array", "See multiplication", "🔢", "from-emerald-300 to-sky-600", "K-8", "Arithmetic", "Visualize multiplication", 2, "choice"),
  m("sudokuMini", "Sudoku Mini", "Tiny logic grid", "🧠", "from-purple-300 to-indigo-700", "K-8", "Logic", "Logical deduction", 2, "choice"),
  m("magicSquare", "Magic Square Puzzle", "Rows share totals", "✨", "from-yellow-300 to-purple-600", "K-8", "Logic", "Constraint reasoning", 2, "choice"),
  m("memoryMatch", "Math Memory Match", "Find equivalents", "🃏", "from-pink-300 to-rose-700", "K-8", "Arithmetic", "Recognize equivalents", 2, "match"),
  m("tangram", "Tangram Geometry Puzzle", "Arrange the pieces", "🔷", "from-cyan-300 to-blue-700", "K-8", "Geometry", "Compose shapes", 2, "reorder"),
  m("primeCatcher", "Prime Number Catcher", "Catch only primes", "⭐", "from-violet-300 to-pink-600", "K-8", "Arithmetic", "Identify primes", 2, "choice"),
  m("fractionBars", "Fraction Bar Comparison", "Compare lengths", "📊", "from-orange-300 to-red-600", "K-8", "Arithmetic", "Compare fractions", 2, "choice"),
  m("decimalSlider", "Decimal Slider Puzzle", "Tune the value", "🎚️", "from-sky-300 to-cyan-700", "K-8", "Arithmetic", "Place decimals", 2, "slider"),
  m("ratioRecipe", "Ratio Recipe Puzzle", "Mix the recipe", "🥣", "from-amber-300 to-rose-600", "K-8", "Arithmetic", "Apply ratios", 2, "drag"),
  m("escapeRoom", "Math Escape Room", "Unlock every door", "🚪", "from-zinc-300 to-violet-700", "K-8", "Algebra", "Chain operations", 3, "swipe"),
  m("linearBalance", "Linear Equation Balance", "Balance the equation", "⚖️", "from-blue-400 to-indigo-600", "9", "Algebra", "Solve ax + b = c", 3, "choice"),
  m("slopeRunner", "Slope Runner", "Race the slope", "🏃", "from-sky-400 to-blue-600", "9", "Algebra", "Slope from two points", 3, "choice"),
  m("graphLine", "Graph the Line", "Plot the equation", "📈", "from-emerald-400 to-teal-600", "9", "Algebra", "Identify line equations", 3, "choice"),
  m("functionRule", "Function Machine", "Infer the function", "⚙️", "from-violet-400 to-fuchsia-600", "9", "Algebra", "Evaluate linear functions", 3, "choice"),
  m("inequalityGate", "Inequality Gate", "Pick the open gate", "🚧", "from-amber-400 to-orange-600", "9", "Algebra", "Solve linear inequalities", 3, "choice"),
  m("systemsScale", "Systems of Equations Scale", "Two scales, one truth", "⚖️", "from-rose-400 to-pink-600", "9", "Algebra", "Solve linear systems", 4, "choice"),
  m("exponentMatch", "Exponent Match", "Pair the powers", "🔥", "from-red-400 to-orange-600", "9", "Algebra", "Apply exponent rules", 3, "match"),
  m("scientificNotation", "Scientific Notation Converter", "Move the decimal", "🔬", "from-cyan-400 to-blue-700", "9", "Algebra", "Convert scientific notation", 3, "choice"),
  m("pythagoreanPath", "Pythagorean Path", "Find the missing side", "📐", "from-emerald-400 to-green-700", "9", "Geometry", "Use a² + b² = c²", 3, "choice"),
  m("angleChase", "Angle Chase", "Trace the angles", "📐", "from-amber-300 to-amber-700", "9", "Geometry", "Sum interior angles", 3, "choice"),
  m("triangleCongruence", "Triangle Congruence Match", "Match the congruence rule", "🔺", "from-rose-300 to-red-700", "9", "Geometry", "Apply SSS, SAS, ASA", 3, "match"),
  m("coordinateGeometry", "Coordinate Geometry Hunt", "Plot the answer", "🧭", "from-teal-400 to-cyan-700", "9", "Geometry", "Distance and midpoint", 3, "choice"),
  m("scatterPlot", "Scatter Plot Prediction", "Spot the trend", "🌌", "from-indigo-400 to-violet-700", "9", "Statistics", "Read scatter plots", 3, "choice"),
  m("probabilitySpinner", "Probability Spinner", "Predict the spin", "🌀", "from-fuchsia-400 to-pink-700", "9", "Statistics", "Compute probability", 3, "choice"),
  m("boxPlot", "Box Plot Builder", "Place the quartiles", "📦", "from-amber-300 to-orange-700", "9", "Statistics", "Build box plots", 3, "drag"),
  m("similarTriangles", "Similar Triangles Puzzle", "Scale the triangle", "🔼", "from-emerald-400 to-green-700", "10", "Geometry", "Use similarity ratios", 4, "choice"),
  m("triangleProof", "Triangle Proof Builder", "Order the proof", "🪜", "from-lime-400 to-emerald-700", "10", "Geometry", "Build geometric proofs", 5, "reorder"),
  m("circleTheorem", "Circle Theorem Challenge", "Find the angle", "⭕", "from-cyan-300 to-sky-700", "10", "Geometry", "Apply circle theorems", 4, "choice"),
  m("transformationsGrid", "Transformations Grid", "Rotate or reflect", "🔁", "from-violet-400 to-fuchsia-700", "10", "Geometry", "Apply transformations", 4, "rotate"),
  m("areaVolume", "Area & Volume Builder", "Stack the volume", "🧊", "from-sky-300 to-indigo-700", "10", "Geometry", "Compute area and volume", 4, "drag"),
  m("rightTriangleSolver", "Trig Right Triangle Solver", "Find sin / cos / tan", "📐", "from-amber-400 to-pink-700", "10", "Trigonometry", "Solve right triangles", 4, "choice"),
  m("quadraticLauncher", "Quadratic Equation Launcher", "Launch the parabola", "🚀", "from-rose-400 to-red-700", "10", "Algebra", "Solve quadratics", 4, "choice"),
  m("parabolaMatch", "Parabola Graph Match", "Match shape to formula", "🪤", "from-orange-300 to-rose-700", "10", "Algebra", "Recognize parabolas", 4, "match"),
  m("factoringTiles", "Factoring Tiles", "Slide to factor", "🧱", "from-emerald-300 to-teal-700", "10", "Algebra", "Factor quadratics", 4, "drag"),
  m("polynomialPuzzle", "Polynomial Puzzle", "Assemble polynomials", "🧩", "from-violet-300 to-purple-700", "10", "Algebra", "Multiply polynomials", 4, "choice"),
  m("radicalSimplify", "Radical Simplifier", "Pull out the squares", "√", "from-amber-300 to-yellow-700", "10", "Algebra", "Simplify radicals", 4, "choice"),
  m("rationalMatch", "Rational Expression Match", "Match reduced forms", "➗", "from-sky-300 to-blue-700", "10", "Algebra", "Reduce rational expressions", 4, "match"),
  m("complexPlane", "Complex Number Plane", "Plot a + bi", "🌐", "from-fuchsia-400 to-purple-700", "10", "Algebra", "Plot complex numbers", 4, "choice"),
  m("conditionalTree", "Conditional Probability Tree", "Trace the tree", "🌳", "from-emerald-400 to-green-700", "10", "Statistics", "Conditional probability", 4, "choice"),
  m("geometricConstruction", "Geometric Construction Puzzle", "Construct the shape", "📏", "from-zinc-300 to-stone-700", "10", "Geometry", "Compass and straightedge", 4, "rotate"),
  m("quadraticSystems", "Quadratic Systems Puzzle", "Find the intersections", "📈", "from-rose-400 to-red-700", "11", "Algebra", "Solve quadratic systems", 5, "choice"),
  m("polynomialRoots", "Polynomial Roots Finder", "Spot the zeros", "🌱", "from-emerald-400 to-teal-700", "11", "Algebra", "Find polynomial roots", 5, "choice"),
  m("syntheticDivision", "Synthetic Division Machine", "Divide step by step", "🛠️", "from-zinc-300 to-zinc-700", "11", "Algebra", "Synthetic division", 5, "choice"),
  m("asymptoteHunt", "Rational Function Asymptote Hunt", "Track the asymptotes", "🪜", "from-cyan-300 to-blue-700", "11", "Precalculus", "Identify asymptotes", 5, "choice"),
  m("exponentialGrowth", "Exponential Growth Simulator", "Predict the curve", "📈", "from-amber-300 to-rose-700", "11", "Precalculus", "Exponential models", 5, "choice"),
  m("logarithmUnlock", "Logarithm Unlock Puzzle", "Solve for the exponent", "🔑", "from-yellow-300 to-amber-700", "11", "Precalculus", "Evaluate logarithms", 4, "choice"),
  m("sequenceBuilder", "Sequence & Series Builder", "Find the next term", "🪜", "from-violet-400 to-fuchsia-700", "11", "Precalculus", "Build sequences", 4, "choice"),
  m("patternMachine", "Arithmetic / Geometric Pattern", "Classify the pattern", "🌀", "from-sky-400 to-indigo-700", "11", "Precalculus", "Classify sequences", 4, "choice"),
  m("unitCircle", "Trig Unit Circle Puzzle", "Walk the unit circle", "🎯", "from-fuchsia-400 to-pink-700", "11", "Trigonometry", "Read the unit circle", 4, "choice"),
  m("sineWave", "Sine Wave Builder", "Tune the wave", "🌊", "from-sky-400 to-cyan-700", "11", "Trigonometry", "Build sine functions", 4, "slider"),
  m("lawOfSines", "Law of Sines / Cosines Quest", "Triangle voyage", "⛵", "from-teal-400 to-blue-700", "11", "Trigonometry", "Solve any triangle", 5, "choice"),
  m("matrixTransform", "Matrix Transformation Puzzle", "Apply the matrix", "🔢", "from-violet-300 to-indigo-700", "11", "Precalculus", "Matrix transformations", 5, "choice"),
  m("vectorNav", "Vector Navigation Challenge", "Steer the vector", "🧭", "from-emerald-300 to-cyan-700", "11", "Precalculus", "Add vectors", 4, "choice"),
  m("conicMatch", "Conic Sections Match", "Match the conic", "🥚", "from-amber-300 to-orange-700", "11", "Precalculus", "Identify conics", 4, "match"),
  m("regressionModel", "Regression Model Builder", "Fit the line", "📊", "from-blue-300 to-indigo-700", "11", "Statistics", "Linear regression", 5, "choice"),
  m("limitExplorer", "Limit Explorer", "Find the limit", "🔭", "from-indigo-400 to-violet-700", "12", "Calculus", "Compute limits", 5, "choice"),
  m("derivativeSlope", "Derivative Slope Lab", "Read the slope", "📐", "from-sky-400 to-blue-700", "12", "Calculus", "Apply the power rule", 4, "choice"),
  m("tangentLine", "Tangent Line Builder", "Aim the tangent", "📏", "from-fuchsia-400 to-pink-700", "12", "Calculus", "Find tangent lines", 5, "slider"),
  m("optimization", "Optimization Challenge", "Maximize or minimize", "🏔️", "from-amber-400 to-orange-700", "12", "Calculus", "Optimize functions", 5, "choice"),
  m("relatedRates", "Related Rates Puzzle", "Match the rates", "⏱️", "from-rose-400 to-red-700", "12", "Calculus", "Related rates", 5, "choice"),
  m("integralArea", "Integral Area Builder", "Sum the area", "🧮", "from-emerald-400 to-green-700", "12", "Calculus", "Definite integrals", 5, "drag"),
  m("riemannSum", "Riemann Sum Simulator", "Slice the curve", "📐", "from-cyan-400 to-teal-700", "12", "Calculus", "Riemann sums", 5, "slider"),
  m("accumulation", "Accumulation Function Puzzle", "Track the running total", "🌊", "from-sky-300 to-indigo-700", "12", "Calculus", "Accumulation functions", 5, "choice"),
  m("differentialFlow", "Differential Equation Flow", "Trace the flow", "🌬️", "from-violet-400 to-indigo-700", "12", "Calculus", "Solve simple ODEs", 5, "choice"),
  m("parametric", "Parametric Curve Tracer", "Trace by time", "🌀", "from-amber-300 to-pink-700", "12", "Precalculus", "Parametric equations", 5, "choice"),
  m("polarMatch", "Polar Graph Match", "Match the polar curve", "🪐", "from-orange-400 to-rose-700", "12", "Precalculus", "Plot polar curves", 5, "match"),
  m("probDistribution", "Probability Distribution Builder", "Build the histogram", "📊", "from-blue-400 to-violet-700", "12", "Statistics", "Distributions", 5, "drag"),
  m("zScore", "Normal Curve Z-Score Puzzle", "Standardize the score", "🔔", "from-indigo-400 to-fuchsia-700", "12", "Statistics", "Compute z-scores", 4, "choice"),
  m("confidenceInterval", "Confidence Interval Lab", "Tune the margin", "🎚️", "from-cyan-400 to-blue-700", "12", "Statistics", "Confidence intervals", 5, "slider"),
  m("hypothesisTest", "Hypothesis Test Decision", "Reject or accept?", "⚖️", "from-emerald-300 to-cyan-700", "12", "Statistics", "Hypothesis testing", 5, "choice"),
];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)] as T;
}

function shuffle<T>(items: readonly T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }
  return copy;
}

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function frac(n: number, d: number) {
  const g = gcd(n, d);
  return `${n / g}/${d / g}`;
}

function difficultyFor(solved: number): Difficulty {
  if (solved >= 16) return "hard";
  if (solved >= 6) return "medium";
  return "easy";
}

function numberChoices(answer: number, spread = 5) {
  const set = new Set([String(answer)]);
  while (set.size < 4) {
    const n = answer + rand(-spread, spread);
    if (n > 0) set.add(String(n));
  }
  return shuffle([...set]);
}

function metaFor(type: PuzzleId) {
  return METAS.find((m) => m.id === type) ?? METAS[0]!;
}

function base(meta: PuzzleMeta, difficulty: Difficulty, mode: Mode, prompt: string, visual: Visual): Puzzle {
  return {
    id: `${meta.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type: meta.id,
    title: meta.title,
    emoji: meta.emoji,
    difficulty,
    mode,
    prompt,
    hint: "Look for the smallest relationship first.",
    explanation: "The visual clue points to the answer.",
    visual,
  };
}

function makeChoice(puzzle: Puzzle, answer: string, choices: string[]): Puzzle {
  const all = shuffle(Array.from(new Set([answer, ...choices])).slice(0, 4));
  while (all.length < 4) all.push(String(rand(2, 24)));
  return { ...puzzle, mode: "choice", answer, choices: all };
}

function makePuzzle(type: PuzzleId, difficulty: Difficulty): Puzzle {
  const m = metaFor(type);
  const max = difficulty === "hard" ? 24 : difficulty === "medium" ? 16 : 10;

  switch (type) {
    case "weightScale": {
      const circle = rand(2, max > 16 ? 9 : 6);
      const square = rand(2, max > 16 ? 9 : 6);
      const answer = circle + square * 2;
      return makeChoice(
        {
          ...base(m, difficulty, "choice", "What does the mystery scale weigh?", {
            kind: "scale",
            title: `● = ${circle}`,
            subtitle: `■ = ${square}   ·   ● + ■ + ■ = ?`,
          }),
          hint: "Replace each shape with its weight.",
          explanation: `Circle is ${circle}; each square is ${square}. ${circle} + ${square} + ${square} = ${answer}.`,
        },
        String(answer),
        numberChoices(answer),
      );
    }
    case "fractionPizza": {
      const slices = pick([4, 6, 8, difficulty === "hard" ? 10 : 8]);
      const filled = rand(1, slices - 1);
      const answer = frac(filled, slices);
      return makeChoice(
        {
          ...base(m, difficulty, "choice", "What fraction of the pizza is glowing?", { kind: "pizza", slices, filled }),
          hint: "Count glowing slices over total slices.",
          explanation: `${filled} of ${slices} slices are glowing, which is ${answer}.`,
        },
        answer,
        [frac(filled + 1, slices), frac(Math.max(1, filled - 1), slices), frac(filled, slices + 2)],
      );
    }
    case "numberMachine": {
      const mult = rand(2, difficulty === "hard" ? 5 : 3);
      const add = rand(difficulty === "easy" ? 1 : -3, 6);
      const query = rand(3, max);
      const answer = mult * query + add;
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `The machine gets ${query}. What comes out?`, {
            kind: "machine",
            examples: [1, 2, 4].map((input) => ({ input, output: mult * input + add })),
            query,
          }),
          hint: "The same multiply-and-add rule works each time.",
          explanation: `The rule is ×${mult}${add >= 0 ? ` + ${add}` : ` − ${Math.abs(add)}`}. ${query} becomes ${answer}.`,
        },
        String(answer),
        numberChoices(answer),
      );
    }
    case "patternBlocks": {
      const a = rand(0, 3);
      const b = (a + rand(1, 3)) % 4;
      const c = (b + rand(1, 3)) % 4;
      const hard = difficulty !== "easy";
      const answer = hard ? b : a;
      return makeChoice(
        {
          ...base(m, difficulty, "choice", "Which block comes next?", {
            kind: "pattern",
            sequence: hard ? [a, b, c, a, b, c, a, -1] : [a, b, a, b, a, b, -1],
          }),
          hint: "Find the repeating cycle.",
          explanation: "The next block continues the visual cycle.",
        },
        String(answer),
        ["0", "1", "2", "3"],
      );
    }
    case "areaBuilder": {
      const width = rand(2, difficulty === "hard" ? 6 : 4);
      const height = rand(2, difficulty === "hard" ? 5 : 4);
      const answer = width * height;
      return makeChoice(
        {
          ...base(m, difficulty, "choice", "How many green tiles are inside the shape?", {
            kind: "area",
            width,
            height,
            cols: width + 2,
            rows: height + 2,
          }),
          hint: "Area is width times height.",
          explanation: `${width} × ${height} = ${answer}.`,
        },
        String(answer),
        numberChoices(answer),
      );
    }
    case "gridPath": {
      const start = rand(2, 8);
      const add = rand(2, 6);
      const mult = rand(2, 4);
      const target = (start + add) * mult;
      return {
        ...base(m, difficulty, "path", `Draw a path from ${start} to ${target}.`, {
          kind: "grid",
          title: `${start} → ${target}`,
          tiles: [`+${add}`, `×${mult}`, `−${rand(1, 4)}`, `+${rand(1, 4)}`],
        }),
        pathTiles: [`+${add}`, `×${mult}`, `−${rand(1, 4)}`, `+${rand(1, 4)}`],
        correctPath: [0, 1],
        hint: "Grow the number, then multiply.",
        explanation: `${start} + ${add} = ${start + add}; then ×${mult} = ${target}.`,
      };
    }
    case "waterFill": {
      const target = pick([2, 3, 4, 5]);
      return {
        ...base(m, difficulty, "drag", `Drag a jug that reaches ${target}L.`, {
          kind: "water",
          target,
          jugs: [
            { label: `${target}L`, fill: target, cap: target + 2 },
            { label: `${target + 1}L`, fill: target + 1, cap: target + 2 },
            { label: `${Math.max(1, target - 1)}L`, fill: Math.max(1, target - 1), cap: target + 2 },
          ],
        }),
        dragItems: [`${target}L`, `${target + 1}L`, `${Math.max(1, target - 1)}L`],
        dropLabel: `Target ${target}L`,
        answer: `${target}L`,
        hint: "The correct jug touches the target line exactly.",
        explanation: `The ${target}L jug reaches the target exactly.`,
      };
    }
    case "treasureEquations": {
      const x = rand(3, max);
      const add = rand(2, 9);
      return makeChoice(
        {
          ...base(m, difficulty, "choice", "Which key unlocks the chest?", {
            kind: "icon",
            icon: "💎",
            title: `x + ${add} = ${x + add}`,
            subtitle: "Solve for x",
          }),
          hint: "Undo the plus.",
          explanation: `${x + add} − ${add} = ${x}.`,
        },
        String(x),
        numberChoices(x),
      );
    }
    case "monsterMerge": {
      const values = shuffle([2, 3, 4, 5, 6]).slice(0, 3);
      const answer = values[0]! + values[1]!;
      return makeChoice(
        {
          ...base(m, difficulty, "choice", "Merge the first two monsters. What value appears?", {
            kind: "icon",
            icon: "👾",
            title: values.join("  +  "),
            subtitle: "Merged monsters add values",
          }),
          hint: "Only the first two monsters merge.",
          explanation: `${values[0]} + ${values[1]} = ${answer}.`,
        },
        String(answer),
        numberChoices(answer),
      );
    }
    case "clock": {
      const hour = rand(1, 12);
      const minute = pick([0, 15, 30, 45]);
      const answer = `${hour}:${String(minute).padStart(2, "0")}`;
      return makeChoice(
        {
          ...base(m, difficulty, "choice", "What time is shown?", { kind: "clock", hour, minute }),
          hint: "Short hand is hours; long hand is minutes.",
          explanation: `The clock shows ${answer}.`,
        },
        answer,
        [`${hour}:${String((minute + 15) % 60).padStart(2, "0")}`, `${hour === 12 ? 1 : hour + 1}:${String(minute).padStart(2, "0")}`, `${Math.max(1, hour - 1)}:${String(minute).padStart(2, "0")}`],
      );
    }
    case "balanceBeam": {
      const left = rand(4, 12);
      const right = rand(4, 12);
      const answer = left === right ? "Balanced" : left > right ? "Left heavy" : "Right heavy";
      return makeChoice(
        {
          ...base(m, difficulty, "choice", "Which side is heavier?", {
            kind: "beam",
            left: `${left}kg`,
            right: `${right}kg`,
            tilt: left === right ? 0 : left > right ? -1 : 1,
          }),
          hint: "Compare the total weight on each side.",
          explanation: `${left}kg versus ${right}kg means ${answer.toLowerCase()}.`,
        },
        answer,
        ["Left heavy", "Right heavy", "Balanced"],
      );
    }
    case "diceProbability": {
      const target = pick(["even", "greater than 4", "less than 3"]);
      const answer = target === "even" ? "3/6" : "2/6";
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Chance of rolling ${target}?`, {
            kind: "icon",
            icon: "🎲",
            title: "1 2 3 4 5 6",
            subtitle: `Target: ${target}`,
          }),
          hint: "Count winning faces out of six.",
          explanation: `There are ${answer.split("/")[0]} winning faces out of 6.`,
        },
        answer,
        ["1/6", "2/6", "3/6", "4/6"],
      );
    }
    case "coordinateTreasure": {
      const x = rand(-3, 3);
      const y = rand(-3, 3);
      return makeChoice(
        {
          ...base(m, difficulty, "choice", "Where is the treasure?", { kind: "coordinate", targetX: x, targetY: y }),
          hint: "Coordinates are x first, y second.",
          explanation: `The treasure sits at (${x}, ${y}).`,
        },
        `(${x}, ${y})`,
        [`(${y}, ${x})`, `(${x + 1}, ${y})`, `(${x}, ${y + 1})`],
      );
    }
    case "shapeFolding":
      return {
        ...base(m, difficulty, "rotate", "Rotate the folded shape until the star is upright.", {
          kind: "fold",
          title: "★ ● ▲ ■",
        }),
        targetRotation: 180,
        rotationStep: 90,
        hint: "Two quarter-turns make 180 degrees.",
        explanation: "The star lands upright after a 180° rotation.",
      };
    case "lightBeam":
      return {
        ...base(m, difficulty, "rotate", "Rotate the mirror to hit the crystal.", {
          kind: "laser",
          title: "Laser mirror",
        }),
        targetRotation: 90,
        rotationStep: 45,
        hint: "The beam needs a right-angle turn.",
        explanation: "At 90°, the mirror redirects the light into the crystal.",
      };
    case "bridgeWeight": {
      const limit = rand(12, 22);
      const weights = [rand(4, 9), rand(4, 9), rand(4, 9)];
      const total = weights[0]! + weights[1]!;
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Can the first two crates cross a ${limit}kg bridge?`, {
            kind: "icon",
            icon: "🌉",
            title: `${limit}kg limit`,
            subtitle: `Crates: ${weights.join("kg, ")}kg`,
          }),
          hint: "Add only the first two crates.",
          explanation: `They weigh ${total}kg, which is ${total <= limit ? "safe" : "too heavy"}.`,
        },
        total <= limit ? "Safe" : "Breaks",
        ["Safe", "Breaks"],
      );
    }
    case "resourceManagement": {
      const have = rand(8, 16);
      const costs = [rand(2, 6), rand(2, 6), rand(2, 6)];
      const total = costs[0]! + costs[1]!;
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Can you buy the first two items with ${have} coins?`, {
            kind: "icon",
            icon: "🪙",
            title: `${have} coins`,
            subtitle: `Costs: ${costs.join(" + ")}`,
          }),
          hint: "Spend only on the glowing items.",
          explanation: `The first two cost ${total}, so the answer is ${have >= total ? "yes" : "no"}.`,
        },
        have >= total ? "Yes" : "No",
        ["Yes", "No"],
      );
    }
    case "numberPyramid": {
      const a = rand(2, 8);
      const b = rand(2, 8);
      const c = rand(2, 8);
      const missing = a + b;
      return makeChoice(
        {
          ...base(m, difficulty, "choice", "Fill the missing pyramid block.", {
            kind: "pyramid",
            grid: [[a + b + b + c], [null, b + c], [a, b, c]],
          }),
          hint: "Each block is the sum of the two below it.",
          explanation: `${a} + ${b} = ${missing}.`,
        },
        String(missing),
        numberChoices(missing),
      );
    }
    case "snakePath": {
      const nums = [rand(2, 6), rand(2, 6), rand(2, 6), rand(2, 6)];
      const target = nums[0]! + nums[1]! + nums[2]!;
      return {
        ...base(m, difficulty, "path", `Draw a snake totaling ${target}.`, {
          kind: "icon",
          icon: "🐍",
          title: `Target ${target}`,
          subtitle: nums.join("  ·  "),
        }),
        pathTiles: nums.map(String),
        correctPath: [0, 1, 2],
        hint: "Tap connected numbers until the sum matches.",
        explanation: `${nums[0]} + ${nums[1]} + ${nums[2]} = ${target}.`,
      };
    }
    case "equationMatch":
      return matchPuzzle(m, difficulty, "Match each equation to its value.", [
        ["3 + 4", "7"],
        ["2 × 5", "10"],
        ["12 − 8", "4"],
      ]);
    case "multiplicationArray": {
      const rows = rand(2, 6);
      const cols = rand(2, 6);
      const answer = rows * cols;
      return makeChoice(
        {
          ...base(m, difficulty, "choice", "How many dots are in the array?", { kind: "array", rows, cols }),
          hint: "Rows times columns.",
          explanation: `${rows} × ${cols} = ${answer}.`,
        },
        String(answer),
        numberChoices(answer),
      );
    }
    case "sudokuMini":
      return makeChoice(
        {
          ...base(m, difficulty, "choice", "Which number completes the mini Sudoku?", {
            kind: "smallGrid",
            grid: [
              [1, 2, null],
              [3, null, 1],
              [2, 1, 3],
            ],
          }),
          hint: "Each row and column needs 1, 2, and 3.",
          explanation: "The top-right cell must be 3.",
        },
        "3",
        ["1", "2", "3"],
      );
    case "magicSquare":
      return makeChoice(
        {
          ...base(m, difficulty, "choice", "What number completes the magic square?", {
            kind: "smallGrid",
            grid: [
              [8, 1, 6],
              [3, null, 7],
              [4, 9, 2],
            ],
            target: 15,
          }),
          hint: "Every row should total 15.",
          explanation: "3 + 5 + 7 = 15, so the center is 5.",
        },
        "5",
        ["4", "5", "6", "8"],
      );
    case "memoryMatch":
      return matchPuzzle(m, difficulty, "Match equivalent math cards.", [
        ["1/2", "2/4"],
        ["3 + 3", "6"],
        ["5 × 2", "10"],
      ]);
    case "tangram":
      return {
        ...base(m, difficulty, "reorder", "Rearrange pieces from small to large.", {
          kind: "icon",
          icon: "🔷",
          title: "Tangram pieces",
          subtitle: "Tap two pieces to swap",
        }),
        tiles: ["◆", "■", "▲", "▰"],
        correctOrder: ["▲", "◆", "▰", "■"],
        hint: "Select a piece, then another piece to swap.",
        explanation: "The ordered pieces build a stable silhouette.",
      };
    case "primeCatcher": {
      const numbers = shuffle([2, 3, 4, 5, 6, 7]).slice(0, 4);
      const answer = numbers.filter((n) => [2, 3, 5, 7].includes(n)).join(", ");
      return makeChoice(
        {
          ...base(m, difficulty, "choice", "Catch all prime numbers.", {
            kind: "icon",
            icon: "⭐",
            title: numbers.join("  •  "),
            subtitle: "Prime numbers have two factors",
          }),
          hint: "Prime numbers are divisible only by 1 and themselves.",
          explanation: `The primes shown are ${answer}.`,
        },
        answer,
        [numbers.slice(0, 2).join(", "), numbers.filter((n) => n % 2 === 0).join(", "), numbers.slice(1, 3).join(", ")],
      );
    }
    case "fractionBars": {
      const left: [number, number] = [rand(1, 3), 4];
      const right: [number, number] = [rand(1, 5), 6];
      const answer = left[0] / left[1] === right[0] / right[1] ? "=" : left[0] / left[1] > right[0] / right[1] ? "Left" : "Right";
      return makeChoice(
        {
          ...base(m, difficulty, "choice", "Which fraction bar is larger?", { kind: "bars", left, right }),
          hint: "Compare how much of each bar is filled.",
          explanation: `${left[0]}/${left[1]} is compared to ${right[0]}/${right[1]}.`,
        },
        answer,
        ["Left", "Right", "="],
      );
    }
    case "decimalSlider": {
      const target = Number((rand(2, 9) / 10).toFixed(1));
      return {
        ...base(m, difficulty, "slider", `Slide to ${target.toFixed(1)}.`, {
          kind: "icon",
          icon: "🎚️",
          title: target.toFixed(1),
          subtitle: "Target decimal",
        }),
        slider: { min: 0, max: 1, step: 0.1, initial: 0.5, target },
        hint: "Each tick is one tenth.",
        explanation: `${target.toFixed(1)} means ${Math.round(target * 10)} tenths.`,
      };
    }
    case "ratioRecipe": {
      const a = rand(1, 4);
      const b = rand(1, 4);
      return {
        ...base(m, difficulty, "drag", `Drag the ${a}:${b} recipe into the bowl.`, {
          kind: "icon",
          icon: "🥣",
          title: `${a}:${b}`,
          subtitle: "Blue parts : pink parts",
        }),
        dragItems: [`${a}:${b}`, `${b}:${a}`, `${a + 1}:${b}`],
        dropLabel: "Mixing bowl",
        answer: `${a}:${b}`,
        hint: "Order matters: first ingredient, then second.",
        explanation: `The recipe asks for ${a} parts blue to ${b} parts pink.`,
      };
    }
    case "escapeRoom":
      return {
        ...base(m, difficulty, "swipe", "Swipe toward the door with code 12.", {
          kind: "icon",
          icon: "🚪",
          title: "3+4   2×6   9−5",
          subtitle: "Left · Up · Right",
        }),
        swipeTarget: "up",
        swipeLabels: ["Left door: 7", "Up door: 12", "Right door: 4"],
        hint: "Solve the middle lock.",
        explanation: "2 × 6 = 12, so the up door opens.",
      };
    case "linearBalance": {
      const aCoef = rand(2, difficulty === "hard" ? 6 : 4);
      const xVal = rand(2, difficulty === "hard" ? 12 : 8);
      const bConst = rand(2, 9);
      const cTotal = aCoef * xVal + bConst;
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Solve for x:   ${aCoef}x + ${bConst} = ${cTotal}.`, {
            kind: "icon",
            icon: "⚖️",
            title: `${aCoef}x + ${bConst} = ${cTotal}`,
            subtitle: "Balance both sides",
          }),
          hint: `Subtract ${bConst}, then divide by ${aCoef}.`,
          explanation: `(${cTotal} − ${bConst}) ÷ ${aCoef} = ${xVal}.`,
        },
        String(xVal),
        numberChoices(xVal),
      );
    }
    case "pythagoreanPath": {
      const triples: [number, number, number][] = [
        [3, 4, 5],
        [5, 12, 13],
        [8, 15, 17],
        [7, 24, 25],
        [6, 8, 10],
        [9, 12, 15],
      ];
      const [legA, legB, hyp] = pick(triples);
      const hideHyp = difficulty === "easy" ? true : Math.random() < 0.6;
      if (hideHyp) {
        return makeChoice(
          {
            ...base(m, difficulty, "choice", "Find the hypotenuse.", {
              kind: "icon",
              icon: "📐",
              title: `legs ${legA} and ${legB}`,
              subtitle: "a² + b² = c²",
            }),
            hint: "Take √(a² + b²).",
            explanation: `√(${legA}² + ${legB}²) = √${legA * legA + legB * legB} = ${hyp}.`,
          },
          String(hyp),
          numberChoices(hyp, 4),
        );
      }
      return makeChoice(
        {
          ...base(m, difficulty, "choice", "Find the missing leg.", {
            kind: "icon",
            icon: "📐",
            title: `leg ${legA}, hypotenuse ${hyp}`,
            subtitle: "c² − a² = b²",
          }),
          hint: "Subtract leg² from hyp², then square root.",
          explanation: `√(${hyp}² − ${legA}²) = ${legB}.`,
        },
        String(legB),
        numberChoices(legB, 4),
      );
    }
    case "rightTriangleSolver": {
      const triples: [number, number, number][] = [
        [3, 4, 5],
        [6, 8, 10],
        [5, 12, 13],
      ];
      const [opp, adj, hypo] = pick(triples);
      const ratio = pick(["sin", "cos", "tan"] as const);
      const answer = ratio === "sin" ? frac(opp, hypo) : ratio === "cos" ? frac(adj, hypo) : frac(opp, adj);
      const explanation =
        ratio === "sin"
          ? `sin θ = opp / hyp = ${opp}/${hypo} = ${answer}.`
          : ratio === "cos"
            ? `cos θ = adj / hyp = ${adj}/${hypo} = ${answer}.`
            : `tan θ = opp / adj = ${opp}/${adj} = ${answer}.`;
      const distractors = Array.from(
        new Set([
          frac(adj, hypo),
          frac(opp, hypo),
          frac(opp, adj),
          frac(adj, opp),
          frac(hypo, opp),
        ]),
      ).filter((value) => value !== answer);
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Right triangle: legs ${opp} & ${adj}, hyp ${hypo}. Find ${ratio} θ.`, {
            kind: "icon",
            icon: "📐",
            title: `legs ${opp}, ${adj}`,
            subtitle: `hypotenuse ${hypo}`,
          }),
          hint: "Remember SOH-CAH-TOA.",
          explanation,
        },
        answer,
        distractors,
      );
    }
    case "logarithmUnlock": {
      const baseVal = pick([2, 3, 5, 10] as const);
      const expCap = baseVal === 10 ? 4 : baseVal === 2 ? 6 : 4;
      const exp = rand(2, expCap);
      const value = Math.pow(baseVal, exp);
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Solve:   log_${baseVal}(${value}) = ?`, {
            kind: "icon",
            icon: "🔑",
            title: `log_${baseVal}(${value}) = ?`,
            subtitle: "Find the exponent",
          }),
          hint: `Ask yourself: ${baseVal} to what power equals ${value}?`,
          explanation: `${baseVal}^${exp} = ${value}, so the answer is ${exp}.`,
        },
        String(exp),
        numberChoices(exp, 3),
      );
    }
    case "derivativeSlope": {
      const coeff = rand(1, difficulty === "hard" ? 5 : 3);
      const power = rand(2, 4);
      const at = rand(2, 5);
      const answer = coeff * power * Math.pow(at, power - 1);
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `f(x) = ${coeff}x^${power}. Find f′(${at}).`, {
            kind: "icon",
            icon: "📐",
            title: `f(x) = ${coeff}x^${power}`,
            subtitle: `Slope at x = ${at}`,
          }),
          hint: "Power rule: bring the exponent down.",
          explanation: `f′(x) = ${coeff * power}x^${power - 1}. At x = ${at}: ${coeff * power}·${at}^${power - 1} = ${answer}.`,
        },
        String(answer),
        numberChoices(answer, 10),
      );
    }
    case "zScore": {
      const mu = rand(40, 80);
      const sigma = pick([2, 4, 5, 10] as const);
      const z = pick([-2, -1, 1, 2] as const);
      const xObs = mu + z * sigma;
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `μ = ${mu}, σ = ${sigma}, x = ${xObs}. Find z.`, {
            kind: "icon",
            icon: "🔔",
            title: `z = (x − μ) / σ`,
            subtitle: `μ=${mu}, σ=${sigma}, x=${xObs}`,
          }),
          hint: "Subtract the mean, then divide by σ.",
          explanation: `(${xObs} − ${mu}) / ${sigma} = ${z}.`,
        },
        String(z),
        [String(z + 1), String(z - 1), String(z + 2), String(-z)],
      );
    }
    default:
      return placeholderPuzzle(m, difficulty);
  }
}

function matchPuzzle(meta: PuzzleMeta, difficulty: Difficulty, prompt: string, rawPairs: [string, string][]): Puzzle {
  return {
    ...base(meta, difficulty, "match", prompt, {
      kind: "icon",
      icon: "🔗",
      title: "Pair the cards",
      subtitle: rawPairs.map(([left]) => left).join("  •  "),
    }),
    pairs: rawPairs.map(([left, right]) => ({ left, right })),
    hint: "Tap a left card, then the matching right card.",
    explanation: "Every expression is matched to an equivalent value.",
  };
}

function subjectChoicePreview(meta: PuzzleMeta, difficulty: Difficulty): Puzzle {
  const max = difficulty === "hard" ? 24 : difficulty === "medium" ? 16 : 10;
  const previewLabel = `${meta.subject} preview`;

  switch (meta.subject) {
    case "Algebra": {
      const k = rand(2, 9);
      const x = rand(2, max);
      return makeChoice(
        {
          ...base(meta, difficulty, "choice", `${meta.title}: solve ${k}x = ${k * x}.`, {
            kind: "icon",
            icon: meta.emoji,
            title: `${k}x = ${k * x}`,
            subtitle: previewLabel,
          }),
          hint: `Divide both sides by ${k}.`,
          explanation: `${k * x} ÷ ${k} = ${x}.`,
        },
        String(x),
        numberChoices(x),
      );
    }
    case "Geometry": {
      const a = rand(30, 80);
      const b = rand(30, 80);
      const answer = 180 - a - b;
      return makeChoice(
        {
          ...base(meta, difficulty, "choice", `${meta.title}: find the missing triangle angle.`, {
            kind: "icon",
            icon: meta.emoji,
            title: `${a}° + ${b}° + ?° = 180°`,
            subtitle: previewLabel,
          }),
          hint: "Angles in a triangle add to 180°.",
          explanation: `180 − ${a} − ${b} = ${answer}.`,
        },
        `${answer}°`,
        [`${answer - 5}°`, `${answer + 5}°`, `${answer + 10}°`],
      );
    }
    case "Trigonometry": {
      const opts: { q: string; a: string; others: string[] }[] = [
        { q: "sin 30°", a: "1/2", others: ["√3/2", "√2/2", "1"] },
        { q: "cos 60°", a: "1/2", others: ["√3/2", "√2/2", "0"] },
        { q: "tan 45°", a: "1", others: ["0", "√3", "1/√3"] },
        { q: "sin 90°", a: "1", others: ["0", "1/2", "√3/2"] },
        { q: "cos 0°", a: "1", others: ["0", "1/2", "√3/2"] },
      ];
      const choice = pick(opts);
      return makeChoice(
        {
          ...base(meta, difficulty, "choice", `${meta.title}: evaluate ${choice.q}.`, {
            kind: "icon",
            icon: meta.emoji,
            title: choice.q,
            subtitle: previewLabel,
          }),
          hint: "Recall the unit circle.",
          explanation: `${choice.q} = ${choice.a}.`,
        },
        choice.a,
        choice.others,
      );
    }
    case "Precalculus": {
      const aCoef = rand(1, 4);
      const bConst = rand(0, 6);
      const xVal = rand(2, 8);
      const answer = aCoef * xVal + bConst;
      return makeChoice(
        {
          ...base(meta, difficulty, "choice", `${meta.title}: evaluate f(${xVal}) where f(x) = ${aCoef}x + ${bConst}.`, {
            kind: "icon",
            icon: meta.emoji,
            title: `f(x) = ${aCoef}x + ${bConst}`,
            subtitle: previewLabel,
          }),
          hint: `Substitute ${xVal} for x.`,
          explanation: `${aCoef}·${xVal} + ${bConst} = ${answer}.`,
        },
        String(answer),
        numberChoices(answer),
      );
    }
    case "Calculus": {
      const coeff = rand(1, 4);
      const power = rand(2, 4);
      const at = rand(2, 5);
      const answer = coeff * power * Math.pow(at, power - 1);
      return makeChoice(
        {
          ...base(meta, difficulty, "choice", `${meta.title}: d/dx of ${coeff}x^${power} at x = ${at}.`, {
            kind: "icon",
            icon: meta.emoji,
            title: `f(x) = ${coeff}x^${power}`,
            subtitle: previewLabel,
          }),
          hint: "Power rule: bring down the exponent.",
          explanation: `f′(x) = ${coeff * power}x^${power - 1}. At x = ${at}: ${answer}.`,
        },
        String(answer),
        numberChoices(answer, 10),
      );
    }
    case "Statistics": {
      const data = [rand(2, 9), rand(2, 9), rand(2, 9), rand(2, 9), rand(2, 9)];
      const sorted = [...data].sort((a, b) => a - b);
      const answer = sorted[2]!;
      return makeChoice(
        {
          ...base(meta, difficulty, "choice", `${meta.title}: find the median.`, {
            kind: "icon",
            icon: meta.emoji,
            title: data.join(", "),
            subtitle: previewLabel,
          }),
          hint: "Sort the values, then pick the middle.",
          explanation: `Sorted: ${sorted.join(", ")}. Median = ${answer}.`,
        },
        String(answer),
        numberChoices(answer),
      );
    }
    default: {
      const answer = rand(2, max);
      return makeChoice(
        {
          ...base(meta, difficulty, "choice", `${meta.title}: pick the highlighted value.`, {
            kind: "icon",
            icon: meta.emoji,
            title: meta.title,
            subtitle: previewLabel,
          }),
          hint: "Tap any option.",
          explanation: "Preview challenge.",
        },
        String(answer),
        numberChoices(answer),
      );
    }
  }
}

function placeholderMatch(meta: PuzzleMeta, difficulty: Difficulty): Puzzle {
  const banks: Record<Subject, [string, string][]> = {
    Algebra: [["2x at x=3", "6"], ["x² at x=4", "16"], ["3x − 1 at x=2", "5"]],
    Geometry: [["Square side 4", "16"], ["Rect 3×5", "15"], ["Triangle b=6 h=4", "12"]],
    Trigonometry: [["sin 30°", "1/2"], ["cos 60°", "1/2"], ["tan 45°", "1"]],
    Precalculus: [["log₂ 8", "3"], ["log₃ 9", "2"], ["log₁₀ 100", "2"]],
    Calculus: [["d/dx x²", "2x"], ["d/dx x³", "3x²"], ["d/dx 5x", "5"]],
    Statistics: [["Median {1,2,3}", "2"], ["Mean {2,4,6}", "4"], ["Mode {1,1,2}", "1"]],
    Arithmetic: [["3 + 4", "7"], ["2 × 5", "10"], ["12 − 8", "4"]],
    Logic: [["3 + 4", "7"], ["2 × 5", "10"], ["12 − 8", "4"]],
  };
  return matchPuzzle(meta, difficulty, `${meta.title}: pair the cards.`, banks[meta.subject]);
}

function placeholderSlider(meta: PuzzleMeta, difficulty: Difficulty): Puzzle {
  const target = Number((rand(2, 9) / 10).toFixed(1));
  return {
    ...base(meta, difficulty, "slider", `${meta.title}: slide to ${target.toFixed(1)}.`, {
      kind: "icon",
      icon: meta.emoji,
      title: target.toFixed(1),
      subtitle: "Tune the value",
    }),
    slider: { min: 0, max: 1, step: 0.1, initial: 0.5, target },
    hint: "Find the precise decimal.",
    explanation: `Target was ${target.toFixed(1)}.`,
  };
}

function placeholderDrag(meta: PuzzleMeta, difficulty: Difficulty): Puzzle {
  const targetValue = String(rand(5, 15));
  const distractors = [String(rand(2, 4)), String(rand(20, 25))];
  return {
    ...base(meta, difficulty, "drag", `${meta.title}: drag the matching value into the bowl.`, {
      kind: "icon",
      icon: meta.emoji,
      title: `Target ${targetValue}`,
      subtitle: "Drag and drop",
    }),
    dragItems: shuffle([targetValue, ...distractors]),
    dropLabel: `Target ${targetValue}`,
    answer: targetValue,
    hint: "Pick the value that matches the target.",
    explanation: `The right item was ${targetValue}.`,
  };
}

function placeholderReorder(meta: PuzzleMeta, _difficulty: Difficulty): Puzzle {
  const tiles = ["1", "2", "3", "4"];
  return {
    ...base(meta, _difficulty, "reorder", `${meta.title}: arrange the tiles in order.`, {
      kind: "icon",
      icon: meta.emoji,
      title: tiles.join("  ·  "),
      subtitle: "Tap two tiles to swap",
    }),
    tiles: shuffle(tiles),
    correctOrder: tiles,
    hint: "Tap two tiles to swap them.",
    explanation: "Tiles are arranged from 1 to 4.",
  };
}

function placeholderRotate(meta: PuzzleMeta, _difficulty: Difficulty): Puzzle {
  return {
    ...base(meta, _difficulty, "rotate", `${meta.title}: rotate to 180°.`, {
      kind: "fold",
      title: "Rotate the figure",
    }),
    targetRotation: 180,
    rotationStep: 90,
    hint: "Two quarter-turns reach 180°.",
    explanation: "A half-turn completes the transformation.",
  };
}

function placeholderPuzzle(meta: PuzzleMeta, difficulty: Difficulty): Puzzle {
  switch (meta.interactionHint) {
    case "match":
      return placeholderMatch(meta, difficulty);
    case "slider":
      return placeholderSlider(meta, difficulty);
    case "drag":
      return placeholderDrag(meta, difficulty);
    case "reorder":
      return placeholderReorder(meta, difficulty);
    case "rotate":
      return placeholderRotate(meta, difficulty);
    default:
      return subjectChoicePreview(meta, difficulty);
  }
}

function initialState(puzzle: Puzzle | null): PlayState {
  return {
    choice: null,
    slider: puzzle?.slider?.initial ?? 0,
    dropped: null,
    matches: {},
    pendingLeft: null,
    path: [],
    rotation: 0,
    order: puzzle?.tiles ?? [],
    swipe: null,
    touchStart: null,
  };
}

function isSolved(puzzle: Puzzle, state: PlayState) {
  if (puzzle.mode === "choice") return state.choice === puzzle.answer;
  if (puzzle.mode === "slider") return Math.abs(state.slider - (puzzle.slider?.target ?? 999)) < 0.001;
  if (puzzle.mode === "drag") return state.dropped === puzzle.answer;
  if (puzzle.mode === "match") return (puzzle.pairs ?? []).every((p) => state.matches[p.left] === p.right);
  if (puzzle.mode === "path") return (puzzle.correctPath ?? []).every((v, i) => state.path[i] === v) && state.path.length === (puzzle.correctPath ?? []).length;
  if (puzzle.mode === "rotate") return ((state.rotation % 360) + 360) % 360 === puzzle.targetRotation;
  if (puzzle.mode === "reorder") return (puzzle.correctOrder ?? []).every((v, i) => state.order[i] === v);
  return state.swipe === puzzle.swipeTarget;
}

function canCheck(puzzle: Puzzle | null, state: PlayState) {
  if (!puzzle) return false;
  if (puzzle.mode === "choice") return state.choice !== null;
  if (puzzle.mode === "drag") return state.dropped !== null;
  if (puzzle.mode === "match") return Object.keys(state.matches).length === (puzzle.pairs ?? []).length;
  if (puzzle.mode === "path") return state.path.length > 0;
  if (puzzle.mode === "swipe") return state.swipe !== null;
  return true;
}

function Shape({ kind }: { kind: number }) {
  const base = "block h-11 w-11 shadow-lg ring-1 ring-white/20";
  if (kind === 0) return <span className={`${base} rounded-full bg-gradient-to-br from-rose-300 to-rose-600`} />;
  if (kind === 1) return <span className={`${base} rounded-xl bg-gradient-to-br from-sky-300 to-blue-600`} />;
  if (kind === 2) return <span className={`${base} bg-gradient-to-br from-amber-300 to-orange-600`} style={{ clipPath: "polygon(50% 4%, 96% 94%, 4% 94%)" }} />;
  return <span className={`${base} rotate-45 rounded-lg bg-gradient-to-br from-emerald-300 to-green-600`} />;
}

function VisualCard({ visual, rotation }: { visual: Visual; rotation: number }) {
  if (visual.kind === "pizza") return <Pizza slices={visual.slices ?? 6} filled={visual.filled ?? 1} />;
  if (visual.kind === "machine") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {(visual.examples ?? []).map((ex) => (
            <span key={ex.input} className="rounded-xl bg-zinc-800 px-2 py-2 text-center font-mono text-sm ring-1 ring-white/10">
              {ex.input} → <b className="text-emerald-300">{ex.output}</b>
            </span>
          ))}
        </div>
        <div className="flex items-center justify-center gap-3 text-2xl font-black">
          <span className="rounded-2xl bg-amber-400 px-4 py-3 text-amber-950">{visual.query}</span>
          <span className="text-zinc-500">→</span>
          <span className="rounded-2xl bg-sky-500 px-4 py-3">⚙️</span>
          <span className="text-zinc-500">→</span>
          <span className="rounded-2xl border-2 border-dashed border-emerald-300 px-4 py-3 text-emerald-200">?</span>
        </div>
      </div>
    );
  }
  if (visual.kind === "pattern") {
    return (
      <div className="flex flex-wrap justify-center gap-3">
        {(visual.sequence ?? []).map((item, i) =>
          item === -1 ? (
            <span key={i} className="grid h-11 w-11 place-items-center rounded-xl border-2 border-dashed border-violet-300 text-xl font-black">?</span>
          ) : (
            <Shape key={i} kind={item} />
          ),
        )}
      </div>
    );
  }
  if (visual.kind === "area") return <Area width={visual.width ?? 3} height={visual.height ?? 3} cols={visual.cols ?? 5} rows={visual.rows ?? 5} />;
  if (visual.kind === "water") return <Water jugs={visual.jugs ?? []} />;
  if (visual.kind === "clock") return <Clock hour={visual.hour ?? 12} minute={visual.minute ?? 0} />;
  if (visual.kind === "beam") return <Beam left={String(visual.left)} right={String(visual.right)} tilt={visual.tilt ?? 0} />;
  if (visual.kind === "coordinate") return <Coordinate x={visual.targetX ?? 0} y={visual.targetY ?? 0} />;
  if (visual.kind === "fold") return <Fold rotation={rotation} />;
  if (visual.kind === "laser") return <Laser rotation={rotation} />;
  if (visual.kind === "pyramid") return <SmallGrid grid={visual.grid ?? []} pyramid />;
  if (visual.kind === "array") return <Dots rows={visual.rows ?? 3} cols={visual.cols ?? 4} />;
  if (visual.kind === "smallGrid") return <SmallGrid grid={visual.grid ?? []} footer={visual.target ? `Rows target ${visual.target}` : undefined} />;
  if (visual.kind === "bars") return <Bars left={(visual.left as [number, number]) ?? [1, 2]} right={(visual.right as [number, number]) ?? [1, 3]} />;
  return (
    <div className="flex flex-col items-center gap-2 rounded-3xl bg-zinc-800/60 p-5 text-center ring-1 ring-white/10">
      <span className="text-6xl drop-shadow-lg">{visual.icon ?? "✨"}</span>
      <p className="text-xl font-black text-white">{visual.title}</p>
      <p className="text-sm text-zinc-400">{visual.subtitle}</p>
    </div>
  );
}

function Pizza({ slices, filled }: { slices: number; filled: number }) {
  const size = 208;
  const r = size / 2;
  return (
    <svg className="mx-auto drop-shadow-2xl" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {Array.from({ length: slices }, (_, i) => {
        const a = (i / slices) * Math.PI * 2 - Math.PI / 2;
        const b = ((i + 1) / slices) * Math.PI * 2 - Math.PI / 2;
        const d = `M ${r} ${r} L ${r + r * Math.cos(a)} ${r + r * Math.sin(a)} A ${r} ${r} 0 0 1 ${r + r * Math.cos(b)} ${r + r * Math.sin(b)} Z`;
        return <path key={i} d={d} fill={i < filled ? "#f59e0b" : "#78350f"} stroke="#431407" strokeWidth="2" />;
      })}
    </svg>
  );
}

function Area({ width, height, cols, rows }: { width: number; height: number; cols: number; rows: number }) {
  return (
    <div className="mx-auto grid w-max gap-1 rounded-3xl bg-zinc-800/70 p-3" style={{ gridTemplateColumns: `repeat(${cols}, 2rem)` }}>
      {Array.from({ length: cols * rows }, (_, i) => {
        const x = i % cols;
        const y = Math.floor(i / cols);
        const inside = x > 0 && x <= width && y > 0 && y <= height;
        return <span key={i} className={`h-8 w-8 rounded-lg ${inside ? "bg-emerald-400 shadow-lg shadow-emerald-500/30" : "bg-zinc-700/70"}`} />;
      })}
    </div>
  );
}

function Water({ jugs }: { jugs: { label: string; fill: number; cap: number }[] }) {
  return (
    <div className="flex items-end justify-center gap-4">
      {jugs.map((jug) => (
        <div key={jug.label} className="flex flex-col items-center gap-2">
          <div className="relative h-28 w-16 overflow-hidden rounded-b-3xl rounded-t-lg border-2 border-sky-200/40 bg-sky-950/40">
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-sky-500 to-cyan-300" style={{ height: `${(jug.fill / jug.cap) * 100}%` }} />
          </div>
          <span className="font-mono text-sm text-sky-100">{jug.label}</span>
        </div>
      ))}
    </div>
  );
}

function Clock({ hour, minute }: { hour: number; minute: number }) {
  const minuteDeg = minute * 6;
  const hourDeg = (hour % 12) * 30 + minute * 0.5;
  return (
    <div className="relative mx-auto h-56 w-56 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-300 shadow-2xl ring-8 ring-zinc-700">
      <span className="absolute left-1/2 top-1/2 h-16 w-1.5 origin-bottom rounded-full bg-zinc-950" style={{ transform: `translate(-50%, -100%) rotate(${hourDeg}deg)` }} />
      <span className="absolute left-1/2 top-1/2 h-24 w-1 origin-bottom rounded-full bg-rose-500" style={{ transform: `translate(-50%, -100%) rotate(${minuteDeg}deg)` }} />
      <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-950" />
    </div>
  );
}

function Beam({ left, right, tilt }: { left: string; right: string; tilt: -1 | 0 | 1 }) {
  return (
    <div className="flex h-36 items-center justify-center">
      <div className="relative h-4 w-64 rounded-full bg-amber-700 shadow-xl" style={{ transform: `rotate(${tilt * 8}deg)` }}>
        <span className="absolute -top-14 left-3 rounded-2xl bg-zinc-800 px-4 py-3 font-black ring-1 ring-white/10">{left}</span>
        <span className="absolute -top-14 right-3 rounded-2xl bg-zinc-800 px-4 py-3 font-black ring-1 ring-white/10">{right}</span>
      </div>
      <div className="absolute mt-24 h-16 w-6 rounded-t-full bg-zinc-700" />
    </div>
  );
}

function Coordinate({ x, y }: { x: number; y: number }) {
  return (
    <div className="mx-auto grid w-max grid-cols-7 gap-1 rounded-3xl bg-zinc-800/70 p-3">
      {Array.from({ length: 49 }, (_, i) => {
        const gx = (i % 7) - 3;
        const gy = 3 - Math.floor(i / 7);
        return <span key={i} className={`grid h-8 w-8 place-items-center rounded-lg text-xs ${gx === x && gy === y ? "bg-amber-400 text-amber-950" : "bg-zinc-700/70 text-zinc-500"}`}>{gx === x && gy === y ? "💎" : ""}</span>;
      })}
    </div>
  );
}

function Fold({ rotation }: { rotation: number }) {
  return (
    <motion.div animate={{ rotate: rotation }} className="mx-auto grid w-max grid-cols-2 gap-2 rounded-3xl bg-zinc-800/70 p-4">
      {["★", "●", "▲", "■"].map((face) => <span key={face} className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-400 to-violet-700 text-3xl shadow-lg">{face}</span>)}
    </motion.div>
  );
}

function Laser({ rotation }: { rotation: number }) {
  return (
    <div className="relative mx-auto h-40 w-72 rounded-3xl bg-zinc-900 ring-1 ring-white/10">
      <span className="absolute left-5 top-1/2 h-1 w-28 -translate-y-1/2 rounded-full bg-yellow-300 shadow-[0_0_20px_rgba(253,224,71,0.8)]" />
      <motion.span animate={{ rotate: rotation }} className="absolute left-36 top-16 h-3 w-16 rounded-full bg-sky-200 shadow-lg shadow-sky-300/40" />
      <span className="absolute right-7 top-10 text-4xl">💎</span>
    </div>
  );
}

function SmallGrid({ grid, footer, pyramid }: { grid: (number | null)[][]; footer?: string; pyramid?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={pyramid ? "space-y-2" : "grid grid-cols-3 gap-1 rounded-2xl bg-zinc-700 p-1"}>
        {pyramid
          ? grid.map((row, ri) => <div key={ri} className="flex justify-center gap-2">{row.map((n, i) => <Cell key={i} n={n} wide />)}</div>)
          : grid.flat().map((n, i) => <Cell key={i} n={n} />)}
      </div>
      {footer ? <p className="text-xs text-zinc-400">{footer}</p> : null}
    </div>
  );
}

function Cell({ n, wide }: { n: number | null; wide?: boolean }) {
  return <span className={`grid h-14 ${wide ? "w-16" : "w-14"} place-items-center rounded-xl text-xl font-black ${n === null ? "border-2 border-dashed border-violet-300 text-violet-100" : "bg-zinc-900 text-zinc-100"}`}>{n ?? "?"}</span>;
}

function Dots({ rows, cols }: { rows: number; cols: number }) {
  return (
    <div className="mx-auto grid w-max gap-2 rounded-3xl bg-zinc-800/70 p-4" style={{ gridTemplateColumns: `repeat(${cols}, 1.25rem)` }}>
      {Array.from({ length: rows * cols }, (_, i) => <span key={i} className="h-5 w-5 rounded-full bg-emerald-300 shadow-md shadow-emerald-500/30" />)}
    </div>
  );
}

function Bars({ left, right }: { left: [number, number]; right: [number, number] }) {
  return (
    <div className="space-y-4">
      {[
        ["Left", left],
        ["Right", right],
      ].map(([label, pair]) => {
        const [n, d] = pair as [number, number];
        return (
          <div key={String(label)} className="space-y-1">
            <div className="flex justify-between text-sm text-zinc-400"><span>{String(label)}</span><span>{n}/{d}</span></div>
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${d}, 1fr)` }}>
              {Array.from({ length: d }, (_, i) => <span key={i} className={`h-8 rounded-lg ${i < n ? "bg-orange-400" : "bg-zinc-700"}`} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Interaction({ puzzle, state, setState, locked }: { puzzle: Puzzle; state: PlayState; setState: (s: Partial<PlayState>) => void; locked: boolean }) {
  if (puzzle.mode === "choice") {
    return (
      <div className="grid grid-cols-2 gap-2">
        {(puzzle.choices ?? []).map((choice) => (
          <motion.button
            key={choice}
            type="button"
            whileTap={{ scale: 0.96 }}
            disabled={locked}
            onClick={() => setState({ choice })}
            className={`min-h-16 rounded-2xl border-2 px-3 py-3 text-lg font-black transition ${state.choice === choice ? "border-sky-300 bg-sky-500/25 text-white shadow-lg shadow-sky-500/20" : "border-white/10 bg-zinc-800/70 text-zinc-100"}`}
          >
            {puzzle.type === "patternBlocks" ? <span className="flex justify-center"><Shape kind={Number(choice)} /></span> : choice}
          </motion.button>
        ))}
      </div>
    );
  }

  if (puzzle.mode === "slider" && puzzle.slider) {
    return (
      <div className="rounded-3xl bg-zinc-800/70 p-5 ring-1 ring-white/10">
        <div className="mb-4 text-center font-mono text-4xl font-black text-cyan-200">{state.slider.toFixed(1)}</div>
        <input disabled={locked} type="range" min={puzzle.slider.min} max={puzzle.slider.max} step={puzzle.slider.step} value={state.slider} onChange={(e) => setState({ slider: Number(e.target.value) })} className="h-3 w-full accent-cyan-400" />
      </div>
    );
  }

  if (puzzle.mode === "drag") {
    const onDrop = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!locked) setState({ dropped: event.dataTransfer.getData("text/plain") });
    };
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {(puzzle.dragItems ?? []).map((item) => (
            <button key={item} type="button" draggable={!locked} disabled={locked} onDragStart={(e) => e.dataTransfer.setData("text/plain", item)} onClick={() => setState({ dropped: item })} className="rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 px-3 py-4 text-lg font-black text-white shadow-lg shadow-sky-500/20">
              {item}
            </button>
          ))}
        </div>
        <div onDragOver={(e) => e.preventDefault()} onDrop={onDrop} className="grid min-h-24 place-items-center rounded-3xl border-2 border-dashed border-cyan-300/60 bg-cyan-500/10 p-4 text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-cyan-100">{state.dropped ?? puzzle.dropLabel}</span>
        </div>
      </div>
    );
  }

  if (puzzle.mode === "match") {
    const rights = shuffle((puzzle.pairs ?? []).map((p) => p.right));
    return (
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {(puzzle.pairs ?? []).map((pair) => (
            <button key={pair.left} type="button" disabled={locked || state.matches[pair.left] !== undefined} onClick={() => setState({ pendingLeft: pair.left })} className={`w-full rounded-2xl px-3 py-4 text-left font-black ring-1 ring-white/10 ${state.pendingLeft === pair.left ? "bg-violet-500/30" : state.matches[pair.left] ? "bg-emerald-500/20" : "bg-zinc-800/80"}`}>
              {pair.left}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {rights.map((right) => (
            <button key={right} type="button" disabled={locked || Object.values(state.matches).includes(right)} onClick={() => state.pendingLeft && setState({ matches: { ...state.matches, [state.pendingLeft]: right }, pendingLeft: null })} className={`w-full rounded-2xl px-3 py-4 text-left font-black ring-1 ring-white/10 ${Object.values(state.matches).includes(right) ? "bg-emerald-500/20" : "bg-zinc-800/80"}`}>
              {right}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (puzzle.mode === "path") {
    return (
      <div className="space-y-3">
        <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-2xl bg-zinc-800/70 p-2 ring-1 ring-white/10">
          {state.path.length === 0 ? <span className="px-2 text-sm text-zinc-500">Tap tiles to draw a path</span> : state.path.map((idx, i) => <span key={`${idx}-${i}`} className="rounded-xl bg-cyan-500 px-3 py-2 font-mono font-black">{puzzle.pathTiles?.[idx]}</span>)}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {(puzzle.pathTiles ?? []).map((tile, i) => <button key={`${tile}-${i}`} type="button" disabled={locked} onClick={() => setState({ path: [...state.path, i] })} className="rounded-2xl bg-zinc-800 px-3 py-4 font-mono text-lg font-black ring-1 ring-white/10">{tile}</button>)}
        </div>
        <button type="button" disabled={locked} onClick={() => setState({ path: [] })} className="w-full rounded-xl bg-white/5 py-2 text-sm text-zinc-300">Clear path</button>
      </div>
    );
  }

  if (puzzle.mode === "rotate") {
    return <button type="button" disabled={locked} onClick={() => setState({ rotation: (state.rotation + (puzzle.rotationStep ?? 90)) % 360 })} className="w-full rounded-2xl bg-violet-500 px-4 py-4 text-lg font-black text-white shadow-lg shadow-violet-500/25">Rotate {puzzle.rotationStep ?? 90}°</button>;
  }

  if (puzzle.mode === "reorder") {
    return <Reorder state={state} setState={setState} locked={locked} />;
  }

  return <Swipe labels={puzzle.swipeLabels ?? []} state={state} setState={setState} locked={locked} />;
}

function Reorder({ state, setState, locked }: { state: PlayState; setState: (s: Partial<PlayState>) => void; locked: boolean }) {
  const [held, setHeld] = useState<number | null>(null);
  return (
    <div className="grid grid-cols-4 gap-2">
      {state.order.map((tile, i) => (
        <button
          key={`${tile}-${i}`}
          type="button"
          disabled={locked}
          onClick={() => {
            if (held === null) {
              setHeld(i);
              return;
            }
            const next = [...state.order];
            [next[held], next[i]] = [next[i]!, next[held]!];
            setHeld(null);
            setState({ order: next });
          }}
          className={`grid h-16 place-items-center rounded-2xl text-3xl ring-1 ring-white/10 ${held === i ? "bg-amber-500/30" : "bg-zinc-800"}`}
        >
          {tile}
        </button>
      ))}
    </div>
  );
}

function Swipe({ labels, state, setState, locked }: { labels: string[]; state: PlayState; setState: (s: Partial<PlayState>) => void; locked: boolean }) {
  const detect = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
  };
  const finishTouch = (event: TouchEvent<HTMLDivElement>) => {
    if (!state.touchStart || locked) return;
    setState({ swipe: detect(state.touchStart, { x: event.changedTouches[0]?.clientX ?? 0, y: event.changedTouches[0]?.clientY ?? 0 }), touchStart: null });
  };
  return (
    <div
      onTouchStart={(e) => setState({ touchStart: { x: e.touches[0]?.clientX ?? 0, y: e.touches[0]?.clientY ?? 0 } })}
      onTouchEnd={finishTouch}
      className="grid min-h-36 place-items-center rounded-3xl border-2 border-dashed border-violet-300/60 bg-violet-500/10 p-5 text-center"
    >
      <div>
        <p className="text-4xl">↕️</p>
        <p className="mt-2 font-black text-violet-100">{state.swipe ? `Swiped ${state.swipe}` : "Swipe toward a door"}</p>
        <p className="mt-2 text-xs text-zinc-400">{labels.join(" · ")}</p>
      </div>
    </div>
  );
}

function Confetti({ show }: { show: boolean }) {
  const bits = useMemo(
    () => Array.from({ length: 18 }, (_, i) => ({ icon: ["⭐", "✨", "🎉", "💫"][i % 4]!, x: (Math.random() - 0.5) * 95, y: -25 - Math.random() * 45, delay: i * 0.03 })),
    [],
  );
  return (
    <AnimatePresence>
      {show ? (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {bits.map((bit, i) => (
            <motion.span key={i} className="absolute left-1/2 top-1/2 text-3xl" initial={{ opacity: 1, x: 0, y: 0, scale: 0.4, rotate: 0 }} animate={{ opacity: 0, x: `${bit.x}vw`, y: `${bit.y}vh`, scale: 1.5, rotate: 180 }} transition={{ duration: 1.1, delay: bit.delay, ease: "easeOut" }}>
              {bit.icon}
            </motion.span>
          ))}
        </div>
      ) : null}
    </AnimatePresence>
  );
}

function gradeLabel(grade: Grade) {
  return grade === "K-8" ? "K–8" : `Gr ${grade}`;
}

function interactionLabel(mode: Mode) {
  const labels: Record<Mode, string> = {
    choice: "Tap",
    drag: "Drag",
    slider: "Slide",
    match: "Match",
    path: "Path",
    rotate: "Rotate",
    reorder: "Rearrange",
    swipe: "Swipe",
  };
  return labels[mode];
}

function difficultyBoost(difficulty: Difficulty) {
  return difficulty === "hard" ? 8 : difficulty === "medium" ? 4 : 0;
}

function FilterPills<T extends string>({
  options,
  value,
  onChange,
  render,
}: {
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
  render?: (option: T) => string;
}) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-wider transition ${
              selected
                ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25"
                : "bg-zinc-800/70 text-zinc-300 ring-1 ring-white/10 hover:bg-zinc-700/70"
            }`}
          >
            {render ? render(option) : option}
          </button>
        );
      })}
    </div>
  );
}

function Badge({ tone, children }: { tone: "violet" | "sky" | "amber" | "emerald"; children: ReactNode }) {
  const colors: Record<string, string> = {
    violet: "bg-violet-500/15 text-violet-100 ring-violet-300/30",
    sky: "bg-sky-500/15 text-sky-100 ring-sky-300/30",
    amber: "bg-amber-500/15 text-amber-100 ring-amber-300/30",
    emerald: "bg-emerald-500/15 text-emerald-100 ring-emerald-300/30",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ring-1 ${colors[tone]}`}>
      {children}
    </span>
  );
}

function CategoryCard({ meta, onClick }: { meta: PuzzleMeta; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/75 p-4 text-left shadow-xl ring-1 ring-white/5 transition hover:border-white/20"
    >
      <div className="flex items-start gap-3">
        <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${meta.gradient} text-3xl shadow-lg`}>
          {meta.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-black text-white">{meta.title}</h3>
          <p className="mt-0.5 truncate text-[11px] text-zinc-400">{meta.short}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            <Badge tone="violet">{gradeLabel(meta.grade)}</Badge>
            <Badge tone="sky">{meta.subject}</Badge>
          </div>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-xs leading-snug text-zinc-300">{meta.skill}</p>
      <div className="mt-auto flex items-center justify-between pt-3 text-[11px] text-zinc-500">
        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800/80 px-2 py-0.5 font-bold uppercase tracking-wider ring-1 ring-white/5 text-zinc-300">
          {interactionLabel(meta.interactionHint)}
        </span>
        <span className="inline-flex items-center gap-1">⏱ ~{meta.estMin} min</span>
      </div>
    </motion.button>
  );
}

const GRADE_OPTIONS: readonly GradeFilter[] = ["All", "9", "10", "11", "12", "K-8"];
const SUBJECT_OPTIONS: readonly SubjectFilter[] = [
  "All",
  "Algebra",
  "Geometry",
  "Trigonometry",
  "Precalculus",
  "Calculus",
  "Statistics",
];
const DIFFICULTY_OPTIONS: readonly DifficultyFilter[] = ["All", "easy", "medium", "hard"];

function ProgressBar({ xp }: { xp: number }) {
  const level = Math.floor(xp / LEVEL_XP) + 1;
  const inLevel = xp % LEVEL_XP;
  return (
    <div className="flex items-center gap-2">
      <span className="rounded-lg bg-violet-500/20 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-violet-100 ring-1 ring-violet-300/30">Lv {level}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-800 ring-1 ring-white/10">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400" animate={{ width: `${inLevel}%` }} />
      </div>
      <span className="font-mono text-xs text-zinc-500">{inLevel}/{LEVEL_XP}</span>
    </div>
  );
}

export default function MathPuzzlesPage() {
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [solved, setSolved] = useState(0);
  const [active, setActive] = useState<PuzzleId | null>(null);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [state, setRawState] = useState<PlayState>(() => initialState(null));
  const [result, setResult] = useState<Result>("idle");
  const [hint, setHint] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [daily, setDaily] = useState<PuzzleId>("weightScale");
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>("All");
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>("All");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("All");

  const adaptiveDifficulty = difficultyFor(solved);
  const effectiveDifficulty: Difficulty = difficultyFilter === "All" ? adaptiveDifficulty : difficultyFilter;
  const activeMeta = active ? metaFor(active) : null;
  const setState = (next: Partial<PlayState>) => setRawState((prev) => ({ ...prev, ...next }));

  const visibleMetas = useMemo(
    () =>
      METAS.filter((meta) => {
        if (gradeFilter !== "All" && meta.grade !== gradeFilter) return false;
        if (subjectFilter !== "All" && meta.subject !== subjectFilter) return false;
        return true;
      }),
    [gradeFilter, subjectFilter],
  );

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const progress = JSON.parse(saved) as { xp?: number; streak?: number; solved?: number };
      setXp(progress.xp ?? 0);
      setStreak(progress.streak ?? 0);
      setSolved(progress.solved ?? 0);
    }
    const daySeed = new Date().toISOString().slice(0, 10).split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    setDaily(METAS[daySeed % METAS.length]!.id);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ xp, streak, solved }));
  }, [xp, streak, solved]);

  useEffect(() => {
    if (!confetti) return;
    const timer = window.setTimeout(() => setConfetti(false), 1300);
    return () => window.clearTimeout(timer);
  }, [confetti]);

  const start = useCallback(
    (type: PuzzleId) => {
      const useDifficulty: Difficulty = difficultyFilter === "All" ? difficultyFor(solved) : difficultyFilter;
      const next = makePuzzle(type, useDifficulty);
      setActive(type);
      setPuzzle(next);
      setRawState(initialState(next));
      setResult("idle");
      setHint(false);
    },
    [difficultyFilter, solved],
  );

  const nextPuzzle = useCallback(() => {
    if (!active) return;
    const useDifficulty: Difficulty = difficultyFilter === "All" ? difficultyFor(solved + 1) : difficultyFilter;
    const next = makePuzzle(active, useDifficulty);
    setPuzzle(next);
    setRawState(initialState(next));
    setResult("idle");
    setHint(false);
  }, [active, difficultyFilter, solved]);

  const check = () => {
    if (!puzzle) return;
    if (result === "correct") {
      nextPuzzle();
      return;
    }
    if (result === "wrong") {
      setRawState(initialState(puzzle));
      setResult("idle");
      return;
    }
    const correct = isSolved(puzzle, state);
    setResult(correct ? "correct" : "wrong");
    if (correct) {
      setXp((value) => value + XP_PER_WIN + difficultyBoost(puzzle.difficulty));
      setStreak((value) => value + 1);
      setSolved((value) => value + 1);
      setConfetti(true);
    } else {
      setStreak(0);
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-zinc-100">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute -right-24 top-48 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>
      <Confetti show={confetti} />

      <header className="sticky top-0 z-30 border-b border-white/5 bg-zinc-950/85 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-xl">
        <div className="mx-auto max-w-lg">
          <div className="flex items-center gap-3">
            {active ? (
              <button type="button" onClick={() => setActive(null)} className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-xl">‹</button>
            ) : (
              <span className="grid h-10 w-10 place-items-center rounded-full bg-violet-500/20 text-xl">🧠</span>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-black tracking-tight">{activeMeta?.title ?? "Math Puzzles"}</h1>
              <p className="truncate text-xs text-zinc-400">{activeMeta?.short ?? "Visual reasoning playground"}</p>
            </div>
            <span className="rounded-full bg-rose-500/15 px-3 py-1.5 text-sm font-black text-rose-100 ring-1 ring-rose-300/30">🔥 {streak}</span>
            <span className="rounded-full bg-amber-500/15 px-3 py-1.5 text-sm font-black text-amber-100 ring-1 ring-amber-300/30">⚡ {xp}</span>
          </div>
          <div className="mt-3"><ProgressBar xp={xp} /></div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-lg flex-1 px-4 pb-36 pt-5">
        <AnimatePresence mode="wait">
          {!active ? (
            <motion.section key="selector" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="mb-5 rounded-3xl border border-amber-300/20 bg-amber-400/10 p-4 ring-1 ring-white/5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-200">Daily Challenge</p>
                    <p className="mt-1 text-sm text-zinc-300">One fresh puzzle for today. Beat it to protect your streak.</p>
                  </div>
                  <button type="button" onClick={() => start(daily)} className="rounded-2xl bg-amber-400 px-4 py-3 text-sm font-black text-amber-950 shadow-lg shadow-amber-500/20">Play</button>
                </div>
              </div>

              <div className="mb-5 space-y-3 rounded-3xl border border-white/10 bg-zinc-900/60 p-4 shadow-lg ring-1 ring-white/5">
                <div>
                  <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Grade</p>
                  <FilterPills
                    options={GRADE_OPTIONS}
                    value={gradeFilter}
                    onChange={setGradeFilter}
                    render={(option) => (option === "All" ? "All" : option === "K-8" ? "K–8" : `Grade ${option}`)}
                  />
                </div>
                <div>
                  <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Subject</p>
                  <FilterPills options={SUBJECT_OPTIONS} value={subjectFilter} onChange={setSubjectFilter} />
                </div>
                <div>
                  <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Difficulty</p>
                  <FilterPills
                    options={DIFFICULTY_OPTIONS}
                    value={difficultyFilter}
                    onChange={setDifficultyFilter}
                    render={(option) =>
                      option === "All" ? `Adaptive · ${adaptiveDifficulty}` : option.charAt(0).toUpperCase() + option.slice(1)
                    }
                  />
                </div>
              </div>

              <div className="mb-4 flex items-end justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-200">Puzzle Arcade</p>
                  <h2 className="mt-1 text-2xl font-black tracking-tight">Choose your world</h2>
                </div>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-zinc-300">{visibleMetas.length} puzzles</span>
              </div>

              {visibleMetas.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 text-center text-sm text-zinc-400 ring-1 ring-white/5">
                  No puzzles match these filters yet. Try widening the grade or subject.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {visibleMetas.map((meta, i) => (
                    <motion.div
                      key={meta.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.01, 0.3) }}
                    >
                      <CategoryCard meta={meta} onClick={() => start(meta.id)} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.section>
          ) : puzzle ? (
            <motion.section key={puzzle.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-5">
              <div className="text-center">
                <span className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${activeMeta?.gradient ?? "from-violet-400 to-fuchsia-600"} px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg`}>{puzzle.emoji} {puzzle.difficulty}</span>
                <h2 className="mt-3 text-2xl font-black leading-tight tracking-tight">{puzzle.prompt}</h2>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-zinc-900/55 p-4 shadow-2xl ring-1 ring-white/5">
                <VisualCard visual={puzzle.visual} rotation={state.rotation} />
              </div>

              <Interaction puzzle={puzzle} state={state} setState={setState} locked={result === "correct"} />

              <button type="button" onClick={() => setHint((open) => !open)} className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm font-bold text-zinc-300 ring-1 ring-white/10">{hint ? "Hide hint" : "Need a hint?"}</button>

              <AnimatePresence>
                {hint ? <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="rounded-2xl border border-sky-300/20 bg-sky-500/10 p-4 text-sm text-sky-100">{puzzle.hint}</motion.div> : null}
              </AnimatePresence>

              <AnimatePresence>
                {result !== "idle" ? (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }} className={`rounded-3xl border p-4 text-sm leading-relaxed ${result === "correct" ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-50" : "border-rose-300/30 bg-rose-500/10 text-rose-50"}`}>
                    <p className="text-base font-black">{result === "correct" ? "Beautiful solve." : "Almost. Try a different move."}</p>
                    <p className="mt-1.5 text-zinc-200">{puzzle.explanation}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.section>
          ) : null}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {active && puzzle ? (
          <motion.div key="bottom-action" initial={{ y: 96 }} animate={{ y: 0 }} exit={{ y: 96 }} className="fixed inset-x-0 bottom-0 z-40 border-t border-white/5 bg-zinc-950/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-xl">
            <div className="mx-auto max-w-lg">
              <button type="button" disabled={!canCheck(puzzle, state)} onClick={check} className={`w-full rounded-2xl py-4 text-base font-black uppercase tracking-[0.16em] text-white shadow-xl transition disabled:cursor-not-allowed disabled:opacity-40 ${result === "correct" ? "bg-emerald-500 shadow-emerald-500/30" : result === "wrong" ? "bg-rose-500 shadow-rose-500/30" : "bg-sky-500 shadow-sky-500/30"}`}>
                {result === "correct" ? "Next Puzzle" : result === "wrong" ? "Try Again" : "Check"}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
