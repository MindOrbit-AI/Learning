"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useCallback, useEffect, useMemo, useState, type DragEvent, type ReactNode, type TouchEvent } from "react";

type Difficulty = "easy" | "medium" | "hard";
type DifficultyFilter = Difficulty | "All";
type Result = "idle" | "correct" | "wrong";
type Mode =
  | "choice"
  | "drag"
  | "slider"
  | "match"
  | "path"
  | "rotate"
  | "reorder"
  | "swipe"
  | "numpad"
  | "sort";
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
  | "Logic"
  | "Probability"
  | "NumberTheory"
  | "FinancialMath"
  | "Biology"
  | "Chemistry"
  | "Physics"
  | "EarthScience"
  | "GeneralScience"
  | "Astronomy"
  | "Genetics"
  | "Ecology"
  | "Anatomy"
  | "EnvironmentalScience"
  | "CodingLogic"
  | "Algorithms"
  | "AIML"
  | "Cybersecurity"
  | "Databases"
  | "RoboticsProgramming"
  | "WebDev"
  | "APIs"
  | "Networks"
  | "DigitalSystems"
  | "MechanicalEng"
  | "ElectricalEng"
  | "CivilEng"
  | "AerospaceEng"
  | "Robotics"
  | "StructuralDesign"
  | "MaterialsScience"
  | "Circuits"
  | "SystemsEng"
  | "DesignThinking";
type SubjectFilter = Subject | "All";

type Domain = "Math" | "Science" | "Technology" | "Engineering";
type DomainFilter = Domain | "All";
type LockFilter = "All" | "Unlocked" | "Locked";
type CatalogView = "grid" | "tree";

type GameMode =
  | "practice"
  | "timed"
  | "daily"
  | "streak"
  | "boss"
  | "mistakes"
  | "skillTree"
  | "race"
  | "survival"
  | "mastery";

type InteractionTypeKey =
  | "Multiple choice"
  | "Drag and drop"
  | "Slider"
  | "Graph plot"
  | "Matching cards"
  | "Order steps"
  | "Fill in number"
  | "Drawing"
  | "Rotate"
  | "Build with tiles"
  | "Region select"
  | "Move on grid"
  | "Balance"
  | "Unlock"
  | "Sort categories"
  | "Connect pathways"
  | "Sequence processes"
  | "Build systems"
  | "Code Trace"
  | "Circuit Builder"
  | "Design Challenge"
  | "Simulation";

type InteractionFilter = InteractionTypeKey | "All";

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
  | "hypothesisTest"
  | "equationMaze"
  | "variableLock"
  | "expressionSimplifier"
  | "likeTermSorter"
  | "functionTableBuilder"
  | "domainRangePicker"
  | "piecewiseSwitch"
  | "absValueDistance"
  | "inequalityNumberLine"
  | "algebraTiles"
  | "angleDetective"
  | "parallelTransversal"
  | "polygonAngles"
  | "similarityMap"
  | "arcSector"
  | "netFolding"
  | "volumeFill"
  | "surfaceArea"
  | "coordTransform"
  | "proofSequence"
  | "unitCircleMemory"
  | "trigRatioFinder"
  | "sinCosWave"
  | "referenceAngle"
  | "trigIdentity"
  | "inverseTrig"
  | "radianDegree"
  | "triangleHeight"
  | "ferrisWheel"
  | "harmonicMotion"
  | "compositionMachine"
  | "inverseMirror"
  | "endBehaviorSort"
  | "rationalGraph"
  | "expLogMatch"
  | "sequenceSum"
  | "conicSorter"
  | "dotProduct"
  | "matrixGrid"
  | "parametricMotion"
  | "limitTable"
  | "continuityRepair"
  | "derivativeRule"
  | "chainRule"
  | "productQuotient"
  | "criticalPoint"
  | "curveSketch"
  | "integralMatch"
  | "areaBetween"
  | "slopeField"
  | "sampleSpace"
  | "probTree"
  | "expectedValue"
  | "binomialSpinner"
  | "normalShade"
  | "stdDevBalancer"
  | "correlationMatch"
  | "residualPlot"
  | "samplingBias"
  | "abTest"
  | "cellOrganelle"
  | "photosynthesisFlow"
  | "foodWeb"
  | "dnaBasePair"
  | "mitosisStage"
  | "bodySystemPath"
  | "enzymeLockKey"
  | "punnettSquare"
  | "ecosystemBalance"
  | "evolutionMatch"
  | "periodicHunt"
  | "elementSymbol"
  | "moleculeBuilder"
  | "equationBalance"
  | "phScaleSort"
  | "atomicStructure"
  | "bondTypeMatch"
  | "reactionSort"
  | "stoichRecipe"
  | "electronShell"
  | "forceVector"
  | "motionGraph"
  | "energyChain"
  | "circuitBuilder"
  | "gravityDrop"
  | "waveFrequency"
  | "opticsReflect"
  | "workPower"
  | "momentumCollide"
  | "simpleMachines"
  | "rockCycle"
  | "plateTectonics"
  | "weatherFront"
  | "waterCycle"
  | "climateDetect"
  | "earthLayers"
  | "moonPhase"
  | "solarOrbit"
  | "disasterRisk"
  | "fossilTimeline"
  | "methodEscape"
  | "labSafety"
  | "variableControl"
  | "dataGraph"
  | "hypothesisBuild"
  | "experimentDesign"
  | "measureUnit"
  | "obsInference"
  | "evidenceRank"
  | "claimEvidence"
  | "codeTrace"
  | "binaryConverter"
  | "algorithmSorter"
  | "debugFunction"
  | "apiFlow"
  | "neuralNetwork"
  | "phishingSort"
  | "queryMatch"
  | "robotCommand"
  | "logicGate"
  | "bridgeStrength"
  | "gearRatio"
  | "pulleyForce"
  | "structuralLoad"
  | "waterFlowSystem"
  | "rocketLaunch"
  | "robotArmAngle"
  | "circuitCompletion"
  | "materialStrength"
  | "designConstraint";

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
  | "bars"
  | "cell"
  | "molecule"
  | "equation"
  | "vectors"
  | "rockCycle"
  | "code"
  | "circuit"
  | "gears"
  | "binary"
  | "truthTable";

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
  displayInteraction?: InteractionTypeKey;
  xpRequired?: number;
  isBoss?: boolean;
  isMasteryTest?: boolean;
  prerequisites?: PuzzleId[];
  unlockMessage?: string;
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
  atoms?: { symbol: string; count: number; color: string }[];
  equation?: { reactants: string[]; products: string[]; coefficients?: number[] };
  vectors?: { label: string; magnitude: number; direction: "left" | "right" | "up" | "down" }[];
  organelles?: { name: string; emoji: string }[];
  stages?: string[];
  code?: { lines: string[]; highlight?: number };
  circuit?: { nodes: string[]; closed?: boolean };
  gears?: { teeth: number; label?: string }[];
  bits?: number[];
  truthTable?: { gate: string; rows: { a: number; b?: number; out: number }[] };
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
  hints?: string[];
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
  numpadAnswer?: string;
  numpadAllowDecimal?: boolean;
  numpadAllowMinus?: boolean;
  sortItems?: { label: string; category: string }[];
  sortCategories?: string[];
  xpReward?: number;
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
  numpad: string;
  sort: Record<string, string>;
  pendingItem: string | null;
}

const STORAGE_KEY = "mindorbit.stem-puzzles.arcade.v3";
const XP_PER_WIN = 14;
const LEVEL_XP = 100;
const MAX_ENERGY = 5;
const ENERGY_REGEN_MS = 5 * 60 * 1000;

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
  displayInteraction?: InteractionTypeKey,
): PuzzleMeta {
  return { id, title, short, emoji, gradient, grade, subject, skill, estMin, interactionHint, displayInteraction };
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
  m("equationMaze", "Equation Maze", "Trace the right path", "🌀", "from-violet-400 to-blue-700", "9", "Algebra", "Solve multi-step equations", 4, "path", "Drawing"),
  m("variableLock", "Variable Lock Puzzle", "Crack the variable", "🔒", "from-amber-400 to-rose-700", "9", "Algebra", "Solve for x with a numpad", 3, "numpad", "Unlock"),
  m("expressionSimplifier", "Expression Simplifier", "Reduce the expression", "✂️", "from-emerald-400 to-cyan-700", "9", "Algebra", "Simplify expressions", 3, "choice"),
  m("likeTermSorter", "Like-Term Sorter", "Sort the like terms", "🗂️", "from-sky-400 to-violet-700", "9", "Algebra", "Combine like terms", 3, "sort"),
  m("functionTableBuilder", "Function Table Builder", "Drop the right outputs", "📋", "from-fuchsia-400 to-pink-700", "9", "Algebra", "Evaluate functions", 4, "drag", "Build with tiles"),
  m("domainRangePicker", "Domain & Range Picker", "Spot domain or range", "🎯", "from-rose-400 to-amber-700", "10", "Algebra", "Find domain and range", 4, "choice", "Region select"),
  m("piecewiseSwitch", "Piecewise Function Switchboard", "Pick the right piece", "🔀", "from-orange-400 to-rose-700", "11", "Algebra", "Evaluate piecewise functions", 4, "choice"),
  m("absValueDistance", "Absolute Value Distance", "Measure the distance", "📏", "from-cyan-400 to-blue-700", "9", "Algebra", "Compute |a − b|", 3, "numpad", "Fill in number"),
  m("inequalityNumberLine", "Inequality Number Line Escape", "Slide to safe zone", "🚪", "from-amber-400 to-orange-700", "9", "Algebra", "Graph inequalities", 3, "slider"),
  m("algebraTiles", "Algebra Tile Builder", "Build the expression", "🧱", "from-emerald-300 to-emerald-700", "9", "Algebra", "Visualize x and constants", 4, "drag", "Build with tiles"),
  m("angleDetective", "Angle Relationship Detective", "Find the missing angle", "🕵️", "from-amber-300 to-amber-700", "9", "Geometry", "Apply angle relationships", 3, "numpad", "Fill in number"),
  m("parallelTransversal", "Parallel Lines Transversal", "Find the alternate angle", "🔀", "from-blue-400 to-violet-700", "9", "Geometry", "Parallel lines theorems", 4, "choice"),
  m("polygonAngles", "Polygon Interior Angle Builder", "Sum the polygon angles", "🛡️", "from-emerald-300 to-teal-700", "9", "Geometry", "Use (n−2)·180", 3, "numpad", "Fill in number"),
  m("similarityMap", "Similarity Scale Map", "Scale the missing side", "🗺️", "from-sky-300 to-indigo-700", "10", "Geometry", "Apply similarity ratios", 4, "numpad", "Fill in number"),
  m("arcSector", "Circle Arc & Sector Puzzle", "Find the arc length", "🥧", "from-rose-300 to-pink-700", "10", "Geometry", "Compute arcs and sectors", 4, "numpad", "Fill in number"),
  m("netFolding", "3D Net Folding Puzzle", "Match the folded shape", "📦", "from-fuchsia-400 to-purple-700", "10", "Geometry", "Visualize nets and solids", 4, "rotate"),
  m("volumeFill", "Volume Fill Challenge", "Fill to the target", "🧊", "from-sky-300 to-cyan-700", "10", "Geometry", "Compute prism volume", 4, "numpad", "Fill in number"),
  m("surfaceArea", "Surface Area Builder", "Wrap the surface", "🎁", "from-emerald-400 to-green-700", "10", "Geometry", "Compute surface area", 4, "numpad", "Fill in number"),
  m("coordTransform", "Coordinate Transformation Lab", "Apply the rule", "🧭", "from-violet-300 to-fuchsia-700", "10", "Geometry", "Translate / rotate / reflect", 4, "choice", "Move on grid"),
  m("proofSequence", "Proof Sequence Builder", "Order the proof", "🪜", "from-amber-300 to-orange-700", "10", "Geometry", "Order proof steps", 5, "reorder", "Order steps"),
  m("unitCircleMemory", "Unit Circle Memory Map", "Match the angle", "🎯", "from-fuchsia-400 to-pink-700", "11", "Trigonometry", "Recall unit circle values", 4, "match", "Matching cards"),
  m("trigRatioFinder", "Trig Ratio Finder", "Pick sin / cos / tan", "📐", "from-amber-400 to-rose-700", "10", "Trigonometry", "Identify trig ratios", 3, "choice"),
  m("sinCosWave", "Sin/Cos Wave Matcher", "Tune the amplitude", "🌊", "from-sky-400 to-cyan-700", "11", "Trigonometry", "Identify sine and cosine waves", 4, "slider"),
  m("referenceAngle", "Reference Angle Puzzle", "Reflect into Q1", "🪞", "from-violet-400 to-indigo-700", "11", "Trigonometry", "Find reference angles", 3, "numpad", "Fill in number"),
  m("trigIdentity", "Trig Identity Match", "Pair the identity", "🧮", "from-cyan-300 to-blue-700", "11", "Trigonometry", "Apply trig identities", 4, "match", "Matching cards"),
  m("inverseTrig", "Inverse Trig Target", "Find the angle", "🎯", "from-amber-300 to-pink-700", "11", "Trigonometry", "Evaluate inverse trig", 4, "numpad", "Fill in number"),
  m("radianDegree", "Radian-Degree Converter", "Convert with π", "🔄", "from-sky-300 to-violet-700", "11", "Trigonometry", "Convert radian and degree", 3, "numpad", "Fill in number"),
  m("triangleHeight", "Triangle Height Estimator", "Find the height", "🗼", "from-emerald-300 to-green-700", "11", "Trigonometry", "Use right-triangle trig", 4, "numpad", "Fill in number"),
  m("ferrisWheel", "Ferris Wheel Function", "Read the wheel height", "🎡", "from-pink-400 to-rose-700", "11", "Trigonometry", "Model with sine functions", 4, "slider"),
  m("harmonicMotion", "Harmonic Motion Simulator", "Tune the oscillator", "🌗", "from-indigo-400 to-violet-700", "12", "Trigonometry", "Model harmonic motion", 5, "slider"),
  m("compositionMachine", "Function Composition Machine", "Compose f and g", "⚙️", "from-sky-400 to-indigo-700", "11", "Precalculus", "Evaluate (f ∘ g)(x)", 4, "choice"),
  m("inverseMirror", "Inverse Function Mirror", "Match function and inverse", "🪞", "from-fuchsia-400 to-purple-700", "11", "Precalculus", "Find inverse functions", 4, "match", "Matching cards"),
  m("endBehaviorSort", "Polynomial End Behavior Sort", "Sort by end behavior", "📈", "from-emerald-400 to-teal-700", "11", "Precalculus", "Classify polynomial growth", 4, "sort", "Sort categories"),
  m("rationalGraph", "Rational Graph Builder", "Pick the right region", "📊", "from-amber-300 to-rose-700", "11", "Precalculus", "Graph rational functions", 5, "choice", "Region select"),
  m("expLogMatch", "Exponential vs Log Match", "Pair the inverse", "🔁", "from-yellow-300 to-amber-700", "11", "Precalculus", "Connect exp and log", 4, "match", "Matching cards"),
  m("sequenceSum", "Sequence Sum Race", "Sum the series", "🏁", "from-cyan-300 to-blue-700", "11", "Precalculus", "Compute series sums", 4, "numpad", "Fill in number"),
  m("conicSorter", "Conic Equation Sorter", "Sort the conics", "🥚", "from-orange-300 to-rose-700", "11", "Precalculus", "Classify conic equations", 4, "sort", "Sort categories"),
  m("dotProduct", "Vector Dot Product Target", "Compute a · b", "🧭", "from-emerald-300 to-cyan-700", "11", "Precalculus", "Compute dot products", 4, "numpad", "Fill in number"),
  m("matrixGrid", "Matrix Grid Transformer", "Apply the matrix", "🔢", "from-violet-300 to-indigo-700", "11", "Precalculus", "2×2 matrix transforms", 5, "choice"),
  m("parametricMotion", "Parametric Motion Puzzle", "Draw the path", "🌀", "from-fuchsia-300 to-pink-700", "12", "Precalculus", "Trace parametric curves", 5, "path", "Drawing"),
  m("limitTable", "Limit Table Predictor", "Predict the limit", "🔭", "from-indigo-400 to-violet-700", "12", "Calculus", "Predict limits from tables", 4, "choice"),
  m("continuityRepair", "Continuity Repair Puzzle", "Fix the hole", "🩹", "from-rose-300 to-red-700", "12", "Calculus", "Spot discontinuities", 4, "choice", "Region select"),
  m("derivativeRule", "Derivative Rule Match", "Pair function with derivative", "🔗", "from-sky-400 to-blue-700", "12", "Calculus", "Apply derivative rules", 4, "match", "Matching cards"),
  m("chainRule", "Chain Rule Machine", "Differentiate the chain", "⛓️", "from-violet-300 to-fuchsia-700", "12", "Calculus", "Apply the chain rule", 5, "choice"),
  m("productQuotient", "Product / Quotient Rule Sort", "Sort by rule", "🪺", "from-amber-300 to-orange-700", "12", "Calculus", "Choose product or quotient", 4, "sort", "Sort categories"),
  m("criticalPoint", "Critical Point Finder", "Spot the critical x", "📍", "from-emerald-400 to-green-700", "12", "Calculus", "Find critical points", 4, "choice"),
  m("curveSketch", "Curve Sketch Builder", "Sketch the curve", "✏️", "from-cyan-400 to-teal-700", "12", "Calculus", "Sketch from f′ and f″", 5, "path", "Drawing"),
  m("integralMatch", "Integral Match Game", "Match integral to area", "🧮", "from-rose-300 to-pink-700", "12", "Calculus", "Connect integrals and areas", 5, "match", "Matching cards"),
  m("areaBetween", "Area Between Curves Builder", "Stack the bands", "🟦", "from-blue-300 to-indigo-700", "12", "Calculus", "Area between curves", 5, "drag", "Build with tiles"),
  m("slopeField", "Slope Field Direction Puzzle", "Aim the slope arrow", "🧭", "from-violet-400 to-indigo-700", "12", "Calculus", "Read slope fields", 5, "rotate"),
  m("sampleSpace", "Sample Space Builder", "Drop into outcomes", "🎲", "from-rose-400 to-amber-700", "9", "Statistics", "List sample spaces", 3, "drag", "Build with tiles"),
  m("probTree", "Probability Tree Constructor", "Trace the branch", "🌳", "from-emerald-400 to-green-700", "10", "Statistics", "Use probability trees", 4, "path", "Drawing"),
  m("expectedValue", "Expected Value Casino", "Compute the EV", "🎰", "from-amber-300 to-rose-700", "11", "Statistics", "Compute expected values", 4, "numpad", "Fill in number"),
  m("binomialSpinner", "Binomial Probability Spinner", "Tune the chance", "🎯", "from-fuchsia-400 to-pink-700", "11", "Statistics", "Binomial probabilities", 4, "slider"),
  m("normalShade", "Normal Distribution Shade", "Select the tail", "🔔", "from-cyan-400 to-blue-700", "12", "Statistics", "Read normal curves", 4, "choice", "Region select"),
  m("stdDevBalancer", "Standard Deviation Balancer", "Balance the spread", "⚖️", "from-violet-300 to-fuchsia-700", "11", "Statistics", "Reason about std. dev.", 4, "slider"),
  m("correlationMatch", "Correlation Match", "Pair r with the plot", "🔗", "from-emerald-300 to-cyan-700", "11", "Statistics", "Estimate correlation r", 4, "match", "Matching cards"),
  m("residualPlot", "Residual Plot Detective", "Spot the bias", "🔍", "from-amber-300 to-rose-700", "12", "Statistics", "Read residual plots", 4, "choice"),
  m("samplingBias", "Sampling Bias Finder", "Sort biased vs fair", "⚖️", "from-orange-300 to-rose-700", "12", "Statistics", "Recognize sampling bias", 4, "sort", "Sort categories"),
  m("abTest", "A/B Test Decision Game", "Pick the winning variant", "🅰️", "from-sky-400 to-blue-700", "12", "Statistics", "Compare A/B test results", 5, "choice"),
  s("cellOrganelle", "Cell Organelle Match", "Pair organelles with jobs", "🧫", "from-emerald-400 to-green-700", "9", "Biology", "Identify cell organelles", 3, "match", { displayInteraction: "Matching cards", xpRequired: 0, unlockMessage: "The cell awaits — pair each part with its role." }),
  s("photosynthesisFlow", "Photosynthesis Flow Puzzle", "Trace the energy", "🌿", "from-emerald-300 to-lime-700", "9", "Biology", "Trace light → glucose", 4, "path", { displayInteraction: "Drawing", xpRequired: 0 }),
  s("foodWeb", "Food Web Builder", "Connect predators & prey", "🦅", "from-amber-300 to-orange-700", "9", "Biology", "Build food webs", 4, "drag", { displayInteraction: "Connect pathways", xpRequired: 30 }),
  s("dnaBasePair", "DNA Base Pair Match", "A-T, G-C", "🧬", "from-rose-300 to-fuchsia-700", "10", "Biology", "Pair DNA bases", 3, "match", { displayInteraction: "Matching cards", xpRequired: 80 }),
  s("mitosisStage", "Mitosis Stage Sort", "Order PMAT", "🪡", "from-violet-300 to-purple-700", "10", "Biology", "Order mitosis stages", 4, "reorder", { displayInteraction: "Sequence processes", xpRequired: 100 }),
  s("bodySystemPath", "Body System Pathway", "Trace circulation", "❤️", "from-rose-400 to-red-700", "10", "Biology", "Trace body pathways", 4, "path", { displayInteraction: "Connect pathways", xpRequired: 110 }),
  s("enzymeLockKey", "Enzyme Lock & Key", "Fit the substrate", "🔑", "from-amber-300 to-yellow-700", "11", "Biology", "Reason about enzymes", 4, "match", { displayInteraction: "Matching cards", xpRequired: 240 }),
  s("punnettSquare", "Punnett Square", "Predict inheritance", "🟨", "from-yellow-300 to-amber-700", "11", "Biology", "Use Punnett squares", 4, "choice", { displayInteraction: "Multiple choice", xpRequired: 260 }),
  s("ecosystemBalance", "Ecosystem Balance", "Tune populations", "🌳", "from-green-300 to-emerald-700", "11", "Biology", "Balance ecosystems", 5, "slider", { displayInteraction: "Slider", xpRequired: 280 }),
  s("evolutionMatch", "Evolution Adaptation Match", "Pair beak to food", "🦜", "from-orange-300 to-rose-700", "12", "Biology", "Connect adaptations", 5, "match", { displayInteraction: "Matching cards", xpRequired: 480 }),
  s("periodicHunt", "Periodic Table Hunt", "Find the element", "🧪", "from-cyan-300 to-blue-700", "9", "Chemistry", "Read the periodic table", 3, "choice", { displayInteraction: "Multiple choice", xpRequired: 0 }),
  s("elementSymbol", "Element Symbol Match", "Pair name & symbol", "⚛️", "from-sky-300 to-indigo-700", "9", "Chemistry", "Recall element symbols", 3, "match", { displayInteraction: "Matching cards", xpRequired: 30 }),
  s("moleculeBuilder", "Molecule Builder", "Snap atoms together", "🧊", "from-violet-300 to-fuchsia-700", "9", "Chemistry", "Build simple molecules", 4, "choice", { displayInteraction: "Build with tiles", xpRequired: 50, unlockMessage: "Lab unlocked: snap atoms together." }),
  s("equationBalance", "Chemical Equation Balancer", "Balance the coefficients", "⚖️", "from-emerald-300 to-cyan-700", "10", "Chemistry", "Balance equations", 4, "choice", { displayInteraction: "Balance", xpRequired: 110 }),
  s("phScaleSort", "pH Scale Sort", "Acid · Neutral · Base", "🧴", "from-rose-300 to-pink-700", "10", "Chemistry", "Sort by pH", 3, "sort", { displayInteraction: "Sort categories", xpRequired: 120 }),
  s("atomicStructure", "Atomic Structure Builder", "Place protons & electrons", "🪐", "from-fuchsia-300 to-purple-700", "10", "Chemistry", "Build atomic structure", 4, "drag", { displayInteraction: "Build with tiles", xpRequired: 130 }),
  s("bondTypeMatch", "Bond Type Match", "Ionic · Covalent · Metallic", "🧲", "from-amber-300 to-rose-700", "11", "Chemistry", "Classify chemical bonds", 4, "match", { displayInteraction: "Matching cards", xpRequired: 260 }),
  s("reactionSort", "Reaction Type Sort", "Synthesis / decomp / etc.", "🧪", "from-emerald-300 to-teal-700", "11", "Chemistry", "Classify reactions", 4, "sort", { displayInteraction: "Sort categories", xpRequired: 280 }),
  s("stoichRecipe", "Stoichiometry Recipe", "Scale the recipe", "🍰", "from-orange-300 to-rose-700", "12", "Chemistry", "Apply stoichiometry", 5, "numpad", { displayInteraction: "Fill in number", xpRequired: 500 }),
  s("electronShell", "Electron Shell Fill", "Fill 2, 8, 18…", "🔆", "from-yellow-300 to-orange-700", "11", "Chemistry", "Fill electron shells", 4, "drag", { displayInteraction: "Build with tiles", xpRequired: 300 }),
  s("forceVector", "Force Vector Puzzle", "Find the net force", "🧲", "from-cyan-300 to-blue-700", "9", "Physics", "Add force vectors", 4, "choice", { displayInteraction: "Multiple choice", xpRequired: 0, unlockMessage: "Physics lab unlocked: add the forces." }),
  s("motionGraph", "Motion Graph Match", "Pair graph to motion", "📈", "from-sky-300 to-indigo-700", "10", "Physics", "Read motion graphs", 4, "match", { displayInteraction: "Matching cards", xpRequired: 110 }),
  s("energyChain", "Energy Transformation Chain", "Sequence the transfer", "🔋", "from-amber-300 to-orange-700", "10", "Physics", "Trace energy transfers", 4, "reorder", { displayInteraction: "Sequence processes", xpRequired: 120 }),
  s("circuitBuilder", "Circuit Builder", "Light up the bulb", "💡", "from-yellow-300 to-amber-700", "11", "Physics", "Wire simple circuits", 5, "drag", { displayInteraction: "Build systems", xpRequired: 280 }),
  s("gravityDrop", "Gravity Drop Simulator", "Predict the fall", "🍎", "from-emerald-300 to-cyan-700", "10", "Physics", "Apply g = 9.8 m/s²", 4, "slider", { displayInteraction: "Slider", xpRequired: 130 }),
  s("waveFrequency", "Wave Frequency Matcher", "Tune f and λ", "🌊", "from-cyan-300 to-blue-700", "11", "Physics", "Relate f, λ, v", 4, "slider", { displayInteraction: "Slider", xpRequired: 300 }),
  s("opticsReflect", "Optics Reflection Puzzle", "Bounce the laser", "🔦", "from-violet-300 to-indigo-700", "11", "Physics", "Apply law of reflection", 4, "rotate", { displayInteraction: "Rotate", xpRequired: 310 }),
  s("workPower", "Work & Power Challenge", "W = F · d, P = W/t", "💪", "from-rose-300 to-orange-700", "11", "Physics", "Compute work and power", 4, "numpad", { displayInteraction: "Fill in number", xpRequired: 320 }),
  s("momentumCollide", "Momentum Collision Puzzle", "Conserve momentum", "💥", "from-amber-300 to-red-700", "12", "Physics", "Solve collisions", 5, "numpad", { displayInteraction: "Fill in number", xpRequired: 500 }),
  s("simpleMachines", "Simple Machines Puzzle", "Pick a mechanical advantage", "⚙️", "from-zinc-300 to-zinc-700", "9", "Physics", "Identify simple machines", 3, "choice", { displayInteraction: "Multiple choice", xpRequired: 30 }),
  s("rockCycle", "Rock Cycle Builder", "Sequence the cycle", "🪨", "from-orange-300 to-stone-700", "9", "EarthScience", "Order the rock cycle", 4, "reorder", { displayInteraction: "Sequence processes", xpRequired: 0, unlockMessage: "Geology unlocked: order the rock cycle." }),
  s("plateTectonics", "Plate Tectonics Map", "Sort the boundaries", "🗺️", "from-amber-300 to-orange-700", "9", "EarthScience", "Classify plate boundaries", 4, "sort", { displayInteraction: "Sort categories", xpRequired: 30 }),
  s("weatherFront", "Weather Front Match", "Warm · Cold · Stationary", "🌦️", "from-cyan-300 to-sky-700", "10", "EarthScience", "Identify weather fronts", 4, "match", { displayInteraction: "Matching cards", xpRequired: 110 }),
  s("waterCycle", "Water Cycle Flow", "Trace evaporation → rain", "💧", "from-blue-300 to-cyan-700", "9", "EarthScience", "Trace the water cycle", 4, "path", { displayInteraction: "Drawing", xpRequired: 40 }),
  s("climateDetect", "Climate Data Detective", "Spot the trend", "🌡️", "from-rose-300 to-amber-700", "11", "EarthScience", "Interpret climate data", 4, "choice", { displayInteraction: "Multiple choice", xpRequired: 280 }),
  s("earthLayers", "Earth Layer Sort", "Crust → Core", "🌍", "from-emerald-300 to-cyan-700", "9", "EarthScience", "Order Earth's layers", 3, "reorder", { displayInteraction: "Sequence processes", xpRequired: 40 }),
  s("moonPhase", "Moon Phase Sequencer", "Order the phases", "🌙", "from-zinc-300 to-violet-700", "10", "EarthScience", "Sequence moon phases", 4, "reorder", { displayInteraction: "Sequence processes", xpRequired: 120 }),
  s("solarOrbit", "Solar System Orbit Puzzle", "Order the planets", "🪐", "from-indigo-300 to-violet-700", "9", "EarthScience", "Order the planets", 3, "reorder", { displayInteraction: "Sequence processes", xpRequired: 40 }),
  s("disasterRisk", "Natural Disaster Risk Map", "Classify the risk", "🌪️", "from-orange-300 to-red-700", "11", "EarthScience", "Map disaster risk", 4, "sort", { displayInteraction: "Sort categories", xpRequired: 300 }),
  s("fossilTimeline", "Fossil Timeline Puzzle", "Order the eras", "🦖", "from-amber-300 to-orange-700", "11", "EarthScience", "Order geologic time", 4, "reorder", { displayInteraction: "Sequence processes", xpRequired: 320 }),
  s("methodEscape", "Scientific Method Escape Room", "Unlock by reasoning", "🚪", "from-violet-300 to-fuchsia-700", "9", "GeneralScience", "Apply the scientific method", 5, "reorder", { displayInteraction: "Sequence processes", xpRequired: 80, isBoss: true, unlockMessage: "Boss room unlocked — only careful reasoners get out." }),
  s("labSafety", "Lab Safety Sort", "Safe vs unsafe", "🧯", "from-rose-300 to-red-700", "9", "GeneralScience", "Spot safety issues", 3, "sort", { displayInteraction: "Sort categories", xpRequired: 0 }),
  s("variableControl", "Variable Control Puzzle", "Pick the controlled var", "🧪", "from-emerald-300 to-cyan-700", "9", "GeneralScience", "Identify variables", 3, "choice", { displayInteraction: "Multiple choice", xpRequired: 20 }),
  s("dataGraph", "Data Graph Detective", "Read the data story", "📊", "from-sky-300 to-blue-700", "10", "GeneralScience", "Read data graphs", 4, "choice", { displayInteraction: "Multiple choice", xpRequired: 110 }),
  s("hypothesisBuild", "Hypothesis Builder", "Choose the best hypothesis", "💡", "from-amber-300 to-yellow-700", "9", "GeneralScience", "Frame hypotheses", 3, "choice", { displayInteraction: "Multiple choice", xpRequired: 20 }),
  s("experimentDesign", "Experiment Design Challenge", "Design a fair test", "🧬", "from-violet-300 to-indigo-700", "10", "GeneralScience", "Design experiments", 5, "reorder", { displayInteraction: "Sequence processes", xpRequired: 130 }),
  s("measureUnit", "Measurement Unit Match", "SI to quantity", "📏", "from-cyan-300 to-blue-700", "9", "GeneralScience", "Match SI units", 3, "match", { displayInteraction: "Matching cards", xpRequired: 0 }),
  s("obsInference", "Observation vs Inference", "Sort the claims", "🔭", "from-fuchsia-300 to-purple-700", "10", "GeneralScience", "Sort observation/inference", 3, "sort", { displayInteraction: "Sort categories", xpRequired: 110 }),
  s("evidenceRank", "Evidence Ranking Puzzle", "Rank the evidence", "🥇", "from-amber-300 to-orange-700", "11", "GeneralScience", "Rank evidence quality", 4, "reorder", { displayInteraction: "Sequence processes", xpRequired: 300 }),
  s("claimEvidence", "Claim-Evidence-Reasoning Builder", "Assemble the CER", "📝", "from-emerald-300 to-cyan-700", "12", "GeneralScience", "Build CER arguments", 5, "reorder", { displayInteraction: "Sequence processes", xpRequired: 500, isMasteryTest: true, unlockMessage: "Mastery test unlocked: claim, evidence, reasoning." }),
  s("codeTrace", "Code Trace Puzzle", "Predict the output", "🧑‍💻", "from-violet-400 to-fuchsia-700", "9", "CodingLogic", "Trace program execution", 4, "choice", { displayInteraction: "Code Trace", xpRequired: 0, unlockMessage: "Coding logic unlocked: trace each step." }),
  s("binaryConverter", "Binary Converter", "Decimal ↔ Binary", "0️⃣", "from-cyan-400 to-blue-700", "9", "DigitalSystems", "Convert between bases", 3, "numpad", { displayInteraction: "Fill in number", xpRequired: 0 }),
  s("algorithmSorter", "Algorithm Sorter", "Order the sort steps", "🔢", "from-emerald-400 to-cyan-700", "10", "Algorithms", "Compare sort algorithms", 4, "reorder", { displayInteraction: "Order steps", xpRequired: 500 }),
  s("debugFunction", "Debug the Function", "Spot the bug", "🐛", "from-rose-400 to-amber-700", "10", "CodingLogic", "Find logic errors", 4, "choice", { displayInteraction: "Multiple choice", xpRequired: 500 }),
  s("apiFlow", "API Flow Puzzle", "Order request → response", "🔗", "from-sky-400 to-indigo-700", "11", "APIs", "Trace API request flows", 4, "reorder", { displayInteraction: "Sequence processes", xpRequired: 1200 }),
  s("neuralNetwork", "Neural Network Builder", "Wire the neurons", "🧠", "from-violet-400 to-fuchsia-700", "12", "AIML", "Build neural nets", 5, "drag", { displayInteraction: "Build systems", xpRequired: 2500, isBoss: true, unlockMessage: "AI lab unlocked: connect the neurons." }),
  s("phishingSort", "Cybersecurity Phishing Sort", "Real vs phishing", "🛡️", "from-amber-400 to-red-700", "10", "Cybersecurity", "Spot phishing patterns", 4, "sort", { displayInteraction: "Sort categories", xpRequired: 500 }),
  s("queryMatch", "Database Query Match", "Pair SQL to result", "💾", "from-emerald-400 to-teal-700", "11", "Databases", "Read SQL queries", 4, "match", { displayInteraction: "Matching cards", xpRequired: 1200 }),
  s("robotCommand", "Robot Command Puzzle", "Sequence commands", "🤖", "from-zinc-400 to-zinc-700", "9", "RoboticsProgramming", "Program robot moves", 4, "reorder", { displayInteraction: "Order steps", xpRequired: 100, unlockMessage: "Robot deck unlocked: sequence the commands." }),
  s("logicGate", "Logic Gate Builder", "AND, OR, NOT, XOR", "⚡", "from-amber-400 to-orange-700", "10", "DigitalSystems", "Reason about logic gates", 4, "choice", { displayInteraction: "Circuit Builder", xpRequired: 500 }),
  s("bridgeStrength", "Bridge Strength Builder", "Tune the truss", "🌉", "from-cyan-400 to-blue-700", "9", "CivilEng", "Reason about truss strength", 4, "slider", { displayInteraction: "Build systems", xpRequired: 0, unlockMessage: "Engineering bay unlocked: tune the truss." }),
  s("gearRatio", "Gear Ratio Puzzle", "Pick the gear ratio", "⚙️", "from-zinc-400 to-stone-700", "9", "MechanicalEng", "Apply gear ratios", 4, "numpad", { displayInteraction: "Fill in number", xpRequired: 100 }),
  s("pulleyForce", "Pulley Force Challenge", "Reduce the load", "🧷", "from-amber-400 to-orange-700", "10", "MechanicalEng", "Mechanical advantage", 4, "slider", { displayInteraction: "Slider", xpRequired: 500 }),
  s("structuralLoad", "Structural Load Balance", "Where will it break?", "🏗️", "from-rose-400 to-amber-700", "10", "StructuralDesign", "Predict load failure", 4, "choice", { displayInteraction: "Multiple choice", xpRequired: 500 }),
  s("waterFlowSystem", "Water Flow System", "Reach the reservoir", "💧", "from-sky-400 to-cyan-700", "9", "CivilEng", "Plan water flow", 5, "path", { displayInteraction: "Connect pathways", xpRequired: 100 }),
  s("rocketLaunch", "Rocket Launch Simulator", "Pick the fuel ratio", "🚀", "from-orange-400 to-red-700", "11", "AerospaceEng", "Tune launch parameters", 5, "slider", { displayInteraction: "Simulation", xpRequired: 1200 }),
  s("robotArmAngle", "Robot Arm Angle", "Aim the gripper", "🦾", "from-violet-400 to-fuchsia-700", "11", "Robotics", "Apply trig to robotics", 4, "rotate", { displayInteraction: "Rotate", xpRequired: 1200 }),
  s("circuitCompletion", "Circuit Completion", "Close the loop", "🔌", "from-amber-400 to-yellow-700", "10", "Circuits", "Complete a circuit", 4, "drag", { displayInteraction: "Circuit Builder", xpRequired: 500 }),
  s("materialStrength", "Material Strength Sort", "Stiff vs flexible", "🪵", "from-amber-300 to-orange-700", "9", "MaterialsScience", "Classify materials", 3, "sort", { displayInteraction: "Sort categories", xpRequired: 0 }),
  s("designConstraint", "Design Constraint Challenge", "Pick the trade-off", "🧩", "from-emerald-400 to-cyan-700", "12", "DesignThinking", "Balance design constraints", 5, "choice", { displayInteraction: "Design Challenge", xpRequired: 2500, isMasteryTest: true, unlockMessage: "Design mastery unlocked: trade off the constraints." }),
];

function s(
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
  options: {
    displayInteraction?: InteractionTypeKey;
    xpRequired?: number;
    isBoss?: boolean;
    isMasteryTest?: boolean;
    prerequisites?: PuzzleId[];
    unlockMessage?: string;
  } = {},
): PuzzleMeta {
  return {
    id,
    title,
    short,
    emoji,
    gradient,
    grade,
    subject,
    skill,
    estMin,
    interactionHint,
    ...options,
  };
}

const SCIENCE_SUBJECTS: readonly Subject[] = [
  "Biology",
  "Chemistry",
  "Physics",
  "EarthScience",
  "GeneralScience",
  "Astronomy",
  "Genetics",
  "Ecology",
  "Anatomy",
  "EnvironmentalScience",
];

const TECH_SUBJECTS: readonly Subject[] = [
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

const ENGINEERING_SUBJECTS: readonly Subject[] = [
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

function domainFor(subject: Subject): Domain {
  if (SCIENCE_SUBJECTS.includes(subject)) return "Science";
  if (TECH_SUBJECTS.includes(subject)) return "Technology";
  if (ENGINEERING_SUBJECTS.includes(subject)) return "Engineering";
  return "Math";
}

const GRADE_BASE_XP: Record<Grade, number> = {
  "K-8": 0,
  "9": 0,
  "10": 500,
  "11": 1200,
  "12": 2500,
};

const BOSS_CATEGORY_THRESHOLD = 5;
const MASTERY_CATEGORY_THRESHOLD = 8;

function xpRequiredFor(meta: PuzzleMeta): number {
  if (meta.xpRequired !== undefined) return meta.xpRequired;
  let base = GRADE_BASE_XP[meta.grade];
  if (meta.isBoss) base += 300;
  if (meta.isMasteryTest) base += 500;
  return base;
}

type AiPuzzleMode = "choice" | "match" | "sort" | "reorder" | "numpad";

interface AiPuzzleSpec {
  mode: AiPuzzleMode;
  prompt: string;
  hint: string;
  hints: string[];
  explanation: string;
  choice?: { choices: string[]; answer: string };
  match?: { pairs: { left: string; right: string }[] };
  sort?: { categories: string[]; items: { label: string; category: string }[] };
  reorder?: { correctOrder: string[] };
  numpad?: { answer: string; allowDecimal?: boolean; allowMinus?: boolean };
}

function aiCompatibleMode(meta: PuzzleMeta): AiPuzzleMode | null {
  switch (meta.interactionHint) {
    case "choice":
      return "choice";
    case "match":
      return "match";
    case "sort":
      return "sort";
    case "reorder":
      return "reorder";
    case "numpad":
      return "numpad";
    default:
      return null;
  }
}

function puzzleFromAiSpec(meta: PuzzleMeta, spec: AiPuzzleSpec, difficulty: Difficulty, mode: AiPuzzleMode): Puzzle {
  const visual: Visual = {
    kind: "icon",
    icon: meta.emoji,
    title: meta.title,
    subtitle: `✨ AI · ${subjectLabel(meta.subject)}`,
  };
  const seedPuzzle: Puzzle = {
    ...base(meta, difficulty, mode, spec.prompt, visual),
    hint: spec.hint,
    hints: spec.hints,
    explanation: spec.explanation,
  };
  if (mode === "choice" && spec.choice) {
    return {
      ...seedPuzzle,
      choices: shuffle(spec.choice.choices),
      answer: spec.choice.answer,
    };
  }
  if (mode === "match" && spec.match) {
    return {
      ...seedPuzzle,
      pairs: spec.match.pairs,
    };
  }
  if (mode === "sort" && spec.sort) {
    return {
      ...seedPuzzle,
      sortItems: shuffle(spec.sort.items),
      sortCategories: spec.sort.categories,
    };
  }
  if (mode === "reorder" && spec.reorder) {
    return {
      ...seedPuzzle,
      tiles: shuffle(spec.reorder.correctOrder),
      correctOrder: spec.reorder.correctOrder,
    };
  }
  if (mode === "numpad" && spec.numpad) {
    return {
      ...seedPuzzle,
      numpadAnswer: spec.numpad.answer,
      numpadAllowDecimal: spec.numpad.allowDecimal,
      numpadAllowMinus: spec.numpad.allowMinus,
    };
  }
  return seedPuzzle;
}

function isUnlocked(meta: PuzzleMeta, xp: number, completions: Record<string, number> = {}): boolean {
  if (xp < xpRequiredFor(meta)) return false;
  const subjectCount = completions[meta.subject] ?? 0;
  if (meta.isBoss && subjectCount < BOSS_CATEGORY_THRESHOLD) return false;
  if (meta.isMasteryTest && subjectCount < MASTERY_CATEGORY_THRESHOLD) return false;
  if (meta.prerequisites && meta.prerequisites.length > 0) {
    const missing = meta.prerequisites.some((pid) => (completions[`puzzle:${pid}`] ?? 0) === 0);
    if (missing) return false;
  }
  return true;
}

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

function xpRewardFor(difficulty: Difficulty) {
  return XP_PER_WIN + (difficulty === "hard" ? 8 : difficulty === "medium" ? 4 : 0);
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
    hints: ["Look for the smallest relationship first."],
    explanation: "The visual clue points to the answer.",
    visual,
    xpReward: xpRewardFor(difficulty),
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
    case "cellOrganelle": {
      const organelles: { name: string; emoji: string; job: string }[] = [
        { name: "Nucleus", emoji: "🧠", job: "Stores DNA" },
        { name: "Mitochondria", emoji: "🔋", job: "Makes ATP energy" },
        { name: "Ribosome", emoji: "🧶", job: "Builds proteins" },
        { name: "Chloroplast", emoji: "🌿", job: "Photosynthesis" },
        { name: "Cell membrane", emoji: "🛡️", job: "Controls entry" },
      ];
      const picks = shuffle(organelles).slice(0, difficulty === "easy" ? 3 : 4);
      return matchPuzzle(
        {
          ...m,
        },
        difficulty,
        "Match each organelle to its job.",
        picks.map((organelle) => [`${organelle.emoji} ${organelle.name}`, organelle.job]) as [string, string][],
      );
    }
    case "moleculeBuilder": {
      const targets: { name: string; atoms: Record<string, number> }[] = [
        { name: "Water (H₂O)", atoms: { H: 2, O: 1 } },
        { name: "Carbon dioxide (CO₂)", atoms: { C: 1, O: 2 } },
        { name: "Methane (CH₄)", atoms: { C: 1, H: 4 } },
        { name: "Ammonia (NH₃)", atoms: { N: 1, H: 3 } },
      ];
      const target = pick(targets);
      const correct = Object.entries(target.atoms)
        .map(([sym, n]) => `${n}${sym}`)
        .join(" + ");
      const wrong = (offset: { sym: string; delta: number }) => {
        const tweaked: Record<string, number> = { ...target.atoms };
        const value = (tweaked[offset.sym] ?? 0) + offset.delta;
        tweaked[offset.sym] = Math.max(1, value);
        return Object.entries(tweaked)
          .map(([sym, n]) => `${n}${sym}`)
          .join(" + ");
      };
      const keys = Object.keys(target.atoms);
      const distractors = shuffle([
        wrong({ sym: keys[0]!, delta: 1 }),
        wrong({ sym: keys[0]!, delta: -1 }),
        wrong({ sym: keys[keys.length - 1]!, delta: 1 }),
      ]);
      const atomColors: Record<string, string> = { H: "#fda4af", O: "#67e8f9", C: "#a3a3a3", N: "#a78bfa" };
      const atoms = Object.entries(target.atoms).map(([sym, n]) => ({ symbol: sym, count: n, color: atomColors[sym] ?? "#e4e4e7" }));
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Build ${target.name}. Pick the right atoms.`, {
            kind: "molecule",
            title: target.name,
            subtitle: "Snap atoms together",
            atoms,
          }),
          hint: `Count each atom in ${target.name}.`,
          hints: [`Look at the subscripts in ${target.name}.`, "Each subscript tells you how many of that atom you need."],
          explanation: `${target.name} requires ${correct}.`,
        },
        correct,
        distractors,
      );
    }
    case "equationBalance": {
      const recipes: { eq: string; coefficients: number[] }[] = [
        { eq: "_H₂ + _O₂ → _H₂O", coefficients: [2, 1, 2] },
        { eq: "_N₂ + _H₂ → _NH₃", coefficients: [1, 3, 2] },
        { eq: "_CH₄ + _O₂ → _CO₂ + _H₂O", coefficients: [1, 2, 1, 2] },
        { eq: "_C + _O₂ → _CO₂", coefficients: [1, 1, 1] },
      ];
      const recipe = pick(recipes);
      const correct = recipe.coefficients.join(",");
      const tweak = (offset: number, idx: number) => recipe.coefficients.map((value, i) => (i === idx ? Math.max(1, value + offset) : value)).join(",");
      const distractors = shuffle([
        tweak(1, 0),
        tweak(-1, recipe.coefficients.length - 1),
        recipe.coefficients.map(() => 1).join(","),
      ]);
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Balance: ${recipe.eq}`, {
            kind: "equation",
            title: recipe.eq,
            subtitle: "Pick coefficients to balance",
            equation: { reactants: recipe.eq.split(" → ")[0]!.split(" + "), products: recipe.eq.split(" → ")[1]!.split(" + "), coefficients: recipe.coefficients },
          }),
          hint: "Atoms on each side must match.",
          hints: ["Count each atom on both sides.", "Start with whichever atom appears only once."],
          explanation: `Balanced coefficients: ${correct}.`,
        },
        correct,
        distractors,
      );
    }
    case "forceVector": {
      const magnitudes: [number, number] = [rand(2, 8), rand(2, 8)];
      const sameDirection = Math.random() < 0.6;
      const direction1: "left" | "right" = pick(["left", "right"] as const);
      const direction2: "left" | "right" = sameDirection ? direction1 : direction1 === "left" ? "right" : "left";
      const signedSum =
        (direction1 === "right" ? magnitudes[0] : -magnitudes[0]) +
        (direction2 === "right" ? magnitudes[1] : -magnitudes[1]);
      const answer = `${Math.abs(signedSum)} N ${signedSum === 0 ? "balanced" : signedSum > 0 ? "right" : "left"}`;
      const distractors = shuffle([
        `${magnitudes[0] + magnitudes[1]} N right`,
        `${Math.abs(magnitudes[0] - magnitudes[1])} N left`,
        `${magnitudes[0] + magnitudes[1]} N left`,
      ].filter((s) => s !== answer)).slice(0, 3);
      return makeChoice(
        {
          ...base(m, difficulty, "choice", "Two forces act on a block. What is the net force?", {
            kind: "vectors",
            title: `${magnitudes[0]}N ${direction1}  &  ${magnitudes[1]}N ${direction2}`,
            subtitle: "Add vectors along one axis",
            vectors: [
              { label: `${magnitudes[0]}N`, magnitude: magnitudes[0], direction: direction1 },
              { label: `${magnitudes[1]}N`, magnitude: magnitudes[1], direction: direction2 },
            ],
          }),
          hint: "Same direction = add. Opposite direction = subtract.",
          hints: ["Set right as positive, left as negative.", "Add the signed magnitudes and take the absolute value."],
          explanation: `Net force = ${signedSum}N ${signedSum === 0 ? "(balanced)" : signedSum > 0 ? "right" : "left"}.`,
        },
        answer,
        distractors,
      );
    }
    case "rockCycle": {
      const sequence = ["Magma", "Igneous", "Sediment", "Sedimentary", "Metamorphic"];
      const stages = difficulty === "easy" ? sequence.slice(0, 4) : sequence;
      return {
        ...base(m, difficulty, "reorder", "Order the rock cycle from molten start to final form.", {
          kind: "rockCycle",
          title: stages.join(" → "),
          subtitle: "Tap two tiles to swap",
          stages,
        }),
        tiles: shuffle(stages),
        correctOrder: stages,
        hint: "Magma cools first. Pressure and heat come later.",
        hints: ["Magma cools first.", "Sediment forms before sedimentary rock.", "Heat & pressure produce metamorphic rock."],
        explanation: `Correct order: ${stages.join(" → ")}.`,
      };
    }
    case "binaryConverter": {
      const range: [number, number] = difficulty === "easy" ? [1, 15] : difficulty === "medium" ? [8, 63] : [32, 255];
      const decimal = rand(range[0], range[1]);
      const binary = decimal.toString(2);
      const bits = binary.padStart(8, "0").split("").map((c) => Number(c));
      return {
        ...base(m, difficulty, "numpad", `Convert ${decimal} to binary.`, {
          kind: "binary",
          title: `${decimal} (decimal)`,
          subtitle: "Type the binary value",
          bits,
        }),
        numpadAnswer: binary,
        numpadAllowDecimal: false,
        numpadAllowMinus: false,
        hint: "Divide by 2 and read remainders bottom-up.",
        hints: ["Each bit represents 2ⁿ.", `Largest power of 2 ≤ ${decimal} is ${Math.pow(2, Math.floor(Math.log2(decimal)))}.`],
        explanation: `${decimal} = ${binary} in binary.`,
      };
    }
    case "logicGate": {
      const gates: { name: string; truth: { a: number; b: number; out: number }[] }[] = [
        { name: "AND", truth: [ { a: 0, b: 0, out: 0 }, { a: 0, b: 1, out: 0 }, { a: 1, b: 0, out: 0 }, { a: 1, b: 1, out: 1 } ] },
        { name: "OR",  truth: [ { a: 0, b: 0, out: 0 }, { a: 0, b: 1, out: 1 }, { a: 1, b: 0, out: 1 }, { a: 1, b: 1, out: 1 } ] },
        { name: "XOR", truth: [ { a: 0, b: 0, out: 0 }, { a: 0, b: 1, out: 1 }, { a: 1, b: 0, out: 1 }, { a: 1, b: 1, out: 0 } ] },
        { name: "NAND",truth: [ { a: 0, b: 0, out: 1 }, { a: 0, b: 1, out: 1 }, { a: 1, b: 0, out: 1 }, { a: 1, b: 1, out: 0 } ] },
      ];
      const gate = pick(gates);
      const row = pick(gate.truth);
      const correct = String(row.out);
      const distractor = correct === "1" ? "0" : "1";
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Output of ${gate.name}(${row.a}, ${row.b}) ?`, {
            kind: "truthTable",
            title: `${gate.name} gate`,
            subtitle: "Apply the truth table",
            truthTable: { gate: gate.name, rows: gate.truth },
          }),
          hint: `${gate.name}: ${gate.name === "AND" ? "both must be 1" : gate.name === "OR" ? "either must be 1" : gate.name === "XOR" ? "exactly one is 1" : "NOT(AND)"}.`,
          hints: ["Trace the row in the truth table.", `${gate.name} of (${row.a}, ${row.b}) → ?`],
          explanation: `${gate.name}(${row.a}, ${row.b}) = ${row.out}.`,
        },
        correct,
        [distractor],
      );
    }
    case "gearRatio": {
      const teethSmall = pick([8, 10, 12, 14, 16]);
      const teethLarge = pick([24, 30, 36, 40, 48]).valueOf();
      const inputRpm = rand(20, 120);
      const ratio = teethLarge / teethSmall;
      const outputRpm = Math.round(inputRpm / ratio);
      return {
        ...base(m, difficulty, "numpad", `Input gear (${teethSmall} teeth) at ${inputRpm} RPM drives output (${teethLarge} teeth). Output RPM?`, {
          kind: "gears",
          title: `${teethSmall}T → ${teethLarge}T`,
          subtitle: `Input ${inputRpm} RPM`,
          gears: [
            { teeth: teethSmall, label: "Input" },
            { teeth: teethLarge, label: "Output" },
          ],
        }),
        numpadAnswer: String(outputRpm),
        numpadAllowDecimal: false,
        numpadAllowMinus: false,
        hint: "Output RPM = Input RPM × (Input teeth / Output teeth).",
        hints: ["Bigger output gear → slower output.", `Ratio = ${teethLarge}/${teethSmall} = ${ratio.toFixed(2)}.`],
        explanation: `${inputRpm} × (${teethSmall}/${teethLarge}) ≈ ${outputRpm} RPM.`,
      };
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
    Biology: [["Mitochondria", "Powerhouse"], ["Ribosome", "Proteins"], ["Nucleus", "DNA"]],
    Chemistry: [["Na", "Sodium"], ["H₂O", "Water"], ["O", "Oxygen"]],
    Physics: [["F = ma", "Newton 2"], ["E = mc²", "Mass-energy"], ["P = W/t", "Power"]],
    EarthScience: [["Crust", "Outer layer"], ["Cumulus", "Puffy cloud"], ["Igneous", "From magma"]],
    GeneralScience: [["m", "meter"], ["kg", "kilogram"], ["s", "second"]],
    Probability: [["P(heads)", "1/2"], ["P(roll 1)", "1/6"], ["P(red Q)", "2/52"]],
    NumberTheory: [["GCD(12,18)", "6"], ["LCM(4,6)", "12"], ["Prime?", "7"]],
    FinancialMath: [["10% of 200", "20"], ["Simple int 100·5%·2y", "10"], ["Tip 18% of 50", "9"]],
    Astronomy: [["Mercury", "Closest"], ["Saturn", "Rings"], ["Jupiter", "Largest"]],
    Genetics: [["A", "T"], ["C", "G"], ["mRNA", "Codon"]],
    Ecology: [["Producer", "Plant"], ["Consumer", "Animal"], ["Decomposer", "Fungus"]],
    Anatomy: [["Heart", "Pumps blood"], ["Lungs", "Gas exchange"], ["Brain", "Control"]],
    EnvironmentalScience: [["CO₂", "Greenhouse"], ["Solar", "Renewable"], ["Coal", "Fossil"]],
    CodingLogic: [["if", "Branch"], ["loop", "Repeat"], ["return", "Output"]],
    Algorithms: [["O(1)", "Constant"], ["O(n)", "Linear"], ["O(n²)", "Quadratic"]],
    AIML: [["Neuron", "Node"], ["Weight", "Strength"], ["Bias", "Offset"]],
    Cybersecurity: [["Phishing", "Fake email"], ["Firewall", "Filter"], ["2FA", "Two factor"]],
    Databases: [["SELECT", "Read"], ["INSERT", "Add"], ["JOIN", "Combine"]],
    RoboticsProgramming: [["forward()", "Move"], ["turn(90)", "Rotate"], ["sense()", "Read"]],
    WebDev: [["HTML", "Structure"], ["CSS", "Style"], ["JS", "Behavior"]],
    APIs: [["GET", "Read"], ["POST", "Create"], ["DELETE", "Remove"]],
    Networks: [["IP", "Address"], ["DNS", "Lookup"], ["TCP", "Stream"]],
    DigitalSystems: [["0b101", "5"], ["0xFF", "255"], ["XOR", "Different"]],
    MechanicalEng: [["Lever", "Pivot"], ["Pulley", "Wheel"], ["Gear", "Teeth"]],
    ElectricalEng: [["V", "Volts"], ["Ω", "Ohms"], ["A", "Amps"]],
    CivilEng: [["Truss", "Bridge"], ["Beam", "Span"], ["Arch", "Compression"]],
    AerospaceEng: [["Lift", "Wings"], ["Drag", "Friction"], ["Thrust", "Engine"]],
    Robotics: [["Servo", "Angle"], ["Encoder", "Position"], ["LIDAR", "Distance"]],
    StructuralDesign: [["Tension", "Pull"], ["Compression", "Push"], ["Shear", "Slide"]],
    MaterialsScience: [["Steel", "Stiff"], ["Rubber", "Elastic"], ["Glass", "Brittle"]],
    Circuits: [["Resistor", "Limits I"], ["Capacitor", "Stores V"], ["Diode", "One-way"]],
    SystemsEng: [["Input", "Source"], ["Process", "Transform"], ["Output", "Result"]],
    DesignThinking: [["Empathize", "Listen"], ["Prototype", "Build"], ["Test", "Validate"]],
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
    hints: ["Two quarter-turns reach 180°.", "Rotation is cumulative."],
    explanation: "A half-turn completes the transformation.",
  };
}

function placeholderNumpad(meta: PuzzleMeta, difficulty: Difficulty): Puzzle {
  const ranges: Record<Difficulty, [number, number]> = { easy: [3, 12], medium: [6, 24], hard: [10, 60] };
  const [lo, hi] = ranges[difficulty];
  const answer = rand(lo, hi);
  return {
    ...base(meta, difficulty, "numpad", `${meta.title}: type the answer.`, {
      kind: "icon",
      icon: meta.emoji,
      title: `${meta.subject} drill`,
      subtitle: "Type a numeric answer",
    }),
    numpadAnswer: String(answer),
    numpadAllowDecimal: meta.subject === "Trigonometry" || meta.subject === "Statistics",
    numpadAllowMinus: meta.subject === "Algebra" || meta.subject === "Calculus",
    hint: `Round to a whole number near ${Math.round((lo + hi) / 2)} if needed.`,
    hints: [`Round to a whole number near ${Math.round((lo + hi) / 2)} if needed.`, "Re-read the prompt for units."],
    explanation: `The expected answer is ${answer}.`,
  };
}

function placeholderSort(meta: PuzzleMeta, difficulty: Difficulty): Puzzle {
  const banks: Record<Subject, { categories: string[]; items: { label: string; category: string }[] }> = {
    Algebra: {
      categories: ["x terms", "Constants"],
      items: [
        { label: "3x", category: "x terms" },
        { label: "−x", category: "x terms" },
        { label: "5", category: "Constants" },
        { label: "−2", category: "Constants" },
      ],
    },
    Geometry: {
      categories: ["Acute", "Obtuse"],
      items: [
        { label: "30°", category: "Acute" },
        { label: "70°", category: "Acute" },
        { label: "120°", category: "Obtuse" },
        { label: "150°", category: "Obtuse" },
      ],
    },
    Trigonometry: {
      categories: ["Positive", "Negative"],
      items: [
        { label: "sin 60°", category: "Positive" },
        { label: "cos 30°", category: "Positive" },
        { label: "sin 210°", category: "Negative" },
        { label: "cos 150°", category: "Negative" },
      ],
    },
    Precalculus: {
      categories: ["Even", "Odd"],
      items: [
        { label: "x²", category: "Even" },
        { label: "|x|", category: "Even" },
        { label: "x³", category: "Odd" },
        { label: "sin x", category: "Odd" },
      ],
    },
    Calculus: {
      categories: ["Increasing", "Decreasing"],
      items: [
        { label: "x²+1", category: "Increasing" },
        { label: "eˣ", category: "Increasing" },
        { label: "−x", category: "Decreasing" },
        { label: "1/x (x>0)", category: "Decreasing" },
      ],
    },
    Statistics: {
      categories: ["Random", "Biased"],
      items: [
        { label: "Lottery draw", category: "Random" },
        { label: "Random dial", category: "Random" },
        { label: "Friends survey", category: "Biased" },
        { label: "Self-selected poll", category: "Biased" },
      ],
    },
    Arithmetic: {
      categories: ["Even", "Odd"],
      items: [
        { label: "2", category: "Even" },
        { label: "8", category: "Even" },
        { label: "3", category: "Odd" },
        { label: "7", category: "Odd" },
      ],
    },
    Logic: {
      categories: ["Prime", "Composite"],
      items: [
        { label: "3", category: "Prime" },
        { label: "7", category: "Prime" },
        { label: "9", category: "Composite" },
        { label: "12", category: "Composite" },
      ],
    },
    Biology: {
      categories: ["Plant cell", "Animal cell"],
      items: [
        { label: "Chloroplast", category: "Plant cell" },
        { label: "Cell wall", category: "Plant cell" },
        { label: "Centriole", category: "Animal cell" },
        { label: "Lysosome", category: "Animal cell" },
      ],
    },
    Chemistry: {
      categories: ["Acid", "Base"],
      items: [
        { label: "HCl", category: "Acid" },
        { label: "Vinegar", category: "Acid" },
        { label: "NaOH", category: "Base" },
        { label: "Ammonia", category: "Base" },
      ],
    },
    Physics: {
      categories: ["Scalar", "Vector"],
      items: [
        { label: "Speed", category: "Scalar" },
        { label: "Mass", category: "Scalar" },
        { label: "Velocity", category: "Vector" },
        { label: "Force", category: "Vector" },
      ],
    },
    EarthScience: {
      categories: ["Igneous", "Sedimentary"],
      items: [
        { label: "Granite", category: "Igneous" },
        { label: "Basalt", category: "Igneous" },
        { label: "Limestone", category: "Sedimentary" },
        { label: "Sandstone", category: "Sedimentary" },
      ],
    },
    GeneralScience: {
      categories: ["Observation", "Inference"],
      items: [
        { label: "Sky is blue", category: "Observation" },
        { label: "Leaf is green", category: "Observation" },
        { label: "It will rain", category: "Inference" },
        { label: "Cat is happy", category: "Inference" },
      ],
    },
    Probability: { categories: ["Possible", "Impossible"], items: [
      { label: "Roll a 3", category: "Possible" }, { label: "Heads on coin", category: "Possible" },
      { label: "Roll a 7 (d6)", category: "Impossible" }, { label: "Snow in summer here", category: "Impossible" },
    ] },
    NumberTheory: { categories: ["Prime", "Composite"], items: [
      { label: "11", category: "Prime" }, { label: "13", category: "Prime" },
      { label: "9", category: "Composite" }, { label: "15", category: "Composite" },
    ] },
    FinancialMath: { categories: ["Asset", "Liability"], items: [
      { label: "Savings", category: "Asset" }, { label: "Stock", category: "Asset" },
      { label: "Loan", category: "Liability" }, { label: "Credit debt", category: "Liability" },
    ] },
    Astronomy: { categories: ["Inner planet", "Outer planet"], items: [
      { label: "Mercury", category: "Inner planet" }, { label: "Venus", category: "Inner planet" },
      { label: "Jupiter", category: "Outer planet" }, { label: "Neptune", category: "Outer planet" },
    ] },
    Genetics: { categories: ["Dominant", "Recessive"], items: [
      { label: "Brown eyes", category: "Dominant" }, { label: "Tall pea", category: "Dominant" },
      { label: "Blue eyes", category: "Recessive" }, { label: "Short pea", category: "Recessive" },
    ] },
    Ecology: { categories: ["Producer", "Consumer"], items: [
      { label: "Grass", category: "Producer" }, { label: "Algae", category: "Producer" },
      { label: "Deer", category: "Consumer" }, { label: "Hawk", category: "Consumer" },
    ] },
    Anatomy: { categories: ["Skeletal", "Circulatory"], items: [
      { label: "Femur", category: "Skeletal" }, { label: "Skull", category: "Skeletal" },
      { label: "Aorta", category: "Circulatory" }, { label: "Capillary", category: "Circulatory" },
    ] },
    EnvironmentalScience: { categories: ["Renewable", "Non-renewable"], items: [
      { label: "Wind", category: "Renewable" }, { label: "Solar", category: "Renewable" },
      { label: "Coal", category: "Non-renewable" }, { label: "Oil", category: "Non-renewable" },
    ] },
    CodingLogic: { categories: ["Loop", "Branch"], items: [
      { label: "for", category: "Loop" }, { label: "while", category: "Loop" },
      { label: "if", category: "Branch" }, { label: "switch", category: "Branch" },
    ] },
    Algorithms: { categories: ["Sort", "Search"], items: [
      { label: "Quicksort", category: "Sort" }, { label: "Merge sort", category: "Sort" },
      { label: "Binary search", category: "Search" }, { label: "Linear search", category: "Search" },
    ] },
    AIML: { categories: ["Supervised", "Unsupervised"], items: [
      { label: "Classification", category: "Supervised" }, { label: "Regression", category: "Supervised" },
      { label: "Clustering", category: "Unsupervised" }, { label: "PCA", category: "Unsupervised" },
    ] },
    Cybersecurity: { categories: ["Real", "Phishing"], items: [
      { label: "Bank login URL", category: "Real" }, { label: "Verified sender", category: "Real" },
      { label: "Urgent password reset", category: "Phishing" }, { label: "Misspelled domain", category: "Phishing" },
    ] },
    Databases: { categories: ["Read", "Write"], items: [
      { label: "SELECT", category: "Read" }, { label: "JOIN", category: "Read" },
      { label: "INSERT", category: "Write" }, { label: "UPDATE", category: "Write" },
    ] },
    RoboticsProgramming: { categories: ["Sensor", "Actuator"], items: [
      { label: "LIDAR", category: "Sensor" }, { label: "Camera", category: "Sensor" },
      { label: "Servo", category: "Actuator" }, { label: "Motor", category: "Actuator" },
    ] },
    WebDev: { categories: ["Frontend", "Backend"], items: [
      { label: "React", category: "Frontend" }, { label: "CSS", category: "Frontend" },
      { label: "Node", category: "Backend" }, { label: "Postgres", category: "Backend" },
    ] },
    APIs: { categories: ["Safe", "Mutating"], items: [
      { label: "GET", category: "Safe" }, { label: "HEAD", category: "Safe" },
      { label: "POST", category: "Mutating" }, { label: "DELETE", category: "Mutating" },
    ] },
    Networks: { categories: ["Layer 3", "Layer 7"], items: [
      { label: "IP", category: "Layer 3" }, { label: "ICMP", category: "Layer 3" },
      { label: "HTTP", category: "Layer 7" }, { label: "DNS", category: "Layer 7" },
    ] },
    DigitalSystems: { categories: ["AND", "OR"], items: [
      { label: "1·1 = 1", category: "AND" }, { label: "1·0 = 0", category: "AND" },
      { label: "1+0 = 1", category: "OR" }, { label: "0+0 = 0", category: "OR" },
    ] },
    MechanicalEng: { categories: ["Simple machine", "Composite"], items: [
      { label: "Lever", category: "Simple machine" }, { label: "Pulley", category: "Simple machine" },
      { label: "Bicycle", category: "Composite" }, { label: "Crane", category: "Composite" },
    ] },
    ElectricalEng: { categories: ["AC", "DC"], items: [
      { label: "Wall outlet", category: "AC" }, { label: "Transformer", category: "AC" },
      { label: "Battery", category: "DC" }, { label: "Solar panel", category: "DC" },
    ] },
    CivilEng: { categories: ["Tension", "Compression"], items: [
      { label: "Cable", category: "Tension" }, { label: "Suspension wire", category: "Tension" },
      { label: "Column", category: "Compression" }, { label: "Arch base", category: "Compression" },
    ] },
    AerospaceEng: { categories: ["Lift", "Drag"], items: [
      { label: "Wing camber", category: "Lift" }, { label: "Angle of attack", category: "Lift" },
      { label: "Air friction", category: "Drag" }, { label: "Fuselage shape", category: "Drag" },
    ] },
    Robotics: { categories: ["Sensor", "Actuator"], items: [
      { label: "Encoder", category: "Sensor" }, { label: "Gyro", category: "Sensor" },
      { label: "Stepper motor", category: "Actuator" }, { label: "Servo", category: "Actuator" },
    ] },
    StructuralDesign: { categories: ["Tension", "Shear"], items: [
      { label: "Cable", category: "Tension" }, { label: "Rope bridge", category: "Tension" },
      { label: "Bolt under twist", category: "Shear" }, { label: "Beam under cross-load", category: "Shear" },
    ] },
    MaterialsScience: { categories: ["Stiff", "Elastic"], items: [
      { label: "Steel", category: "Stiff" }, { label: "Diamond", category: "Stiff" },
      { label: "Rubber", category: "Elastic" }, { label: "Silicone", category: "Elastic" },
    ] },
    Circuits: { categories: ["Series", "Parallel"], items: [
      { label: "Same current", category: "Series" }, { label: "Sum of R", category: "Series" },
      { label: "Same voltage", category: "Parallel" }, { label: "Inverse R sum", category: "Parallel" },
    ] },
    SystemsEng: { categories: ["Input", "Output"], items: [
      { label: "Sensor read", category: "Input" }, { label: "User press", category: "Input" },
      { label: "Display update", category: "Output" }, { label: "Motor turn", category: "Output" },
    ] },
    DesignThinking: { categories: ["Diverge", "Converge"], items: [
      { label: "Brainstorm", category: "Diverge" }, { label: "Sketch many", category: "Diverge" },
      { label: "Prototype best", category: "Converge" }, { label: "Pick top", category: "Converge" },
    ] },
  };
  const bank = banks[meta.subject];
  return {
    ...base(meta, difficulty, "sort", `${meta.title}: sort each card into a bucket.`, {
      kind: "icon",
      icon: meta.emoji,
      title: bank.categories.join("  ·  "),
      subtitle: "Tap a card, then a bucket",
    }),
    sortItems: shuffle(bank.items),
    sortCategories: bank.categories,
    hint: "Tap a card, then tap a bucket to place it.",
    hints: ["Tap a card, then a bucket.", "All cards must be placed before you check."],
    explanation: `Correct grouping: ${bank.items.map((i) => `${i.label} → ${i.category}`).join("; ")}.`,
  };
}

function placeholderPath(meta: PuzzleMeta, difficulty: Difficulty): Puzzle {
  const stops = ["Start", "Step 1", "Step 2", "Goal"];
  return {
    ...base(meta, difficulty, "path", `${meta.title}: trace the path in order.`, {
      kind: "grid",
      title: stops.join(" → "),
      tiles: stops,
    }),
    pathTiles: stops,
    correctPath: [0, 1, 2, 3],
    hint: "Tap the stops in order from start to goal.",
    hints: ["Start at the leftmost tile.", "Each tap appends to the path."],
    explanation: "Walking the steps in order completes the trace.",
  };
}

function placeholderSwipe(meta: PuzzleMeta, difficulty: Difficulty): Puzzle {
  const target = pick(["left", "right", "up", "down"] as const);
  return {
    ...base(meta, difficulty, "swipe", `${meta.title}: swipe to unlock.`, {
      kind: "icon",
      icon: meta.emoji,
      title: "Locked",
      subtitle: `Swipe ${target}`,
    }),
    swipeTarget: target,
    swipeLabels: ["left", "right", "up", "down"],
    hint: `Swipe ${target} to release the lock.`,
    hints: [`Swipe ${target} to release the lock.`],
    explanation: `Swiping ${target} unlocks the door.`,
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
    case "numpad":
      return placeholderNumpad(meta, difficulty);
    case "sort":
      return placeholderSort(meta, difficulty);
    case "path":
      return placeholderPath(meta, difficulty);
    case "swipe":
      return placeholderSwipe(meta, difficulty);
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
    numpad: "",
    sort: {},
    pendingItem: null,
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
  if (puzzle.mode === "numpad") return state.numpad.trim() === (puzzle.numpadAnswer ?? "");
  if (puzzle.mode === "sort") {
    const items = puzzle.sortItems ?? [];
    return items.length > 0 && items.every((item) => state.sort[item.label] === item.category);
  }
  return state.swipe === puzzle.swipeTarget;
}

function canCheck(puzzle: Puzzle | null, state: PlayState) {
  if (!puzzle) return false;
  if (puzzle.mode === "choice") return state.choice !== null;
  if (puzzle.mode === "drag") return state.dropped !== null;
  if (puzzle.mode === "match") return Object.keys(state.matches).length === (puzzle.pairs ?? []).length;
  if (puzzle.mode === "path") return state.path.length > 0;
  if (puzzle.mode === "swipe") return state.swipe !== null;
  if (puzzle.mode === "numpad") return state.numpad.trim().length > 0;
  if (puzzle.mode === "sort") return Object.keys(state.sort).length === (puzzle.sortItems ?? []).length;
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
  if (visual.kind === "molecule") return <Molecule atoms={visual.atoms ?? []} title={visual.title} />;
  if (visual.kind === "equation") return <EquationCard equation={visual.equation} title={visual.title} subtitle={visual.subtitle} />;
  if (visual.kind === "vectors") return <VectorBoard vectors={visual.vectors ?? []} title={visual.title} subtitle={visual.subtitle} />;
  if (visual.kind === "rockCycle") return <RockCycleDiagram stages={visual.stages ?? []} />;
  if (visual.kind === "cell") return <CellDiagram organelles={visual.organelles ?? []} title={visual.title} />;
  if (visual.kind === "binary") return <BinaryStrip bits={visual.bits ?? []} title={visual.title} subtitle={visual.subtitle} />;
  if (visual.kind === "truthTable") return <TruthTable table={visual.truthTable} subtitle={visual.subtitle} />;
  if (visual.kind === "gears") return <Gears gears={visual.gears ?? []} title={visual.title} subtitle={visual.subtitle} />;
  if (visual.kind === "code") return <CodeBlock lines={visual.code?.lines ?? []} highlight={visual.code?.highlight} title={visual.title} />;
  if (visual.kind === "circuit") return <CircuitBoard nodes={visual.circuit?.nodes ?? []} closed={visual.circuit?.closed} title={visual.title} />;
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
      {Array.from({ length: filled }, (_, i) => <circle key={i} cx={r + Math.cos((i / slices) * Math.PI * 2) * 42} cy={r + Math.sin((i / slices) * Math.PI * 2) * 42} r="6" fill="#ef4444" />)}
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

function Molecule({ atoms, title }: { atoms: { symbol: string; count: number; color: string }[]; title?: string }) {
  const expanded = atoms.flatMap((atom) =>
    Array.from({ length: atom.count }, (_, i) => ({ symbol: atom.symbol, color: atom.color, key: `${atom.symbol}-${i}` })),
  );
  return (
    <div className="space-y-3">
      {title ? <p className="text-center text-sm font-black tracking-wide text-white/85">{title}</p> : null}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {expanded.map((atom, idx) => (
          <motion.span
            key={atom.key}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.05, type: "spring", stiffness: 280, damping: 18 }}
            className="grid h-12 w-12 place-items-center rounded-full text-base font-black text-zinc-900 shadow-lg ring-2 ring-white/40"
            style={{ background: atom.color }}
          >
            {atom.symbol}
          </motion.span>
        ))}
      </div>
      <p className="text-center text-[11px] uppercase tracking-[0.3em] text-zinc-400">
        {atoms.map((a) => `${a.count}${a.symbol}`).join(" + ")}
      </p>
    </div>
  );
}

function EquationCard({ equation, title, subtitle }: { equation?: Visual["equation"]; title?: string; subtitle?: string }) {
  return (
    <div className="space-y-3 text-center">
      {title ? <p className="text-lg font-black text-white">{title}</p> : null}
      {equation ? (
        <div className="flex items-center justify-center gap-2 text-sm text-zinc-200">
          <span className="rounded-2xl bg-emerald-500/20 px-3 py-2 text-emerald-100 ring-1 ring-emerald-300/30">{equation.reactants.join("  +  ")}</span>
          <span className="text-base text-zinc-400">→</span>
          <span className="rounded-2xl bg-cyan-500/20 px-3 py-2 text-cyan-100 ring-1 ring-cyan-300/30">{equation.products.join("  +  ")}</span>
        </div>
      ) : null}
      {subtitle ? <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">{subtitle}</p> : null}
    </div>
  );
}

function VectorBoard({ vectors, title, subtitle }: { vectors: { label: string; magnitude: number; direction: "left" | "right" | "up" | "down" }[]; title?: string; subtitle?: string }) {
  const max = Math.max(1, ...vectors.map((v) => v.magnitude));
  const arrow = (dir: string) => (dir === "left" ? "←" : dir === "right" ? "→" : dir === "up" ? "↑" : "↓");
  return (
    <div className="space-y-3">
      {title ? <p className="text-center text-sm font-black text-white/85">{title}</p> : null}
      <div className="space-y-2">
        {vectors.map((vec, idx) => (
          <div key={`${vec.label}-${idx}`} className="flex items-center gap-3">
            <span className="w-16 text-xs font-black uppercase tracking-wider text-zinc-400">{vec.label}</span>
            <div className="relative flex h-6 flex-1 items-center">
              <div className="absolute inset-y-0 left-1/2 w-px bg-white/15" />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(vec.magnitude / max) * 45}%` }}
                transition={{ duration: 0.45 }}
                className={`h-2 rounded-full ${vec.direction === "right" ? "ml-1/2 bg-emerald-400" : "mr-auto bg-rose-400"}`}
                style={vec.direction === "right" ? { marginLeft: "50%" } : { marginRight: "50%", marginLeft: "auto" }}
              />
            </div>
            <span className="w-10 text-right text-base text-white">{arrow(vec.direction)}</span>
          </div>
        ))}
      </div>
      {subtitle ? <p className="text-center text-[11px] uppercase tracking-[0.3em] text-zinc-400">{subtitle}</p> : null}
    </div>
  );
}

function RockCycleDiagram({ stages }: { stages: string[] }) {
  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-black tracking-wide text-white/85">Rock Cycle</p>
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-200">
        {stages.map((stage, idx) => (
          <span key={`${stage}-${idx}`} className="flex items-center gap-2">
            <span className="rounded-2xl bg-amber-500/20 px-3 py-1 ring-1 ring-amber-300/30">{stage}</span>
            {idx < stages.length - 1 ? <span className="text-zinc-500">↻</span> : null}
          </span>
        ))}
      </div>
    </div>
  );
}

function BinaryStrip({ bits, title, subtitle }: { bits: number[]; title?: string; subtitle?: string }) {
  return (
    <div className="space-y-3 text-center">
      {title ? <p className="text-base font-black text-white">{title}</p> : null}
      <div className="flex items-center justify-center gap-1">
        {bits.map((b, idx) => (
          <motion.span
            key={idx}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className={`grid h-10 w-10 place-items-center rounded-xl text-base font-black ${
              b === 1 ? "bg-cyan-400 text-zinc-950 shadow-lg shadow-cyan-500/30" : "bg-zinc-800 text-zinc-400"
            } ring-1 ring-white/15`}
          >
            {b}
          </motion.span>
        ))}
      </div>
      {subtitle ? <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">{subtitle}</p> : null}
    </div>
  );
}

function TruthTable({ table, subtitle }: { table?: Visual["truthTable"]; subtitle?: string }) {
  if (!table) return null;
  const cols = table.rows[0] && table.rows[0].b !== undefined ? 3 : 2;
  return (
    <div className="space-y-3">
      <p className="text-center text-base font-black text-white">{table.gate}</p>
      <div className="mx-auto inline-grid gap-1 rounded-2xl bg-zinc-900/70 p-2 ring-1 ring-white/10" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        <span className="px-3 py-1 text-center text-[11px] font-black uppercase tracking-wider text-zinc-400">A</span>
        {cols === 3 ? <span className="px-3 py-1 text-center text-[11px] font-black uppercase tracking-wider text-zinc-400">B</span> : null}
        <span className="px-3 py-1 text-center text-[11px] font-black uppercase tracking-wider text-zinc-400">Out</span>
        {table.rows.map((row, idx) => (
          <Fragment key={idx}>
            <span className="rounded-lg bg-zinc-800/60 px-3 py-1 text-center text-sm text-zinc-100">{row.a}</span>
            {cols === 3 ? <span className="rounded-lg bg-zinc-800/60 px-3 py-1 text-center text-sm text-zinc-100">{row.b}</span> : null}
            <span className={`rounded-lg px-3 py-1 text-center text-sm font-black ${row.out === 1 ? "bg-emerald-500/30 text-emerald-100" : "bg-zinc-800/60 text-zinc-300"}`}>{row.out}</span>
          </Fragment>
        ))}
      </div>
      {subtitle ? <p className="text-center text-[11px] uppercase tracking-[0.3em] text-zinc-400">{subtitle}</p> : null}
    </div>
  );
}

function Gears({ gears, title, subtitle }: { gears: { teeth: number; label?: string }[]; title?: string; subtitle?: string }) {
  return (
    <div className="space-y-3">
      {title ? <p className="text-center text-sm font-black text-white/85">{title}</p> : null}
      <div className="flex items-center justify-center gap-6">
        {gears.map((g, idx) => {
          const size = 60 + Math.min(60, g.teeth * 1.4);
          return (
            <motion.div
              key={idx}
              animate={{ rotate: idx % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 6 + idx * 2, repeat: Infinity, ease: "linear" }}
              className="relative"
              style={{ width: size, height: size }}
            >
              <div className="grid h-full w-full place-items-center rounded-full bg-gradient-to-br from-zinc-300 to-zinc-600 shadow-xl ring-2 ring-white/20">
                <span className="text-xs font-black text-zinc-900">{g.teeth}T</span>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-6 text-[11px] uppercase tracking-[0.2em] text-zinc-400">
        {gears.map((g, idx) => (<span key={idx}>{g.label ?? `Gear ${idx + 1}`}</span>))}
      </div>
      {subtitle ? <p className="text-center text-[11px] uppercase tracking-[0.3em] text-zinc-400">{subtitle}</p> : null}
    </div>
  );
}

function CodeBlock({ lines, highlight, title }: { lines: string[]; highlight?: number; title?: string }) {
  return (
    <div className="space-y-3">
      {title ? <p className="text-center text-sm font-black text-white/85">{title}</p> : null}
      <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-zinc-950/80 p-3 text-left text-xs leading-6 text-zinc-100 ring-1 ring-white/5">
        {lines.map((line, idx) => (
          <div key={idx} className={`flex gap-2 ${highlight === idx ? "bg-violet-500/15 -mx-3 px-3" : ""}`}>
            <span className="select-none text-zinc-500">{String(idx + 1).padStart(2, "0")}</span>
            <code className="text-zinc-200">{line}</code>
          </div>
        ))}
      </pre>
    </div>
  );
}

function CircuitBoard({ nodes, closed, title }: { nodes: string[]; closed?: boolean; title?: string }) {
  return (
    <div className="space-y-3">
      {title ? <p className="text-center text-sm font-black text-white/85">{title}</p> : null}
      <div className="flex items-center justify-center gap-2 text-xs text-zinc-200">
        {nodes.map((node, idx) => (
          <span key={idx} className="flex items-center gap-2">
            <span className={`rounded-2xl px-3 py-1 ring-1 ${closed ? "bg-emerald-500/20 ring-emerald-300/30 text-emerald-100" : "bg-amber-500/20 ring-amber-300/30 text-amber-100"}`}>{node}</span>
            {idx < nodes.length - 1 ? <span className="text-zinc-500">━</span> : null}
          </span>
        ))}
      </div>
    </div>
  );
}

function CellDiagram({ organelles, title }: { organelles: { name: string; emoji: string }[]; title?: string }) {
  return (
    <div className="space-y-3">
      {title ? <p className="text-center text-sm font-black tracking-wide text-white/85">{title}</p> : null}
      <div className="relative mx-auto h-44 w-44 rounded-full bg-gradient-to-br from-emerald-500/40 via-cyan-500/30 to-violet-500/40 ring-2 ring-white/15">
        {organelles.map((org, idx) => {
          const angle = (idx / Math.max(1, organelles.length)) * Math.PI * 2;
          const radius = 56;
          const x = 88 + Math.cos(angle) * radius;
          const y = 88 + Math.sin(angle) * radius;
          return (
            <span
              key={org.name}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/15 px-2 py-1 text-[11px] font-black text-white shadow ring-1 ring-white/20"
              style={{ left: `${x}px`, top: `${y}px` }}
              title={org.name}
            >
              {org.emoji}
            </span>
          );
        })}
      </div>
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

  if (puzzle.mode === "numpad") {
    return <Numpad puzzle={puzzle} state={state} setState={setState} locked={locked} />;
  }

  if (puzzle.mode === "sort") {
    return <SortCategories puzzle={puzzle} state={state} setState={setState} locked={locked} />;
  }

  return <Swipe labels={puzzle.swipeLabels ?? []} state={state} setState={setState} locked={locked} />;
}

function Numpad({ puzzle, state, setState, locked }: { puzzle: Puzzle; state: PlayState; setState: (s: Partial<PlayState>) => void; locked: boolean }) {
  const keys: string[] = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    puzzle.numpadAllowMinus ? "−" : "",
    "0",
    puzzle.numpadAllowDecimal ? "." : "",
  ];
  const press = (key: string) => {
    if (locked || !key) return;
    if (key === "−") {
      setState({ numpad: state.numpad.startsWith("-") ? state.numpad.slice(1) : `-${state.numpad}` });
      return;
    }
    if (key === "." && state.numpad.includes(".")) return;
    setState({ numpad: state.numpad + key });
  };
  return (
    <div className="rounded-3xl bg-zinc-800/70 p-4 ring-1 ring-white/10">
      <div className="mb-3 grid min-h-16 place-items-center rounded-2xl bg-zinc-900/80 px-4 text-center font-mono text-3xl font-black tracking-wider text-cyan-100 ring-1 ring-white/10">
        {state.numpad.length > 0 ? state.numpad.replace(/-/g, "−") : <span className="text-zinc-600">type a number</span>}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {keys.map((key, i) => (
          <motion.button
            key={`${key}-${i}`}
            type="button"
            whileTap={{ scale: 0.94 }}
            disabled={locked || !key}
            onClick={() => press(key)}
            className={`min-h-14 rounded-2xl text-xl font-black ring-1 ring-white/10 ${
              key === ""
                ? "invisible"
                : key === "−" || key === "."
                ? "bg-zinc-800 text-amber-200"
                : "bg-zinc-900 text-white"
            }`}
          >
            {key}
          </motion.button>
        ))}
      </div>
      <button
        type="button"
        disabled={locked || state.numpad.length === 0}
        onClick={() => setState({ numpad: state.numpad.slice(0, -1) })}
        className="mt-2 w-full rounded-2xl bg-rose-500/15 py-3 text-sm font-black text-rose-100 ring-1 ring-rose-300/30 disabled:opacity-40"
      >
        ⌫ Backspace
      </button>
    </div>
  );
}

function SortCategories({ puzzle, state, setState, locked }: { puzzle: Puzzle; state: PlayState; setState: (s: Partial<PlayState>) => void; locked: boolean }) {
  const items = puzzle.sortItems ?? [];
  const categories = puzzle.sortCategories ?? [];
  const placedLabels = Object.keys(state.sort);
  const unplaced = items.filter((item) => !placedLabels.includes(item.label));
  const assign = (cat: string) => {
    if (!state.pendingItem || locked) return;
    setState({ sort: { ...state.sort, [state.pendingItem]: cat }, pendingItem: null });
  };
  const unassign = (label: string) => {
    if (locked) return;
    const next = { ...state.sort };
    delete next[label];
    setState({ sort: next, pendingItem: null });
  };
  return (
    <div className="space-y-3">
      <div className="rounded-3xl bg-zinc-800/70 p-3 ring-1 ring-white/10">
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
          Cards{unplaced.length > 0 ? "" : " · all placed"}
        </p>
        <div className="flex flex-wrap gap-2">
          {unplaced.length === 0 ? (
            <span className="text-xs text-zinc-500">Tap a bucket card to reassign.</span>
          ) : (
            unplaced.map((item) => (
              <button
                key={item.label}
                type="button"
                disabled={locked}
                onClick={() => setState({ pendingItem: state.pendingItem === item.label ? null : item.label })}
                className={`rounded-2xl px-3 py-2 text-sm font-black ring-1 transition ${
                  state.pendingItem === item.label
                    ? "bg-amber-400 text-amber-950 ring-amber-200"
                    : "bg-zinc-900 text-zinc-100 ring-white/10"
                }`}
              >
                {item.label}
              </button>
            ))
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {categories.map((category) => {
          const inside = items.filter((item) => state.sort[item.label] === category);
          return (
            <button
              key={category}
              type="button"
              disabled={locked || !state.pendingItem}
              onClick={() => assign(category)}
              className={`min-h-32 rounded-3xl border-2 border-dashed p-3 text-left transition ${
                state.pendingItem ? "border-cyan-300/60 bg-cyan-500/10" : "border-white/10 bg-zinc-900/60"
              }`}
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-300">{category}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {inside.length === 0 ? (
                  <span className="text-[11px] text-zinc-500">empty</span>
                ) : (
                  inside.map((item) => (
                    <span
                      key={item.label}
                      onClick={(event) => {
                        event.stopPropagation();
                        unassign(item.label);
                      }}
                      className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-bold ring-1 ring-white/10"
                    >
                      {item.label} ×
                    </span>
                  ))
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
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
    numpad: "Numpad",
    sort: "Sort",
  };
  return labels[mode];
}

function metaInteractionDisplay(meta: PuzzleMeta): InteractionTypeKey {
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
  };
  return map[meta.interactionHint];
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

function CategoryCard({
  meta,
  xp,
  onClick,
  unlocked,
  required,
  currentXp,
}: {
  meta: PuzzleMeta;
  xp: number;
  onClick: () => void;
  unlocked: boolean;
  required: number;
  currentXp: number;
}) {
  const progress = required === 0 ? 1 : Math.min(1, currentXp / required);
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] border p-4 text-left shadow-xl shadow-black/20 ring-1 transition ${
        unlocked
          ? "border-white/10 bg-zinc-950/70 ring-white/5 hover:-translate-y-0.5 hover:border-white/20 hover:bg-zinc-900/85"
          : "border-white/5 bg-zinc-950/40 ring-white/5 hover:border-amber-300/30"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${meta.gradient} transition ${
          unlocked ? "opacity-10 group-hover:opacity-20" : "opacity-5"
        }`}
      />
      <div className="flex items-start gap-3">
        <div
          className={`relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${meta.gradient} text-3xl shadow-lg ${
            unlocked ? "" : "saturate-50"
          }`}
        >
          <span className={unlocked ? "" : "opacity-60"}>{meta.emoji}</span>
          {!unlocked ? (
            <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-zinc-900 text-base ring-1 ring-amber-300/40">🔒</span>
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className={`line-clamp-2 text-sm font-black leading-tight ${unlocked ? "text-white" : "text-zinc-400"}`}>{meta.title}</h3>
          <p className="mt-0.5 truncate text-[11px] text-zinc-400">{meta.short}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            <Badge tone="violet">{gradeLabel(meta.grade)}</Badge>
            <Badge tone="sky">{subjectLabel(meta.subject)}</Badge>
            {unlocked ? (
              <Badge tone="amber">+{xp} XP</Badge>
            ) : (
              <Badge tone="amber">🔒 {required} XP</Badge>
            )}
            {meta.isBoss ? <Badge tone="amber">BOSS</Badge> : null}
            {meta.isMasteryTest ? <Badge tone="violet">Mastery</Badge> : null}
          </div>
        </div>
      </div>
      <p className={`mt-3 line-clamp-2 text-xs leading-snug ${unlocked ? "text-zinc-300" : "text-zinc-500"}`}>{meta.skill}</p>
      {!unlocked ? (
        <div className="mt-3 space-y-1">
          <div className="h-1.5 rounded-full bg-white/10">
            <div className="h-1.5 rounded-full bg-amber-400/80" style={{ width: `${progress * 100}%` }} />
          </div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-amber-200/80">
            {currentXp}/{required} XP to unlock
          </p>
        </div>
      ) : null}
      <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-[11px] text-zinc-500">
        <span className="inline-flex max-w-[65%] items-center gap-1 truncate rounded-full bg-white/5 px-2 py-0.5 font-bold uppercase tracking-wider text-zinc-300 ring-1 ring-white/10">
          {metaInteractionDisplay(meta)}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1">⏱ ~{meta.estMin} min</span>
      </div>
    </motion.button>
  );
}

function SkillTree({
  metas,
  xp,
  currentDifficulty,
  onPick,
  completions,
}: {
  metas: PuzzleMeta[];
  xp: number;
  currentDifficulty: Difficulty;
  onPick: (id: PuzzleId) => void;
  completions: Record<string, number>;
}) {
  const tierFor = (meta: PuzzleMeta) => {
    const req = xpRequiredFor(meta);
    if (req === 0) return "Tier 1 · Grade 9 Easy";
    if (req <= 250) return "Tier 2 · Grade 9 Med/Hard";
    if (req <= 500) return "Tier 3 · Grade 10";
    if (req <= 1200) return "Tier 4 · Grade 11";
    return "Tier 5 · Grade 12 · Boss · Mastery";
  };
  const tiers = ["Tier 1 · Grade 9 Easy", "Tier 2 · Grade 9 Med/Hard", "Tier 3 · Grade 10", "Tier 4 · Grade 11", "Tier 5 · Grade 12 · Boss · Mastery"];
  const grouped: Record<string, PuzzleMeta[]> = {};
  for (const tier of tiers) grouped[tier] = [];
  for (const meta of metas) {
    const tier = tierFor(meta);
    grouped[tier]!.push(meta);
  }
  return (
    <div className="space-y-4">
      {tiers.map((tier) => {
        const inTier = grouped[tier]!;
        if (inTier.length === 0) return null;
        const unlockedInTier = inTier.filter((m) => isUnlocked(m, xp, completions)).length;
        return (
          <div key={tier} className="rounded-[2rem] border border-white/10 bg-zinc-950/55 p-4 ring-1 ring-white/5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-200">{tier}</p>
                <p className="mt-1 text-base font-black text-white">{inTier.length} puzzles · {unlockedInTier} unlocked</p>
              </div>
              <div className="h-1.5 w-32 rounded-full bg-white/10">
                <div className="h-1.5 rounded-full bg-emerald-400" style={{ width: `${(unlockedInTier / inTier.length) * 100}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {inTier.map((meta) => (
                <CategoryCard
                  key={meta.id}
                  meta={meta}
                  xp={xpRewardFor(currentDifficulty)}
                  onClick={() => onPick(meta.id)}
                  unlocked={isUnlocked(meta, xp, completions)}
                  required={xpRequiredFor(meta)}
                  currentXp={xp}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: "violet" | "cyan" | "amber" | "emerald" }) {
  const colors: Record<typeof tone, string> = {
    violet: "from-violet-500/25 to-fuchsia-500/10 text-violet-100",
    cyan: "from-cyan-500/25 to-blue-500/10 text-cyan-100",
    amber: "from-amber-500/25 to-orange-500/10 text-amber-100",
    emerald: "from-emerald-500/25 to-teal-500/10 text-emerald-100",
  };
  return (
    <div className={`rounded-3xl border border-white/10 bg-gradient-to-br ${colors[tone]} p-3 ring-1 ring-white/5`}>
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-tight text-white">{value}</p>
    </div>
  );
}

function subjectEmoji(subject: SubjectFilter) {
  const icons: Record<SubjectFilter, string> = {
    All: "✨",
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

const SUBJECT_DISPLAY_OVERRIDES: Partial<Record<SubjectFilter, string>> = {
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

function subjectLabel(subject: SubjectFilter) {
  return SUBJECT_DISPLAY_OVERRIDES[subject] ?? subject;
}

function subjectDemoCopy(subject: Subject) {
  const copy: Record<Subject, string> = {
    Arithmetic: "Quick visual fluency with numbers, fractions, ratios, and patterns.",
    Algebra: "Balance, unlock, simplify, and model equations through game-like mechanics.",
    Geometry: "Fold, rotate, map, and measure shapes with spatial reasoning challenges.",
    Trigonometry: "Explore triangles, waves, unit-circle values, and motion models.",
    Precalculus: "Connect functions, vectors, matrices, conics, and parametric motion.",
    Calculus: "Predict limits, slopes, integrals, curve behavior, and differential fields.",
    Statistics: "Build distributions, trees, decisions, and data-story diagnostics.",
    Logic: "Practice constraints, memory, sequences, and deduction loops.",
    Probability: "Spin, roll, and reason about chance through visual experiments.",
    NumberTheory: "Hunt primes, GCDs, LCMs, and modular patterns.",
    FinancialMath: "Interest, percentages, budgets, and money decisions.",
    Biology: "Match organelles, trace flows, sort stages, and balance ecosystems.",
    Chemistry: "Build molecules, balance equations, classify bonds, and read pH.",
    Physics: "Combine vectors, wire circuits, sequence energy, and reflect light.",
    EarthScience: "Order the rock cycle, map tectonics, sequence phases, and read weather.",
    GeneralScience: "Design experiments, sort claims, rank evidence, and assemble CER.",
    Astronomy: "Order planets, sequence moon phases, and read the sky.",
    Genetics: "Pair DNA bases, predict traits, and read Punnett squares.",
    Ecology: "Connect food webs, sort niches, and balance ecosystems.",
    Anatomy: "Trace body systems and connect organs to functions.",
    EnvironmentalScience: "Sort renewable vs non-renewable, model climate, audit impact.",
    CodingLogic: "Trace programs, find bugs, and reason about control flow.",
    Algorithms: "Compare sorts, searches, and Big-O complexity puzzles.",
    AIML: "Wire neurons, classify data, and reason about ML basics.",
    Cybersecurity: "Spot phishing, sort threats, and harden a system.",
    Databases: "Read SQL, build joins, and match queries to results.",
    RoboticsProgramming: "Sequence robot commands and reason about sensors.",
    WebDev: "Sort HTML/CSS/JS roles and connect frontend to backend.",
    APIs: "Order request lifecycles and match HTTP verbs to actions.",
    Networks: "Map layers, addresses, and routing concepts.",
    DigitalSystems: "Read binary, hex, and reason about logic gates.",
    MechanicalEng: "Reason about gears, pulleys, and simple machines.",
    ElectricalEng: "Compare AC/DC, Ohm's law, and power flow.",
    CivilEng: "Plan trusses, water flow, and load paths.",
    AerospaceEng: "Tune lift, drag, thrust, and launch conditions.",
    Robotics: "Aim arms, drive bases, and read robot sensors.",
    StructuralDesign: "Predict tension, compression, and shear failure.",
    MaterialsScience: "Sort by stiffness, elasticity, and durability.",
    Circuits: "Wire series/parallel and complete the loop.",
    SystemsEng: "Connect inputs, processes, and outputs into a system.",
    DesignThinking: "Trade off constraints across user, build, and value.",
  };
  return copy[subject];
}

function SubjectDemoCard({
  subject,
  count,
  selected,
  onSelect,
}: {
  subject: Subject;
  count: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const sample = METAS.find((meta) => meta.subject === subject);
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`min-w-[15rem] flex-1 rounded-[2rem] border p-4 text-left transition ${
        selected
          ? "border-violet-300/40 bg-violet-500/15 shadow-lg shadow-violet-500/10"
          : "border-white/10 bg-zinc-950/65 hover:border-white/20 hover:bg-zinc-900/75"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-2xl ring-1 ring-white/10">
          {subjectEmoji(subject)}
        </span>
        <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-zinc-300 ring-1 ring-white/10">
          {count} puzzles
        </span>
      </div>
      <h3 className="mt-3 text-lg font-black text-white">{subject}</h3>
      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-400">{subjectDemoCopy(subject)}</p>
      <p className="mt-3 truncate text-[11px] text-zinc-500">Demo: {sample?.title ?? "Coming soon"}</p>
    </button>
  );
}

function SearchInput({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">🔎</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search puzzles, skills, or topics…"
        className="w-full rounded-2xl border border-white/10 bg-zinc-900/70 py-3 pl-9 pr-9 text-sm text-white placeholder:text-zinc-500 focus:border-violet-400/60 focus:outline-none focus:ring-2 focus:ring-violet-400/20"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-white/5 text-xs text-zinc-300"
          aria-label="Clear search"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}

function GameModeChip({ mode, active, onSelect }: { mode: GameMode; active: boolean; onSelect: (mode: GameMode) => void }) {
  const meta = GAME_MODE_META[mode];
  return (
    <button
      type="button"
      onClick={() => onSelect(mode)}
      className={`shrink-0 rounded-2xl px-3 py-2 text-left transition ${
        active
          ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25"
          : "bg-zinc-900/70 text-zinc-200 ring-1 ring-white/10 hover:bg-zinc-800/70"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg leading-none">{meta.emoji}</span>
        <span className="text-xs font-black uppercase tracking-wider">{meta.label}</span>
      </div>
      <p className={`mt-0.5 text-[10px] leading-tight ${active ? "text-white/80" : "text-zinc-400"}`}>{meta.tagline}</p>
    </button>
  );
}

interface GameModeMeta {
  label: string;
  tagline: string;
  emoji: string;
  forcesDifficulty?: Difficulty;
  xpMultiplier?: number;
  countdown?: number;
  lives?: number;
  description: string;
}

const GAME_MODE_META: Record<GameMode, GameModeMeta> = {
  practice: { label: "Practice", emoji: "🧘", tagline: "Infinite calm runs", description: "Endless puzzles at adaptive difficulty.", xpMultiplier: 1 },
  timed: { label: "Timed", emoji: "⏱️", tagline: "Beat the clock", description: "30 second countdown per puzzle.", countdown: 30, xpMultiplier: 1.5 },
  daily: { label: "Daily", emoji: "🌅", tagline: "One per day", description: "Today's locked challenge.", xpMultiplier: 1.25 },
  streak: { label: "Streak", emoji: "🔥", tagline: "Don't break it", description: "Lose your streak on a wrong answer.", xpMultiplier: 1.2 },
  boss: { label: "Boss", emoji: "👹", tagline: "Hard only · 3× XP", description: "Forced hard mode with triple XP.", forcesDifficulty: "hard", xpMultiplier: 3 },
  mistakes: { label: "Mistake Review", emoji: "🪞", tagline: "Replay your misses", description: "Replays types you got wrong recently.", xpMultiplier: 1 },
  skillTree: { label: "Skill Tree", emoji: "🌳", tagline: "Climb a subject", description: "Walks subject mastery.", xpMultiplier: 1 },
  race: { label: "Race", emoji: "🏁", tagline: "vs ghost runner", description: "Simulated opponent ticks alongside you.", countdown: 45, xpMultiplier: 1.5 },
  survival: { label: "Survival", emoji: "❤️", tagline: "3 lives only", description: "Lose all lives and the run ends.", lives: 3, xpMultiplier: 2 },
  mastery: { label: "Mastery Test", emoji: "🏆", tagline: "5 puzzles in a row", description: "Five-puzzle session to unlock mastery.", xpMultiplier: 2 },
};

const GAME_MODE_ORDER: readonly GameMode[] = [
  "practice",
  "timed",
  "daily",
  "streak",
  "boss",
  "mistakes",
  "skillTree",
  "race",
  "survival",
  "mastery",
];

const INTERACTION_OPTIONS: readonly InteractionFilter[] = [
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
];

const GRADE_OPTIONS: readonly GradeFilter[] = ["All", "9", "10", "11", "12", "K-8"];
const MATH_SUBJECTS: readonly SubjectFilter[] = [
  "All",
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
const SCIENCE_SUBJECT_OPTIONS: readonly SubjectFilter[] = [
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
const TECH_SUBJECT_OPTIONS: readonly SubjectFilter[] = [
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
const ENGINEERING_SUBJECT_OPTIONS: readonly SubjectFilter[] = [
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
const DIFFICULTY_OPTIONS: readonly DifficultyFilter[] = ["All", "easy", "medium", "hard"];
const DOMAIN_OPTIONS: readonly DomainFilter[] = ["All", "Math", "Science", "Technology", "Engineering"];
const LOCK_OPTIONS: readonly LockFilter[] = ["All", "Unlocked", "Locked"];

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
  const [hintIndex, setHintIndex] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [daily, setDaily] = useState<PuzzleId>("weightScale");
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>("All");
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>("All");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("All");
  const [interactionFilter, setInteractionFilter] = useState<InteractionFilter>("All");
  const [search, setSearch] = useState("");
  const [gameMode, setGameMode] = useState<GameMode>("practice");
  const [lives, setLives] = useState(3);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [mistakeIds, setMistakeIds] = useState<PuzzleId[]>([]);
  const [masteryRemaining, setMasteryRemaining] = useState(0);
  const [runOver, setRunOver] = useState(false);
  const [domainFilter, setDomainFilter] = useState<DomainFilter>("All");
  const [lockFilter, setLockFilter] = useState<LockFilter>("All");
  const [catalogView, setCatalogView] = useState<CatalogView>("grid");
  const [lockedToast, setLockedToast] = useState<{ title: string; message: string } | null>(null);
  const [energy, setEnergy] = useState(MAX_ENERGY);
  const [lastEnergyAt, setLastEnergyAt] = useState<number>(() => Date.now());
  const [categoryCompletions, setCategoryCompletions] = useState<Record<string, number>>({});
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSource, setAiSource] = useState<"ai" | "mock" | "fallback" | "procedural" | null>(null);

  const adaptiveDifficulty = difficultyFor(solved);
  const activeMeta = active ? metaFor(active) : null;
  const setState = (next: Partial<PlayState>) => setRawState((prev) => ({ ...prev, ...next }));

  const resolveDifficulty = useCallback(
    (override?: number): Difficulty => {
      const forced = GAME_MODE_META[gameMode].forcesDifficulty;
      if (forced) return forced;
      if (difficultyFilter !== "All") return difficultyFilter;
      return difficultyFor(typeof override === "number" ? override : solved);
    },
    [difficultyFilter, gameMode, solved],
  );

  const effectiveDifficulty: Difficulty = resolveDifficulty();

  const visibleMetas = useMemo(
    () =>
      METAS.filter((meta) => {
        if (gradeFilter !== "All" && meta.grade !== gradeFilter) return false;
        if (subjectFilter !== "All" && meta.subject !== subjectFilter) return false;
        if (domainFilter !== "All" && domainFor(meta.subject) !== domainFilter) return false;
        if (interactionFilter !== "All" && metaInteractionDisplay(meta) !== interactionFilter) return false;
        if (lockFilter === "Unlocked" && !isUnlocked(meta, xp, categoryCompletions)) return false;
        if (lockFilter === "Locked" && isUnlocked(meta, xp, categoryCompletions)) return false;
        if (search.trim().length > 0) {
          const haystack = `${meta.title} ${meta.short} ${meta.skill} ${meta.subject}`.toLowerCase();
          if (!haystack.includes(search.trim().toLowerCase())) return false;
        }
        return true;
      }),
    [gradeFilter, subjectFilter, interactionFilter, search, domainFilter, lockFilter, xp, categoryCompletions],
  );

  const subjectOptions = useMemo<readonly SubjectFilter[]>(() => {
    if (domainFilter === "Science") return SCIENCE_SUBJECT_OPTIONS;
    if (domainFilter === "Math") return MATH_SUBJECTS;
    if (domainFilter === "Technology") return TECH_SUBJECT_OPTIONS;
    if (domainFilter === "Engineering") return ENGINEERING_SUBJECT_OPTIONS;
    return [
      "All",
      ...MATH_SUBJECTS.filter((s) => s !== "All"),
      ...SCIENCE_SUBJECT_OPTIONS.filter((s) => s !== "All"),
      ...TECH_SUBJECT_OPTIONS.filter((s) => s !== "All"),
      ...ENGINEERING_SUBJECT_OPTIONS.filter((s) => s !== "All"),
    ];
  }, [domainFilter]);

  const nextUnlock = useMemo(() => {
    const locked = METAS.filter((meta) => !isUnlocked(meta, xp, categoryCompletions));
    if (locked.length === 0) return null;
    locked.sort((a, b) => xpRequiredFor(a) - xpRequiredFor(b));
    return locked[0];
  }, [xp, categoryCompletions]);

  const unlockedCount = useMemo(() => METAS.filter((meta) => isUnlocked(meta, xp, categoryCompletions)).length, [xp, categoryCompletions]);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const progress = JSON.parse(saved) as {
        xp?: number;
        streak?: number;
        solved?: number;
        mistakes?: PuzzleId[];
        energy?: number;
        lastEnergyAt?: number;
        completions?: Record<string, number>;
      };
      setXp(progress.xp ?? 0);
      setStreak(progress.streak ?? 0);
      setSolved(progress.solved ?? 0);
      setMistakeIds(progress.mistakes ?? []);
      setCategoryCompletions(progress.completions ?? {});
      if (typeof progress.energy === "number" && typeof progress.lastEnergyAt === "number") {
        const elapsed = Date.now() - progress.lastEnergyAt;
        const regen = Math.floor(elapsed / ENERGY_REGEN_MS);
        const restored = Math.min(MAX_ENERGY, (progress.energy ?? MAX_ENERGY) + regen);
        setEnergy(restored);
        setLastEnergyAt(restored === MAX_ENERGY ? Date.now() : progress.lastEnergyAt + regen * ENERGY_REGEN_MS);
      }
    }
    const daySeed = new Date().toISOString().slice(0, 10).split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    setDaily(METAS[daySeed % METAS.length]!.id);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ xp, streak, solved, mistakes: mistakeIds, energy, lastEnergyAt, completions: categoryCompletions }),
    );
  }, [xp, streak, solved, mistakeIds, energy, lastEnergyAt, categoryCompletions]);

  useEffect(() => {
    if (energy >= MAX_ENERGY) return;
    const id = window.setInterval(() => {
      const elapsed = Date.now() - lastEnergyAt;
      if (elapsed >= ENERGY_REGEN_MS) {
        const ticks = Math.floor(elapsed / ENERGY_REGEN_MS);
        setEnergy((value) => Math.min(MAX_ENERGY, value + ticks));
        setLastEnergyAt(Date.now());
      }
    }, 15000);
    return () => window.clearInterval(id);
  }, [energy, lastEnergyAt]);

  useEffect(() => {
    if (subjectFilter === "All") return;
    if (!subjectOptions.includes(subjectFilter)) setSubjectFilter("All");
  }, [domainFilter, subjectFilter, subjectOptions]);

  useEffect(() => {
    if (!lockedToast) return;
    const id = window.setTimeout(() => setLockedToast(null), 2400);
    return () => window.clearTimeout(id);
  }, [lockedToast]);

  useEffect(() => {
    if (!confetti) return;
    const timer = window.setTimeout(() => setConfetti(false), 1300);
    return () => window.clearTimeout(timer);
  }, [confetti]);

  useEffect(() => {
    if (!active || !puzzle || result !== "idle" || runOver) return;
    if (secondsLeft <= 0) return;
    const id = window.setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(id);
  }, [active, puzzle, result, secondsLeft, runOver]);

  useEffect(() => {
    if (!active || !puzzle || result !== "idle" || runOver) return;
    const countdown = GAME_MODE_META[gameMode].countdown;
    if (!countdown) return;
    if (secondsLeft === 0) {
      setResult("wrong");
      setStreak(0);
      if (gameMode === "survival") setLives((value) => Math.max(0, value - 1));
      setMistakeIds((prev) => Array.from(new Set([puzzle.type, ...prev])).slice(0, 12));
    }
  }, [secondsLeft, active, puzzle, result, gameMode, runOver]);

  const start = useCallback(
    async (type: PuzzleId, modeOverride?: GameMode) => {
      const meta = metaFor(type);
      if (meta && !isUnlocked(meta, xp, categoryCompletions)) {
        const subjectCount = categoryCompletions[meta.subject] ?? 0;
        let message = meta.unlockMessage ?? `Reach ${xpRequiredFor(meta)} XP to unlock ${meta.title}.`;
        if (meta.isBoss && subjectCount < BOSS_CATEGORY_THRESHOLD) {
          message = `Boss locked — finish ${BOSS_CATEGORY_THRESHOLD - subjectCount} more ${subjectLabel(meta.subject)} puzzles.`;
        } else if (meta.isMasteryTest && subjectCount < MASTERY_CATEGORY_THRESHOLD) {
          message = `Mastery test locked — finish ${MASTERY_CATEGORY_THRESHOLD - subjectCount} more ${subjectLabel(meta.subject)} puzzles.`;
        }
        setLockedToast({ title: meta.title, message });
        return;
      }
      if (energy <= 0) {
        setLockedToast({ title: "Out of energy", message: "Wait for energy to regen, or come back later." });
        return;
      }
      const mode = modeOverride ?? gameMode;
      const useDifficulty: Difficulty = (() => {
        const forced = GAME_MODE_META[mode].forcesDifficulty;
        if (forced) return forced;
        if (difficultyFilter !== "All") return difficultyFilter;
        return difficultyFor(solved);
      })();
      if (modeOverride && modeOverride !== gameMode) setGameMode(modeOverride);
      setActive(type);
      setHint(false);
      setHintIndex(0);
      setRunOver(false);

      let next: Puzzle | null = null;
      if (aiEnabled && meta) {
        const aiMode = aiCompatibleMode(meta);
        if (aiMode) {
          setAiLoading(true);
          setPuzzle(null);
          try {
            const response = await fetch("/api/stem-puzzle/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: meta.id,
                title: meta.title,
                domain: domainFor(meta.subject),
                subject: meta.subject,
                skill: meta.skill,
                grade: meta.grade,
                difficulty: useDifficulty,
                mode: aiMode,
              }),
            });
            if (response.ok) {
              const data = (await response.json()) as { spec?: unknown; source?: string };
              if (data.spec) {
                next = puzzleFromAiSpec(meta, data.spec as AiPuzzleSpec, useDifficulty, aiMode);
                setAiSource((data.source as "ai" | "mock" | "fallback") ?? "ai");
              }
            }
          } catch (err) {
            console.error("AI puzzle fetch failed", err);
          } finally {
            setAiLoading(false);
          }
        }
      }
      if (!next) {
        next = makePuzzle(type, useDifficulty);
        setAiSource(aiEnabled ? "fallback" : "procedural");
      }
      setPuzzle(next);
      setRawState(initialState(next));
      setResult("idle");
      const gMeta = GAME_MODE_META[mode];
      setSecondsLeft(gMeta.countdown ?? 0);
      if (mode === "survival") setLives(gMeta.lives ?? 3);
      if (mode === "mastery") setMasteryRemaining(5);
    },
    [difficultyFilter, gameMode, solved, xp, categoryCompletions, energy, aiEnabled],
  );

  const nextPuzzle = useCallback(() => {
    if (!active) return;
    if (gameMode === "mastery" && masteryRemaining <= 1) {
      setRunOver(true);
      setMasteryRemaining(0);
      return;
    }
    if (gameMode === "mastery") setMasteryRemaining((value) => value - 1);
    const targetType =
      gameMode === "mistakes" && mistakeIds.length > 0
        ? (mistakeIds[Math.floor(Math.random() * mistakeIds.length)] as PuzzleId)
        : active;
    if (aiEnabled) {
      void start(targetType);
      return;
    }
    const useDifficulty: Difficulty = resolveDifficulty(solved + 1);
    const next = makePuzzle(targetType, useDifficulty);
    setActive(targetType);
    setPuzzle(next);
    setRawState(initialState(next));
    setResult("idle");
    setHint(false);
    setHintIndex(0);
    setAiSource("procedural");
    setSecondsLeft(GAME_MODE_META[gameMode].countdown ?? 0);
  }, [active, aiEnabled, gameMode, masteryRemaining, mistakeIds, resolveDifficulty, solved, start]);

  const exitRun = () => {
    setActive(null);
    setPuzzle(null);
    setRunOver(false);
    setMasteryRemaining(0);
    setLives(3);
    setSecondsLeft(0);
  };

  const check = () => {
    if (!puzzle) return;
    if (result === "correct") {
      if (runOver) {
        exitRun();
        return;
      }
      if (gameMode === "survival" && lives <= 0) {
        setRunOver(true);
        return;
      }
      nextPuzzle();
      return;
    }
    if (result === "wrong") {
      if (gameMode === "survival" && lives <= 0) {
        setRunOver(true);
        return;
      }
      setRawState(initialState(puzzle));
      setResult("idle");
      setSecondsLeft(GAME_MODE_META[gameMode].countdown ?? 0);
      return;
    }
    const correct = isSolved(puzzle, state);
    setResult(correct ? "correct" : "wrong");
    if (correct) {
      const multiplier = GAME_MODE_META[gameMode].xpMultiplier ?? 1;
      const reward = Math.round((puzzle.xpReward ?? xpRewardFor(puzzle.difficulty)) * multiplier);
      setXp((value) => value + reward);
      setStreak((value) => value + 1);
      setSolved((value) => value + 1);
      setConfetti(true);
      const meta = metaFor(puzzle.type);
      if (meta) {
        setCategoryCompletions((prev) => ({
          ...prev,
          [meta.subject]: (prev[meta.subject] ?? 0) + 1,
          [`puzzle:${meta.id}`]: (prev[`puzzle:${meta.id}`] ?? 0) + 1,
        }));
      }
      if (gameMode === "mastery" && masteryRemaining <= 1) {
        setRunOver(true);
      }
    } else {
      setStreak(0);
      setMistakeIds((prev) => Array.from(new Set([puzzle.type, ...prev])).slice(0, 12));
      setEnergy((value) => Math.max(0, value - 1));
      setLastEnergyAt(Date.now());
      if (gameMode === "survival") {
        const remaining = lives - 1;
        setLives(remaining);
        if (remaining <= 0) setRunOver(true);
      }
    }
  };

  const currentHint = (() => {
    if (!puzzle) return "";
    if (puzzle.hints && puzzle.hints.length > 0) {
      return puzzle.hints[Math.min(hintIndex, puzzle.hints.length - 1)] ?? puzzle.hint;
    }
    return puzzle.hint;
  })();

  const subjectChips = useMemo(() => {
    return subjectOptions
      .filter((option): option is Subject => option !== "All")
      .map((subject) => ({
        subject,
        count: METAS.filter((meta) => meta.subject === subject).length,
      }))
      .filter((entry) => entry.count > 0);
  }, [subjectOptions]);

  const featuredMeta = visibleMetas[0] ?? metaFor(daily);
  const randomStart = () => {
    const visibleUnlocked = visibleMetas.filter((meta) => isUnlocked(meta, xp, categoryCompletions));
    const pool = visibleUnlocked.length > 0
      ? visibleUnlocked
      : METAS.filter((meta) => isUnlocked(meta, xp, categoryCompletions));
    if (pool.length === 0) return;
    start(pool[Math.floor(Math.random() * pool.length)]!.id);
  };

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[radial-gradient(circle_at_top_left,#312e81_0%,transparent_32%),radial-gradient(circle_at_top_right,#0e7490_0%,transparent_28%),linear-gradient(180deg,#050505_0%,#09090b_45%,#000_100%)] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute -right-24 top-48 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>
      <Confetti show={confetti} />

      <AnimatePresence>
        {lockedToast ? (
          <motion.div
            key="lock-toast"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed inset-x-0 top-[max(1rem,env(safe-area-inset-top))] z-50 mx-auto flex max-w-sm justify-center px-4"
          >
            <div className="flex items-start gap-3 rounded-2xl border border-amber-300/30 bg-amber-500/15 px-4 py-3 text-amber-50 shadow-2xl backdrop-blur-xl">
              <span className="text-xl">🔒</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-black">{lockedToast.title}</p>
                <p className="text-[11px] leading-snug text-amber-100/90">{lockedToast.message}</p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/55 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            {active ? (
              <button type="button" onClick={exitRun} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-xl ring-1 ring-white/10">‹</button>
            ) : (
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-500/20 text-xl ring-1 ring-violet-300/20">🧠</span>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-black tracking-tight sm:text-xl">{activeMeta?.title ?? "MindOrbit STEM Arcade"}</h1>
              <p className="truncate text-xs text-zinc-400">{activeMeta?.short ?? `${METAS.length} STEM puzzles · Math · Science · Tech · Engineering`}</p>
            </div>
            <span className="hidden rounded-full bg-violet-500/15 px-3 py-1.5 text-sm font-black text-violet-100 ring-1 ring-violet-300/30 sm:inline-flex">Lv {Math.floor(xp / LEVEL_XP) + 1}</span>
            <span className="hidden rounded-full bg-rose-500/15 px-3 py-1.5 text-sm font-black text-rose-100 ring-1 ring-rose-300/30 sm:inline-flex">🔥 {streak}</span>
            <button
              type="button"
              onClick={() => setAiEnabled((value) => !value)}
              aria-pressed={aiEnabled}
              title={aiEnabled ? "AI puzzle generation: ON" : "AI puzzle generation: OFF"}
              className={`hidden items-center gap-1 rounded-full px-3 py-1.5 text-sm font-black ring-1 transition sm:inline-flex ${
                aiEnabled
                  ? "bg-gradient-to-r from-fuchsia-500/25 to-violet-500/25 text-fuchsia-100 ring-fuchsia-300/40 shadow shadow-fuchsia-500/20"
                  : "bg-zinc-800/60 text-zinc-300 ring-white/10"
              }`}
            >
              <span>✨</span>
              <span>AI {aiEnabled ? "ON" : "OFF"}</span>
            </button>
            <span className={`rounded-full px-3 py-1.5 text-sm font-black ring-1 ${energy === 0 ? "bg-zinc-800 text-zinc-400 ring-white/10" : "bg-cyan-500/15 text-cyan-100 ring-cyan-300/30"}`}>🔋 {energy}/{MAX_ENERGY}</span>
            <span className="rounded-full bg-amber-500/15 px-3 py-1.5 text-sm font-black text-amber-100 ring-1 ring-amber-300/30">⚡ {xp}</span>
          </div>
          <div className="mt-3"><ProgressBar xp={xp} /></div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 pb-36 pt-5 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {!active ? (
            <motion.section key="selector" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-6">
              <section className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-950/70 shadow-2xl shadow-black/30 ring-1 ring-white/5">
                <div className="relative grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.25fr_0.75fr] lg:p-8">
                  <div className={`absolute inset-0 bg-gradient-to-br ${featuredMeta.gradient} opacity-10`} />
                  <div className="relative">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-violet-200">Visual Learning Arcade</p>
                    <h2 className="mt-3 max-w-2xl text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl">
                      Play your way through math &amp; science.
                    </h2>
                    <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-300 sm:text-base">
                      A polished playground for {METAS.length} visual puzzles across K–12 math &amp; science — with filters, modes, streaks, XP, and unlockable challenges.
                    </p>
                    <div className="mt-5 -mx-1 flex gap-2 overflow-x-auto rounded-2xl bg-zinc-900/70 p-1 ring-1 ring-white/10 sm:flex-wrap sm:overflow-visible">
                      {DOMAIN_OPTIONS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setDomainFilter(option)}
                          className={`shrink-0 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition ${
                            domainFilter === option ? "bg-white text-zinc-950 shadow" : "text-zinc-300 hover:text-white"
                          }`}
                        >
                          {option === "All" ? "All" : option === "Math" ? "🧮 Math" : option === "Science" ? "🔬 Science" : option === "Technology" ? "💻 Tech" : "🛠️ Eng"}
                        </button>
                      ))}
                    </div>
                    <div className="mt-5 max-w-2xl">
                      <SearchInput value={search} onChange={setSearch} />
                    </div>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={randomStart}
                        className="rounded-2xl bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-zinc-950 shadow-xl shadow-white/10"
                      >
                        Shuffle Puzzle
                      </button>
                      <button
                        type="button"
                        onClick={() => start(daily, "daily")}
                        className="rounded-2xl bg-amber-400 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-amber-950 shadow-xl shadow-amber-500/20"
                      >
                        Daily: {metaFor(daily).title}
                      </button>
                    </div>
                  </div>
                  <div className="relative grid grid-cols-2 gap-3 self-end">
                    <StatCard label="Puzzle Types" value={String(METAS.length)} tone="violet" />
                    <StatCard label="Visible" value={String(visibleMetas.length)} tone="cyan" />
                    <StatCard label="Streak" value={String(streak)} tone="amber" />
                    <StatCard label="Solved" value={String(solved)} tone="emerald" />
                  </div>
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-black/25 p-3 ring-1 ring-white/5 sm:p-4">
                <div>
                  <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Game Mode · {GAME_MODE_META[gameMode].description}</p>
                  <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 pr-6">
                    {GAME_MODE_ORDER.map((mode) => (
                      <GameModeChip key={mode} mode={mode} active={mode === gameMode} onSelect={setGameMode} />
                    ))}
                  </div>
                </div>
              </section>

              <div className="grid gap-5 lg:grid-cols-[20rem_minmax(0,1fr)]">
                <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
                  <div className="rounded-[2rem] border border-white/10 bg-zinc-950/75 p-4 shadow-xl shadow-black/20 ring-1 ring-white/5">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">Filters</p>
                        <h3 className="mt-1 text-lg font-black text-white">Tune the arcade</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setGradeFilter("All");
                          setSubjectFilter("All");
                          setDifficultyFilter("All");
                          setInteractionFilter("All");
                          setDomainFilter("All");
                          setLockFilter("All");
                          setSearch("");
                        }}
                        className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-zinc-300 ring-1 ring-white/10"
                      >
                        Reset
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Domain</p>
                        <FilterPills options={DOMAIN_OPTIONS} value={domainFilter} onChange={setDomainFilter} />
                      </div>
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
                        <FilterPills options={subjectOptions} value={subjectFilter} onChange={setSubjectFilter} render={(o) => (o === "All" ? "All" : subjectLabel(o))} />
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
                      <div>
                        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Status</p>
                        <FilterPills options={LOCK_OPTIONS} value={lockFilter} onChange={setLockFilter} />
                      </div>
                      <div>
                        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Interaction</p>
                        <FilterPills options={INTERACTION_OPTIONS} value={interactionFilter} onChange={setInteractionFilter} />
                      </div>
                    </div>
                  </div>

                  {nextUnlock ? (
                    <div className="rounded-[2rem] border border-amber-300/30 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-rose-500/10 p-4 ring-1 ring-white/5">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-200">Next Unlock</p>
                      <h3 className="mt-1 text-base font-black text-white">{nextUnlock.title}</h3>
                      <p className="mt-1 text-xs text-zinc-300">{nextUnlock.unlockMessage ?? `Hit ${xpRequiredFor(nextUnlock)} XP to open this puzzle.`}</p>
                      <div className="mt-3 h-1.5 rounded-full bg-white/10">
                        <div
                          className="h-1.5 rounded-full bg-amber-400"
                          style={{ width: `${Math.min(100, (xp / Math.max(1, xpRequiredFor(nextUnlock))) * 100)}%` }}
                        />
                      </div>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-amber-200/80">{xp} / {xpRequiredFor(nextUnlock)} XP</p>
                    </div>
                  ) : null}

                  <div className="rounded-[2rem] border border-violet-300/20 bg-violet-500/10 p-4 ring-1 ring-white/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-200">Progress</p>
                    <p className="mt-1 text-base font-black text-white">{unlockedCount} / {METAS.length} unlocked</p>
                    <div className="mt-3 h-1.5 rounded-full bg-white/10">
                      <div className="h-1.5 rounded-full bg-violet-400" style={{ width: `${(unlockedCount / METAS.length) * 100}%` }} />
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-amber-300/20 bg-amber-400/10 p-4 ring-1 ring-white/5">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-200">{GAME_MODE_META[gameMode].label}</p>
                    <p className="mt-1 text-sm leading-6 text-zinc-300">{GAME_MODE_META[gameMode].description}</p>
                  </div>
                </aside>

                <section className="min-w-0 space-y-5">
                  <div>
                    <div className="mb-3 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-200">Subject Demos</p>
                        <h2 className="mt-1 text-2xl font-black tracking-tight">Pick a learning world</h2>
                      </div>
                      <span className="hidden rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-zinc-300 ring-1 ring-white/10 sm:inline-flex">
                        {subjectFilter === "All" ? "All subjects" : subjectLabel(subjectFilter)}
                      </span>
                    </div>
                    <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 pr-6">
                      {subjectChips.map(({ subject, count }) => (
                        <SubjectDemoCard
                          key={subject}
                          subject={subject as Subject}
                          count={count}
                          selected={subjectFilter === subject}
                          onSelect={() => setSubjectFilter(subject as SubjectFilter)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Puzzle Catalog</p>
                      <h2 className="mt-1 text-2xl font-black tracking-tight">Choose your next challenge</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="inline-flex rounded-xl bg-zinc-900/70 p-1 ring-1 ring-white/10">
                        <button
                          type="button"
                          onClick={() => setCatalogView("grid")}
                          className={`rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-wider transition ${catalogView === "grid" ? "bg-white text-zinc-950" : "text-zinc-300"}`}
                        >
                          ▦ Grid
                        </button>
                        <button
                          type="button"
                          onClick={() => setCatalogView("tree")}
                          className={`rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-wider transition ${catalogView === "tree" ? "bg-white text-zinc-950" : "text-zinc-300"}`}
                        >
                          🌳 Skill Tree
                        </button>
                      </div>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-zinc-300 ring-1 ring-white/10">{visibleMetas.length} / {METAS.length}</span>
                    </div>
                  </div>

                  {visibleMetas.length === 0 ? (
                    <div className="rounded-[2rem] border border-white/10 bg-zinc-950/70 p-8 text-center text-sm text-zinc-400 ring-1 ring-white/5">
                      No puzzles match these filters yet. Try widening the grade, subject, or interaction.
                    </div>
                  ) : catalogView === "grid" ? (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {visibleMetas.map((meta, i) => (
                        <motion.div
                          key={meta.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(i * 0.008, 0.25) }}
                        >
                          <CategoryCard
                            meta={meta}
                            xp={xpRewardFor(effectiveDifficulty)}
                            onClick={() => start(meta.id)}
                            unlocked={isUnlocked(meta, xp, categoryCompletions)}
                            required={xpRequiredFor(meta)}
                            currentXp={xp}
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <SkillTree
                      metas={visibleMetas}
                      xp={xp}
                      currentDifficulty={effectiveDifficulty}
                      onPick={(id) => start(id)}
                      completions={categoryCompletions}
                    />
                  )}
                </section>
              </div>
            </motion.section>
          ) : aiLoading ? (
            <motion.section key="ai-loading" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="grid place-items-center py-24">
              <div className="flex flex-col items-center gap-4 rounded-[2.5rem] border border-fuchsia-300/30 bg-gradient-to-br from-fuchsia-500/15 via-violet-500/10 to-cyan-500/15 px-8 py-12 text-center shadow-2xl shadow-fuchsia-500/10 ring-1 ring-white/10">
                <motion.span
                  className="text-5xl"
                  animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  ✨
                </motion.span>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-fuchsia-200">AI Author Working</p>
                <h2 className="max-w-md text-2xl font-black leading-tight text-white">
                  Generating a fresh {activeMeta?.subject ? subjectLabel(activeMeta.subject) : "STEM"} puzzle…
                </h2>
                <p className="max-w-sm text-sm text-zinc-300">
                  {activeMeta?.title ? `Hand-crafting "${activeMeta.title}"` : "Hand-crafting a custom challenge"} with hints, choices, and an explanation.
                </p>
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map((dot) => (
                    <motion.span
                      key={dot}
                      className="h-2 w-2 rounded-full bg-fuchsia-300"
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </motion.section>
          ) : puzzle ? (
            <motion.section key={puzzle.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] lg:items-start">
              <section className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-950/70 shadow-2xl shadow-black/30 ring-1 ring-white/5">
                <div className={`h-2 bg-gradient-to-r ${activeMeta?.gradient ?? "from-violet-400 to-fuchsia-600"}`} />
                <div className="space-y-5 p-4 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${activeMeta?.gradient ?? "from-violet-400 to-fuchsia-600"} px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg`}>
                      {puzzle.emoji} {puzzle.difficulty}
                    </span>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-black uppercase tracking-wider text-zinc-300 ring-1 ring-white/10">
                      {activeMeta?.subject} · {metaInteractionDisplay(activeMeta ?? metaFor(puzzle.type))}
                    </span>
                    {aiSource === "ai" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-fuchsia-500/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-fuchsia-100 ring-1 ring-fuchsia-300/30">
                        ✨ AI generated
                      </span>
                    ) : aiSource === "mock" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-violet-100 ring-1 ring-violet-300/30">
                        ✨ AI mock
                      </span>
                    ) : aiSource === "fallback" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-100 ring-1 ring-amber-300/30">
                        🛟 procedural fallback
                      </span>
                    ) : null}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-500">Current Challenge</p>
                    <h2 className="mt-2 text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">{puzzle.prompt}</h2>
                  </div>
                  <div className="rounded-[2rem] border border-white/10 bg-black/25 p-4 shadow-inner ring-1 ring-white/5">
                    <VisualCard visual={puzzle.visual} rotation={state.rotation} />
                  </div>
                </div>
              </section>

              <aside className="space-y-4 lg:sticky lg:top-28">
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-[2rem] border border-white/10 bg-zinc-950/70 px-3 py-3 text-xs shadow-xl shadow-black/20 ring-1 ring-white/5">
                  <span className="inline-flex items-center gap-1 font-black uppercase tracking-wider text-violet-100">
                    {GAME_MODE_META[gameMode].emoji} {GAME_MODE_META[gameMode].label}
                  </span>
                  <span className="flex flex-wrap items-center gap-2 font-mono">
                    {GAME_MODE_META[gameMode].countdown ? (
                      <span className={`rounded-full px-2 py-0.5 ${secondsLeft <= 5 ? "bg-rose-500/20 text-rose-100" : "bg-zinc-800 text-zinc-200"}`}>
                        ⏱ {secondsLeft}s
                      </span>
                    ) : null}
                    {gameMode === "survival" ? (
                      <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-rose-100 ring-1 ring-rose-300/30">
                        {Array.from({ length: lives }, () => "❤").join(" ") || "—"}
                      </span>
                    ) : null}
                    {gameMode === "mastery" && masteryRemaining > 0 ? (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-amber-100 ring-1 ring-amber-300/30">
                        🏆 {masteryRemaining}/5
                      </span>
                    ) : null}
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-100 ring-1 ring-emerald-300/30">
                      +{Math.round((puzzle.xpReward ?? XP_PER_WIN) * (GAME_MODE_META[gameMode].xpMultiplier ?? 1))} XP
                    </span>
                  </span>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-zinc-950/70 p-4 shadow-xl shadow-black/20 ring-1 ring-white/5">
                  <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">Your Move</p>
                  <Interaction puzzle={puzzle} state={state} setState={setState} locked={result === "correct" || runOver} />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setHint((open) => !open);
                    }}
                    className="flex-1 rounded-2xl bg-white/5 px-4 py-3 text-sm font-bold text-zinc-300 ring-1 ring-white/10"
                  >
                    {hint ? "Hide hint" : "Need a hint?"}
                  </button>
                  {hint && puzzle.hints && puzzle.hints.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => setHintIndex((value) => (value + 1) % (puzzle.hints?.length ?? 1))}
                      className="rounded-2xl bg-sky-500/15 px-4 py-3 text-sm font-bold text-sky-100 ring-1 ring-sky-300/30"
                    >
                      Next hint
                    </button>
                  ) : null}
                </div>

                <AnimatePresence>
                  {hint ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="rounded-2xl border border-sky-300/20 bg-sky-500/10 p-4 text-sm text-sky-100"
                    >
                      <p>{currentHint}</p>
                      {puzzle.hints && puzzle.hints.length > 1 ? (
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-sky-300/70">Hint {hintIndex + 1} / {puzzle.hints.length}</p>
                      ) : null}
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <AnimatePresence>
                  {result !== "idle" ? (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }} className={`rounded-3xl border p-4 text-sm leading-relaxed ${result === "correct" ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-50" : "border-rose-300/30 bg-rose-500/10 text-rose-50"}`}>
                      <p className="text-base font-black">{result === "correct" ? "Beautiful solve." : "Almost. Try a different move."}</p>
                      <p className="mt-1.5 text-zinc-200">{puzzle.explanation}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <AnimatePresence>
                  {runOver ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="rounded-3xl border border-violet-300/30 bg-violet-500/10 p-4 text-violet-100"
                    >
                      <p className="text-base font-black">
                        {gameMode === "survival"
                          ? "Run over — out of lives."
                          : gameMode === "mastery"
                          ? "Mastery test complete."
                          : "Run complete."}
                      </p>
                      <p className="mt-1 text-sm text-zinc-200">Tap below to head back to the arcade.</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </aside>
            </motion.section>
          ) : null}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {active && puzzle && !aiLoading ? (
          <motion.div key="bottom-action" initial={{ y: 96 }} animate={{ y: 0 }} exit={{ y: 96 }} className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/75 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-2xl">
            <div className="mx-auto flex max-w-7xl items-center gap-3">
              <div className="hidden min-w-0 flex-1 lg:block">
                <p className="truncate text-xs font-black uppercase tracking-[0.2em] text-zinc-500">{puzzle.title}</p>
                <p className="truncate text-sm text-zinc-300">{result === "idle" ? "Solve the interaction panel, then check your answer." : puzzle.explanation}</p>
              </div>
              {runOver ? (
                <button
                  type="button"
                  onClick={exitRun}
                  className="w-full rounded-2xl bg-violet-500 py-4 text-base font-black uppercase tracking-[0.16em] text-white shadow-xl shadow-violet-500/30 lg:max-w-sm"
                >
                  Back to Arcade
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!canCheck(puzzle, state)}
                  onClick={check}
                  className={`w-full rounded-2xl py-4 text-base font-black uppercase tracking-[0.16em] text-white shadow-xl transition disabled:cursor-not-allowed disabled:opacity-40 lg:max-w-sm ${
                    result === "correct"
                      ? "bg-emerald-500 shadow-emerald-500/30"
                      : result === "wrong"
                      ? "bg-rose-500 shadow-rose-500/30"
                      : "bg-sky-500 shadow-sky-500/30"
                  }`}
                >
                  {result === "correct" ? "Next Puzzle" : result === "wrong" ? "Try Again" : "Check"}
                </button>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
