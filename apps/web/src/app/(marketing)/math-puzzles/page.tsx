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
  | "MathFoundations"
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
  | "placeValueBuilder"
  | "roundingTarget"
  | "integerChipSort"
  | "orderOpsTower"
  | "equivalentFractionBridge"
  | "fractionOperationLab"
  | "decimalPlaceRace"
  | "percentBarBuilder"
  | "ratioTableMatch"
  | "coordinateQuadrantSort"
  | "numberLineJump"
  | "multiplicationFact"
  | "divisionRemainder"
  | "fractionDecimalConvert"
  | "percentFractionDecimal"
  | "absoluteValueBasics"
  | "exponentBasic"
  | "expandedFormBuilder"
  | "unitConversionBridge"
  | "negativeNumberOperate"
  | "factorPairFinder"
  | "mixedNumberConvert"
  | "numberLineCompare"
  | "fractionMultiplyDivide"
  | "decimalAddSubtract"
  | "decimalMultiplyDivide"
  | "reorderLeastGreatest"
  | "percentChangeBasics"
  | "meanMedianMode"
  | "elapsedTimeClock"
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
  | "distributiveProperty"
  | "compoundInequality"
  | "slopeIntercept"
  | "pointSlopeMatch"
  | "absoluteValueEquation"
  | "quadraticFormula"
  | "discriminantClassify"
  | "geometricSeriesSum"
  | "literalEquation"
  | "directVariation"
  | "inverseVariation"
  | "exponentRules"
  | "completingSquare"
  | "absValueInequality"
  | "logEquation"
  | "binomialExpansion"
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
  | "designConstraint"
  | "torqueBalance"
  | "leverArm"
  | "camFollower"
  | "ohmsLawCircuit"
  | "powerBudget"
  | "capacitorCharge"
  | "soilBearing"
  | "trafficFlow"
  | "foundationDepth"
  | "liftDragBalance"
  | "orbitTransfer"
  | "wingArea"
  | "sensorFusion"
  | "pathPlanner"
  | "gripperForce"
  | "trussMemberForce"
  | "beamDeflection"
  | "columnBuckling"
  | "stressStrain"
  | "thermalExpansion"
  | "compositeLayer"
  | "resistorNetwork"
  | "breadboardTrace"
  | "sensorCircuit"
  | "feedbackLoop"
  | "reliabilityBlock"
  | "tradeStudy"
  | "personaNeeds"
  | "prototypeTest"
  | "constraintMatrix"
  | "frictionRamp"
  | "flywheelInertia"
  | "engineEfficiency"
  | "hydraulicPress"
  | "motorTorqueCurve"
  | "transformerRatio"
  | "threePhasePower"
  | "ledResistor"
  | "batteryLife"
  | "concreteMix"
  | "reinforcedBeam"
  | "drainagePlan"
  | "earthquakeBracing"
  | "propThrust"
  | "fuelMassFraction"
  | "reentryAngle"
  | "droneStability"
  | "kinematicChain"
  | "swarmCoordination"
  | "robotPickPlace"
  | "loadPath"
  | "weldJoint"
  | "fatigueLife"
  | "alloySelect"
  | "polymerChain"
  | "corrosionSort"
  | "transistorMode"
  | "kirchhoffLoop"
  | "logicCircuitMap"
  | "rootCauseTree"
  | "userStoryRank"
  | "probSpinner2"
  | "probAndOr"
  | "combinations"
  | "permutations"
  | "conditionalProb"
  | "gcdHunt"
  | "lcmHunt"
  | "modArithmetic"
  | "primeFactor"
  | "divisibilityRule"
  | "simpleInterest"
  | "compoundInterest"
  | "percentDiscount"
  | "taxTip"
  | "budgetSort"
  | "truthTableRead"
  | "setOperations"
  | "planetOrder"
  | "moonPhaseSeq"
  | "keplerPeriod"
  | "starClassify"
  | "lightYearDist"
  | "dnaTranscribe"
  | "traitMendel"
  | "mutationSort"
  | "pedigreeRead"
  | "chromosomeCount"
  | "trophicLevels"
  | "nicheSort"
  | "popGrowth"
  | "organSystemMatch"
  | "bloodFlowOrder"
  | "neuronImpulse"
  | "carbonPoolSort"
  | "renewableSort"
  | "greenhouseCause"
  | "forLoopTrace"
  | "ifElseResult"
  | "recursionDepth"
  | "bigOSort"
  | "binarySearchSteps"
  | "sortAlgoMatch"
  | "precisionRecall"
  | "gradientStep"
  | "normalizeData"
  | "caesarCipher"
  | "passwordStrength"
  | "sqlJoinMatch"
  | "sqlCount"
  | "normalizationSort"
  | "httpVerbMatch"
  | "statusCodeMatch"
  | "restRoute"
  | "osiLayerOrder"
  | "subnetCount"
  | "dnsOrder"
  | "htmlTagSort"
  | "cssBoxModel"
  | "domEventOrder"
  | "hexBinaryConvert";

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
  m("balanceBeam", "Balance Beam Puzzle", "Level the beam", "🪵", "from-orange-300 to-stone-600", "K-8", "Algebra", "Compare weights", 2, "choice"),
  m("fractionPizza", "Fraction Pizza", "Build and compare slices", "🍕", "from-rose-400 to-red-500", "K-8", "Arithmetic", "Recognize fraction parts", 2, "choice"),
  m("equationMatch", "Equation Match Puzzle", "Pair equations", "🔗", "from-blue-400 to-indigo-700", "K-8", "Algebra", "Pair equation values", 2, "match"),
  m("patternBlocks", "Pattern Blocks", "Continue the sequence", "🧩", "from-violet-400 to-fuchsia-600", "K-8", "Logic", "Continue visual patterns", 2, "choice"),
  m("areaBuilder", "Area Builder", "Count tiles and edges", "🟩", "from-emerald-400 to-green-600", "K-8", "Geometry", "Compute rectangular area", 2, "choice"),
  m("gridPath", "Grid Path", "Walk through operations", "🎯", "from-cyan-400 to-teal-600", "K-8", "Arithmetic", "Chain operations", 2, "path"),
  m("waterFill", "Water Fill Puzzle", "Pour to the target", "💧", "from-blue-400 to-cyan-600", "K-8", "Arithmetic", "Reason about volume", 2, "drag"),
  m("numberMachine", "Number Machine", "Find the hidden rule", "⚙️", "from-sky-400 to-blue-600", "K-8", "Algebra", "Spot function rules", 2, "choice"),
  m("monsterMerge", "Monster Merge Math", "Combine creature values", "👾", "from-lime-400 to-emerald-600", "K-8", "Arithmetic", "Combine quantities", 2, "choice"),
  m("clock", "Clock Puzzle", "Read the time", "🕒", "from-indigo-400 to-purple-600", "K-8", "Arithmetic", "Read analog clocks", 2, "choice"),
  m("treasureEquations", "Treasure Chest Equations", "Crack the lock", "💎", "from-yellow-300 to-amber-600", "K-8", "Algebra", "Solve one-step equations", 2, "choice"),
  m("diceProbability", "Dice Probability", "Predict the chance", "🎲", "from-red-400 to-pink-600", "K-8", "Statistics", "Simple probability", 2, "choice"),
  m("coordinateTreasure", "Coordinate Treasure Hunt", "Find the point", "🗺️", "from-teal-400 to-cyan-700", "K-8", "Geometry", "Read coordinates", 2, "choice"),
  m("shapeFolding", "Shape Folding Puzzle", "Fold in your mind", "📦", "from-fuchsia-400 to-violet-700", "K-8", "Geometry", "Visualize rotation", 2, "rotate"),
  m("lightBeam", "Light Beam Reflection", "Aim the mirror", "🔦", "from-yellow-200 to-sky-500", "K-8", "Geometry", "Reason about reflection", 2, "rotate"),
  m("bridgeWeight", "Bridge Weight Puzzle", "Stay under limit", "🌉", "from-slate-300 to-slate-700", "K-8", "Arithmetic", "Sum within a limit", 2, "choice"),
  m("resourceManagement", "Resource Management", "Spend wisely", "🪙", "from-amber-300 to-lime-600", "K-8", "Arithmetic", "Budget resources", 2, "choice"),
  m("numberPyramid", "Missing Number Pyramid", "Build upward", "🔺", "from-red-300 to-orange-600", "K-8", "Arithmetic", "Sum upward chains", 2, "choice"),
  m("snakePath", "Arithmetic Snake Path", "Draw the value trail", "🐍", "from-green-400 to-teal-700", "K-8", "Arithmetic", "Sum number paths", 2, "path"),
  m("weightScale", "Weight Scale", "Solve hidden weights", "⚖️", "from-amber-400 to-orange-500", "K-8", "Algebra", "Solve for unknown weights", 2, "choice"),
  m("multiplicationArray", "Multiplication Array", "See multiplication", "🔢", "from-emerald-300 to-sky-600", "K-8", "Arithmetic", "Visualize multiplication", 2, "choice"),
  m("sudokuMini", "Sudoku Mini", "Tiny logic grid", "🧠", "from-purple-300 to-indigo-700", "K-8", "Logic", "Logical deduction", 2, "choice"),
  m("magicSquare", "Magic Square Puzzle", "Rows share totals", "✨", "from-yellow-300 to-purple-600", "K-8", "Logic", "Constraint reasoning", 2, "choice"),
  m("memoryMatch", "Math Memory Match", "Find equivalents", "🃏", "from-pink-300 to-rose-700", "K-8", "Arithmetic", "Recognize equivalents", 2, "match"),
  m("tangram", "Tangram Geometry Puzzle", "Arrange the pieces", "🔷", "from-cyan-300 to-blue-700", "K-8", "Geometry", "Compose shapes", 2, "reorder"),
  m("primeCatcher", "Prime Number Catcher", "Catch only primes", "⭐", "from-violet-300 to-pink-600", "K-8", "Arithmetic", "Identify primes", 2, "choice"),
  m("fractionBars", "Fraction Bar Comparison", "Compare lengths", "📊", "from-orange-300 to-red-600", "K-8", "Arithmetic", "Compare fractions", 2, "choice"),
  m("decimalSlider", "Decimal Slider Puzzle", "Tune the value", "🎚️", "from-sky-300 to-cyan-700", "K-8", "Arithmetic", "Place decimals", 2, "slider"),
  m("ratioRecipe", "Ratio Recipe Puzzle", "Mix the recipe", "🥣", "from-amber-300 to-rose-600", "K-8", "Arithmetic", "Apply ratios", 2, "drag"),
  m("placeValueBuilder", "Place Value Builder", "Build the number", "🏗️", "from-sky-300 to-blue-700", "K-8", "MathFoundations", "Read hundreds, tens, and ones", 2, "numpad", "Fill in number"),
  m("roundingTarget", "Rounding Target", "Land on the nearest value", "🎯", "from-emerald-300 to-teal-700", "K-8", "MathFoundations", "Round whole numbers and decimals", 2, "choice"),
  m("integerChipSort", "Integer Chip Sort", "Positive or negative?", "🧲", "from-rose-300 to-fuchsia-700", "K-8", "MathFoundations", "Classify integers by sign", 2, "sort", "Sort categories"),
  m("orderOpsTower", "Order Ops Tower", "Climb PEMDAS", "🗼", "from-violet-300 to-indigo-700", "K-8", "MathFoundations", "Evaluate expressions in order", 3, "choice"),
  m("equivalentFractionBridge", "Equivalent Fraction Bridge", "Cross with equal parts", "🌉", "from-amber-300 to-orange-700", "K-8", "MathFoundations", "Recognize equivalent fractions", 3, "match"),
  m("fractionOperationLab", "Fraction Operation Lab", "Add or subtract slices", "🧪", "from-pink-300 to-rose-700", "K-8", "MathFoundations", "Operate on like-denominator fractions", 3, "choice"),
  m("decimalPlaceRace", "Decimal Place Race", "Compare the decimals", "🏁", "from-cyan-300 to-blue-700", "K-8", "MathFoundations", "Compare tenths and hundredths", 3, "choice"),
  m("percentBarBuilder", "Percent Bar Builder", "Fill the percent bar", "▰", "from-lime-300 to-green-700", "9", "MathFoundations", "Convert percents to values", 3, "numpad", "Fill in number"),
  m("ratioTableMatch", "Ratio Table Match", "Pair equal ratios", "📋", "from-yellow-300 to-amber-700", "9", "MathFoundations", "Complete equivalent ratio tables", 3, "match"),
  m("coordinateQuadrantSort", "Coordinate Quadrant Sort", "Sort points by quadrant", "🧭", "from-purple-300 to-violet-700", "9", "MathFoundations", "Classify coordinate plane points", 3, "sort", "Sort categories"),
  m("numberLineJump", "Number Line Jump", "Hop along the line", "➡️", "from-sky-300 to-indigo-700", "K-8", "MathFoundations", "Add and subtract with integers", 2, "choice"),
  m("multiplicationFact", "Multiplication Fact Blast", "Speed-run the facts", "✖️", "from-orange-300 to-red-700", "K-8", "MathFoundations", "Recall multiplication facts", 2, "numpad", "Fill in number"),
  m("divisionRemainder", "Division with Remainder", "Split with a leftover", "➗", "from-emerald-300 to-green-700", "K-8", "MathFoundations", "Divide with a remainder", 3, "choice"),
  m("fractionDecimalConvert", "Fraction ↔ Decimal", "Swap the forms", "🔁", "from-cyan-300 to-teal-700", "K-8", "MathFoundations", "Convert between fractions and decimals", 3, "match"),
  m("percentFractionDecimal", "Percent · Fraction · Decimal", "Pair the three forms", "🔗", "from-fuchsia-300 to-pink-700", "9", "MathFoundations", "Convert percents, fractions, decimals", 3, "match"),
  m("absoluteValueBasics", "Absolute Value Basics", "Drop the sign", "📏", "from-amber-300 to-yellow-700", "K-8", "MathFoundations", "Compute |x|", 2, "numpad", "Fill in number"),
  m("exponentBasic", "Exponent Power-Up", "Multiply repeatedly", "⚡", "from-violet-300 to-purple-700", "K-8", "MathFoundations", "Evaluate small powers", 2, "numpad", "Fill in number"),
  m("expandedFormBuilder", "Expanded Form Builder", "Stretch out the digits", "🧱", "from-rose-300 to-amber-700", "K-8", "MathFoundations", "Write numbers in expanded form", 2, "choice"),
  m("unitConversionBridge", "Unit Conversion Bridge", "Cross the units", "📐", "from-blue-300 to-cyan-700", "K-8", "MathFoundations", "Convert basic units", 3, "numpad", "Fill in number"),
  m("negativeNumberOperate", "Negative Number Lab", "Operate with negatives", "🧊", "from-indigo-300 to-blue-700", "K-8", "MathFoundations", "Add, subtract, multiply negatives", 3, "numpad", "Fill in number"),
  m("factorPairFinder", "Factor Pair Finder", "Find a pair that multiplies", "🧩", "from-yellow-400 to-amber-700", "K-8", "MathFoundations", "Identify factor pairs", 2, "choice"),
  m("mixedNumberConvert", "Mixed Number Convert", "Improper → mixed", "🔢", "from-rose-400 to-pink-700", "K-8", "MathFoundations", "Convert improper fractions to mixed", 3, "choice"),
  m("numberLineCompare", "Number Line Compare", "Which is bigger?", "⚖️", "from-sky-400 to-indigo-700", "K-8", "MathFoundations", "Compare numbers with <, >, =", 2, "choice"),
  m("fractionMultiplyDivide", "Fraction × ÷ Lab", "Multiply or divide fractions", "🧪", "from-emerald-300 to-teal-700", "K-8", "MathFoundations", "Multiply and divide fractions", 3, "choice"),
  m("decimalAddSubtract", "Decimal Add & Subtract", "Line up the points", "➕", "from-cyan-400 to-blue-700", "K-8", "MathFoundations", "Add and subtract decimals", 3, "numpad", "Fill in number"),
  m("decimalMultiplyDivide", "Decimal × ÷ Lab", "Place the decimal", "✖️", "from-violet-400 to-fuchsia-700", "K-8", "MathFoundations", "Multiply and divide decimals", 3, "numpad", "Fill in number"),
  m("reorderLeastGreatest", "Least to Greatest", "Order the cards", "📊", "from-amber-300 to-orange-700", "K-8", "MathFoundations", "Order numbers least to greatest", 3, "reorder", "Order steps"),
  m("percentChangeBasics", "Percent Change", "Increase or decrease", "📈", "from-green-400 to-emerald-700", "9", "MathFoundations", "Compute percent increase / decrease", 3, "numpad", "Fill in number"),
  m("meanMedianMode", "Mean & Median Lab", "Compute the center", "📍", "from-blue-400 to-violet-700", "K-8", "MathFoundations", "Find mean and median of a list", 3, "numpad", "Fill in number"),
  m("elapsedTimeClock", "Elapsed Time Clock", "How long passed?", "🕒", "from-indigo-300 to-purple-700", "K-8", "MathFoundations", "Compute elapsed clock time", 3, "choice"),
  m("escapeRoom", "Math Escape Room", "Unlock every door", "🚪", "from-zinc-300 to-violet-700", "K-8", "Algebra", "Chain operations", 3, "swipe"),
  m("absValueDistance", "Absolute Value Distance", "Measure the distance", "📏", "from-cyan-400 to-blue-700", "9", "Algebra", "Compute |a − b|", 3, "numpad", "Fill in number"),
  m("absoluteValueEquation", "Absolute Value Equation", "Solve |x + b| = c", "🪞", "from-fuchsia-400 to-pink-600", "9", "Algebra", "Split into two cases", 3, "choice"),
  m("directVariation", "Direct Variation Lab", "Find k in y = kx", "📏", "from-lime-400 to-green-600", "9", "Algebra", "Apply direct variation", 3, "numpad", "Fill in number"),
  m("distributiveProperty", "Distribute Lab", "Spread it out", "🧪", "from-emerald-400 to-lime-600", "9", "Algebra", "Apply a(b ± c) = ab ± ac", 3, "choice"),
  m("exponentMatch", "Exponent Match", "Pair the powers", "🔥", "from-red-400 to-orange-600", "9", "Algebra", "Apply exponent rules", 3, "match"),
  m("exponentRules", "Exponent Rules Workshop", "Simplify with the laws", "⚡", "from-orange-400 to-red-700", "9", "Algebra", "Apply product, quotient, and power rules", 3, "choice"),
  m("expressionSimplifier", "Expression Simplifier", "Reduce the expression", "✂️", "from-emerald-400 to-cyan-700", "9", "Algebra", "Simplify expressions", 3, "choice"),
  m("functionRule", "Function Machine", "Infer the function", "⚙️", "from-violet-400 to-fuchsia-600", "9", "Algebra", "Evaluate linear functions", 3, "choice"),
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
  m("graphLine", "Graph the Line", "Plot the equation", "📈", "from-emerald-400 to-teal-600", "9", "Algebra", "Identify line equations", 3, "choice"),
  m("inequalityGate", "Inequality Gate", "Pick the open gate", "🚧", "from-amber-400 to-orange-600", "9", "Algebra", "Solve linear inequalities", 3, "choice"),
  m("inequalityNumberLine", "Inequality Number Line Escape", "Slide to safe zone", "🚪", "from-amber-400 to-orange-700", "9", "Algebra", "Graph inequalities", 3, "slider"),
  m("likeTermSorter", "Like-Term Sorter", "Sort the like terms", "🗂️", "from-sky-400 to-violet-700", "9", "Algebra", "Combine like terms", 3, "sort"),
  m("linearBalance", "Linear Equation Balance", "Balance the equation", "⚖️", "from-blue-400 to-indigo-600", "9", "Algebra", "Solve ax + b = c", 3, "choice"),
  m("literalEquation", "Literal Equation Solver", "Rearrange the formula", "🧰", "from-cyan-400 to-emerald-600", "9", "Algebra", "Solve formulas for any variable", 3, "choice"),
  m("scientificNotation", "Scientific Notation Converter", "Move the decimal", "🔬", "from-cyan-400 to-blue-700", "9", "Algebra", "Convert scientific notation", 3, "choice"),
  m("conditionalTree", "Conditional Probability Tree", "Trace the tree", "🌳", "from-emerald-400 to-green-700", "10", "Statistics", "Conditional probability", 4, "choice"),
  m("geometricConstruction", "Geometric Construction Puzzle", "Construct the shape", "📏", "from-zinc-300 to-stone-700", "10", "Geometry", "Compass and straightedge", 4, "rotate"),
  m("slopeIntercept", "Slope-Intercept Finder", "Find the y-intercept", "📐", "from-sky-400 to-cyan-600", "9", "Algebra", "Compute b from slope and point", 3, "numpad", "Fill in number"),
  m("slopeRunner", "Slope Runner", "Race the slope", "🏃", "from-sky-400 to-blue-600", "9", "Algebra", "Slope from two points", 3, "choice"),
  m("variableLock", "Variable Lock Puzzle", "Crack the variable", "🔒", "from-amber-400 to-rose-700", "9", "Algebra", "Solve for x with a numpad", 3, "numpad", "Unlock"),
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
  m("algebraTiles", "Algebra Tile Builder", "Build the expression", "🧱", "from-emerald-300 to-emerald-700", "9", "Algebra", "Visualize x and constants", 4, "drag", "Build with tiles"),
  m("compoundInequality", "Compound Inequality Solver", "Squeeze x into range", "🎯", "from-amber-400 to-yellow-600", "9", "Algebra", "Solve a ≤ x + b ≤ c", 4, "choice"),
  m("equationMaze", "Equation Maze", "Trace the right path", "🌀", "from-violet-400 to-blue-700", "9", "Algebra", "Solve multi-step equations", 4, "path", "Drawing"),
  m("functionTableBuilder", "Function Table Builder", "Drop the right outputs", "📋", "from-fuchsia-400 to-pink-700", "9", "Algebra", "Evaluate functions", 4, "drag", "Build with tiles"),
  m("pointSlopeMatch", "Point-Slope Match", "Pair forms of a line", "🔗", "from-blue-400 to-indigo-600", "9", "Algebra", "Convert point-slope to slope-intercept", 4, "match"),
  m("systemsScale", "Systems of Equations Scale", "Two scales, one truth", "⚖️", "from-rose-400 to-pink-600", "9", "Algebra", "Solve linear systems", 4, "choice"),
  m("absValueInequality", "Absolute Value Inequality", "Inside or outside?", "🚦", "from-fuchsia-400 to-violet-700", "10", "Algebra", "Solve |x − a| < c or > c", 4, "choice"),
  m("completingSquare", "Completing the Square", "Push it to vertex form", "🟧", "from-teal-400 to-indigo-700", "10", "Algebra", "Convert standard to vertex form", 4, "choice"),
  m("complexPlane", "Complex Number Plane", "Plot a + bi", "🌐", "from-fuchsia-400 to-purple-700", "10", "Algebra", "Plot complex numbers", 4, "choice"),
  m("discriminantClassify", "Discriminant Classifier", "Real, repeated, or complex?", "🔮", "from-violet-400 to-purple-700", "10", "Algebra", "Use b² − 4ac to classify roots", 4, "choice"),
  m("domainRangePicker", "Domain & Range Picker", "Spot domain or range", "🎯", "from-rose-400 to-amber-700", "10", "Algebra", "Find domain and range", 4, "choice", "Region select"),
  m("factoringTiles", "Factoring Tiles", "Slide to factor", "🧱", "from-emerald-300 to-teal-700", "10", "Algebra", "Factor quadratics", 4, "drag"),
  m("inverseVariation", "Inverse Variation Lab", "Find y when x changes", "🪁", "from-amber-400 to-rose-600", "10", "Algebra", "Apply y = k/x", 4, "numpad", "Fill in number"),
  m("parabolaMatch", "Parabola Graph Match", "Match shape to formula", "🪤", "from-orange-300 to-rose-700", "10", "Algebra", "Recognize parabolas", 4, "match"),
  m("polynomialPuzzle", "Polynomial Puzzle", "Assemble polynomials", "🧩", "from-violet-300 to-purple-700", "10", "Algebra", "Multiply polynomials", 4, "choice"),
  m("quadraticLauncher", "Quadratic Equation Launcher", "Launch the parabola", "🚀", "from-rose-400 to-red-700", "10", "Algebra", "Solve quadratics", 4, "choice"),
  m("quadraticFormula", "Quadratic Formula Lab", "Plug in a, b, c", "🧮", "from-rose-400 to-red-600", "10", "Algebra", "Solve ax² + bx + c = 0", 4, "choice"),
  m("radicalSimplify", "Radical Simplifier", "Pull out the squares", "√", "from-amber-300 to-yellow-700", "10", "Algebra", "Simplify radicals", 4, "choice"),
  m("rationalMatch", "Rational Expression Match", "Match reduced forms", "➗", "from-sky-300 to-blue-700", "10", "Algebra", "Reduce rational expressions", 4, "match"),
  m("binomialExpansion", "Binomial Expansion", "Pascal's coefficients", "🧨", "from-emerald-400 to-cyan-700", "11", "Algebra", "Expand (x + k)ⁿ", 4, "choice"),
  m("geometricSeriesSum", "Geometric Series Sum", "Add the powers", "🌀", "from-teal-400 to-emerald-700", "11", "Algebra", "Compute Sₙ = a₁(rⁿ − 1)/(r − 1)", 4, "numpad", "Fill in number"),
  m("logEquation", "Log Equation Solver", "Drop the log", "📜", "from-purple-400 to-fuchsia-700", "11", "Algebra", "Solve log equations for x", 4, "numpad", "Fill in number"),
  m("piecewiseSwitch", "Piecewise Function Switchboard", "Pick the right piece", "🔀", "from-orange-400 to-rose-700", "11", "Algebra", "Evaluate piecewise functions", 4, "choice"),
  m("polynomialRoots", "Polynomial Roots Finder", "Spot the zeros", "🌱", "from-emerald-400 to-teal-700", "11", "Algebra", "Find polynomial roots", 5, "choice"),
  m("quadraticSystems", "Quadratic Systems Puzzle", "Find the intersections", "📈", "from-rose-400 to-red-700", "11", "Algebra", "Solve quadratic systems", 5, "choice"),
  m("syntheticDivision", "Synthetic Division Machine", "Divide step by step", "🛠️", "from-zinc-300 to-zinc-700", "11", "Algebra", "Synthetic division", 5, "choice"),
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
  s("torqueBalance", "Torque Balance", "Balance the beam", "🔩", "from-zinc-400 to-slate-700", "9", "MechanicalEng", "Apply torque = force × distance", 4, "numpad", { displayInteraction: "Fill in number", xpRequired: 0 }),
  s("leverArm", "Lever Arm Challenge", "Move the fulcrum", "🪛", "from-amber-400 to-stone-700", "10", "MechanicalEng", "Compare lever moments", 4, "choice", { displayInteraction: "Multiple choice", xpRequired: 500 }),
  s("camFollower", "Cam Follower Sequence", "Order the motion cycle", "⚙️", "from-orange-400 to-red-700", "11", "MechanicalEng", "Read rotational motion systems", 5, "reorder", { displayInteraction: "Order steps", xpRequired: 1200, isBoss: true, unlockMessage: "Mechanism boss unlocked: trace the cam cycle." }),
  s("ohmsLawCircuit", "Ohm's Law Circuit", "Find V, I, or R", "💡", "from-yellow-300 to-amber-700", "9", "ElectricalEng", "Use V = IR", 3, "numpad", { displayInteraction: "Fill in number", xpRequired: 0 }),
  s("powerBudget", "Power Budget Planner", "Stay under wattage", "🔋", "from-lime-400 to-emerald-700", "10", "ElectricalEng", "Estimate electrical power", 4, "choice", { displayInteraction: "Multiple choice", xpRequired: 500 }),
  s("capacitorCharge", "Capacitor Charge Curve", "Match time constants", "⚡", "from-cyan-300 to-blue-700", "11", "ElectricalEng", "Reason about RC circuits", 5, "match", { displayInteraction: "Matching cards", xpRequired: 1200 }),
  s("soilBearing", "Soil Bearing Puzzle", "Pick the safe footing", "🧱", "from-amber-500 to-stone-700", "9", "CivilEng", "Compare load and soil capacity", 4, "choice", { displayInteraction: "Multiple choice", xpRequired: 0 }),
  s("trafficFlow", "Traffic Flow Optimizer", "Reduce the bottleneck", "🚦", "from-red-400 to-orange-700", "10", "CivilEng", "Analyze flow constraints", 4, "sort", { displayInteraction: "Sort categories", xpRequired: 500 }),
  s("foundationDepth", "Foundation Depth Plan", "Order the site work", "🏗️", "from-slate-400 to-zinc-700", "11", "CivilEng", "Sequence foundation planning", 5, "reorder", { displayInteraction: "Sequence processes", xpRequired: 1200, isBoss: true, prerequisites: ["soilBearing"], unlockMessage: "Civil boss unlocked: plan the foundation sequence." }),
  s("liftDragBalance", "Lift-Drag Balance", "Tune the wing forces", "🛩️", "from-sky-300 to-blue-700", "9", "AerospaceEng", "Compare lift, drag, thrust, and weight", 4, "choice", { displayInteraction: "Multiple choice", xpRequired: 0 }),
  s("orbitTransfer", "Orbit Transfer Steps", "Plan the maneuver", "🛰️", "from-indigo-400 to-violet-700", "11", "AerospaceEng", "Sequence orbital transfers", 5, "reorder", { displayInteraction: "Simulation", xpRequired: 1200 }),
  s("wingArea", "Wing Area Estimator", "Solve the lift setup", "📐", "from-cyan-400 to-sky-700", "12", "AerospaceEng", "Estimate wing loading", 5, "numpad", { displayInteraction: "Fill in number", xpRequired: 2500, isBoss: true, unlockMessage: "Aerospace boss unlocked: size the wing." }),
  s("sensorFusion", "Sensor Fusion Match", "Pair sensor to signal", "📡", "from-purple-400 to-indigo-700", "9", "Robotics", "Match sensors to robot data", 3, "match", { displayInteraction: "Matching cards", xpRequired: 0 }),
  s("pathPlanner", "Robot Path Planner", "Order moves safely", "🤖", "from-violet-400 to-fuchsia-700", "10", "Robotics", "Sequence robot navigation", 4, "reorder", { displayInteraction: "Order steps", xpRequired: 500 }),
  s("gripperForce", "Gripper Force Puzzle", "Hold without crushing", "🦾", "from-rose-400 to-pink-700", "11", "Robotics", "Balance force and friction", 5, "numpad", { displayInteraction: "Fill in number", xpRequired: 1200 }),
  s("trussMemberForce", "Truss Member Force", "Tension or compression?", "🌉", "from-cyan-400 to-blue-800", "9", "StructuralDesign", "Classify truss forces", 4, "sort", { displayInteraction: "Sort categories", xpRequired: 0 }),
  s("beamDeflection", "Beam Deflection Predictor", "Pick the sag pattern", "📏", "from-slate-400 to-blue-700", "10", "StructuralDesign", "Predict beam deflection", 4, "choice", { displayInteraction: "Multiple choice", xpRequired: 500 }),
  s("columnBuckling", "Column Buckling Boss", "Choose the stable column", "🏛️", "from-amber-400 to-orange-800", "12", "StructuralDesign", "Compare buckling risk", 5, "choice", { displayInteraction: "Design Challenge", xpRequired: 2500, isBoss: true, unlockMessage: "Structural boss unlocked: stop the column from buckling." }),
  s("stressStrain", "Stress-Strain Match", "Pair curve to behavior", "📈", "from-emerald-400 to-teal-700", "9", "MaterialsScience", "Read material response curves", 4, "match", { displayInteraction: "Matching cards", xpRequired: 0 }),
  s("thermalExpansion", "Thermal Expansion Gap", "Find the expansion space", "🌡️", "from-orange-400 to-red-700", "10", "MaterialsScience", "Estimate thermal expansion", 4, "numpad", { displayInteraction: "Fill in number", xpRequired: 500 }),
  s("compositeLayer", "Composite Layer Sort", "Stack for strength", "🧵", "from-violet-400 to-indigo-700", "11", "MaterialsScience", "Classify composite layers", 4, "sort", { displayInteraction: "Sort categories", xpRequired: 1200 }),
  s("resistorNetwork", "Resistor Network", "Equivalent resistance", "🔌", "from-yellow-400 to-orange-700", "9", "Circuits", "Analyze series and parallel resistance", 4, "numpad", { displayInteraction: "Circuit Builder", xpRequired: 0 }),
  s("breadboardTrace", "Breadboard Trace", "Follow the hidden node", "🍞", "from-amber-300 to-yellow-700", "10", "Circuits", "Trace circuit connectivity", 4, "choice", { displayInteraction: "Circuit Builder", xpRequired: 500 }),
  s("sensorCircuit", "Sensor Circuit Builder", "Pick the right divider", "🎛️", "from-cyan-400 to-blue-700", "11", "Circuits", "Design a voltage divider", 5, "choice", { displayInteraction: "Circuit Builder", xpRequired: 1200, isBoss: true, prerequisites: ["resistorNetwork"], unlockMessage: "Circuit boss unlocked: build the sensor divider." }),
  s("feedbackLoop", "Feedback Loop Builder", "Close the control loop", "🔁", "from-emerald-400 to-cyan-700", "9", "SystemsEng", "Identify feedback components", 4, "match", { displayInteraction: "Build systems", xpRequired: 0 }),
  s("reliabilityBlock", "Reliability Block Puzzle", "Find weak links", "🧱", "from-slate-400 to-zinc-700", "10", "SystemsEng", "Compare redundancy and risk", 4, "choice", { displayInteraction: "Multiple choice", xpRequired: 500 }),
  s("tradeStudy", "Engineering Trade Study", "Rank the options", "⚖️", "from-fuchsia-400 to-purple-700", "12", "SystemsEng", "Evaluate weighted criteria", 5, "reorder", { displayInteraction: "Design Challenge", xpRequired: 2500, isMasteryTest: true, unlockMessage: "Systems mastery unlocked: rank the best architecture." }),
  s("personaNeeds", "Persona Needs Sort", "User need or solution?", "🧑‍🔧", "from-pink-400 to-rose-700", "9", "DesignThinking", "Separate needs from ideas", 3, "sort", { displayInteraction: "Sort categories", xpRequired: 0 }),
  s("prototypeTest", "Prototype Test Loop", "Order build-measure-learn", "🧪", "from-lime-400 to-emerald-700", "10", "DesignThinking", "Sequence rapid prototyping", 4, "reorder", { displayInteraction: "Sequence processes", xpRequired: 500 }),
  s("constraintMatrix", "Constraint Matrix Boss", "Score the trade-offs", "🧮", "from-indigo-400 to-fuchsia-700", "12", "DesignThinking", "Use constraint matrices", 5, "choice", { displayInteraction: "Design Challenge", xpRequired: 2500, isBoss: true, prerequisites: ["prototypeTest"], unlockMessage: "Design boss unlocked: score the trade-off matrix." }),
  s("frictionRamp", "Friction Ramp Puzzle", "Slide or stay?", "📐", "from-amber-400 to-orange-700", "9", "MechanicalEng", "Compare friction and gravity components", 4, "choice", { displayInteraction: "Multiple choice", xpRequired: 0 }),
  s("flywheelInertia", "Flywheel Inertia", "Pick the smoothest", "🌀", "from-zinc-400 to-slate-700", "10", "MechanicalEng", "Reason about rotational inertia", 4, "choice", { displayInteraction: "Multiple choice", xpRequired: 500 }),
  s("engineEfficiency", "Engine Efficiency Match", "Pair cycle to efficiency", "🛠️", "from-rose-400 to-amber-700", "11", "MechanicalEng", "Compare thermodynamic cycles", 5, "match", { displayInteraction: "Matching cards", xpRequired: 1200 }),
  s("hydraulicPress", "Hydraulic Press Force", "Multiply the force", "💪", "from-cyan-400 to-blue-700", "10", "MechanicalEng", "Apply F1/A1 = F2/A2", 4, "numpad", { displayInteraction: "Fill in number", xpRequired: 500 }),
  s("motorTorqueCurve", "Motor Torque Curve", "Read the operating point", "⚙️", "from-yellow-400 to-orange-700", "11", "ElectricalEng", "Read torque-speed curves", 5, "choice", { displayInteraction: "Multiple choice", xpRequired: 1200 }),
  s("transformerRatio", "Transformer Ratio", "Step up or step down?", "🔁", "from-amber-400 to-rose-700", "10", "ElectricalEng", "Apply V1/V2 = N1/N2", 4, "numpad", { displayInteraction: "Fill in number", xpRequired: 500 }),
  s("threePhasePower", "Three-Phase Power Match", "Pair config to load", "⚡", "from-violet-400 to-indigo-700", "12", "ElectricalEng", "Compare wye and delta", 5, "match", { displayInteraction: "Matching cards", xpRequired: 2500 }),
  s("ledResistor", "LED Resistor Picker", "Limit the current", "💡", "from-lime-400 to-emerald-700", "9", "ElectricalEng", "Size a current-limiting resistor", 3, "numpad", { displayInteraction: "Fill in number", xpRequired: 0 }),
  s("batteryLife", "Battery Life Estimator", "Predict runtime", "🔋", "from-emerald-400 to-cyan-700", "10", "ElectricalEng", "Estimate Ah / draw", 4, "numpad", { displayInteraction: "Fill in number", xpRequired: 500 }),
  s("concreteMix", "Concrete Mix Sort", "Aggregate, binder, additive", "🧱", "from-stone-400 to-amber-700", "9", "CivilEng", "Classify concrete components", 3, "sort", { displayInteraction: "Sort categories", xpRequired: 0 }),
  s("reinforcedBeam", "Reinforced Beam Boss", "Pick the safe section", "🏗️", "from-cyan-400 to-blue-800", "12", "CivilEng", "Compare reinforcement layouts", 5, "choice", { displayInteraction: "Design Challenge", xpRequired: 2500, isBoss: true, prerequisites: ["foundationDepth"], unlockMessage: "Civil boss unlocked: reinforce the beam." }),
  s("drainagePlan", "Drainage Plan Path", "Move the water", "💧", "from-sky-400 to-cyan-700", "10", "CivilEng", "Plan a drainage path", 4, "path", { displayInteraction: "Connect pathways", xpRequired: 500 }),
  s("earthquakeBracing", "Earthquake Bracing Sort", "Stiff or ductile?", "🌎", "from-rose-400 to-orange-700", "11", "CivilEng", "Classify seismic strategies", 4, "sort", { displayInteraction: "Sort categories", xpRequired: 1200 }),
  s("propThrust", "Propeller Thrust Tuner", "Pitch vs RPM", "🛩️", "from-sky-300 to-indigo-700", "9", "AerospaceEng", "Tune propeller thrust", 4, "slider", { displayInteraction: "Slider", xpRequired: 0 }),
  s("fuelMassFraction", "Fuel Mass Fraction", "Solve Tsiolkovsky", "🚀", "from-orange-400 to-red-800", "12", "AerospaceEng", "Use the rocket equation", 5, "numpad", { displayInteraction: "Fill in number", xpRequired: 2500 }),
  s("reentryAngle", "Re-entry Angle Match", "Burn up or skip out?", "🪂", "from-amber-400 to-rose-700", "11", "AerospaceEng", "Match entry angle to outcome", 5, "match", { displayInteraction: "Matching cards", xpRequired: 1200 }),
  s("droneStability", "Drone Stability Tuner", "Pick the PID gain", "🛸", "from-violet-400 to-fuchsia-700", "10", "AerospaceEng", "Stabilize a quadcopter", 4, "choice", { displayInteraction: "Multiple choice", xpRequired: 500 }),
  s("kinematicChain", "Kinematic Chain Order", "Order the joints", "🦾", "from-zinc-400 to-stone-700", "10", "Robotics", "Sequence robot joints", 4, "reorder", { displayInteraction: "Order steps", xpRequired: 500 }),
  s("swarmCoordination", "Swarm Coordination Boss", "Pick the protocol", "🐝", "from-yellow-400 to-amber-700", "12", "Robotics", "Choose swarm coordination rules", 5, "choice", { displayInteraction: "Design Challenge", xpRequired: 2500, isBoss: true, prerequisites: ["pathPlanner"], unlockMessage: "Robotics boss unlocked: coordinate the swarm." }),
  s("robotPickPlace", "Pick & Place Sequence", "Order the cycle", "🤖", "from-emerald-400 to-cyan-700", "9", "Robotics", "Sequence pick & place steps", 4, "reorder", { displayInteraction: "Sequence processes", xpRequired: 0 }),
  s("loadPath", "Load Path Tracer", "Follow the force", "🧗", "from-slate-400 to-blue-700", "10", "StructuralDesign", "Trace load paths", 4, "path", { displayInteraction: "Connect pathways", xpRequired: 500 }),
  s("weldJoint", "Weld Joint Strength", "Lap, butt, or fillet?", "🔧", "from-amber-400 to-orange-700", "9", "StructuralDesign", "Compare weld joint types", 4, "match", { displayInteraction: "Matching cards", xpRequired: 0 }),
  s("fatigueLife", "Fatigue Life Estimator", "Cycles until failure", "📉", "from-rose-400 to-amber-700", "11", "StructuralDesign", "Estimate fatigue life", 5, "numpad", { displayInteraction: "Fill in number", xpRequired: 1200 }),
  s("alloySelect", "Alloy Selection Match", "Pair alloy to use", "🪙", "from-amber-300 to-yellow-700", "9", "MaterialsScience", "Match alloys to applications", 4, "match", { displayInteraction: "Matching cards", xpRequired: 0 }),
  s("polymerChain", "Polymer Chain Order", "Build the chain", "🧬", "from-violet-400 to-fuchsia-700", "11", "MaterialsScience", "Order monomers to polymer", 5, "reorder", { displayInteraction: "Order steps", xpRequired: 1200 }),
  s("corrosionSort", "Corrosion Resistance Sort", "Resistant or vulnerable?", "🧪", "from-emerald-400 to-teal-700", "10", "MaterialsScience", "Classify corrosion behavior", 4, "sort", { displayInteraction: "Sort categories", xpRequired: 500 }),
  s("transistorMode", "Transistor Mode Match", "Cutoff, active, saturation", "🧠", "from-cyan-400 to-blue-800", "11", "Circuits", "Identify transistor regions", 5, "match", { displayInteraction: "Matching cards", xpRequired: 1200 }),
  s("kirchhoffLoop", "Kirchhoff Loop Solver", "Solve the loop current", "🔌", "from-yellow-400 to-orange-700", "11", "Circuits", "Apply Kirchhoff's voltage law", 5, "numpad", { displayInteraction: "Circuit Builder", xpRequired: 1200 }),
  s("logicCircuitMap", "Logic Circuit Map", "Match gate to truth table", "🔢", "from-amber-400 to-yellow-700", "10", "Circuits", "Read combinational logic", 4, "match", { displayInteraction: "Circuit Builder", xpRequired: 500 }),
  s("rootCauseTree", "Root Cause Tree", "Trace the failure", "🌲", "from-emerald-400 to-cyan-700", "11", "SystemsEng", "Order root-cause analysis", 5, "reorder", { displayInteraction: "Sequence processes", xpRequired: 1200 }),
  s("userStoryRank", "User Story Ranker", "Prioritize the work", "📋", "from-pink-400 to-rose-700", "10", "DesignThinking", "Rank user stories by value", 4, "reorder", { displayInteraction: "Order steps", xpRequired: 500 }),

  s("probSpinner2", "Spinner Probability", "Slice the chance", "🎯", "from-rose-300 to-fuchsia-700", "9", "Probability", "Read single-event probability", 3, "numpad", { displayInteraction: "Fill in number", xpRequired: 0 }),
  s("probAndOr", "AND vs OR Probability", "Combine events", "🎲", "from-violet-400 to-fuchsia-700", "10", "Probability", "Apply AND / OR rules", 4, "choice", { displayInteraction: "Multiple choice", xpRequired: 500 }),
  s("combinations", "Combinations C(n,k)", "Count unordered groups", "🧮", "from-sky-400 to-violet-700", "11", "Probability", "Compute n choose k", 5, "numpad", { displayInteraction: "Fill in number", xpRequired: 1200 }),
  s("permutations", "Permutations P(n,k)", "Count ordered arrangements", "🔢", "from-cyan-400 to-blue-700", "11", "Probability", "Compute permutation counts", 5, "numpad", { displayInteraction: "Fill in number", xpRequired: 1200 }),
  s("conditionalProb", "Conditional Probability", "Given that…", "🪙", "from-emerald-400 to-cyan-700", "11", "Probability", "Compute P(B|A)", 5, "numpad", { displayInteraction: "Fill in number", xpRequired: 1200 }),
  s("gcdHunt", "GCD Hunt", "Find the common factor", "🧩", "from-amber-300 to-orange-700", "9", "NumberTheory", "Compute greatest common divisor", 3, "numpad", { displayInteraction: "Fill in number", xpRequired: 0 }),
  s("lcmHunt", "LCM Hunt", "Find the shared multiple", "🧠", "from-yellow-300 to-amber-700", "9", "NumberTheory", "Compute least common multiple", 3, "numpad", { displayInteraction: "Fill in number", xpRequired: 0 }),
  s("modArithmetic", "Mod Arithmetic", "Find the remainder", "🔁", "from-violet-300 to-indigo-700", "10", "NumberTheory", "Compute a mod n", 4, "numpad", { displayInteraction: "Fill in number", xpRequired: 500 }),
  s("primeFactor", "Prime Factor Pick", "Choose the factorization", "🔱", "from-pink-300 to-rose-700", "9", "NumberTheory", "Identify prime factorization", 4, "choice", { displayInteraction: "Multiple choice", xpRequired: 0 }),
  s("divisibilityRule", "Divisibility Sort", "Sort by rule", "📐", "from-emerald-300 to-teal-700", "9", "NumberTheory", "Apply divisibility rules", 4, "sort", { displayInteraction: "Sort categories", xpRequired: 0 }),
  s("simpleInterest", "Simple Interest", "I = Prt", "💰", "from-emerald-300 to-cyan-700", "9", "FinancialMath", "Compute simple interest", 3, "numpad", { displayInteraction: "Fill in number", xpRequired: 0 }),
  s("compoundInterest", "Compound Interest", "Grow the principal", "📈", "from-amber-300 to-yellow-700", "11", "FinancialMath", "Apply compound interest formula", 5, "numpad", { displayInteraction: "Fill in number", xpRequired: 1200 }),
  s("percentDiscount", "Percent Discount", "Sale price", "🏷️", "from-rose-300 to-pink-700", "9", "FinancialMath", "Apply percent off", 3, "numpad", { displayInteraction: "Fill in number", xpRequired: 0 }),
  s("taxTip", "Tax + Tip Total", "Final receipt", "🧾", "from-amber-300 to-orange-700", "9", "FinancialMath", "Add tax and tip to a bill", 3, "numpad", { displayInteraction: "Fill in number", xpRequired: 0 }),
  s("budgetSort", "Budget Sorter", "Needs vs wants vs savings", "💳", "from-sky-300 to-indigo-700", "10", "FinancialMath", "Categorize spending", 4, "sort", { displayInteraction: "Sort categories", xpRequired: 500 }),
  s("truthTableRead", "Truth Table Reader", "Read the output", "🧠", "from-violet-300 to-fuchsia-700", "9", "Logic", "Read truth tables", 3, "choice", { displayInteraction: "Multiple choice", xpRequired: 0 }),
  s("setOperations", "Set Operations", "Union, intersection, difference", "🔵", "from-cyan-300 to-blue-700", "10", "Logic", "Compute set sizes", 4, "numpad", { displayInteraction: "Fill in number", xpRequired: 500 }),

  s("planetOrder", "Planet Order", "Sun to Neptune", "🪐", "from-indigo-300 to-violet-700", "9", "Astronomy", "Order planets from the Sun", 3, "reorder", { displayInteraction: "Order steps", xpRequired: 0 }),
  s("moonPhaseSeq", "Moon Phase Sequence", "Phase cycle", "🌗", "from-zinc-300 to-zinc-700", "9", "Astronomy", "Sequence the lunar cycle", 3, "reorder", { displayInteraction: "Sequence processes", xpRequired: 0 }),
  s("keplerPeriod", "Kepler's Third Law", "T² ∝ a³", "🌌", "from-fuchsia-300 to-indigo-700", "11", "Astronomy", "Apply Kepler's third law", 5, "numpad", { displayInteraction: "Fill in number", xpRequired: 1200 }),
  s("starClassify", "Star Spectral Class", "OBAFGKM", "⭐", "from-amber-300 to-orange-700", "10", "Astronomy", "Classify stars by temperature", 4, "sort", { displayInteraction: "Sort categories", xpRequired: 500 }),
  s("lightYearDist", "Light-Year Distance", "Distance in light-years", "💫", "from-cyan-300 to-blue-700", "10", "Astronomy", "Convert distance using c·t", 4, "numpad", { displayInteraction: "Fill in number", xpRequired: 500 }),
  s("dnaTranscribe", "DNA → mRNA", "Transcribe the strand", "🧬", "from-emerald-300 to-cyan-700", "10", "Genetics", "Transcribe DNA to mRNA", 4, "choice", { displayInteraction: "Multiple choice", xpRequired: 500 }),
  s("traitMendel", "Mendel Trait Predict", "Punnett prediction", "🟢", "from-emerald-300 to-teal-700", "10", "Genetics", "Predict Mendelian trait ratios", 4, "choice", { displayInteraction: "Multiple choice", xpRequired: 500 }),
  s("mutationSort", "Mutation Type Sort", "Silent, missense, nonsense", "🧪", "from-violet-300 to-pink-700", "11", "Genetics", "Classify point mutations", 4, "sort", { displayInteraction: "Sort categories", xpRequired: 1200 }),
  s("pedigreeRead", "Pedigree Reader", "Read the chart", "🌳", "from-amber-300 to-orange-700", "11", "Genetics", "Read pedigree inheritance", 5, "choice", { displayInteraction: "Multiple choice", xpRequired: 1200 }),
  s("chromosomeCount", "Chromosome Counter", "Haploid vs diploid", "🧫", "from-rose-300 to-pink-700", "10", "Genetics", "Count human chromosomes", 3, "numpad", { displayInteraction: "Fill in number", xpRequired: 500 }),
  s("trophicLevels", "Trophic Level Order", "Producer → apex", "🦅", "from-emerald-300 to-teal-700", "9", "Ecology", "Order trophic levels", 3, "reorder", { displayInteraction: "Order steps", xpRequired: 0 }),
  s("nicheSort", "Niche Classification", "Producer, consumer, decomposer", "🌿", "from-lime-300 to-emerald-700", "9", "Ecology", "Classify ecological roles", 4, "sort", { displayInteraction: "Sort categories", xpRequired: 0 }),
  s("popGrowth", "Population Growth", "Exponential snapshot", "📊", "from-cyan-300 to-emerald-700", "10", "Ecology", "Compute exponential growth", 4, "numpad", { displayInteraction: "Fill in number", xpRequired: 500 }),
  s("organSystemMatch", "Organ → System Match", "Pair organ to system", "🫀", "from-rose-300 to-red-700", "9", "Anatomy", "Match organs to body systems", 3, "match", { displayInteraction: "Matching cards", xpRequired: 0 }),
  s("bloodFlowOrder", "Blood Flow Order", "Heart circuit", "🩸", "from-red-300 to-rose-700", "10", "Anatomy", "Trace pulmonary circulation", 4, "reorder", { displayInteraction: "Order steps", xpRequired: 500 }),
  s("neuronImpulse", "Neuron Impulse Order", "Signal pathway", "🧠", "from-violet-300 to-fuchsia-700", "11", "Anatomy", "Order action-potential steps", 5, "reorder", { displayInteraction: "Sequence processes", xpRequired: 1200 }),
  s("carbonPoolSort", "Carbon Pool Sort", "Where is the carbon?", "🌍", "from-emerald-300 to-teal-700", "10", "EnvironmentalScience", "Classify carbon reservoirs", 4, "sort", { displayInteraction: "Sort categories", xpRequired: 500 }),
  s("renewableSort", "Renewable vs Non-renewable", "Energy sort", "⚡", "from-yellow-300 to-amber-700", "9", "EnvironmentalScience", "Classify energy sources", 3, "sort", { displayInteraction: "Sort categories", xpRequired: 0 }),
  s("greenhouseCause", "Greenhouse Cause", "Pick the driver", "🌫️", "from-amber-300 to-orange-700", "9", "EnvironmentalScience", "Identify climate drivers", 3, "choice", { displayInteraction: "Multiple choice", xpRequired: 0 }),

  s("forLoopTrace", "For-Loop Trace", "Predict the final value", "🔁", "from-sky-400 to-violet-700", "9", "CodingLogic", "Trace loop accumulators", 4, "numpad", { displayInteraction: "Code Trace", xpRequired: 0 }),
  s("ifElseResult", "If/Else Result", "Pick the branch", "🌿", "from-violet-400 to-fuchsia-700", "9", "CodingLogic", "Evaluate conditional logic", 3, "choice", { displayInteraction: "Code Trace", xpRequired: 0 }),
  s("recursionDepth", "Recursion Depth", "Count the calls", "🌀", "from-fuchsia-400 to-pink-700", "11", "CodingLogic", "Compute recursion call depth", 5, "numpad", { displayInteraction: "Code Trace", xpRequired: 1200 }),
  s("bigOSort", "Big-O Speed Order", "Fastest to slowest", "🚀", "from-emerald-400 to-cyan-700", "10", "Algorithms", "Rank algorithm complexity", 4, "reorder", { displayInteraction: "Order steps", xpRequired: 500 }),
  s("binarySearchSteps", "Binary Search Steps", "log₂(n) jumps", "🔎", "from-cyan-400 to-blue-700", "10", "Algorithms", "Count binary search steps", 4, "numpad", { displayInteraction: "Fill in number", xpRequired: 500 }),
  s("sortAlgoMatch", "Sort Algo Match", "Name to method", "🃏", "from-violet-400 to-indigo-700", "10", "Algorithms", "Match sort algorithms to behavior", 4, "match", { displayInteraction: "Matching cards", xpRequired: 500 }),
  s("precisionRecall", "Precision / Recall", "Score the classifier", "🤖", "from-fuchsia-400 to-violet-700", "11", "AIML", "Compute precision and recall", 5, "numpad", { displayInteraction: "Fill in number", xpRequired: 1200 }),
  s("gradientStep", "Gradient Descent Step", "Which way to go?", "📉", "from-rose-400 to-amber-700", "12", "AIML", "Decide gradient descent direction", 5, "choice", { displayInteraction: "Multiple choice", xpRequired: 2500 }),
  s("normalizeData", "Normalize a Value", "Min-max scale", "🧮", "from-cyan-400 to-emerald-700", "10", "AIML", "Min-max scale a feature", 4, "numpad", { displayInteraction: "Fill in number", xpRequired: 500 }),
  s("caesarCipher", "Caesar Cipher", "Decode the shift", "🔐", "from-amber-400 to-rose-700", "10", "Cybersecurity", "Decrypt a Caesar cipher", 4, "numpad", { displayInteraction: "Fill in number", xpRequired: 500 }),
  s("passwordStrength", "Password Strength Order", "Weakest to strongest", "🛡️", "from-emerald-400 to-cyan-700", "9", "Cybersecurity", "Rank password entropy", 3, "reorder", { displayInteraction: "Order steps", xpRequired: 0 }),
  s("sqlJoinMatch", "SQL Join Match", "Inner, left, right, full", "🗄️", "from-blue-400 to-cyan-700", "10", "Databases", "Match SQL joins to behavior", 4, "match", { displayInteraction: "Matching cards", xpRequired: 500 }),
  s("sqlCount", "SQL Count Result", "Predict row count", "🔢", "from-cyan-400 to-blue-700", "11", "Databases", "Predict SQL aggregate count", 5, "numpad", { displayInteraction: "Fill in number", xpRequired: 1200 }),
  s("normalizationSort", "Normalization Sort", "1NF, 2NF, 3NF", "📚", "from-violet-400 to-fuchsia-700", "11", "Databases", "Classify normal forms", 5, "sort", { displayInteraction: "Sort categories", xpRequired: 1200 }),
  s("httpVerbMatch", "HTTP Verb Match", "Verb to action", "🌐", "from-emerald-400 to-cyan-700", "9", "APIs", "Match HTTP verbs to CRUD", 3, "match", { displayInteraction: "Matching cards", xpRequired: 0 }),
  s("statusCodeMatch", "Status Code Match", "Code to meaning", "🚦", "from-rose-400 to-amber-700", "10", "APIs", "Match HTTP status codes", 4, "match", { displayInteraction: "Matching cards", xpRequired: 500 }),
  s("restRoute", "REST Route Design", "Pick the endpoint", "🛣️", "from-cyan-400 to-violet-700", "10", "APIs", "Choose REST URL design", 4, "choice", { displayInteraction: "Multiple choice", xpRequired: 500 }),
  s("osiLayerOrder", "OSI Layer Order", "Top to bottom", "🗼", "from-indigo-400 to-violet-700", "10", "Networks", "Order the OSI layers", 4, "reorder", { displayInteraction: "Order steps", xpRequired: 500 }),
  s("subnetCount", "Subnet Host Count", "How many hosts?", "🛰️", "from-sky-400 to-blue-700", "11", "Networks", "Compute subnet host count", 5, "numpad", { displayInteraction: "Fill in number", xpRequired: 1200 }),
  s("dnsOrder", "DNS Lookup Order", "Where do we look first?", "🌍", "from-emerald-400 to-cyan-700", "10", "Networks", "Order DNS resolution steps", 4, "reorder", { displayInteraction: "Sequence processes", xpRequired: 500 }),
  s("htmlTagSort", "HTML Tag Sort", "Structure vs content", "📄", "from-orange-400 to-rose-700", "9", "WebDev", "Classify HTML tags", 3, "sort", { displayInteraction: "Sort categories", xpRequired: 0 }),
  s("cssBoxModel", "CSS Box Model", "Outer width math", "📦", "from-cyan-400 to-blue-700", "10", "WebDev", "Compute box-model width", 4, "numpad", { displayInteraction: "Fill in number", xpRequired: 500 }),
  s("domEventOrder", "DOM Event Order", "Capture → bubble", "🖱️", "from-violet-400 to-fuchsia-700", "10", "WebDev", "Sequence DOM event flow", 4, "reorder", { displayInteraction: "Sequence processes", xpRequired: 500 }),
  s("hexBinaryConvert", "Hex ↔ Binary", "Convert the byte", "🔢", "from-amber-400 to-orange-700", "10", "DigitalSystems", "Convert between hex and binary", 4, "numpad", { displayInteraction: "Fill in number", xpRequired: 500 }),
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

function sample<T>(items: readonly T[], count: number) {
  return shuffle(items).slice(0, Math.min(count, items.length));
}

function challengeSubset<T>(items: readonly T[], min = 4, max = 6) {
  if (items.length <= min) return [...items];
  const size = rand(min, Math.min(max, items.length));
  const start = rand(0, items.length - size);
  return items.slice(start, start + size);
}

function variedPrompt(prompt: string, mode: Mode) {
  const frames: Record<Mode, string[]> = {
    choice: ["Pick the strongest answer.", "Choose the card that fits.", "Solve this version."],
    drag: ["Drag the correct card into place.", "Find the missing piece.", "Drop the best match."],
    slider: ["Tune the value exactly.", "Set the target value.", "Adjust until the model balances."],
    match: ["Pair the cards shown.", "Match this shuffled set.", "Connect each idea to its partner."],
    path: ["Trace the shown route.", "Walk this version in order.", "Tap the path cards in sequence."],
    rotate: ["Rotate into alignment.", "Turn the shape to the target.", "Find the matching orientation."],
    reorder: ["Order the cards shown.", "Sequence this shuffled set.", "Arrange this version correctly."],
    swipe: ["Swipe to finish the challenge.", "Use the target swipe.", "Unlock this version."],
    numpad: ["Enter the exact value.", "Solve this numeric version.", "Type the missing number."],
    sort: ["Sort the cards shown.", "Classify this shuffled set.", "Place each card in a bucket."],
  };
  return `${prompt} ${pick(frames[mode])}`;
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
  const offsets = shuffle([
    -spread,
    -Math.max(1, Math.floor(spread / 2)),
    -1,
    1,
    Math.max(2, Math.floor(spread / 2)),
    spread,
    rand(-spread * 2, spread * 2),
    rand(-spread * 3, spread * 3),
  ]);
  for (const offset of offsets) {
    const n = answer + offset;
    if (n > 0 && n !== answer) set.add(String(n));
    if (set.size >= 4) break;
  }
  while (set.size < 4) {
    const n = answer + rand(-spread * 3, spread * 3);
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
  const all = new Set([answer, ...sample(Array.from(new Set(choices.filter((choice) => choice !== answer))), 3)]);
  while (all.size < 4) {
    all.add(String(rand(-12, 36)));
  }
  return { ...puzzle, mode: "choice", prompt: variedPrompt(puzzle.prompt, "choice"), answer, choices: shuffle(Array.from(all)) };
}

function numpadEng(
  meta: PuzzleMeta,
  difficulty: Difficulty,
  prompt: string,
  visual: Visual,
  answer: string | number,
  hint: string,
  hints: string[],
  explanation: string,
  allowMinus = false,
): Puzzle {
  const str = typeof answer === "number" ? String(answer) : answer;
  return {
    ...base(meta, difficulty, "numpad", variedPrompt(prompt, "numpad"), visual),
    numpadAnswer: str,
    numpadAllowDecimal: str.includes("."),
    numpadAllowMinus: allowMinus || str.startsWith("-"),
    hint,
    hints,
    explanation,
  };
}

function reorderEng(
  meta: PuzzleMeta,
  difficulty: Difficulty,
  prompt: string,
  correctOrder: string[],
  hint: string,
  hints: string[],
  explanation: string,
): Puzzle {
  const order = challengeSubset(correctOrder);
  return {
    ...base(meta, difficulty, "reorder", variedPrompt(prompt, "reorder"), {
      kind: "icon",
      icon: meta.emoji,
      title: order.join(" → "),
      subtitle: order.length === correctOrder.length ? "Tap two tiles to swap" : `Subset of ${correctOrder.length} steps`,
    }),
    tiles: shuffle(order),
    correctOrder: order,
    hint,
    hints,
    explanation: order.length === correctOrder.length ? explanation : `${explanation} This run used a focused subset of the full sequence.`,
  };
}

function sortEng(
  meta: PuzzleMeta,
  difficulty: Difficulty,
  prompt: string,
  categories: string[],
  items: { label: string; category: string }[],
  hint: string,
  hints: string[],
  explanation: string,
): Puzzle {
  const categoriesWithItems = categories.filter((category) => items.some((item) => item.category === category));
  const activeCategories = categoriesWithItems.length > 3 ? sample(categoriesWithItems, rand(2, 3)) : categoriesWithItems;
  const activeItems = activeCategories.flatMap((category) => sample(items.filter((item) => item.category === category), rand(1, 2)));
  return {
    ...base(meta, difficulty, "sort", variedPrompt(prompt, "sort"), {
      kind: "icon",
      icon: meta.emoji,
      title: activeCategories.join("  ·  "),
      subtitle: activeItems.length === items.length ? "Tap a card, then a bucket" : `Sorting ${activeItems.length} of ${items.length} cards`,
    }),
    sortItems: shuffle(activeItems.length > 0 ? activeItems : items),
    sortCategories: activeCategories.length > 0 ? activeCategories : categories,
    hint,
    hints,
    explanation: activeItems.length === items.length ? explanation : `${explanation} This run sampled a smaller set of examples.`,
  };
}

function pathEng(
  meta: PuzzleMeta,
  difficulty: Difficulty,
  prompt: string,
  stops: string[],
  hint: string,
  hints: string[],
  explanation: string,
): Puzzle {
  const route = challengeSubset(stops);
  return {
    ...base(meta, difficulty, "path", variedPrompt(prompt, "path"), {
      kind: "grid",
      title: route.join(" → "),
      tiles: route,
    }),
    pathTiles: route,
    correctPath: route.map((_, i) => i),
    hint,
    hints,
    explanation: route.length === stops.length ? explanation : `${explanation} This run traced a focused segment of the full path.`,
  };
}

function sliderEng(
  meta: PuzzleMeta,
  difficulty: Difficulty,
  prompt: string,
  range: { min: number; max: number; step: number; initial: number; target: number },
  subtitle: string,
  hint: string,
  hints: string[],
  explanation: string,
): Puzzle {
  return {
    ...base(meta, difficulty, "slider", prompt, {
      kind: "icon",
      icon: meta.emoji,
      title: `Target ${range.target}`,
      subtitle,
    }),
    slider: range,
    hint,
    hints,
    explanation,
  };
}

function dragEng(
  meta: PuzzleMeta,
  difficulty: Difficulty,
  prompt: string,
  answer: string,
  distractors: string[],
  dropLabel: string,
  hint: string,
  hints: string[],
  explanation: string,
): Puzzle {
  const selectedDistractors = sample(Array.from(new Set(distractors.filter((item) => item !== answer))), 3);
  return {
    ...base(meta, difficulty, "drag", variedPrompt(prompt, "drag"), {
      kind: "icon",
      icon: meta.emoji,
      title: dropLabel,
      subtitle: "Drag and drop",
    }),
    dragItems: shuffle([answer, ...selectedDistractors]),
    dropLabel,
    answer,
    hint,
    hints,
    explanation,
  };
}

function rotateEng(
  meta: PuzzleMeta,
  difficulty: Difficulty,
  prompt: string,
  targetRotation: number,
  rotationStep: number,
  hint: string,
  hints: string[],
  explanation: string,
): Puzzle {
  return {
    ...base(meta, difficulty, "rotate", variedPrompt(prompt, "rotate"), {
      kind: "fold",
      title: meta.title,
    }),
    targetRotation,
    rotationStep,
    hint,
    hints,
    explanation,
  };
}

function matchEng(
  meta: PuzzleMeta,
  difficulty: Difficulty,
  prompt: string,
  pairs: [string, string][],
  hint: string,
  hints: string[],
  explanation: string,
): Puzzle {
  const activePairs = sample(pairs, pairs.length > 4 ? rand(4, Math.min(6, pairs.length)) : pairs.length);
  return {
    ...base(meta, difficulty, "match", variedPrompt(prompt, "match"), {
      kind: "icon",
      icon: meta.emoji,
      title: "Pair the cards",
      subtitle: activePairs.map(([left]) => left).join("  •  "),
    }),
    pairs: activePairs.map(([left, right]) => ({ left, right })),
    hint,
    hints,
    explanation: activePairs.length === pairs.length ? explanation : `${explanation} This run sampled ${activePairs.length} pairs from the full set.`,
  };
}

function choiceEng(
  meta: PuzzleMeta,
  difficulty: Difficulty,
  prompt: string,
  visual: Visual,
  answer: string,
  distractors: string[],
  hint: string,
  hints: string[],
  explanation: string,
): Puzzle {
  const focus = pick(["model", "diagram", "scenario", "example"]);
  return makeChoice(
    {
      ...base(meta, difficulty, "choice", prompt, { ...visual, subtitle: visual.subtitle ?? `Fresh ${focus}` }),
      hint,
      hints,
      explanation,
    },
    answer,
    distractors,
  );
}

interface ReorderVariant {
  prompt: string;
  order: string[];
  hint: string;
  hints?: string[];
  explanation: string;
}
function bankReorder(meta: PuzzleMeta, difficulty: Difficulty, variants: ReorderVariant[]): Puzzle {
  const v = pick(variants);
  return reorderEng(meta, difficulty, v.prompt, v.order, v.hint, v.hints ?? [v.hint], v.explanation);
}

interface MatchVariant {
  prompt: string;
  pairs: [string, string][];
  hint: string;
  hints?: string[];
  explanation: string;
}
function bankMatch(meta: PuzzleMeta, difficulty: Difficulty, variants: MatchVariant[]): Puzzle {
  const v = pick(variants);
  return matchEng(meta, difficulty, v.prompt, v.pairs, v.hint, v.hints ?? [v.hint], v.explanation);
}

interface SortVariant {
  prompt: string;
  categories: string[];
  items: { label: string; category: string }[];
  hint: string;
  hints?: string[];
  explanation: string;
}
function bankSort(meta: PuzzleMeta, difficulty: Difficulty, variants: SortVariant[]): Puzzle {
  const v = pick(variants);
  return sortEng(meta, difficulty, v.prompt, v.categories, v.items, v.hint, v.hints ?? [v.hint], v.explanation);
}

interface ChoiceVariant {
  prompt: string;
  visual: Visual;
  answer: string;
  distractors: string[];
  hint: string;
  hints?: string[];
  explanation: string;
}
function bankChoice(meta: PuzzleMeta, difficulty: Difficulty, variants: ChoiceVariant[]): Puzzle {
  const v = pick(variants);
  return choiceEng(meta, difficulty, v.prompt, v.visual, v.answer, v.distractors, v.hint, v.hints ?? [v.hint], v.explanation);
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
    case "placeValueBuilder": {
      const hundreds = rand(1, 9);
      const tens = rand(0, 9);
      const ones = rand(0, 9);
      const value = hundreds * 100 + tens * 10 + ones;
      return numpadEng(
        m,
        difficulty,
        `Build the number with ${hundreds} hundreds, ${tens} tens, and ${ones} ones.`,
        { kind: "icon", icon: m.emoji, title: `${hundreds}H ${tens}T ${ones}O`, subtitle: "Place value blocks" },
        value,
        "Hundreds are worth 100, tens are worth 10, ones are worth 1.",
        [`${hundreds} hundreds = ${hundreds * 100}.`, `${tens} tens = ${tens * 10}.`, `Add ${hundreds * 100} + ${tens * 10} + ${ones}.`],
        `${hundreds * 100} + ${tens * 10} + ${ones} = ${value}.`,
      );
    }
    case "roundingTarget": {
      const place = pick(["nearest ten", "nearest hundred", "nearest tenth"] as const);
      if (place === "nearest tenth") {
        const tenths = rand(12, 98) / 10;
        const hundredthsDigit = rand(1, 9);
        const value = Number((tenths + hundredthsDigit / 100).toFixed(2));
        const rounded = (Math.round(value * 10) / 10).toFixed(1);
        return makeChoice(
          {
            ...base(m, difficulty, "choice", `Round ${value.toFixed(2)} to the nearest tenth.`, {
              kind: "icon",
              icon: m.emoji,
              title: value.toFixed(2),
              subtitle: "Nearest tenth",
            }),
            hint: "Look at the hundredths digit.",
            hints: [`Hundredths digit is ${hundredthsDigit}.`, hundredthsDigit >= 5 ? "Round the tenths up." : "Keep the tenths the same."],
            explanation: `${value.toFixed(2)} rounds to ${rounded}.`,
          },
          rounded,
          [value.toFixed(2), (Math.floor(value * 10) / 10).toFixed(1), (Math.ceil(value * 10) / 10).toFixed(1)],
        );
      }
      const baseValue = rand(12, 987);
      const factor = place === "nearest hundred" ? 100 : 10;
      const rounded = Math.round(baseValue / factor) * factor;
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Round ${baseValue} to the ${place}.`, {
            kind: "icon",
            icon: m.emoji,
            title: String(baseValue),
            subtitle: place,
          }),
          hint: factor === 100 ? "Look at the tens digit." : "Look at the ones digit.",
          hints: [`Rounding unit is ${factor}.`, `Closest multiple of ${factor} is ${rounded}.`],
          explanation: `${baseValue} rounds to ${rounded} to the ${place}.`,
        },
        String(rounded),
        numberChoices(rounded, factor),
      );
    }
    case "integerChipSort": {
      const positives = [2, 5, 9, 12, 18].map(String);
      const negatives = [-1, -4, -7, -11, -15].map(String);
      const zeros = ["0", "+0"];
      return sortEng(
        m,
        difficulty,
        "Sort each integer by sign.",
        ["Positive", "Negative", "Zero"],
        [
          ...positives.map((label) => ({ label, category: "Positive" })),
          ...negatives.map((label) => ({ label, category: "Negative" })),
          ...zeros.map((label) => ({ label, category: "Zero" })),
        ],
        "Numbers greater than zero are positive; less than zero are negative.",
        ["The minus sign means less than zero.", "Zero is neither positive nor negative."],
        "Classify by position relative to zero on the number line.",
      );
    }
    case "orderOpsTower": {
      const a = rand(2, 8);
      const b = rand(2, 6);
      const c = rand(2, 5);
      const d = rand(1, 9);
      const useParens = Math.random() < 0.5;
      const expression = useParens ? `${a} + ${b} × (${c} + ${d})` : `${a} + ${b} × ${c}²`;
      const answer = useParens ? a + b * (c + d) : a + b * c * c;
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Evaluate ${expression}.`, {
            kind: "icon",
            icon: m.emoji,
            title: expression,
            subtitle: "Order of operations",
          }),
          hint: "Do parentheses and exponents before multiplication and addition.",
          hints: useParens ? [`Parentheses first: ${c} + ${d} = ${c + d}.`, `Then multiply: ${b} × ${c + d}.`] : [`Exponent first: ${c}² = ${c * c}.`, `Then multiply: ${b} × ${c * c}.`],
          explanation: useParens ? `${a} + ${b} × ${c + d} = ${answer}.` : `${a} + ${b} × ${c * c} = ${answer}.`,
        },
        String(answer),
        numberChoices(answer, 12),
      );
    }
    case "equivalentFractionBridge": {
      const variants = [
        [[frac(1, 2), frac(2, 4)], [frac(2, 3), frac(4, 6)], [frac(3, 4), frac(6, 8)], [frac(1, 5), frac(3, 15)], [frac(5, 6), frac(10, 12)]],
        [[frac(3, 6), frac(1, 2)], [frac(6, 9), frac(2, 3)], [frac(4, 10), frac(2, 5)], [frac(9, 12), frac(3, 4)], [frac(8, 20), frac(2, 5)]],
        [[frac(2, 8), frac(1, 4)], [frac(6, 15), frac(2, 5)], [frac(10, 25), frac(2, 5)], [frac(12, 16), frac(3, 4)], [frac(14, 21), frac(2, 3)]],
      ];
      return matchEng(
        m,
        difficulty,
        "Match each fraction to an equivalent fraction.",
        pick(variants) as [string, string][],
        "Multiply or divide numerator and denominator by the same number.",
        ["Equivalent fractions name the same amount.", "Simplify both fractions to compare."],
        "Fractions are equivalent when they simplify to the same ratio.",
      );
    }
    case "fractionOperationLab": {
      const den = pick([6, 8, 10, 12] as const);
      const a = rand(1, Math.floor(den / 2));
      const b = rand(1, Math.floor(den / 2));
      const add = a + b < den || Math.random() < 0.7;
      const top = add ? a + b : Math.max(a, b) - Math.min(a, b);
      const expression = add ? `${a}/${den} + ${b}/${den}` : `${Math.max(a, b)}/${den} − ${Math.min(a, b)}/${den}`;
      const answer = frac(top, den);
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Compute ${expression}.`, {
            kind: "icon",
            icon: m.emoji,
            title: expression,
            subtitle: "Same denominator",
          }),
          hint: "Keep the denominator; operate on the numerators.",
          hints: [`Common denominator is ${den}.`, add ? `${a} + ${b} = ${top}.` : `${Math.max(a, b)} − ${Math.min(a, b)} = ${top}.`],
          explanation: `${expression} = ${answer}.`,
        },
        answer,
        [frac(top + 1, den), frac(Math.max(1, top - 1), den), `${top}/${den + 2}`],
      );
    }
    case "decimalPlaceRace": {
      const left = Number((rand(10, 99) / 10).toFixed(1));
      const right = Number((left + pick([-0.3, -0.1, 0.07, 0.2, 0.35] as const)).toFixed(2));
      const answer = left > right ? `${left.toFixed(1)} is greater` : right > left ? `${right.toFixed(2)} is greater` : "They are equal";
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Compare ${left.toFixed(1)} and ${right.toFixed(2)}.`, {
            kind: "icon",
            icon: m.emoji,
            title: `${left.toFixed(1)} ? ${right.toFixed(2)}`,
            subtitle: "Line up decimal places",
          }),
          hint: "Write both numbers with the same number of decimal places.",
          hints: [`${left.toFixed(1)} = ${left.toFixed(2)}.`, `Compare ${left.toFixed(2)} to ${right.toFixed(2)}.`],
          explanation: `${left.toFixed(2)} ${left > right ? ">" : left < right ? "<" : "="} ${right.toFixed(2)}.`,
        },
        answer,
        [`${left.toFixed(1)} is greater`, `${right.toFixed(2)} is greater`, "They are equal"].filter((choice) => choice !== answer),
      );
    }
    case "percentBarBuilder": {
      const percent = pick([10, 20, 25, 30, 40, 50, 60, 75] as const);
      const whole = pick([40, 60, 80, 100, 120, 200] as const);
      const answer = (percent * whole) / 100;
      return numpadEng(
        m,
        difficulty,
        `Find ${percent}% of ${whole}.`,
        { kind: "icon", icon: m.emoji, title: `${percent}% of ${whole}`, subtitle: "Percent bar" },
        answer,
        "Convert the percent to a fraction or decimal, then multiply.",
        [`${percent}% = ${percent}/100.`, `${whole} × ${percent}/100 = ${answer}.`],
        `${percent}% of ${whole} is ${answer}.`,
      );
    }
    case "ratioTableMatch": {
      const a = rand(2, 6);
      const b = rand(2, 8);
      const factors = [1, 2, 3, 4, 5];
      return matchEng(
        m,
        difficulty,
        `Match each ${a}:${b} ratio table row to its equivalent pair.`,
        factors.map((factor) => [`×${factor}`, `${a * factor}:${b * factor}`]),
        "Multiply both parts of the ratio by the same factor.",
        [`Base ratio is ${a}:${b}.`, "Equivalent ratios scale both columns together."],
        `Rows like ${a * 2}:${b * 2} and ${a * 3}:${b * 3} preserve the same ratio ${a}:${b}.`,
      );
    }
    case "coordinateQuadrantSort": {
      const items = [
        { label: "(3, 4)", category: "Quadrant I" },
        { label: "(6, 2)", category: "Quadrant I" },
        { label: "(-3, 5)", category: "Quadrant II" },
        { label: "(-7, 1)", category: "Quadrant II" },
        { label: "(-4, -6)", category: "Quadrant III" },
        { label: "(-2, -8)", category: "Quadrant III" },
        { label: "(5, -3)", category: "Quadrant IV" },
        { label: "(9, -1)", category: "Quadrant IV" },
      ];
      return sortEng(
        m,
        difficulty,
        "Sort each point by coordinate-plane quadrant.",
        ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV"],
        items,
        "Use the signs of x and y.",
        ["I: (+,+), II: (-,+), III: (-,-), IV: (+,-).", "The first coordinate is x; the second is y."],
        "Quadrants are determined by the sign pattern of (x, y).",
      );
    }
    case "numberLineJump": {
      const start = rand(-9, 9);
      const jump = rand(-9, 9) || 4;
      const end = start + jump;
      const jumpStr = jump >= 0 ? `+${jump}` : `${jump}`;
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Start at ${start} on the number line and jump ${jumpStr}. Where do you land?`, {
            kind: "icon",
            icon: m.emoji,
            title: `${start} ${jumpStr}`,
            subtitle: "Number line jump",
          }),
          hint: jump >= 0 ? "Moving right increases; left decreases." : "Negative jump moves left.",
          hints: [`Start: ${start}.`, `Add ${jump} → ${end}.`],
          explanation: `${start} + (${jump}) = ${end}.`,
        },
        String(end),
        [String(end + 1), String(end - 1), String(start - jump)],
      );
    }
    case "multiplicationFact": {
      const a = rand(3, difficulty === "hard" ? 12 : 9);
      const b = rand(3, difficulty === "hard" ? 12 : 9);
      const answer = a * b;
      return numpadEng(
        m,
        difficulty,
        `What is ${a} × ${b}?`,
        { kind: "icon", icon: m.emoji, title: `${a} × ${b}`, subtitle: "Multiplication facts" },
        answer,
        "Use a known fact or skip-count.",
        [`${a} groups of ${b}.`, `${b} groups of ${a}.`],
        `${a} × ${b} = ${answer}.`,
      );
    }
    case "divisionRemainder": {
      const divisor = rand(3, 9);
      const quotient = rand(3, 12);
      const remainder = rand(1, divisor - 1);
      const dividend = divisor * quotient + remainder;
      const answer = `${quotient} R ${remainder}`;
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Divide ${dividend} ÷ ${divisor}. Pick the quotient with remainder.`, {
            kind: "icon",
            icon: m.emoji,
            title: `${dividend} ÷ ${divisor}`,
            subtitle: "Whole-number division",
          }),
          hint: "Find the largest multiple of the divisor that fits.",
          hints: [`${divisor} × ${quotient} = ${divisor * quotient}.`, `${dividend} − ${divisor * quotient} = ${remainder}.`],
          explanation: `${dividend} = ${divisor} × ${quotient} + ${remainder}, so quotient is ${quotient} remainder ${remainder}.`,
        },
        answer,
        [`${quotient + 1} R ${remainder}`, `${quotient} R ${Math.max(0, remainder - 1)}`, `${quotient - 1} R ${remainder}`],
      );
    }
    case "fractionDecimalConvert": {
      const variants: [string, string][][] = [
        [["1/2", "0.5"], ["1/4", "0.25"], ["3/4", "0.75"], ["1/5", "0.2"], ["2/5", "0.4"]],
        [["1/10", "0.1"], ["3/10", "0.3"], ["7/10", "0.7"], ["1/2", "0.5"], ["9/10", "0.9"]],
        [["1/8", "0.125"], ["3/8", "0.375"], ["5/8", "0.625"], ["7/8", "0.875"], ["1/4", "0.25"]],
        [["1/20", "0.05"], ["3/20", "0.15"], ["1/25", "0.04"], ["1/50", "0.02"], ["1/100", "0.01"]],
      ];
      return matchEng(
        m,
        difficulty,
        "Match each fraction with its decimal form.",
        pick(variants),
        "Divide the numerator by the denominator.",
        ["Fractions like 1/2 and 1/4 are common decimals.", "Look for tenths, fifths, and eighths."],
        "Each fraction has a unique decimal expansion.",
      );
    }
    case "percentFractionDecimal": {
      const variants: [string, string][][] = [
        [["25%", "1/4 = 0.25"], ["50%", "1/2 = 0.5"], ["75%", "3/4 = 0.75"], ["10%", "1/10 = 0.1"], ["20%", "1/5 = 0.2"]],
        [["5%", "1/20 = 0.05"], ["40%", "2/5 = 0.4"], ["60%", "3/5 = 0.6"], ["80%", "4/5 = 0.8"], ["100%", "1 = 1.0"]],
        [["12.5%", "1/8 = 0.125"], ["37.5%", "3/8 = 0.375"], ["62.5%", "5/8 = 0.625"], ["87.5%", "7/8 = 0.875"], ["50%", "1/2 = 0.5"]],
      ];
      return matchEng(
        m,
        difficulty,
        "Pair each percent with its fraction/decimal equivalent.",
        pick(variants),
        "Percent = parts per 100.",
        ["Drop the % sign and divide by 100 for the decimal.", "Simplify the fraction over 100."],
        "Percent, fraction, and decimal are three views of the same number.",
      );
    }
    case "absoluteValueBasics": {
      const value = pick([-15, -12, -9, -7, -4, -2, 3, 5, 8, 11, 14] as const);
      const answer = Math.abs(value);
      return numpadEng(
        m,
        difficulty,
        `Compute |${value}|.`,
        { kind: "icon", icon: m.emoji, title: `|${value}|`, subtitle: "Absolute value" },
        answer,
        "Absolute value is distance from zero — always non-negative.",
        [value < 0 ? `Drop the negative sign.` : `Already non-negative.`, `|x| measures distance to 0.`],
        `|${value}| = ${answer}.`,
      );
    }
    case "exponentBasic": {
      const baseVal = rand(2, 6);
      const exp = rand(2, baseVal <= 3 ? 5 : 4);
      const answer = Math.pow(baseVal, exp);
      return numpadEng(
        m,
        difficulty,
        `Compute ${baseVal}^${exp}.`,
        { kind: "icon", icon: m.emoji, title: `${baseVal}^${exp}`, subtitle: "Repeated multiplication" },
        answer,
        "Multiply the base by itself the exponent number of times.",
        [`${baseVal}^${exp} = ${Array(exp).fill(baseVal).join(" × ")}.`],
        `${baseVal}^${exp} = ${answer}.`,
      );
    }
    case "expandedFormBuilder": {
      const thousands = rand(1, 9);
      const hundreds = rand(0, 9);
      const tens = rand(0, 9);
      const ones = rand(0, 9);
      const value = thousands * 1000 + hundreds * 100 + tens * 10 + ones;
      const parts: string[] = [];
      if (thousands) parts.push(`${thousands * 1000}`);
      if (hundreds) parts.push(`${hundreds * 100}`);
      if (tens) parts.push(`${tens * 10}`);
      if (ones) parts.push(`${ones}`);
      const answer = parts.join(" + ");
      const distractors = [
        `${thousands} + ${hundreds} + ${tens} + ${ones}`,
        `${thousands * 100} + ${hundreds * 10} + ${tens} + ${ones}`,
        `${value} + 0`,
      ];
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Pick the expanded form of ${value}.`, {
            kind: "icon",
            icon: m.emoji,
            title: String(value),
            subtitle: "Expanded form",
          }),
          hint: "Each digit's value depends on its place.",
          hints: [`${thousands} is in the thousands place.`, "Sum each digit times its place value."],
          explanation: `${value} = ${answer}.`,
        },
        answer,
        distractors,
      );
    }
    case "unitConversionBridge": {
      const conversions = [
        { prompt: (n: number) => `Convert ${n} feet to inches.`, factor: 12, label: "1 ft = 12 in", hint: "1 foot = 12 inches.", explanation: (n: number, r: number) => `${n} ft × 12 = ${r} in.` },
        { prompt: (n: number) => `Convert ${n} minutes to seconds.`, factor: 60, label: "1 min = 60 s", hint: "1 minute = 60 seconds.", explanation: (n: number, r: number) => `${n} min × 60 = ${r} s.` },
        { prompt: (n: number) => `Convert ${n} meters to centimeters.`, factor: 100, label: "1 m = 100 cm", hint: "1 meter = 100 cm.", explanation: (n: number, r: number) => `${n} m × 100 = ${r} cm.` },
        { prompt: (n: number) => `Convert ${n} kilograms to grams.`, factor: 1000, label: "1 kg = 1000 g", hint: "1 kg = 1000 g.", explanation: (n: number, r: number) => `${n} kg × 1000 = ${r} g.` },
        { prompt: (n: number) => `Convert ${n} hours to minutes.`, factor: 60, label: "1 hr = 60 min", hint: "1 hour = 60 minutes.", explanation: (n: number, r: number) => `${n} hr × 60 = ${r} min.` },
      ];
      const conv = pick(conversions);
      const n = rand(2, 9);
      const answer = n * conv.factor;
      return numpadEng(
        m,
        difficulty,
        conv.prompt(n),
        { kind: "icon", icon: m.emoji, title: conv.label, subtitle: "Unit conversion" },
        answer,
        conv.hint,
        [conv.hint, `Multiply by ${conv.factor}.`],
        conv.explanation(n, answer),
      );
    }
    case "negativeNumberOperate": {
      const ops = [
        () => {
          const a = -rand(2, 9);
          const b = rand(2, 9);
          return { prompt: `${a} + ${b}`, answer: a + b, hint: "Adding a positive moves right on the number line." };
        },
        () => {
          const a = rand(2, 9);
          const b = rand(2, 9);
          return { prompt: `${a} − ${a + b}`, answer: -b, hint: "Subtract a larger value from a smaller one to get a negative." };
        },
        () => {
          const a = -rand(2, 6);
          const b = rand(2, 6);
          return { prompt: `${a} × ${b}`, answer: a * b, hint: "Negative × positive = negative." };
        },
        () => {
          const a = -rand(2, 6);
          const b = -rand(2, 6);
          return { prompt: `${a} × ${b}`, answer: a * b, hint: "Negative × negative = positive." };
        },
        () => {
          const a = -rand(2, 9);
          const b = -rand(2, 9);
          return { prompt: `${a} − ${b}`, answer: a - b, hint: "Subtracting a negative is adding." };
        },
      ];
      const op = pick(ops)();
      return numpadEng(
        m,
        difficulty,
        `Compute ${op.prompt}.`,
        { kind: "icon", icon: m.emoji, title: op.prompt, subtitle: "Signed arithmetic" },
        op.answer,
        op.hint,
        [op.hint, "Track signs carefully."],
        `${op.prompt} = ${op.answer}.`,
        true,
      );
    }
    case "factorPairFinder": {
      const factorPairs: Record<number, [number, number][]> = {
        12: [[1, 12], [2, 6], [3, 4]],
        18: [[1, 18], [2, 9], [3, 6]],
        24: [[1, 24], [2, 12], [3, 8], [4, 6]],
        30: [[1, 30], [2, 15], [3, 10], [5, 6]],
        36: [[1, 36], [2, 18], [3, 12], [4, 9], [6, 6]],
        40: [[1, 40], [2, 20], [4, 10], [5, 8]],
        48: [[1, 48], [2, 24], [3, 16], [4, 12], [6, 8]],
        60: [[1, 60], [2, 30], [3, 20], [4, 15], [5, 12], [6, 10]],
      };
      const n = pick(Object.keys(factorPairs).map(Number));
      const correct = pick(factorPairs[n]!);
      const ansStr = `${correct[0]} × ${correct[1]}`;
      const distractorPool: string[] = [];
      for (let a = 2; a <= 12; a++) {
        for (let b = a; b <= 12; b++) {
          if (a * b !== n) distractorPool.push(`${a} × ${b}`);
        }
      }
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Which is a factor pair of ${n}?`, {
            kind: "icon",
            icon: m.emoji,
            title: String(n),
            subtitle: "Factor pair",
          }),
          hint: "A factor pair multiplies to the target number.",
          hints: [`${correct[0]} × ${correct[1]} = ${n}.`, "Check by multiplying the candidates."],
          explanation: `${correct[0]} × ${correct[1]} = ${n}.`,
        },
        ansStr,
        sample(distractorPool, 3),
      );
    }
    case "mixedNumberConvert": {
      const den = pick([3, 4, 5, 6, 8] as const);
      const whole = rand(1, 5);
      const fracTop = rand(1, den - 1);
      const numer = whole * den + fracTop;
      const ans = `${whole} ${fracTop}/${den}`;
      const distractors = [
        `${whole} ${den}/${fracTop}`,
        `${whole + 1} ${fracTop}/${den}`,
        `${whole} ${(fracTop % (den - 1)) + 1}/${den}`,
      ].filter((d) => d !== ans);
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Write ${numer}/${den} as a mixed number.`, {
            kind: "icon",
            icon: m.emoji,
            title: `${numer}/${den}`,
            subtitle: "Improper → mixed",
          }),
          hint: "Divide the numerator by the denominator.",
          hints: [`${numer} ÷ ${den} = ${whole} remainder ${fracTop}.`, `Whole part: ${whole}; fraction: ${fracTop}/${den}.`],
          explanation: `${numer}/${den} = ${ans}.`,
        },
        ans,
        distractors,
      );
    }
    case "numberLineCompare": {
      const variants: (() => { aLabel: string; bLabel: string; n1: number; n2: number })[] = [
        () => {
          const a = rand(-12, 12);
          let b = rand(-12, 12);
          if (b === a) b = a + 1;
          return { aLabel: String(a), bLabel: String(b), n1: a, n2: b };
        },
        () => {
          const a = Number((rand(10, 99) / 10).toFixed(1));
          let b = Number((rand(10, 99) / 10).toFixed(1));
          if (b === a) b = Number((b + 0.1).toFixed(1));
          return { aLabel: a.toFixed(1), bLabel: b.toFixed(1), n1: a, n2: b };
        },
        () => {
          const den = pick([2, 3, 4, 5, 8] as const);
          const numA = rand(1, den - 1);
          let numB = rand(1, den - 1);
          if (numB === numA) numB = ((numB) % (den - 1)) + 1;
          return { aLabel: `${numA}/${den}`, bLabel: `${numB}/${den}`, n1: numA / den, n2: numB / den };
        },
      ];
      const v = pick(variants)();
      const op = v.n1 < v.n2 ? "<" : v.n1 > v.n2 ? ">" : "=";
      const ans = `${v.aLabel} ${op} ${v.bLabel}`;
      const distractors = (["<", ">", "="] as const).filter((o) => o !== op).map((o) => `${v.aLabel} ${o} ${v.bLabel}`);
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Compare ${v.aLabel} and ${v.bLabel}.`, {
            kind: "icon",
            icon: m.emoji,
            title: `${v.aLabel}   ?   ${v.bLabel}`,
            subtitle: "Choose <, >, or =",
          }),
          hint: "Visualize each number on the number line.",
          hints: ["Negative numbers are less than positive numbers.", "For fractions with the same denominator, compare numerators."],
          explanation: `${v.aLabel} ${op} ${v.bLabel}.`,
        },
        ans,
        distractors,
      );
    }
    case "fractionMultiplyDivide": {
      const multiply = Math.random() < 0.6;
      const aNum = rand(1, 5);
      const aDen = rand(2, 8);
      const bNum = rand(1, 5);
      const bDen = rand(2, 8);
      if (multiply) {
        const top = aNum * bNum;
        const bot = aDen * bDen;
        const ans = frac(top, bot);
        return makeChoice(
          {
            ...base(m, difficulty, "choice", `Compute ${aNum}/${aDen} × ${bNum}/${bDen}.`, {
              kind: "icon",
              icon: m.emoji,
              title: `${aNum}/${aDen} × ${bNum}/${bDen}`,
              subtitle: "Multiply fractions",
            }),
            hint: "Multiply numerators and denominators across.",
            hints: [`Top: ${aNum} × ${bNum} = ${top}.`, `Bottom: ${aDen} × ${bDen} = ${bot}.`],
            explanation: `${aNum}/${aDen} × ${bNum}/${bDen} = ${top}/${bot} = ${ans}.`,
          },
          ans,
          [frac(aNum + bNum, aDen + bDen), frac(top, bot + 1), frac(top + 1, bot)].filter((d) => d !== ans),
        );
      }
      const top = aNum * bDen;
      const bot = aDen * bNum;
      const ans = frac(top, bot);
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Compute ${aNum}/${aDen} ÷ ${bNum}/${bDen}.`, {
            kind: "icon",
            icon: m.emoji,
            title: `${aNum}/${aDen} ÷ ${bNum}/${bDen}`,
            subtitle: "Divide fractions",
          }),
          hint: "Keep, change, flip — multiply by the reciprocal.",
          hints: [`Reciprocal of ${bNum}/${bDen} is ${bDen}/${bNum}.`, `Then multiply: ${aNum}/${aDen} × ${bDen}/${bNum}.`],
          explanation: `${aNum}/${aDen} ÷ ${bNum}/${bDen} = ${top}/${bot} = ${ans}.`,
        },
        ans,
        [frac(aNum * bNum, aDen * bDen), frac(top + 1, bot), frac(top, bot + 1)].filter((d) => d !== ans),
      );
    }
    case "decimalAddSubtract": {
      const aTenths = rand(10, 99);
      const bTenths = rand(10, 99);
      const add = Math.random() < 0.5;
      const aVal = aTenths / 10;
      const bVal = bTenths / 10;
      const result = add ? (aTenths + bTenths) / 10 : (Math.max(aTenths, bTenths) - Math.min(aTenths, bTenths)) / 10;
      const expression = add
        ? `${aVal.toFixed(1)} + ${bVal.toFixed(1)}`
        : `${Math.max(aVal, bVal).toFixed(1)} − ${Math.min(aVal, bVal).toFixed(1)}`;
      return numpadEng(
        m,
        difficulty,
        `Compute ${expression}.`,
        { kind: "icon", icon: m.emoji, title: expression, subtitle: "Line up the decimal points" },
        String(result),
        "Line up the decimal points, then add or subtract as usual.",
        ["Stack the decimals vertically with points aligned.", "Bring the decimal point straight down."],
        `${expression} = ${result}.`,
      );
    }
    case "decimalMultiplyDivide": {
      const multiply = Math.random() < 0.6;
      if (multiply) {
        const decimal = rand(11, 99) / 10;
        const multiplier = rand(2, 9);
        const product = Math.round(decimal * 10 * multiplier);
        const result = product / 10;
        return numpadEng(
          m,
          difficulty,
          `Compute ${decimal.toFixed(1)} × ${multiplier}.`,
          { kind: "icon", icon: m.emoji, title: `${decimal.toFixed(1)} × ${multiplier}`, subtitle: "Decimal × whole" },
          String(result),
          "Multiply as whole numbers, then place the decimal.",
          [`Ignore the decimal: ${decimal * 10} × ${multiplier} = ${product}.`, `Place the decimal one place from the right: ${result}.`],
          `${decimal.toFixed(1)} × ${multiplier} = ${result}.`,
        );
      }
      const divisor = rand(2, 9);
      const quotientTenths = rand(11, 49);
      const dividend = (quotientTenths * divisor) / 10;
      const result = quotientTenths / 10;
      return numpadEng(
        m,
        difficulty,
        `Compute ${dividend.toFixed(1)} ÷ ${divisor}.`,
        { kind: "icon", icon: m.emoji, title: `${dividend.toFixed(1)} ÷ ${divisor}`, subtitle: "Decimal ÷ whole" },
        String(result),
        "Divide as whole numbers, then place the decimal in the quotient.",
        [`Ignore the decimal: ${quotientTenths * divisor} ÷ ${divisor} = ${quotientTenths}.`, `Place the decimal: ${result}.`],
        `${dividend.toFixed(1)} ÷ ${divisor} = ${result}.`,
      );
    }
    case "reorderLeastGreatest": {
      const variants: { items: { value: number; label: string }[]; explanation: string }[] = [
        {
          items: [
            { value: -3, label: "-3" },
            { value: -1, label: "-1" },
            { value: 0, label: "0" },
            { value: 2, label: "2" },
            { value: 5, label: "5" },
          ],
          explanation: "Negative numbers come first on the number line.",
        },
        {
          items: [
            { value: 0.2, label: "0.2" },
            { value: 0.25, label: "0.25" },
            { value: 0.5, label: "0.5" },
            { value: 0.7, label: "0.7" },
            { value: 0.9, label: "0.9" },
          ],
          explanation: "Line up decimals by place value to compare.",
        },
        {
          items: [
            { value: 1 / 8, label: "1/8" },
            { value: 1 / 4, label: "1/4" },
            { value: 3 / 8, label: "3/8" },
            { value: 1 / 2, label: "1/2" },
            { value: 3 / 4, label: "3/4" },
          ],
          explanation: "Find a common denominator or convert to decimals.",
        },
        {
          items: [
            { value: -1.5, label: "-1.5" },
            { value: -0.5, label: "-0.5" },
            { value: 0.5, label: "0.5" },
            { value: 1.25, label: "1.25" },
            { value: 2, label: "2" },
          ],
          explanation: "Walk left → right on the number line.",
        },
      ];
      const v = pick(variants);
      const sorted = [...v.items].sort((a, b) => a.value - b.value);
      return reorderEng(
        m,
        difficulty,
        "Order from least to greatest.",
        sorted.map((it) => it.label),
        "Smallest value goes first.",
        ["Convert to a common form before comparing.", "Use the number line as a guide."],
        v.explanation,
      );
    }
    case "percentChangeBasics": {
      const increase = Math.random() < 0.6;
      const start = pick([20, 25, 40, 50, 80, 100, 200] as const);
      const pct = pick([10, 20, 25, 30, 50] as const);
      const change = (start * pct) / 100;
      if (increase) {
        const answer = start + change;
        return numpadEng(
          m,
          difficulty,
          `Increase ${start} by ${pct}%.`,
          { kind: "icon", icon: m.emoji, title: `${start} + ${pct}%`, subtitle: "Percent increase" },
          answer,
          "Find the change, then add to the original.",
          [`${pct}% of ${start} = ${change}.`, `${start} + ${change} = ${answer}.`],
          `${start} increased by ${pct}% is ${answer}.`,
        );
      }
      const answer = start - change;
      return numpadEng(
        m,
        difficulty,
        `Decrease ${start} by ${pct}%.`,
        { kind: "icon", icon: m.emoji, title: `${start} − ${pct}%`, subtitle: "Percent decrease" },
        answer,
        "Find the change, then subtract from the original.",
        [`${pct}% of ${start} = ${change}.`, `${start} − ${change} = ${answer}.`],
        `${start} decreased by ${pct}% is ${answer}.`,
      );
    }
    case "meanMedianMode": {
      const stat = pick(["mean", "median"] as const);
      const count = pick([5, 7] as const);
      const list = Array.from({ length: count }, () => rand(2, 20));
      if (stat === "mean") {
        const initialSum = list.reduce((s, x) => s + x, 0);
        const adjust = (count - (initialSum % count)) % count;
        list[0] = (list[0] ?? 0) + adjust;
        const sum = list.reduce((s, x) => s + x, 0);
        const answer = sum / count;
        return numpadEng(
          m,
          difficulty,
          `Find the mean of ${list.join(", ")}.`,
          { kind: "icon", icon: m.emoji, title: list.join(", "), subtitle: "Mean (average)" },
          answer,
          "Mean = sum ÷ count.",
          [`Sum: ${sum}.`, `Count: ${count}.`, `${sum} ÷ ${count} = ${answer}.`],
          `Mean = ${sum} / ${count} = ${answer}.`,
        );
      }
      const sorted = [...list].sort((a, b) => a - b);
      const median = sorted[Math.floor(count / 2)]!;
      return numpadEng(
        m,
        difficulty,
        `Find the median of ${list.join(", ")}.`,
        { kind: "icon", icon: m.emoji, title: list.join(", "), subtitle: "Median (middle value)" },
        median,
        "Sort the numbers, then pick the middle.",
        [`Sorted: ${sorted.join(", ")}.`, `Middle position is ${Math.floor(count / 2) + 1}.`],
        `Median = ${median}.`,
      );
    }
    case "elapsedTimeClock": {
      const startHour = rand(1, 11);
      const startMin = pick([0, 15, 30, 45] as const);
      const durationMin = pick([15, 30, 45, 60, 75, 90, 120, 135] as const);
      const totalStart = startHour * 60 + startMin;
      let totalEnd = (totalStart + durationMin) % (12 * 60);
      const endHour = Math.floor(totalEnd / 60) || 12;
      const endMin = totalEnd % 60;
      const fmtClock = (h: number, mn: number) => `${h}:${mn.toString().padStart(2, "0")}`;
      const formatDuration = (mins: number) => {
        const h = Math.floor(mins / 60);
        const r = mins % 60;
        if (h > 0 && r > 0) return `${h} hr ${r} min`;
        if (h > 0) return `${h} hr`;
        return `${r} min`;
      };
      const answer = formatDuration(durationMin);
      const candidates = [durationMin + 15, durationMin - 15, durationMin + 30, durationMin + 60, durationMin - 30];
      const distractors = sample(
        candidates.filter((d) => d > 0 && formatDuration(d) !== answer).map(formatDuration),
        3,
      );
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `From ${fmtClock(startHour, startMin)} to ${fmtClock(endHour, endMin)}, how much time passed?`, {
            kind: "icon",
            icon: m.emoji,
            title: `${fmtClock(startHour, startMin)} → ${fmtClock(endHour, endMin)}`,
            subtitle: "Elapsed time",
          }),
          hint: "Count up by hours and minutes.",
          hints: [`Hours: ${Math.floor(durationMin / 60)}.`, `Minutes: ${durationMin % 60}.`],
          explanation: `${durationMin} minutes total = ${answer}.`,
        },
        answer,
        distractors,
      );
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
    case "torqueBalance": {
      const d1 = rand(2, 6);
      const d2 = rand(2, 6);
      const F2 = rand(2, 12);
      const num = F2 * d2;
      const F1 = num / d1;
      const ans = +F1.toFixed(2);
      return numpadEng(
        m,
        difficulty,
        `A seesaw balances. ${F2}N sits ${d2}m right of the pivot. What force on the left at ${d1}m balances it?`,
        { kind: "icon", icon: "🔩", title: `F · ${d1}m = ${F2}N · ${d2}m`, subtitle: "Solve for F" },
        ans,
        "Torque = force × distance; set the two torques equal.",
        ["F₁·d₁ = F₂·d₂.", `F₁ = (${F2}×${d2}) / ${d1}.`],
        `F = (${F2} × ${d2}) / ${d1} = ${ans} N.`,
      );
    }
    case "leverArm": {
      const dEffort = pick([3, 4, 5, 6]);
      const dLoad = pick([1, 2]);
      const load = rand(20, 80);
      const effort = Math.round((load * dLoad) / dEffort);
      const distractors = [String(load), String(load - effort), String(load * dEffort)];
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `A lever lifts a ${load}N load ${dLoad}m from the pivot. What effort is needed ${dEffort}m from the pivot?`, {
            kind: "icon",
            icon: "🪛",
            title: `Load ${load}N · ${dLoad}m`,
            subtitle: `Effort arm ${dEffort}m`,
          }),
          hint: "Effort × effort arm = Load × load arm.",
          hints: ["Set the moments equal.", `Effort = (${load} × ${dLoad}) / ${dEffort}.`],
          explanation: `Effort = (${load} × ${dLoad}) / ${dEffort} ≈ ${effort} N.`,
        },
        String(effort),
        distractors,
      );
    }
    case "camFollower": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order the four phases of one full cam follower cycle.",
          order: ["Dwell low", "Rise", "Dwell high", "Fall"],
          hint: "A cam cycle alternates motion and dwell.",
          hints: ["Followers start at rest.", "Rise comes before high dwell."],
          explanation: "Standard cycle: low dwell → rise → high dwell → fall.",
        },
        {
          prompt: "Order the four sections of a typical cam profile diagram.",
          order: ["Base circle (dwell low)", "Rise transition", "Nose (dwell high)", "Return transition"],
          hint: "Profile diagrams mirror the motion cycle.",
          hints: ["Base circle = low dwell.", "Nose = high dwell."],
          explanation: "Cam profile geometry maps directly to motion phases.",
        },
        {
          prompt: "Order the cam-design parameters as you'd tune them.",
          order: ["Choose follower motion", "Pick rise and fall durations", "Define dwell intervals", "Compute cam profile radii", "Verify pressure angle"],
          hint: "Start from the motion you want.",
          hints: ["Profile follows motion, not vice versa.", "Pressure angle is a check at the end."],
          explanation: "Cam design starts with motion law and ends with checks.",
        },
        {
          prompt: "Order the steps of one revolution for an automotive valve cam.",
          order: ["Valve closed (base dwell)", "Cam pushes follower", "Valve open (high dwell)", "Cam releases follower", "Valve closed again"],
          hint: "Valve closed → open → closed.",
          hints: ["High dwell = valve fully open.", "Spring closes the valve."],
          explanation: "Automotive cams cycle a valve through closed-open-closed.",
        },
      ]);
    }
    case "ohmsLawCircuit": {
      const V = pick([6, 9, 12, 24]);
      const R = pick([2, 3, 4, 6]);
      const I = +(V / R).toFixed(2);
      return numpadEng(
        m,
        difficulty,
        `V = ${V}V across R = ${R}Ω. Find I (in amps).`,
        { kind: "icon", icon: "💡", title: `${V}V / ${R}Ω`, subtitle: "Apply Ohm's law" },
        I,
        "Ohm's law: V = IR, so I = V/R.",
        ["I has units of amps.", `${V} ÷ ${R} = ?`],
        `I = V/R = ${V}/${R} = ${I} A.`,
      );
    }
    case "powerBudget": {
      const items = [rand(3, 8), rand(4, 9), rand(2, 6)];
      const total = items.reduce((a, b) => a + b, 0);
      const limit = total + rand(2, 6);
      const overflow = rand(3, 7);
      const choices = [String(limit - total), String(total), String(overflow), String(limit)];
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Loads ${items.join("W, ")}W on a ${limit}W supply. How many watts are still available?`, {
            kind: "icon",
            icon: "🔋",
            title: `Used ${total}W / ${limit}W`,
            subtitle: "Subtract used from limit",
          }),
          hint: "Available = limit − sum of loads.",
          hints: ["Add the loads first.", `${limit} − ${total} = ?`],
          explanation: `${limit} − ${total} = ${limit - total} W remaining.`,
        },
        String(limit - total),
        choices,
      );
    }
    case "capacitorCharge": {
      return bankMatch(m, difficulty, [
        {
          prompt: "Pair each RC time constant with the time it takes to charge to ~63%.",
          pairs: [["RC = 1s", "63% after 1s"], ["RC = 2s", "63% after 2s"], ["RC = 5s", "63% after 5s"], ["RC = 10s", "63% after 10s"]],
          hint: "63% level is reached at exactly τ.",
          explanation: "After one time constant τ = RC, the capacitor reaches ~63% of final voltage.",
        },
        {
          prompt: "Match each charge percentage with the number of time constants.",
          pairs: [["~63%", "1τ"], ["~86%", "2τ"], ["~95%", "3τ"], ["~99%", "5τ"]],
          hint: "Exponential approach: V = V₀(1 − e^(−t/τ)).",
          explanation: "Each additional τ shrinks the remaining gap by ~63%.",
        },
        {
          prompt: "Match each circuit element to its RC role.",
          pairs: [["Capacitor", "Stores charge"], ["Resistor", "Limits current"], ["RC product", "Time constant τ"], ["Final voltage", "Source EMF"]],
          hint: "Each part plays a distinct role in charging.",
          explanation: "RC circuits charge through the resistor to the capacitor's final voltage.",
        },
        {
          prompt: "Pair each behavior with whether RC is large or small.",
          pairs: [["Slow charging", "Large RC"], ["Fast charging", "Small RC"], ["Long discharge tail", "Large RC"], ["Quick reset", "Small RC"]],
          hint: "Larger τ → slower response.",
          explanation: "Time constant directly controls how quickly the capacitor reacts.",
        },
      ]);
    }
    case "soilBearing": {
      const load = rand(80, 140);
      const safe = load + rand(20, 60);
      const risky = load - rand(20, 60);
      const ambiguous = load + rand(1, 5);
      const answer = `${safe} kPa footing`;
      const distractors = [`${risky} kPa footing`, `${ambiguous} kPa footing`];
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Building load is ${load} kPa. Pick the safe soil bearing capacity.`, {
            kind: "icon",
            icon: "🧱",
            title: `Load ${load} kPa`,
            subtitle: "Capacity must exceed load (with margin)",
          }),
          hint: "Bearing capacity must comfortably exceed the load.",
          hints: ["A safe footing has higher capacity than load.", `Look for kPa > ${load} with margin.`],
          explanation: `${safe} kPa safely supports a ${load} kPa load.`,
        },
        answer,
        distractors,
      );
    }
    case "trafficFlow": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each change into bucket: helps flow or worsens flow.",
          categories: ["Helps flow", "Worsens flow"],
          items: [
            { label: "Add a turn lane", category: "Helps flow" },
            { label: "Coordinate signals", category: "Helps flow" },
            { label: "Lower merge angle", category: "Helps flow" },
            { label: "Pop-up event in lane", category: "Worsens flow" },
            { label: "Reduce green time", category: "Worsens flow" },
            { label: "Narrow shoulder", category: "Worsens flow" },
          ],
          hint: "Anything that increases capacity or reduces friction helps.",
          hints: ["Capacity ↑ = better flow.", "Lane closures hurt throughput."],
          explanation: "Lane and signal upgrades help; closures and shorter greens hurt.",
        },
        {
          prompt: "Sort each intervention by what it primarily reduces.",
          categories: ["Reduces demand", "Increases capacity", "Improves safety"],
          items: [
            { label: "Toll pricing", category: "Reduces demand" },
            { label: "Promote transit", category: "Reduces demand" },
            { label: "Add a lane", category: "Increases capacity" },
            { label: "Signal coordination", category: "Increases capacity" },
            { label: "Roundabout instead of stop sign", category: "Increases capacity" },
            { label: "Lower speed limit near schools", category: "Improves safety" },
            { label: "Crosswalk islands", category: "Improves safety" },
          ],
          hint: "Some reduce demand; others widen the throat or save lives.",
          hints: ["Demand reduction shifts trips.", "Capacity grows throughput per lane."],
          explanation: "Traffic fixes target demand, supply, or safety.",
        },
        {
          prompt: "Sort each behavior by its impact on travel time.",
          categories: ["Lowers travel time", "Raises travel time"],
          items: [
            { label: "Adaptive signals", category: "Lowers travel time" },
            { label: "Bus rapid transit", category: "Lowers travel time" },
            { label: "Synchronized green wave", category: "Lowers travel time" },
            { label: "Lane closure for event", category: "Raises travel time" },
            { label: "Stop-and-go congestion", category: "Raises travel time" },
            { label: "Heavy bottleneck merge", category: "Raises travel time" },
          ],
          hint: "Smoother flow → faster trips.",
          hints: ["Removing stops helps.", "Adding stops hurts."],
          explanation: "Anything that adds stops or merges adds time; anything that smooths flow saves it.",
        },
      ]);
    }
    case "foundationDepth": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order the steps to plan a building foundation.",
          order: ["Survey site", "Test soil", "Compute load", "Excavate", "Pour foundation"],
          hint: "Plan before you dig.",
          hints: ["Surveying comes before testing.", "Pour only after excavation."],
          explanation: "Survey → test → compute → excavate → pour is the safe sequence.",
        },
        {
          prompt: "Order the steps to design a deep pile foundation.",
          order: ["Geotechnical investigation", "Choose pile type", "Compute pile capacity", "Drive or drill piles", "Cast pile cap", "Build superstructure"],
          hint: "Geotech → pile design → installation → cap.",
          hints: ["Pile design depends on soil.", "The cap ties piles into the building."],
          explanation: "Deep foundations follow a geotech-first design path.",
        },
        {
          prompt: "Order the steps to build a slab-on-grade foundation.",
          order: ["Clear and grade site", "Compact subgrade", "Install vapor barrier", "Place reinforcement", "Pour concrete slab", "Cure"],
          hint: "Prepare ground before pouring.",
          hints: ["Vapor barriers stop moisture.", "Reinforcement goes in before concrete."],
          explanation: "Slabs follow ground prep → barrier → rebar → pour → cure.",
        },
        {
          prompt: "Order the steps to design a retaining wall foundation.",
          order: ["Estimate retained load", "Pick wall type (gravity/cantilever)", "Design footing geometry", "Check sliding and overturning", "Detail drainage", "Construct"],
          hint: "Loads drive geometry; geometry drives checks.",
          hints: ["Sliding/overturning are separate stability checks.", "Drainage prevents hydrostatic pressure."],
          explanation: "Retaining walls require load → form → checks → drainage.",
        },
      ]);
    }
    case "liftDragBalance": {
      const lift = rand(1000, 4000);
      const weight = lift;
      const thrust = rand(400, 1200);
      const drag = thrust;
      const answer = "Lift = Weight, Thrust = Drag";
      const distractors = ["Lift = Thrust, Drag = Weight", "Lift > Weight always", "Drag > Thrust in cruise"];
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `In steady level flight (L=${lift}, W=${weight}, T=${thrust}, D=${drag}), which is true?`, {
            kind: "icon",
            icon: "🛩️",
            title: "Steady level flight",
            subtitle: `L=${lift}N · W=${weight}N · T=${thrust}N · D=${drag}N`,
          }),
          hint: "Steady flight needs zero net force in both axes.",
          hints: ["Vertical balance pairs lift and weight.", "Horizontal balance pairs thrust and drag."],
          explanation: "Level flight requires Lift = Weight and Thrust = Drag.",
        },
        answer,
        distractors,
      );
    }
    case "orbitTransfer": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order the steps of a Hohmann transfer to a higher orbit.",
          order: ["Park in low orbit", "Burn prograde at periapsis", "Coast on transfer ellipse", "Burn prograde at apoapsis"],
          hint: "Two prograde burns raise the orbit step by step.",
          hints: ["The first burn raises apoapsis.", "The second burn circularizes."],
          explanation: "Hohmann: park → burn at periapsis → coast → burn at apoapsis.",
        },
        {
          prompt: "Order a Hohmann transfer to a lower orbit.",
          order: ["Park in higher orbit", "Burn retrograde at periapsis of original orbit", "Coast on lower ellipse", "Burn retrograde at apoapsis", "Circularize at lower altitude"],
          hint: "Retrograde burns lower the orbit.",
          hints: ["Lowering periapsis is the first burn.", "Second burn locks in the new orbit."],
          explanation: "Mirror of the raise — two retrograde burns drop you to a lower orbit.",
        },
        {
          prompt: "Order a planar plane-change maneuver.",
          order: ["Reach the orbital plane intersection", "Time burn at ascending or descending node", "Apply Δv perpendicular to velocity", "Verify new inclination", "Resume parking"],
          hint: "Plane changes happen at the node.",
          hints: ["Δv is normal to the velocity.", "Cheapest at low speed near apoapsis."],
          explanation: "Plane changes burn perpendicular to velocity at the node.",
        },
        {
          prompt: "Order a rendezvous with a target ahead in the same orbit.",
          order: ["Lower into a phasing orbit", "Wait for target to drift back", "Burn prograde at intercept window", "Match velocity for docking", "Dock"],
          hint: "Lower orbits move faster, so dropping catches a leading target.",
          hints: ["You drop to a faster orbit.", "Final burn matches target's velocity."],
          explanation: "Phasing orbits catch up by changing altitude and period.",
        },
      ]);
    }
    case "wingArea": {
      const lift = rand(4000, 12000);
      const rho = 1.225;
      const v = rand(40, 80);
      const cl = 0.6;
      const area = +(lift / (0.5 * rho * v * v * cl)).toFixed(2);
      return numpadEng(
        m,
        difficulty,
        `Lift L=${lift}N at v=${v} m/s, ρ=1.225, Cl=0.6. Find wing area S (m²).`,
        { kind: "icon", icon: "📐", title: `L=${lift}N · v=${v}m/s`, subtitle: "L = ½ρv²·Cl·S" },
        area,
        "Solve L = ½ρv²·Cl·S for S.",
        ["Dynamic pressure = ½ρv².", `S = L / (½ρv²·Cl).`],
        `S = ${lift} / (0.5 × 1.225 × ${v}² × 0.6) ≈ ${area} m².`,
      );
    }
    case "sensorFusion": {
      return bankMatch(m, difficulty, [
        {
          prompt: "Pair each sensor with the signal it produces.",
          pairs: [["LIDAR", "Distance points"], ["IMU", "Acceleration"], ["Camera", "Pixels"], ["Encoder", "Wheel angle"]],
          hint: "Each sensor outputs a distinct modality.",
          explanation: "Sensor selection drives what signals you can fuse.",
        },
        {
          prompt: "Match each sensor to its main weakness.",
          pairs: [["Camera", "Fails in low light"], ["LIDAR", "Struggles in heavy rain/fog"], ["GPS", "Multi-path indoors"], ["IMU", "Drifts over time"]],
          hint: "Every sensor has a failure mode.",
          explanation: "Fusion mitigates each sensor's weakness.",
        },
        {
          prompt: "Match each sensor to its typical use.",
          pairs: [["Wheel encoders", "Local odometry"], ["IMU", "Short-term orientation"], ["LIDAR", "Mapping geometry"], ["Camera", "Semantic recognition"]],
          hint: "Pick the sensor for the job.",
          explanation: "Different tasks need different sensors; fusion fuses their strengths.",
        },
        {
          prompt: "Pair each fusion algorithm to a property.",
          pairs: [["Kalman filter", "Optimal linear-Gaussian"], ["Extended KF", "Linearized non-linear"], ["Unscented KF", "Sigma-point non-linear"], ["Particle filter", "Sample-based, multimodal"]],
          hint: "Each filter sits at a different complexity level.",
          explanation: "Kalman family scales with non-linearity and assumption flexibility.",
        },
      ]);
    }
    case "pathPlanner": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order the robot navigation loop.",
          order: ["Sense environment", "Localize self", "Plan path", "Execute motion", "Re-plan if blocked"],
          hint: "A robot perceives, decides, then acts.",
          hints: ["Localization needs a sense step first.", "Replanning closes the loop."],
          explanation: "Sense → localize → plan → execute → re-plan.",
        },
        {
          prompt: "Order an A* path-planning execution.",
          order: ["Initialize start in open set", "Pop lowest-f node", "Expand neighbors", "Update g, h, f scores", "Push improved neighbors", "Stop when goal popped"],
          hint: "A* uses f = g + h.",
          hints: ["g = cost so far.", "h = heuristic to goal."],
          explanation: "A* expands lowest-f nodes until it pops the goal.",
        },
        {
          prompt: "Order an RRT (rapidly-exploring random tree) planner.",
          order: ["Initialize tree at start", "Sample random point", "Find nearest tree node", "Steer toward sample", "Check collision and add node", "Loop until goal reachable"],
          hint: "RRT grows a tree by sampling.",
          hints: ["Random sampling explores fast.", "Steering limits step size."],
          explanation: "RRTs explore by repeatedly sampling and extending the tree.",
        },
        {
          prompt: "Order a hierarchical robot navigation stack.",
          order: ["Global planner builds route", "Local planner generates trajectory", "Controller follows trajectory", "Sensors track progress", "Replan on deviation"],
          hint: "Global before local before control.",
          hints: ["Global plans full routes.", "Local handles obstacles online."],
          explanation: "Modern stacks split global, local, and control responsibilities.",
        },
      ]);
    }
    case "gripperForce": {
      const weight = rand(5, 20);
      const mu = pick([0.2, 0.3, 0.4, 0.5]);
      const safety = 1.5;
      const force = +((weight * safety) / (2 * mu)).toFixed(2);
      return numpadEng(
        m,
        difficulty,
        `A two-finger gripper holds a ${weight}N block with friction μ=${mu}. Use safety factor 1.5. Find each finger's normal force.`,
        { kind: "icon", icon: "🦾", title: `W=${weight}N · μ=${mu}`, subtitle: "Two contacts" },
        force,
        "Friction must counter weight on both contacts.",
        ["Friction force per finger = μ·F.", `Sum = W·SF, so F = W·SF / (2·μ).`],
        `F = ${weight} × 1.5 / (2 × ${mu}) ≈ ${force} N per finger.`,
      );
    }
    case "trussMemberForce": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each member into tension or compression.",
          categories: ["Tension", "Compression"],
          items: [
            { label: "Bottom chord of arch", category: "Tension" },
            { label: "Suspension cable", category: "Tension" },
            { label: "Tie rod", category: "Tension" },
            { label: "Top chord of arch", category: "Compression" },
            { label: "Column", category: "Compression" },
            { label: "Arch stone", category: "Compression" },
          ],
          hint: "Pulling members are in tension; squeezing members are in compression.",
          hints: ["Cables can only pull.", "Columns and arches squeeze."],
          explanation: "Cables/ties = tension; columns/arches = compression.",
        },
        {
          prompt: "Sort each truss member of a simply-supported Pratt truss under downward load.",
          categories: ["Tension", "Compression"],
          items: [
            { label: "Top chord", category: "Compression" },
            { label: "Bottom chord", category: "Tension" },
            { label: "Vertical members", category: "Compression" },
            { label: "Diagonal members (sloping toward center)", category: "Tension" },
            { label: "End diagonals", category: "Compression" },
          ],
          hint: "Top compresses, bottom tensions in simply-supported trusses.",
          hints: ["Pratt diagonals slope down toward the center.", "End diagonals carry compressive end reactions."],
          explanation: "Standard Pratt-truss tension/compression pattern.",
        },
        {
          prompt: "Sort each member of a typical Howe truss under gravity.",
          categories: ["Tension", "Compression"],
          items: [
            { label: "Top chord", category: "Compression" },
            { label: "Bottom chord", category: "Tension" },
            { label: "Vertical members", category: "Tension" },
            { label: "Diagonal members", category: "Compression" },
          ],
          hint: "Howe is the Pratt's mirror.",
          hints: ["Verticals in tension swap roles vs Pratt.", "Top still compresses."],
          explanation: "Howe truss flips diagonals and verticals compared to Pratt.",
        },
        {
          prompt: "Sort each structural element by typical loading.",
          categories: ["Tension", "Compression", "Bending"],
          items: [
            { label: "Suspension bridge cable", category: "Tension" },
            { label: "Pre-stressing tendon", category: "Tension" },
            { label: "Column under axial load", category: "Compression" },
            { label: "Arch stone", category: "Compression" },
            { label: "Floor beam under live load", category: "Bending" },
            { label: "Cantilever beam under tip load", category: "Bending" },
          ],
          hint: "Some elements primarily pull, push, or bend.",
          hints: ["Cables pull.", "Beams bend."],
          explanation: "Different members carry distinct types of loading.",
        },
      ]);
    }
    case "beamDeflection": {
      const baseLen = pick([2, 3, 4] as const);
      const lengths = [baseLen, baseLen * 2, baseLen * 4] as const;
      const longest = lengths[2];
      const answer = `${longest}m beam deflects most`;
      const distractors = [`${lengths[0]}m beam deflects most`, `${lengths[1]}m beam deflects most`, "All deflect equally"];
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Same beam, same load, three lengths: ${lengths.join("m, ")}m. Which deflects the most?`, {
            kind: "icon",
            icon: "📏",
            title: "Cantilever load test",
            subtitle: `Lengths: ${lengths.join(", ")} m`,
          }),
          hint: "Deflection grows quickly with length (∝ L³).",
          hints: ["Longer span = more sag.", "Cube the length to compare."],
          explanation: `Cantilever deflection ∝ L³, so the ${longest} m beam sags far the most.`,
        },
        answer,
        distractors,
      );
    }
    case "columnBuckling": {
      const baseLen = rand(3, 4);
      const longer = baseLen + rand(2, 3);
      const sameLenThicker = baseLen;
      const answer = `${sameLenThicker}m thick column`;
      const distractors = [`${longer}m thin column`, `${baseLen}m thin column`, `${longer}m thick column with crack`];
      return makeChoice(
        {
          ...base(m, difficulty, "choice", "Pick the most buckling-resistant column.", {
            kind: "icon",
            icon: "🏛️",
            title: "Compare slenderness",
            subtitle: "Shorter + thicker = stiffer",
          }),
          hint: "Critical load ∝ I / L²; thicker + shorter wins.",
          hints: ["Thicker column → larger I.", "Shorter column → smaller L²."],
          explanation: `Critical load ∝ I/L², so the ${sameLenThicker} m thick column resists buckling best.`,
        },
        answer,
        distractors,
      );
    }
    case "stressStrain": {
      return bankMatch(m, difficulty, [
        {
          prompt: "Pair each material with its stress-strain shape.",
          pairs: [["Steel", "Linear, high modulus"], ["Rubber", "Long, non-linear"], ["Glass", "Linear, brittle"], ["Aluminum", "Linear, lower modulus"]],
          hint: "Modulus and shape define the curve.",
          explanation: "Materials differ in stiffness and ductility.",
        },
        {
          prompt: "Match each region of a metal's stress-strain curve.",
          pairs: [["Elastic region", "Linear, reversible"], ["Yield point", "Onset of plastic flow"], ["Strain hardening", "Slope rises again"], ["Necking", "Cross-section thins"], ["Fracture", "Failure"]],
          hint: "Trace the curve from origin to failure.",
          explanation: "Standard ductile metal curve has five characteristic regions.",
        },
        {
          prompt: "Pair each material property with its stress-strain feature.",
          pairs: [["Stiffness", "Slope of elastic region (E)"], ["Strength", "Peak stress"], ["Ductility", "Elongation at fracture"], ["Toughness", "Total area under curve"]],
          hint: "Each property maps to a geometric feature.",
          explanation: "Stiffness, strength, ductility, and toughness each show up differently.",
        },
        {
          prompt: "Match each behavior to a common engineering material.",
          pairs: [["Brittle, no plastic region", "Cast iron"], ["Ductile metal with yield plateau", "Mild steel"], ["Tough, ductile non-ferrous metal", "Copper"], ["Highly elastic polymer", "Rubber"]],
          hint: "Each material has a characteristic curve.",
          explanation: "Common materials have widely different stress-strain signatures.",
        },
      ]);
    }
    case "thermalExpansion": {
      const len = rand(2, 10);
      const dT = rand(20, 80);
      const alpha = 12e-6;
      const expansion = +(len * alpha * dT * 1000).toFixed(2);
      return numpadEng(
        m,
        difficulty,
        `A ${len}m steel rail heats by ${dT}°C (α=12e-6 /°C). How much does it expand (in mm)?`,
        { kind: "icon", icon: "🌡️", title: `L=${len}m · ΔT=${dT}°C`, subtitle: "α=12e-6 /°C" },
        expansion,
        "ΔL = α · L · ΔT, then convert to mm.",
        [`α·L·ΔT = ${(len * alpha * dT).toFixed(6)} m.`, "Multiply by 1000 for mm."],
        `ΔL = 12e-6 × ${len} × ${dT} ≈ ${expansion} mm.`,
      );
    }
    case "compositeLayer": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each composite ingredient into the right role.",
          categories: ["Reinforcement", "Matrix"],
          items: [
            { label: "Carbon fiber", category: "Reinforcement" },
            { label: "Glass fiber", category: "Reinforcement" },
            { label: "Aramid fiber", category: "Reinforcement" },
            { label: "Epoxy resin", category: "Matrix" },
            { label: "Polyester resin", category: "Matrix" },
            { label: "Thermoplastic", category: "Matrix" },
          ],
          hint: "Fibers carry load; resins bind them.",
          hints: ["Fibers are the stiff, strong part.", "Resin transfers stress between fibers."],
          explanation: "Fibers reinforce; resin is the matrix.",
        },
        {
          prompt: "Sort each composite type by matrix family.",
          categories: ["Polymer matrix", "Metal matrix", "Ceramic matrix"],
          items: [
            { label: "CFRP (carbon-epoxy)", category: "Polymer matrix" },
            { label: "GFRP (glass-epoxy)", category: "Polymer matrix" },
            { label: "Kevlar laminate", category: "Polymer matrix" },
            { label: "Aluminum reinforced with SiC", category: "Metal matrix" },
            { label: "Magnesium-Boron composite", category: "Metal matrix" },
            { label: "C/C composite (carbon-carbon)", category: "Ceramic matrix" },
            { label: "SiC/SiC composite", category: "Ceramic matrix" },
          ],
          hint: "Look at the binder type.",
          hints: ["Epoxy is polymer.", "Aluminum/Mg are metal."],
          explanation: "Composite type is named after its matrix.",
        },
        {
          prompt: "Sort each property by composite design lever.",
          categories: ["Stiffness", "Strength", "Toughness"],
          items: [
            { label: "Fiber modulus", category: "Stiffness" },
            { label: "Fiber alignment", category: "Stiffness" },
            { label: "Fiber strength", category: "Strength" },
            { label: "Fiber volume fraction", category: "Strength" },
            { label: "Ductile matrix", category: "Toughness" },
            { label: "Crack-deflecting interface", category: "Toughness" },
          ],
          hint: "Different properties depend on different ingredients.",
          hints: ["Modulus → fibers.", "Toughness → matrix and interface."],
          explanation: "Each property in a composite is set by a different feature.",
        },
      ]);
    }
    case "resistorNetwork": {
      const R1 = pick([2, 4, 6, 8]);
      const R2 = pick([2, 4, 6, 8]);
      const series = R1 + R2;
      return numpadEng(
        m,
        difficulty,
        `R1=${R1}Ω and R2=${R2}Ω in series. Find the equivalent resistance (Ω).`,
        { kind: "icon", icon: "🔌", title: `${R1}Ω + ${R2}Ω`, subtitle: "Series resistance" },
        series,
        "Series resistors add: R = R1 + R2.",
        ["No branching in series.", `${R1} + ${R2} = ?`],
        `R = ${R1} + ${R2} = ${series} Ω.`,
      );
    }
    case "breadboardTrace": {
      const node = pick(["A1", "B2", "C3", "D4"]);
      const distractors = ["Power rail", "Ground rail", "Empty row"];
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `On a breadboard, where does node ${node} connect?`, {
            kind: "circuit",
            title: "Breadboard trace",
            subtitle: `Trace node ${node}`,
            circuit: { nodes: ["A1", "B2", "C3", "D4"], closed: false },
          }),
          hint: "Each numbered row of holes is one node, separated from rails.",
          hints: ["Letters group columns; numbers group rows.", "Power/ground rails run along the edges."],
          explanation: `${node} connects across its lettered row, not the rails.`,
        },
        `Row ${node}`,
        distractors,
      );
    }
    case "sensorCircuit": {
      const Vin = 5;
      const Vout = pick([1, 2, 2.5, 3]);
      const Rfix = pick([10, 22, 47]);
      const Rratio = +((Rfix * (Vin - Vout)) / Vout).toFixed(1);
      const answer = `R = ${Rratio} kΩ`;
      const distractors = [
        `R = ${(Rratio * 2).toFixed(1)} kΩ`,
        `R = ${(Rratio / 2).toFixed(1)} kΩ`,
        `R = ${Rfix} kΩ`,
      ];
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Voltage divider: ${Vin}V in, ${Vout}V out, lower R=${Rfix}kΩ. Pick the upper R.`, {
            kind: "icon",
            icon: "🎛️",
            title: `${Vin}V → ${Vout}V`,
            subtitle: `Lower R = ${Rfix} kΩ`,
          }),
          hint: "Vout = Vin · R_lower / (R_upper + R_lower).",
          hints: ["Rearrange for R_upper.", `R_upper = R_lower · (Vin − Vout) / Vout.`],
          explanation: `R_upper = ${Rfix} · (${Vin} − ${Vout}) / ${Vout} ≈ ${Rratio} kΩ.`,
        },
        answer,
        distractors,
      );
    }
    case "feedbackLoop": {
      return bankMatch(m, difficulty, [
        {
          prompt: "Pair each feedback loop block with its role.",
          pairs: [["Sensor", "Measures output"], ["Comparator", "Computes error"], ["Controller", "Adjusts input"], ["Plant", "Reacts to input"]],
          hint: "Walk around the loop.",
          explanation: "A closed loop senses, compares, controls, and acts.",
        },
        {
          prompt: "Match each PID term to its effect.",
          pairs: [["P (proportional)", "Reacts to current error"], ["I (integral)", "Eliminates steady-state error"], ["D (derivative)", "Damps oscillation"], ["Setpoint", "Desired output"]],
          hint: "Each PID term plays a distinct role.",
          explanation: "PID is built from proportional, integral, and derivative components.",
        },
        {
          prompt: "Pair each closed-loop symptom with its likely PID fix.",
          pairs: [["Oscillates", "Reduce P or add D"], ["Drifts away", "Add I"], ["Sluggish", "Increase P"], ["Overshoots heavily", "Add D"]],
          hint: "Match symptom to gain.",
          explanation: "Tuning PID involves matching observed behavior to gain changes.",
        },
        {
          prompt: "Match each control loop type to a use.",
          pairs: [["Open-loop", "Toaster timer"], ["Bang-bang", "Thermostat"], ["PID", "Cruise control"], ["Adaptive", "Auto-pilot in changing weather"]],
          hint: "Different problems need different loops.",
          explanation: "Open-loop, bang-bang, PID, and adaptive all have classic use cases.",
        },
      ]);
    }
    case "reliabilityBlock": {
      return bankChoice(m, difficulty, [
        {
          prompt: "Which arrangement is most reliable?",
          visual: { kind: "icon", icon: "🧱", title: "Compare block diagrams", subtitle: "Series vs parallel" },
          answer: "Two parallel blocks at 0.9 each",
          distractors: ["Two series blocks at 0.9 each", "One block at 0.95", "Two series blocks at 0.95"],
          hint: "Parallel = redundancy; series multiplies failure.",
          hints: ["Series: R = R1·R2.", "Parallel: R = 1 − (1−R1)(1−R2)."],
          explanation: "Two parallel 0.9 blocks ≈ 0.99 reliability; series 0.9·0.9 = 0.81.",
        },
        {
          prompt: "Three blocks each with reliability 0.8 are placed in series. What is the overall reliability?",
          visual: { kind: "icon", icon: "🧱", title: "0.8 × 0.8 × 0.8", subtitle: "Series reliability" },
          answer: "≈ 0.512",
          distractors: ["≈ 0.8", "≈ 0.992", "≈ 2.4"],
          hint: "Series: multiply.",
          hints: ["0.8 · 0.8 · 0.8 = ?", "All must work."],
          explanation: "Series reliability = 0.8 × 0.8 × 0.8 ≈ 0.512.",
        },
        {
          prompt: "Three blocks each with reliability 0.8 are placed in parallel. Overall reliability?",
          visual: { kind: "icon", icon: "🧱", title: "1 − (0.2)³", subtitle: "Parallel reliability" },
          answer: "≈ 0.992",
          distractors: ["≈ 0.512", "≈ 0.8", "≈ 0.6"],
          hint: "Parallel: 1 − product of failures.",
          hints: ["Failure of each = 0.2.", "1 − 0.2³ = ?"],
          explanation: "Parallel reliability = 1 − (1 − 0.8)³ ≈ 0.992.",
        },
        {
          prompt: "What's the simplest way to improve a series system's reliability?",
          visual: { kind: "icon", icon: "🛡️", title: "Series fix", subtitle: "Add redundancy" },
          answer: "Add parallel redundancy on the weakest block",
          distractors: ["Make every block longer", "Remove every block", "Increase the load"],
          hint: "Weakest link drives the chain.",
          hints: ["Series limits to weakest part.", "Parallel boosts that link."],
          explanation: "Add parallel redundancy at the weakest series stage to boost overall reliability.",
        },
      ]);
    }
    case "tradeStudy": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order the steps of a trade study.",
          order: ["List options", "Define criteria", "Weight criteria", "Score each option", "Pick the winner"],
          hint: "Criteria come before scores.",
          hints: ["You can't score without a rubric.", "Scoring → ranking → decision."],
          explanation: "Options → criteria → weights → scores → decision.",
        },
        {
          prompt: "Order the steps of a Pugh decision-matrix analysis.",
          order: ["Identify a baseline option", "List criteria", "Rate each option vs baseline (+ / 0 / −)", "Sum scores", "Pick the winner"],
          hint: "Pugh uses a reference option.",
          hints: ["Use the baseline to anchor scores.", "Sum +/- to rank."],
          explanation: "Pugh matrix scores each option relative to a baseline.",
        },
        {
          prompt: "Order a multi-criteria decision analysis (MCDA) workflow.",
          order: ["Define problem", "Identify alternatives", "Define criteria", "Assign weights", "Score alternatives", "Aggregate weighted scores", "Sensitivity analysis", "Recommend"],
          hint: "Always end with sensitivity analysis.",
          hints: ["Weights × scores = aggregate.", "Check what happens if weights shift."],
          explanation: "MCDA blends scoring with sensitivity testing.",
        },
        {
          prompt: "Order an AHP (Analytic Hierarchy Process) study.",
          order: ["Build hierarchy", "Pairwise compare criteria", "Compute weights from comparisons", "Pairwise compare alternatives per criterion", "Synthesize weighted scores", "Check consistency"],
          hint: "AHP uses pairwise comparisons.",
          hints: ["Hierarchy: goal → criteria → alternatives.", "Consistency check at the end."],
          explanation: "AHP turns pairwise judgments into a single ranking.",
        },
      ]);
    }
    case "personaNeeds": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each item: user need or proposed solution?",
          categories: ["User need", "Solution"],
          items: [
            { label: "I'm late on Mondays", category: "User need" },
            { label: "I can't find my keys", category: "User need" },
            { label: "I forget appointments", category: "User need" },
            { label: "Buy a key tracker", category: "Solution" },
            { label: "Build a calendar app", category: "Solution" },
            { label: "Add reminders", category: "Solution" },
          ],
          hint: "Needs describe a problem, solutions describe a fix.",
          hints: ["Needs are observations.", "Solutions name a product or action."],
          explanation: "Statements about problems are needs; products/actions are solutions.",
        },
        {
          prompt: "Sort each statement: user goal, pain point, or solution?",
          categories: ["User goal", "Pain point", "Solution"],
          items: [
            { label: "Finish lab report on time", category: "User goal" },
            { label: "Find lost keys quickly", category: "User goal" },
            { label: "Always sleep 8 hours", category: "User goal" },
            { label: "Reports are stressful at 2 a.m.", category: "Pain point" },
            { label: "Keys vanish daily", category: "Pain point" },
            { label: "Bad sleep on Sundays", category: "Pain point" },
            { label: "Use a Notion template", category: "Solution" },
            { label: "Buy a key tracker", category: "Solution" },
            { label: "Set a 10 p.m. alarm", category: "Solution" },
          ],
          hint: "Goals = wants; pain points = current struggle; solutions = fixes.",
          hints: ["Goals describe outcomes.", "Pain points describe friction."],
          explanation: "Personas split into goals, pain points, and proposed solutions.",
        },
        {
          prompt: "Sort each statement: jobs-to-be-done style.",
          categories: ["Functional job", "Emotional job", "Social job"],
          items: [
            { label: "Track family meals", category: "Functional job" },
            { label: "Hit 10k steps daily", category: "Functional job" },
            { label: "Feel less anxious before exams", category: "Emotional job" },
            { label: "Feel in control of my time", category: "Emotional job" },
            { label: "Look organized to my team", category: "Social job" },
            { label: "Be seen as a thoughtful gift-giver", category: "Social job" },
          ],
          hint: "JTBD splits into doing, feeling, and being-seen.",
          hints: ["Functional = action.", "Emotional/social = identity."],
          explanation: "Jobs-to-be-done framework identifies three job types.",
        },
      ]);
    }
    case "prototypeTest": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order one cycle of build-measure-learn.",
          order: ["Build prototype", "Test with users", "Measure", "Learn", "Iterate"],
          hint: "Make something concrete, then test it.",
          hints: ["Build before measure.", "Learn before you iterate."],
          explanation: "Build → test → measure → learn → iterate.",
        },
        {
          prompt: "Order the steps of a usability test session.",
          order: ["Define task", "Brief participant", "Observe attempt", "Probe with open questions", "Debrief", "Synthesize findings"],
          hint: "Observe, then probe, then synthesize.",
          hints: ["Tasks should be realistic.", "Probing should not lead."],
          explanation: "Usability tests follow a task-focused session structure.",
        },
        {
          prompt: "Order an A/B test of a new feature.",
          order: ["Form hypothesis", "Choose metric", "Compute sample size", "Randomize users into groups", "Run experiment", "Analyze and decide"],
          hint: "Hypothesis before metric, sample size before run.",
          hints: ["Random assignment is essential.", "Analysis should match the hypothesis."],
          explanation: "Sound A/B tests follow this six-step path.",
        },
        {
          prompt: "Order a prototyping fidelity ladder.",
          order: ["Paper sketch", "Wireframe", "Clickable prototype", "Visual/UI design", "Functional MVP", "Beta release"],
          hint: "Move from rough to refined.",
          hints: ["Cheap experiments first.", "Functional code last."],
          explanation: "Prototyping climbs fidelity as confidence grows.",
        },
      ]);
    }
    case "constraintMatrix": {
      return bankChoice(m, difficulty, [
        {
          prompt: "Budget is tight. Use your constraint matrix to decide what to do.",
          visual: { kind: "icon", icon: "🧮", title: "Score × Weight", subtitle: "Pick the trade-off" },
          answer: "Drop the lowest-weighted feature",
          distractors: ["Ship everything anyway", "Increase the budget arbitrarily", "Remove every constraint"],
          hint: "Trade off least-valuable work first.",
          hints: ["Look at weight × score.", "The lowest contribution should go."],
          explanation: "Trade studies cut low-value features first.",
        },
        {
          prompt: "Two alternatives are tied on total score. What does a constraint matrix recommend next?",
          visual: { kind: "icon", icon: "🧮", title: "Tie-breaker", subtitle: "Use the matrix structure" },
          answer: "Run a sensitivity analysis on weights",
          distractors: ["Pick alphabetically", "Pick the cheaper one without thought", "Discard both"],
          hint: "When tied, see whether ranking is stable.",
          hints: ["Vary the weights.", "If the winner changes, ranking is fragile."],
          explanation: "Sensitivity analysis tests how robust the tie is.",
        },
        {
          prompt: "One alternative fails a hard constraint. What should the matrix do?",
          visual: { kind: "icon", icon: "🧮", title: "Hard fail", subtitle: "Filter first" },
          answer: "Eliminate it before scoring",
          distractors: ["Score it lower but keep it", "Ignore the constraint", "Increase its weight"],
          hint: "Hard constraints filter, not score.",
          hints: ["Score only viable alternatives.", "Hard fails are disqualifying."],
          explanation: "Constraint matrices filter on hard constraints first, then score on soft ones.",
        },
        {
          prompt: "What's the role of weights in a constraint matrix?",
          visual: { kind: "icon", icon: "🧮", title: "Weights", subtitle: "Importance" },
          answer: "Reflect the relative importance of each criterion",
          distractors: ["Hide criteria", "Make all criteria equal", "Convert criteria to dollars"],
          hint: "Some criteria matter more.",
          hints: ["Weights × scores = priority.", "Weighted matrices align outcomes with goals."],
          explanation: "Weights encode how much each criterion matters to the decision.",
        },
      ]);
    }
    case "frictionRamp": {
      const angle = pick([10, 20, 30, 45]);
      const mu = pick([0.1, 0.2, 0.3, 0.5]);
      const slides = Math.tan((angle * Math.PI) / 180) > mu;
      const answer = slides ? "Slides" : "Stays";
      const distractors = slides ? ["Stays", "Floats", "Spins"] : ["Slides", "Floats", "Spins"];
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Block on ${angle}° ramp, μ=${mu}. Does it slide?`, {
            kind: "icon",
            icon: "📐",
            title: `${angle}° ramp`,
            subtitle: `μ = ${mu}`,
          }),
          hint: "Compare tan(angle) to μ.",
          hints: ["If tan(θ) > μ → slides.", `tan(${angle}°) ≈ ${Math.tan((angle * Math.PI) / 180).toFixed(2)}.`],
          explanation: `tan(${angle}°) ${slides ? ">" : "≤"} ${mu}, so it ${slides ? "slides" : "stays"}.`,
        },
        answer,
        distractors,
      );
    }
    case "flywheelInertia": {
      const variants = [
        { ans: "Heavy rim, large radius", distractors: ["Light rim, small radius", "Light rim, large radius", "Heavy rim, small radius"], q: "Which flywheel smooths motion the most?", exp: "I = m·r²; both mass and radius increase inertia." },
        { ans: "Mass concentrated at the rim", distractors: ["Mass concentrated at the hub", "Uniform mass distribution", "Half mass at hub, half at rim"], q: "Where should the mass sit to maximize moment of inertia at constant total mass?", exp: "I = ∫ r² dm; placing mass farther from the axis maximizes I." },
        { ans: "Stainless steel", distractors: ["Aluminum foam", "Soft plastic", "Hollow polystyrene"], q: "For a given size, which material gives the highest flywheel inertia?", exp: "High-density materials concentrate more mass at the same radius." },
        { ans: "I_disk = ½MR²", distractors: ["I_disk = MR²", "I_disk = (1/4)MR²", "I_disk = 2MR²"], q: "Moment of inertia for a uniform solid disk about its center?", exp: "Solid disk: I = ½MR²." },
        { ans: "I_hoop = MR²", distractors: ["I_hoop = ½MR²", "I_hoop = (1/3)MR²", "I_hoop = 0.4 MR²"], q: "Moment of inertia for a thin hoop about its center?", exp: "All mass at radius R: I = MR²." },
      ];
      const v = pick(variants);
      return makeChoice(
        {
          ...base(m, difficulty, "choice", v.q, {
            kind: "icon",
            icon: "🌀",
            title: "I = m·r²",
            subtitle: "Mass × radius squared",
          }),
          hint: "Inertia grows with mass at larger radius (r²).",
          hints: ["Mass at the rim matters most.", "Doubling radius quadruples I."],
          explanation: v.exp,
        },
        v.ans,
        v.distractors,
      );
    }
    case "engineEfficiency": {
      return bankMatch(m, difficulty, [
        {
          prompt: "Pair each thermodynamic cycle with its engine.",
          pairs: [["Carnot", "Best-case bound"], ["Otto", "Spark-ignition"], ["Diesel", "Compression-ignition"], ["Brayton", "Gas turbine"]],
          hint: "Match cycle name to engine family.",
          explanation: "Carnot bounds efficiency; Otto = gasoline; Diesel = compression-ignition; Brayton = gas turbine.",
        },
        {
          prompt: "Pair each cycle with its working fluid path.",
          pairs: [["Rankine", "Steam power plant"], ["Stirling", "Sealed gas, regenerator"], ["Brayton", "Continuous combustion turbine"], ["Otto", "Intermittent gasoline burn"]],
          hint: "Some run continuously, others in pulses.",
          explanation: "Rankine uses steam; Stirling uses a sealed gas with a regenerator; Brayton burns continuously; Otto pulses combustion.",
        },
        {
          prompt: "Match each cycle to its idealized characteristic.",
          pairs: [["Carnot", "All-isothermal heat transfer"], ["Otto", "Constant-volume heat addition"], ["Diesel", "Constant-pressure heat addition"], ["Brayton", "Constant-pressure combustion"]],
          hint: "How is heat added or rejected?",
          explanation: "Carnot is fully reversible; Otto is constant-V; Diesel and Brayton are constant-P.",
        },
        {
          prompt: "Match each engine to its typical fuel/use.",
          pairs: [["Otto", "Cars and motorcycles"], ["Diesel", "Trucks and ships"], ["Brayton", "Jets and power turbines"], ["Rankine", "Coal/nuclear steam plants"]],
          hint: "Where do you see each engine?",
          explanation: "Otto powers cars; Diesel trucks; Brayton jets; Rankine drives steam power plants.",
        },
      ]);
    }
    case "hydraulicPress": {
      const A1 = rand(2, 6);
      const A2 = A1 * pick([2, 3, 4, 5]);
      const F1 = rand(20, 80);
      const F2 = +((F1 * A2) / A1).toFixed(2);
      return numpadEng(
        m,
        difficulty,
        `Hydraulic press: small piston A1=${A1}cm², large piston A2=${A2}cm², input force F1=${F1}N. Find F2.`,
        { kind: "icon", icon: "💪", title: `A1=${A1} · A2=${A2}`, subtitle: "F1/A1 = F2/A2" },
        F2,
        "Pressure is equal everywhere: F1/A1 = F2/A2.",
        ["Solve for F2.", `F2 = F1 · A2 / A1.`],
        `F2 = ${F1} · ${A2}/${A1} = ${F2} N.`,
      );
    }
    case "motorTorqueCurve": {
      return bankChoice(m, difficulty, [
        {
          prompt: "Where on a DC motor's torque-speed curve is its operating point typically chosen?",
          visual: { kind: "icon", icon: "⚙️", title: "Torque vs Speed", subtitle: "Pick the safe regime" },
          answer: "Below stall, above no-load speed",
          distractors: ["Above stall, below no-load speed", "Below stall, below no-load speed", "Above stall, above no-load speed"],
          hint: "Stall = max torque, zero speed. No-load = max speed.",
          hints: ["Operating point must produce useful work.", "It sits between stall and no-load."],
          explanation: "Useful operation lies between stall and the no-load speed.",
        },
        {
          prompt: "What happens to a DC motor's current at stall?",
          visual: { kind: "icon", icon: "🛑", title: "Stall current", subtitle: "Rotor at zero rpm" },
          answer: "Current spikes to its maximum",
          distractors: ["Current drops to zero", "Current oscillates at line frequency", "Current equals no-load current"],
          hint: "No back-EMF when stationary.",
          hints: ["Back-EMF rises with speed.", "At zero speed, only R limits I."],
          explanation: "At stall, back-EMF = 0, so current = V/R, which is largest.",
        },
        {
          prompt: "On a DC motor, torque is roughly proportional to which quantity?",
          visual: { kind: "icon", icon: "🔧", title: "T = k·I", subtitle: "Pick the proportionality" },
          answer: "Armature current",
          distractors: ["Speed", "Voltage squared", "Inductance"],
          hint: "Torque tracks current, not speed.",
          hints: ["More current → more force on the windings.", "Speed sets back-EMF, not torque directly."],
          explanation: "For a DC motor, T ≈ kₜ · I.",
        },
        {
          prompt: "Speed control of a brushed DC motor is most directly achieved by changing…",
          visual: { kind: "icon", icon: "🎛️", title: "PWM control", subtitle: "Average voltage" },
          answer: "Average armature voltage (PWM duty)",
          distractors: ["Magnet polarity", "Wire gauge", "Number of poles only"],
          hint: "Speed ≈ (V − I·R)/k.",
          hints: ["Higher V → higher speed.", "PWM averages voltage."],
          explanation: "Changing average voltage (e.g., via PWM) shifts the speed–torque line up or down.",
        },
      ]);
    }
    case "transformerRatio": {
      const N1 = pick([100, 200, 400]);
      const N2 = pick([10, 20, 50]);
      const V1 = pick([120, 240]);
      const V2 = +((V1 * N2) / N1).toFixed(2);
      return numpadEng(
        m,
        difficulty,
        `Transformer with N1=${N1}, N2=${N2}, V1=${V1}V. Find V2.`,
        { kind: "icon", icon: "🔁", title: `${N1}:${N2}`, subtitle: `Primary ${V1}V` },
        V2,
        "V1/V2 = N1/N2.",
        ["Solve for V2.", `V2 = V1 · N2/N1.`],
        `V2 = ${V1} · ${N2}/${N1} = ${V2} V.`,
      );
    }
    case "threePhasePower": {
      return bankMatch(m, difficulty, [
        {
          prompt: "Pair each three-phase configuration with its trait.",
          pairs: [["Wye (Y)", "Phase voltage lower than line"], ["Delta (Δ)", "Phase voltage equals line"], ["Wye neutral", "Needs 4th wire"], ["Delta", "Three wires only"]],
          hint: "Wye has a neutral; Delta does not.",
          explanation: "Wye splits voltage between line and neutral; Delta uses three line wires.",
        },
        {
          prompt: "Match each quantity to its three-phase relationship.",
          pairs: [["V_line (Wye)", "= √3 · V_phase"], ["I_line (Delta)", "= √3 · I_phase"], ["V_phase (Delta)", "= V_line"], ["I_phase (Wye)", "= I_line"]],
          hint: "Square root of three pops up where voltages or currents split.",
          explanation: "Wye: V_L = √3·V_φ. Delta: I_L = √3·I_φ.",
        },
        {
          prompt: "Match each phase shift to the corresponding pair of phases.",
          pairs: [["A → B", "+120°"], ["B → C", "+120°"], ["A → C", "+240° or −120°"], ["A → A", "0°"]],
          hint: "Phases are evenly spaced by 120°.",
          explanation: "Each phase lags the previous by 120° in a balanced system.",
        },
        {
          prompt: "Pair each fault/issue with the right protection.",
          pairs: [["Short to ground", "Ground fault interrupter"], ["Open phase", "Phase-loss relay"], ["Over-current", "Circuit breaker"], ["Unbalanced load", "Neutral conductor / monitoring"]],
          hint: "Different problems need different sensors.",
          explanation: "GFCI catches ground faults; phase-loss relays catch open phases; breakers handle over-current; neutrals/monitors handle imbalance.",
        },
      ]);
    }
    case "ledResistor": {
      const Vs = pick([5, 9, 12]);
      const Vf = pick([1.8, 2.0, 3.0]);
      const I = pick([10, 20, 30]);
      const R = Math.round((Vs - Vf) / (I / 1000));
      return numpadEng(
        m,
        difficulty,
        `LED: Vs=${Vs}V, Vf=${Vf}V, I=${I}mA. Find current-limiting resistor (Ω).`,
        { kind: "icon", icon: "💡", title: `${Vs}V LED ${Vf}V`, subtitle: `${I} mA target` },
        R,
        "R = (Vs − Vf) / I.",
        ["Convert mA → A first.", `R = (${Vs} − ${Vf}) / (${I}/1000).`],
        `R = (${Vs} − ${Vf}) / (${I}/1000) ≈ ${R} Ω.`,
      );
    }
    case "batteryLife": {
      const ah = pick([1, 2, 5, 10]);
      const draw = pick([100, 250, 500, 1000]);
      const hours = +((ah * 1000) / draw).toFixed(2);
      return numpadEng(
        m,
        difficulty,
        `Battery ${ah} Ah powering ${draw} mA load. Estimate runtime (hours).`,
        { kind: "icon", icon: "🔋", title: `${ah} Ah / ${draw} mA`, subtitle: "Estimate runtime" },
        hours,
        "Hours ≈ capacity (mAh) / draw (mA).",
        ["Convert Ah → mAh.", `Runtime = ${ah * 1000} / ${draw}.`],
        `Runtime ≈ ${ah * 1000} / ${draw} = ${hours} h.`,
      );
    }
    case "concreteMix": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each ingredient into aggregate, binder, or additive.",
          categories: ["Aggregate", "Binder", "Additive"],
          items: [
            { label: "Gravel", category: "Aggregate" },
            { label: "Sand", category: "Aggregate" },
            { label: "Crushed stone", category: "Aggregate" },
            { label: "Portland cement", category: "Binder" },
            { label: "Water (paste)", category: "Binder" },
            { label: "Plasticizer", category: "Additive" },
            { label: "Air entrainer", category: "Additive" },
          ],
          hint: "Aggregates are the rocks; binders glue; additives tune behavior.",
          hints: ["Aggregate gives volume.", "Binder hardens to hold it together."],
          explanation: "Aggregates: gravel/sand/stone. Binder: cement paste. Additive: chemicals.",
        },
        {
          prompt: "Sort each item into the cement, water, aggregate, or admixture bucket.",
          categories: ["Cement", "Water", "Aggregate", "Admixture"],
          items: [
            { label: "Portland cement", category: "Cement" },
            { label: "Fly ash supplement", category: "Cement" },
            { label: "Mix water", category: "Water" },
            { label: "Curing water", category: "Water" },
            { label: "Coarse aggregate", category: "Aggregate" },
            { label: "Fine aggregate (sand)", category: "Aggregate" },
            { label: "Superplasticizer", category: "Admixture" },
            { label: "Retarder", category: "Admixture" },
          ],
          hint: "Concrete = cement + water + aggregates + admixtures.",
          hints: ["Aggregates fill volume.", "Admixtures tweak set time or workability."],
          explanation: "Cement and water make paste; aggregates fill volume; admixtures tune behavior.",
        },
        {
          prompt: "Sort each property into strength, durability, or workability driver.",
          categories: ["Strength", "Durability", "Workability"],
          items: [
            { label: "Low w/c ratio", category: "Strength" },
            { label: "Well-graded aggregate", category: "Strength" },
            { label: "Air entrainment", category: "Durability" },
            { label: "Low permeability", category: "Durability" },
            { label: "Sulfate-resistant cement", category: "Durability" },
            { label: "Plasticizer", category: "Workability" },
            { label: "Higher fines content", category: "Workability" },
          ],
          hint: "Each lever boosts one main property.",
          hints: ["w/c down → strength up.", "Air bubbles → freeze-thaw resistance."],
          explanation: "Strength: low w/c; durability: air + low permeability; workability: plasticizers/fines.",
        },
      ]);
    }
    case "reinforcedBeam": {
      return bankChoice(m, difficulty, [
        {
          prompt: "A simply-supported beam carries a downward load. Pick the safe reinforcement layout.",
          visual: { kind: "icon", icon: "🏗️", title: "Simply-supported beam", subtitle: "Tension is at the bottom" },
          answer: "Top compression bars + bottom tension bars",
          distractors: ["Only top bars", "Only bottom bars", "No reinforcement"],
          hint: "Steel resists tension; concrete resists compression.",
          hints: ["Bottom fibers stretch under load.", "Top fibers compress."],
          explanation: "Reinforce where tension lives (bottom) and add compression bars at top for stiffness.",
        },
        {
          prompt: "A cantilever beam has a downward load at its tip. Where should the main tension steel sit?",
          visual: { kind: "icon", icon: "📐", title: "Cantilever beam", subtitle: "Free end loaded" },
          answer: "Along the top, near the support",
          distractors: ["Along the bottom only", "In the middle of the depth", "Wrapped only in stirrups, no main bars"],
          hint: "A cantilever bends so the top stretches.",
          hints: ["Tension is opposite the load direction's bending.", "Steel goes where concrete would crack."],
          explanation: "On a cantilever, the top fibers are in tension, so main bars belong near the top.",
        },
        {
          prompt: "What is the main role of shear stirrups in a reinforced beam?",
          visual: { kind: "icon", icon: "🪢", title: "Shear stirrups", subtitle: "Vertical ties" },
          answer: "Resist diagonal shear cracks near supports",
          distractors: ["Carry all of the bending moment", "Replace longitudinal bars", "Provide thermal insulation"],
          hint: "Look at how cracks form near supports.",
          hints: ["Diagonal cracks come from shear.", "Stirrups tie the beam vertically."],
          explanation: "Stirrups handle shear, especially the diagonal cracking that forms near supports.",
        },
        {
          prompt: "Why are reinforced concrete beams covered with concrete over the rebar (cover)?",
          visual: { kind: "icon", icon: "🧱", title: "Concrete cover", subtitle: "Protects steel" },
          answer: "Protect steel from corrosion and fire",
          distractors: ["Increase the beam's weight", "Reduce strength on purpose", "Replace stirrups entirely"],
          hint: "Steel rusts when exposed.",
          hints: ["Cover blocks moisture and oxygen.", "Cover also adds fire resistance."],
          explanation: "Concrete cover shields rebar from rust and fire, extending service life.",
        },
      ]);
    }
    case "drainagePlan": {
      const variants = [
        { stops: ["Roof", "Gutter", "Downspout", "Drain", "Reservoir"], prompt: "Trace water from roof to reservoir in order.", explanation: "Roof → gutter → downspout → drain → reservoir." },
        { stops: ["Rainfall", "Roof", "Gutter", "Downspout", "Storm drain"], prompt: "Trace stormwater from sky to storm drain.", explanation: "Rainfall → roof → gutter → downspout → storm drain." },
        { stops: ["Sidewalk", "Curb inlet", "Catch basin", "Storm pipe", "Outfall"], prompt: "Trace street runoff from sidewalk to outfall.", explanation: "Sidewalk → curb inlet → catch basin → storm pipe → outfall." },
        { stops: ["Field", "Swale", "Detention pond", "Culvert", "Stream"], prompt: "Trace field runoff from field to stream.", explanation: "Field → swale → detention pond → culvert → stream." },
      ];
      const v = pick(variants);
      return pathEng(
        m,
        difficulty,
        v.prompt,
        v.stops,
        "Tap stops from origin to outlet.",
        ["Start at the source.", "Each tap appends the next stop."],
        v.explanation,
      );
    }
    case "earthquakeBracing": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each strategy into stiff or ductile bracing.",
          categories: ["Stiff", "Ductile"],
          items: [
            { label: "Shear wall", category: "Stiff" },
            { label: "Brace frame", category: "Stiff" },
            { label: "Concrete core", category: "Stiff" },
            { label: "Base isolator", category: "Ductile" },
            { label: "Viscous damper", category: "Ductile" },
            { label: "Moment frame", category: "Ductile" },
          ],
          hint: "Stiff systems resist; ductile systems absorb.",
          hints: ["Walls and cores resist motion.", "Dampers and isolators absorb energy."],
          explanation: "Stiff: walls/cores. Ductile: dampers/isolators/moment frames.",
        },
        {
          prompt: "Sort each strategy into base-level vs. structure-level seismic protection.",
          categories: ["Base level", "Structure level"],
          items: [
            { label: "Base isolation pads", category: "Base level" },
            { label: "Lead-rubber bearings", category: "Base level" },
            { label: "Friction pendulum bearings", category: "Base level" },
            { label: "Tuned mass damper at the top", category: "Structure level" },
            { label: "Diagonal steel braces", category: "Structure level" },
            { label: "Reinforced shear walls", category: "Structure level" },
          ],
          hint: "Where does the device live?",
          hints: ["Isolators sit between building and ground.", "Braces and walls live within the structure."],
          explanation: "Base isolation lives at the foundation; bracing and dampers live within the structure.",
        },
        {
          prompt: "Sort each component into energy dissipator vs. load-carrier.",
          categories: ["Dissipator", "Load-carrier"],
          items: [
            { label: "Viscous damper", category: "Dissipator" },
            { label: "Friction damper", category: "Dissipator" },
            { label: "Buckling-restrained brace", category: "Dissipator" },
            { label: "Column", category: "Load-carrier" },
            { label: "Beam", category: "Load-carrier" },
            { label: "Shear wall", category: "Load-carrier" },
          ],
          hint: "Dissipators turn motion into heat.",
          hints: ["Beams and columns carry gravity.", "Dampers absorb shaking energy."],
          explanation: "Dampers and BRBs absorb energy; beams, columns, and walls carry the loads.",
        },
      ]);
    }
    case "propThrust": {
      const target = +(rand(3, 9) / 10).toFixed(1);
      return {
        ...base(m, difficulty, "slider", `Tune the throttle so thrust matches drag at the target setting ${target.toFixed(1)}.`, {
          kind: "icon",
          icon: "🛩️",
          title: `Target throttle ${target.toFixed(1)}`,
          subtitle: "Trim the prop pitch",
        }),
        slider: { min: 0, max: 1, step: 0.1, initial: 0.4, target },
        hint: "Trim to balance forward thrust with cruise drag.",
        hints: ["Drag rises with airspeed.", "Aim for steady, level cruise."],
        explanation: `Target throttle was ${target.toFixed(1)}.`,
      };
    }
    case "fuelMassFraction": {
      const dv = pick([3000, 5000, 7000, 9400]);
      const isp = pick([300, 350, 400]);
      const ve = isp * 9.81;
      const ratio = Math.exp(dv / ve);
      const massFrac = +(1 - 1 / ratio).toFixed(3);
      return numpadEng(
        m,
        difficulty,
        `Tsiolkovsky: Δv=${dv} m/s, Isp=${isp}s. Find required fuel mass fraction (m_f / m_0).`,
        { kind: "icon", icon: "🚀", title: `Δv=${dv} m/s`, subtitle: `Isp=${isp}s · ve=Isp·g` },
        massFrac,
        "Δv = ve · ln(m0/mf), so mf/m0 = exp(−Δv/ve).",
        ["ve = Isp · 9.81.", `Fuel fraction = 1 − exp(−Δv/ve).`],
        `Fuel fraction ≈ 1 − exp(−${dv}/${ve.toFixed(1)}) = ${massFrac}.`,
      );
    }
    case "reentryAngle": {
      return bankMatch(m, difficulty, [
        {
          prompt: "Pair each re-entry angle with its outcome.",
          pairs: [["Too steep", "Burn up"], ["Too shallow", "Skip out"], ["Nominal", "Safe re-entry"], ["Reversed", "No re-entry"]],
          hint: "There's a narrow safe corridor.",
          explanation: "Too steep = thermal failure; too shallow = skip-off; reversed = miss; nominal = safe.",
        },
        {
          prompt: "Match each re-entry parameter to its main effect.",
          pairs: [["Flight-path angle", "Heat-rate slope"], ["Velocity", "Total heat load"], ["Ballistic coefficient", "Peak deceleration"], ["Bank angle", "Crossrange control"]],
          hint: "Each knob shapes a different curve.",
          explanation: "Angle sets heat-rate slope; velocity sets total heat; β sets g-load; bank steers downrange.",
        },
        {
          prompt: "Pair each capsule with its re-entry style.",
          pairs: [["Apollo CM", "Lifting blunt-body"], ["Mercury", "Pure ballistic"], ["Space Shuttle", "Cross-range glide"], ["Soyuz", "Semi-ballistic"]],
          hint: "Different shapes give different lift/drag.",
          explanation: "Apollo had lift via offset CG; Mercury was ballistic; Shuttle glided; Soyuz uses a lift offset for semi-ballistic re-entry.",
        },
        {
          prompt: "Match each re-entry hazard to a mitigation.",
          pairs: [["Aerodynamic heating", "Ablative or ceramic shield"], ["High g-loads", "Lifting trajectory"], ["Skip-out", "Hold proper flight-path angle"], ["Off-target landing", "Bank-angle steering"]],
          hint: "Each problem has a classic fix.",
          explanation: "Shields handle heat; lift trajectories cap g's; angle control prevents skip-out; bank steering hits the target.",
        },
      ]);
    }
    case "droneStability": {
      return bankChoice(m, difficulty, [
        {
          prompt: "A quadcopter oscillates around hover. Pick the safest PID tweak.",
          visual: { kind: "icon", icon: "🛸", title: "PID tuning", subtitle: "Reduce oscillation" },
          answer: "Increase D gain slightly",
          distractors: ["Zero all gains", "Maximize P gain", "Use only I gain"],
          hint: "Derivative gain damps oscillation.",
          hints: ["P controls stiffness.", "D controls damping."],
          explanation: "Small increase to D gain damps oscillation without slowing response.",
        },
        {
          prompt: "A drone hovers but slowly drifts off heading and never corrects. Best PID move?",
          visual: { kind: "icon", icon: "🛸", title: "PID tuning", subtitle: "Eliminate steady-state error" },
          answer: "Add a small amount of I gain",
          distractors: ["Add more D gain", "Reduce P gain to zero", "Disable the IMU"],
          hint: "Persistent offset = integral action.",
          hints: ["P alone can't kill bias.", "I sums error over time."],
          explanation: "Small I gain removes steady-state drift caused by bias.",
        },
        {
          prompt: "A quadcopter feels sluggish, with slow attitude response. Pick the safest tweak.",
          visual: { kind: "icon", icon: "🛸", title: "PID tuning", subtitle: "Sharpen response" },
          answer: "Increase P gain modestly",
          distractors: ["Zero all gains", "Maximize D gain only", "Disable motors mid-flight"],
          hint: "Proportional gain sets stiffness.",
          hints: ["P controls how hard it pushes back.", "Too much P → oscillation."],
          explanation: "A modest P gain bump sharpens response without breaking damping.",
        },
        {
          prompt: "A quadcopter shakes violently right after takeoff. What's the safest first response?",
          visual: { kind: "icon", icon: "🛸", title: "PID tuning", subtitle: "Damp instability" },
          answer: "Lower P gain and add some D gain",
          distractors: ["Add more P gain", "Set I gain to maximum", "Remove all gains"],
          hint: "Too-high P with low D = oscillation.",
          hints: ["Less push, more damp.", "Tune one knob at a time."],
          explanation: "Reducing P and increasing D damps the high-gain oscillation.",
        },
      ]);
    }
    case "kinematicChain": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order the joints of a 5-DOF robot arm from base to tool.",
          order: ["Base", "Shoulder", "Elbow", "Wrist", "Gripper"],
          hint: "Start at the base, end at the end-effector.",
          hints: ["Shoulder is just above the base.", "Gripper is the tool."],
          explanation: "Base → shoulder → elbow → wrist → gripper.",
        },
        {
          prompt: "Order the joints of a 6-DOF industrial arm from base to tool.",
          order: ["Base", "Shoulder", "Elbow", "Wrist roll", "Wrist pitch", "Tool flange"],
          hint: "Wrist axes stack: roll, pitch (and yaw).",
          hints: ["Base supports everything.", "Tool flange holds the end effector."],
          explanation: "Base → shoulder → elbow → wrist roll → wrist pitch → tool flange.",
        },
        {
          prompt: "Order a SCARA robot's joints from base to tool.",
          order: ["Base", "Joint 1 (rotary)", "Joint 2 (rotary)", "Joint 3 (vertical)", "End-effector"],
          hint: "Two rotary joints in a plane, then a vertical translation.",
          hints: ["SCARA = Selective Compliance Articulated Robot Arm.", "Vertical motion comes last."],
          explanation: "Base → rotary J1 → rotary J2 → vertical Z → end-effector.",
        },
        {
          prompt: "Order the steps for a forward-kinematics computation.",
          order: ["Read joint angles", "Apply DH parameters per joint", "Multiply transforms in order", "Extract end-effector pose"],
          hint: "Build the chain of transforms.",
          hints: ["DH = Denavit–Hartenberg.", "End pose is the product of all transforms."],
          explanation: "Read q → apply each DH transform → multiply → extract pose.",
        },
      ]);
    }
    case "swarmCoordination": {
      return bankChoice(m, difficulty, [
        {
          prompt: "Pick a robust coordination protocol for a 100-drone swarm.",
          visual: { kind: "icon", icon: "🐝", title: "Swarm protocol", subtitle: "Resilience matters" },
          answer: "Decentralized rules with local sensing",
          distractors: ["Single central controller for every robot", "No communication or rules", "Every robot follows one leader by name"],
          hint: "Robust swarms avoid single points of failure.",
          hints: ["Centralized = brittle.", "Local sensing scales."],
          explanation: "Decentralized control with local sensing is the standard for resilient swarms.",
        },
        {
          prompt: "Boids-style flocking uses three local rules. Which set is correct?",
          visual: { kind: "icon", icon: "🐦", title: "Boids rules", subtitle: "Local interaction" },
          answer: "Separation, alignment, cohesion",
          distractors: ["Speed, color, altitude", "Mass, length, charge", "Map, plan, replan"],
          hint: "Three short rules give complex flocking.",
          hints: ["Avoid crowding neighbors.", "Match their heading."],
          explanation: "Boids: separation + alignment + cohesion produce realistic flocking.",
        },
        {
          prompt: "What's the safest behavior if one drone loses comms in a swarm?",
          visual: { kind: "icon", icon: "📡", title: "Comms loss", subtitle: "Failsafe behavior" },
          answer: "Hold position or land safely",
          distractors: ["Sprint ahead at top speed", "Disable obstacle avoidance", "Take over as leader silently"],
          hint: "Without comms, you can't trust the formation.",
          hints: ["Failsafes prioritize safety.", "Land or hover, don't surge."],
          explanation: "Comms-loss drones should hold or land to avoid collisions.",
        },
        {
          prompt: "Which strategy best handles a swarm flying through a narrow passage?",
          visual: { kind: "icon", icon: "🚪", title: "Narrow passage", subtitle: "Formation re-shape" },
          answer: "Temporarily form a single-file line",
          distractors: ["Pile in shoulder-to-shoulder", "Hover indefinitely upstream", "Disable all sensors"],
          hint: "Geometry forces ordering.",
          hints: ["Width constraints drive single-file.", "Reform on the other side."],
          explanation: "Single-file ordering lets a swarm thread bottlenecks safely.",
        },
      ]);
    }
    case "robotPickPlace": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order one pick-and-place cycle.",
          order: ["Approach", "Grasp", "Lift", "Move", "Place", "Release"],
          hint: "Acquire, transport, deposit.",
          hints: ["Grasping comes before lifting.", "Releasing happens after placing."],
          explanation: "Approach → grasp → lift → move → place → release.",
        },
        {
          prompt: "Order a vision-guided pick-and-place sequence.",
          order: ["Detect part", "Compute pose", "Plan approach", "Grasp", "Transport", "Place"],
          hint: "First see, then plan, then move.",
          hints: ["Vision precedes planning.", "Grasping happens after approach planning."],
          explanation: "Detect → compute pose → plan → grasp → transport → place.",
        },
        {
          prompt: "Order a bin-picking workflow.",
          order: ["Capture depth scan", "Segment objects", "Pick best target", "Plan collision-free path", "Execute grasp", "Drop in bin"],
          hint: "Perception → planning → execution.",
          hints: ["Depth scans come first.", "Targets are selected before motion."],
          explanation: "Scan → segment → choose → plan → execute → drop.",
        },
        {
          prompt: "Order error-handled pick-and-place steps.",
          order: ["Approach", "Sense object", "Grasp", "Verify grip", "Lift and move", "Place", "Confirm placement"],
          hint: "Sensing happens before and after grasping.",
          hints: ["Verify grip before lifting.", "Confirm placement before resetting."],
          explanation: "Approach → sense → grasp → verify → move → place → confirm.",
        },
      ]);
    }
    case "loadPath": {
      const variants = [
        { stops: ["Roof load", "Beam", "Column", "Foundation", "Soil"], prompt: "Trace the gravity load path from roof to ground.", explanation: "Roof → beam → column → foundation → soil." },
        { stops: ["Snow load", "Truss", "Wall stud", "Sill plate", "Foundation"], prompt: "Trace winter snow load down to the foundation.", explanation: "Snow → truss → studs → sill plate → foundation." },
        { stops: ["Floor live load", "Floor joist", "Girder", "Post", "Footing"], prompt: "Trace floor live load from finish floor to footing.", explanation: "Floor → joist → girder → post → footing." },
        { stops: ["Wind pressure", "Roof diaphragm", "Shear wall", "Foundation", "Soil"], prompt: "Trace wind lateral load from roof to soil.", explanation: "Wind → roof diaphragm → shear wall → foundation → soil." },
      ];
      const v = pick(variants);
      return pathEng(
        m,
        difficulty,
        v.prompt,
        v.stops,
        "Load flows from top to soil.",
        ["Horizontal members collect load.", "Vertical members carry it down."],
        v.explanation,
      );
    }
    case "weldJoint": {
      return bankMatch(m, difficulty, [
        {
          prompt: "Pair each weld joint with its geometry.",
          pairs: [["Butt", "Edge-to-edge"], ["Lap", "Overlap surfaces"], ["Fillet", "Corner weld"], ["Tee", "Right-angle"]],
          hint: "Look at how the pieces meet.",
          explanation: "Butt aligns edges; Lap overlaps; Fillet is at corners; Tee meets at 90°.",
        },
        {
          prompt: "Match each welding process to its key trait.",
          pairs: [["MIG (GMAW)", "Continuous wire feed"], ["TIG (GTAW)", "Non-consumable tungsten"], ["Stick (SMAW)", "Flux-coated electrode"], ["Flux-core (FCAW)", "Self-shielding wire"]],
          hint: "Process names hint at consumables.",
          explanation: "MIG feeds wire; TIG uses tungsten + filler; Stick uses flux-coated rods; FCAW wire is hollow with flux.",
        },
        {
          prompt: "Pair each defect with its typical cause.",
          pairs: [["Porosity", "Contamination or wet base"], ["Undercut", "Too high amperage"], ["Cold lap", "Too low heat input"], ["Cracks", "Hydrogen + restraint"]],
          hint: "Each defect is a symptom of a parameter going wrong.",
          explanation: "Porosity from contamination; undercut from too much heat; cold lap from too little; cracks from hydrogen + stress.",
        },
        {
          prompt: "Match each weld position to its description.",
          pairs: [["Flat (1G)", "Pool on top, easiest"], ["Horizontal (2G)", "Along a vertical wall"], ["Vertical (3G)", "Travel up or down"], ["Overhead (4G)", "Above the welder"]],
          hint: "Positions go from easy to hard.",
          explanation: "Flat is easiest; overhead is hardest because gravity fights the pool.",
        },
      ]);
    }
    case "fatigueLife": {
      const stress = pick([100, 150, 200]);
      const exp = 3;
      const k = 1e9;
      const cycles = Math.round(k / Math.pow(stress, exp));
      return numpadEng(
        m,
        difficulty,
        `Stress amplitude ${stress} MPa, Basquin's law N = ${k}/σ³. Estimate cycles to failure.`,
        { kind: "icon", icon: "📉", title: `σ=${stress} MPa`, subtitle: "Basquin's law" },
        cycles,
        "Cycles to failure decrease as stress cubed.",
        ["Plug into N = K/σ³.", `K=${k}, σ=${stress}.`],
        `N ≈ ${k} / ${stress}³ = ${cycles} cycles.`,
      );
    }
    case "alloySelect": {
      return bankMatch(m, difficulty, [
        {
          prompt: "Pair each alloy with a typical application.",
          pairs: [["Aluminum 7075", "Aircraft frame"], ["Stainless 304", "Kitchen sink"], ["Brass", "Plumbing fittings"], ["Titanium", "Implants"]],
          hint: "Strength-to-weight, corrosion, biocompatibility.",
          explanation: "Each alloy is chosen for its dominant property.",
        },
        {
          prompt: "Match each alloy to its key property.",
          pairs: [["Aluminum 6061", "Light + corrosion-resistant"], ["Titanium Ti-6Al-4V", "High strength-to-weight"], ["Stainless 316", "Marine corrosion-resistant"], ["Inconel", "High-temperature strength"]],
          hint: "Read the name for the application clue.",
          explanation: "Properties drive the alloy choice.",
        },
        {
          prompt: "Pair each steel with its main alloying purpose.",
          pairs: [["Mild steel", "Low cost, formable"], ["HSLA steel", "Strength via micro-alloying"], ["Stainless steel", "Corrosion resistance from Cr"], ["Tool steel", "Hardness via C + alloy"]],
          hint: "What does the additive accomplish?",
          explanation: "Different goals → different alloy contents.",
        },
        {
          prompt: "Match each alloy to its 'why we use it' story.",
          pairs: [["Aluminum", "Lightweight cans and frames"], ["Copper", "High electrical conductivity"], ["Bronze", "Hard, wear-resistant gears"], ["Brass", "Easy to machine fittings"]],
          hint: "Conductivity, weight, wear, machinability.",
          explanation: "Use cases follow from the dominant property.",
        },
      ]);
    }
    case "polymerChain": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order the steps of free-radical polymerization.",
          order: ["Monomer", "Initiator", "Propagation", "Termination", "Polymer"],
          hint: "Start with monomer and an initiator.",
          hints: ["Propagation grows the chain.", "Termination caps the chain."],
          explanation: "Monomer → initiator → propagation → termination → polymer.",
        },
        {
          prompt: "Order the basic polymer life cycle.",
          order: ["Raw monomer", "Polymerize", "Process (melt/extrude)", "Use", "Recycle or dispose"],
          hint: "Cradle to grave.",
          hints: ["Polymerizing comes after raw monomer.", "Recycling closes the loop."],
          explanation: "Raw monomer → polymerize → process → use → recycle.",
        },
        {
          prompt: "Order the steps of condensation polymerization.",
          order: ["Monomers with functional groups", "React, releasing small molecule (e.g., H₂O)", "Form dimers and oligomers", "Grow long chain", "Polymer"],
          hint: "Small byproduct comes out each step.",
          hints: ["e.g., nylon releases H₂O.", "Chains grow stepwise."],
          explanation: "Monomers react and release a small molecule; chains grow step by step.",
        },
        {
          prompt: "Order how a thermoplastic part is made.",
          order: ["Polymer pellets", "Melt in barrel", "Inject into mold", "Cool and solidify", "Eject part"],
          hint: "Pellets to part.",
          hints: ["Melting precedes molding.", "Cooling locks shape."],
          explanation: "Pellets → melt → inject → cool → eject.",
        },
      ]);
    }
    case "corrosionSort": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each material into corrosion-resistant or vulnerable.",
          categories: ["Resistant", "Vulnerable"],
          items: [
            { label: "Stainless steel", category: "Resistant" },
            { label: "Titanium", category: "Resistant" },
            { label: "Gold plating", category: "Resistant" },
            { label: "Bare mild steel", category: "Vulnerable" },
            { label: "Iron", category: "Vulnerable" },
            { label: "Zinc (sacrificial)", category: "Vulnerable" },
          ],
          hint: "Passive oxides protect; bare metals corrode.",
          hints: ["Stainless and Ti form passive layers.", "Iron rusts when exposed."],
          explanation: "Stainless / Ti / Au resist; bare Fe and Zn corrode.",
        },
        {
          prompt: "Sort each corrosion type into its category.",
          categories: ["Uniform", "Localized", "Galvanic"],
          items: [
            { label: "General atmospheric rusting", category: "Uniform" },
            { label: "Acid attack across a surface", category: "Uniform" },
            { label: "Pitting", category: "Localized" },
            { label: "Crevice corrosion", category: "Localized" },
            { label: "Stress corrosion cracking", category: "Localized" },
            { label: "Dissimilar metals in saltwater", category: "Galvanic" },
            { label: "Zinc anode on steel hull", category: "Galvanic" },
          ],
          hint: "How and where does the attack occur?",
          hints: ["Uniform = even thinning.", "Galvanic = two metals + electrolyte."],
          explanation: "Uniform thins evenly; localized concentrates; galvanic needs two metals.",
        },
        {
          prompt: "Sort each strategy into corrosion-prevention bucket.",
          categories: ["Barrier", "Sacrificial", "Material choice"],
          items: [
            { label: "Paint coating", category: "Barrier" },
            { label: "Epoxy coating", category: "Barrier" },
            { label: "Galvanizing (Zn layer)", category: "Sacrificial" },
            { label: "Zinc anode on hull", category: "Sacrificial" },
            { label: "Magnesium anode on pipeline", category: "Sacrificial" },
            { label: "Switching to stainless steel", category: "Material choice" },
            { label: "Using titanium hardware", category: "Material choice" },
          ],
          hint: "How does the fix work?",
          hints: ["Barriers block O₂/H₂O.", "Sacrificial anodes corrode first."],
          explanation: "Barriers, sacrificial anodes, and material choice are the three classic prevention strategies.",
        },
      ]);
    }
    case "transistorMode": {
      return bankMatch(m, difficulty, [
        {
          prompt: "Pair each BJT mode with its junction biases.",
          pairs: [["Cutoff", "Both junctions reverse"], ["Active", "BE forward, BC reverse"], ["Saturation", "Both junctions forward"], ["Reverse-active", "BE reverse, BC forward"]],
          hint: "BE = base-emitter; BC = base-collector.",
          explanation: "Each mode is set by how the two PN junctions are biased.",
        },
        {
          prompt: "Match each BJT mode to a typical use.",
          pairs: [["Cutoff", "Logic '0' / switch off"], ["Active (forward)", "Linear amplifier"], ["Saturation", "Logic '1' / switch on"], ["Reverse-active", "Rare, low-gain"]],
          hint: "Switches vs amplifiers.",
          explanation: "Saturation and cutoff make switches; active mode amplifies.",
        },
        {
          prompt: "Match each MOSFET region with its description.",
          pairs: [["Cutoff", "V_GS < Vth, no I_D"], ["Triode (linear)", "V_GS > Vth, V_DS small"], ["Saturation", "V_GS > Vth, V_DS ≥ V_GS − Vth"], ["Breakdown", "Excess V_DS, damaging"]],
          hint: "Compare V_GS to threshold and V_DS to overdrive.",
          explanation: "MOSFETs have four key operating regions defined by V_GS and V_DS.",
        },
        {
          prompt: "Pair each region of a JFET I_D vs V_DS curve with its description.",
          pairs: [["Ohmic / triode", "Channel acts like resistor"], ["Pinch-off", "Channel constricts"], ["Saturation", "Nearly constant current"], ["Breakdown", "Reverse voltage too high"]],
          hint: "Behavior changes as V_DS grows.",
          explanation: "JFETs transition from resistive to current-source behavior with rising V_DS.",
        },
      ]);
    }
    case "kirchhoffLoop": {
      const Vs = pick([6, 9, 12, 18]);
      const R1 = pick([2, 3, 4]);
      const R2 = pick([2, 3, 4]);
      const I = +(Vs / (R1 + R2)).toFixed(2);
      return numpadEng(
        m,
        difficulty,
        `A single loop has V=${Vs}V, R1=${R1}Ω, R2=${R2}Ω in series. Find loop current I (A).`,
        { kind: "icon", icon: "🔌", title: `${Vs}V loop`, subtitle: `R1=${R1}Ω, R2=${R2}Ω` },
        I,
        "Sum voltages around the loop equals zero.",
        ["V − IR1 − IR2 = 0.", `I = V / (R1+R2).`],
        `I = ${Vs} / (${R1}+${R2}) = ${I} A.`,
      );
    }
    case "logicCircuitMap": {
      return bankMatch(m, difficulty, [
        {
          prompt: "Pair each gate with its truth condition.",
          pairs: [["AND", "Both 1 → 1"], ["OR", "Any 1 → 1"], ["XOR", "Exactly one 1"], ["NAND", "Not both 1"]],
          hint: "Read the gate's name as a condition.",
          explanation: "AND requires both; OR requires any; XOR exactly one; NAND inverts AND.",
        },
        {
          prompt: "Match each gate to its 2-input truth output for (A=1, B=0).",
          pairs: [["AND", "0"], ["OR", "1"], ["XOR", "1"], ["NOR", "0"]],
          hint: "Evaluate each gate on the input pair.",
          explanation: "A=1,B=0: AND=0, OR=1, XOR=1, NOR=0.",
        },
        {
          prompt: "Match each gate to a universal-gate substitute (using NAND).",
          pairs: [["NOT", "A NAND A"], ["AND", "(A NAND B) NAND (A NAND B)"], ["OR", "(A NAND A) NAND (B NAND B)"], ["NAND", "Itself"]],
          hint: "Universal gates can build everything else.",
          explanation: "NAND alone can build all other gates.",
        },
        {
          prompt: "Match each Boolean expression to its gate.",
          pairs: [["A · B", "AND"], ["A + B", "OR"], ["A ⊕ B", "XOR"], ["A̅", "NOT"]],
          hint: "·=AND, +=OR, ⊕=XOR, bar=NOT.",
          explanation: "Common Boolean notation: · OR + ⊕ and bars.",
        },
      ]);
    }
    case "rootCauseTree": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order the 5-Whys root cause sequence.",
          order: ["Symptom", "Why 1", "Why 2", "Why 3", "Why 4", "Root cause"],
          hint: "Start with the symptom, dig deeper each step.",
          hints: ["Each 'why' uses the previous answer.", "Stop at a controllable root."],
          explanation: "Symptom → why → why → why → why → root cause.",
        },
        {
          prompt: "Order a fishbone (Ishikawa) analysis.",
          order: ["Define problem", "List 6 M-categories", "Brainstorm causes per category", "Test most likely causes", "Identify root cause"],
          hint: "Start with the problem; end with the root.",
          hints: ["6Ms: methods, machines, materials, manpower, measurement, environment.", "Test top suspects."],
          explanation: "Define → categorize → brainstorm → test → identify.",
        },
        {
          prompt: "Order the Plan-Do-Check-Act (PDCA) loop.",
          order: ["Plan", "Do", "Check", "Act"],
          hint: "Continuous improvement cycle.",
          hints: ["Plan the change.", "Do (try); Check (measure); Act (standardize)."],
          explanation: "PDCA cycles: Plan → Do → Check → Act.",
        },
        {
          prompt: "Order a Failure Mode and Effects Analysis (FMEA).",
          order: ["List functions", "Identify failure modes", "Find effects", "Find causes", "Rate severity/occurrence/detection", "Compute RPN and act"],
          hint: "Functions → modes → effects → causes → ratings.",
          hints: ["RPN = S × O × D.", "Highest RPN gets mitigated first."],
          explanation: "Classic FMEA workflow ends with prioritized mitigation.",
        },
      ]);
    }
    case "userStoryRank": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Rank user stories by priority (highest first).",
          order: ["Critical bug fix", "High-value feature", "Nice-to-have feature", "Tech debt cleanup", "Speculative idea"],
          hint: "Critical work outranks speculation.",
          hints: ["Always fix critical bugs first.", "Speculation is lowest."],
          explanation: "Bug fix → high value → nice-to-have → debt → speculative.",
        },
        {
          prompt: "Order an Agile sprint from kickoff to retrospective.",
          order: ["Sprint planning", "Daily standups", "Development", "Sprint review (demo)", "Retrospective"],
          hint: "Plan → execute → demo → learn.",
          hints: ["Standups happen daily during the sprint.", "Retrospective wraps up the cycle."],
          explanation: "Sprints run plan → stand-ups → dev → demo → retro.",
        },
        {
          prompt: "Order a product discovery flow.",
          order: ["Identify problem", "Interview users", "Synthesize insights", "Prototype solution", "Test with users", "Iterate"],
          hint: "Always start with the user problem.",
          hints: ["Insights come from interviews.", "Test before scaling."],
          explanation: "Discovery is problem → user → insight → prototype → test → iterate.",
        },
        {
          prompt: "Order a typical MoSCoW prioritization pass.",
          order: ["List all requirements", "Tag Must / Should / Could / Won't", "Lock Must list", "Estimate Should & Could", "Schedule release"],
          hint: "Tag, lock musts, estimate the rest, schedule.",
          hints: ["MoSCoW = Must/Should/Could/Won't.", "Musts ship first."],
          explanation: "MoSCoW prioritization tags requirements and orders delivery.",
        },
      ]);
    }
    case "equationMaze": {
      const k = rand(2, 9);
      const c = rand(2, 12);
      const x = rand(2, max);
      const ans = k * x + c;
      return makeChoice(
        { ...base(m, difficulty, "choice", `Solve through the maze: ${k}x + ${c} = ${ans}. What is x?`, { kind: "icon", icon: m.emoji, title: `${k}x + ${c} = ${ans}`, subtitle: "Linear maze" }),
          hint: "Subtract the constant first, then divide.",
          hints: [`Subtract ${c} from both sides.`, `Divide by ${k}.`],
          explanation: `${k}x = ${ans - c}, so x = ${x}.`,
        }, String(x), numberChoices(x));
    }
    case "variableLock": {
      const a = rand(2, 9), b = rand(2, 9), x = rand(3, max);
      const ans = a * x - b;
      return numpadEng(m, difficulty, `Unlock: ${a}x − ${b} = ${ans}. Type x.`, { kind: "icon", icon: "🔐", title: `${a}x − ${b} = ${ans}`, subtitle: "Solve for x" },
        x, "Add b then divide.", [`Isolate the variable.`, `(${ans}+${b})/${a} = ?`], `x = (${ans}+${b})/${a} = ${x}.`);
    }
    case "expressionSimplifier": {
      const a = rand(2, 6), b = rand(2, 6);
      const ans = `${a + b}x`;
      const distractors = [`${a * b}x`, `${a}x + ${b}`, `${a - b}x`];
      return makeChoice({ ...base(m, difficulty, "choice", `Simplify: ${a}x + ${b}x.`, { kind: "icon", icon: m.emoji, title: `${a}x + ${b}x`, subtitle: "Combine like terms" }),
        hint: "Add coefficients of like terms.", hints: ["Same variable, add the numbers.", `${a} + ${b} = ?`], explanation: `${a}x + ${b}x = ${ans}.` }, ans, distractors);
    }
    case "likeTermSorter": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each term into the right bucket.",
          categories: ["x terms", "x² terms", "Constants"],
          items: [
            { label: "3x", category: "x terms" }, { label: "−x", category: "x terms" }, { label: "7x", category: "x terms" }, { label: "−12x", category: "x terms" },
            { label: "5x²", category: "x² terms" }, { label: "−2x²", category: "x² terms" }, { label: "x²", category: "x² terms" }, { label: "−9x²", category: "x² terms" },
            { label: "7", category: "Constants" }, { label: "−4", category: "Constants" }, { label: "11", category: "Constants" }, { label: "−25", category: "Constants" },
          ],
          hint: "Match the variable power.",
          hints: ["x and x² are different.", "Numbers alone are constants."],
          explanation: "Group by variable and exponent.",
        },
        {
          prompt: "Sort each term by degree (highest power present).",
          categories: ["Degree 1", "Degree 2", "Degree 3"],
          items: [
            { label: "5x", category: "Degree 1" }, { label: "−3y", category: "Degree 1" }, { label: "x/2", category: "Degree 1" },
            { label: "4x²", category: "Degree 2" }, { label: "x²−1", category: "Degree 2" }, { label: "3y²", category: "Degree 2" },
            { label: "x³", category: "Degree 3" }, { label: "−2t³", category: "Degree 3" }, { label: "x³ + x", category: "Degree 3" },
          ],
          hint: "Degree = highest exponent.",
          hints: ["A polynomial's degree is its highest power.", "Sum of powers in monomial."],
          explanation: "Each term has a single highest-power factor.",
        },
        {
          prompt: "Sort each expression by variable family.",
          categories: ["x family", "y family", "Mixed (xy)"],
          items: [
            { label: "5x", category: "x family" }, { label: "3x²", category: "x family" }, { label: "−x", category: "x family" },
            { label: "4y", category: "y family" }, { label: "−2y²", category: "y family" }, { label: "y", category: "y family" },
            { label: "xy", category: "Mixed (xy)" }, { label: "3x²y", category: "Mixed (xy)" }, { label: "−x y³", category: "Mixed (xy)" },
          ],
          hint: "Mixed terms contain more than one variable.",
          hints: ["Single variable → single family.", "Multiple variables → mixed."],
          explanation: "Pure-variable vs. mixed-variable separation.",
        },
      ]);
    }
    case "functionTableBuilder": {
      const mult = rand(2, 5), add = rand(-3, 6);
      const x = rand(2, 6); const y = mult * x + add;
      return dragEng(m, difficulty, `Build f(x) = ${mult}x ${add >= 0 ? "+ " + add : "− " + Math.abs(add)}. Drop f(${x}).`,
        String(y), [String(y + 1), String(y - 1), String(mult * x)], `f(${x}) = ?`,
        "Plug x into the rule.", ["Multiply then add.", `${mult}·${x} ${add >= 0 ? "+" : "−"} ${Math.abs(add)}`], `${mult}·${x} = ${mult * x}; then ${mult * x} + ${add} = ${y}.`);
    }
    case "domainRangePicker": {
      const variants = [
        { f: "f(x) = x²", ans: "Domain: all real, Range: y ≥ 0", distractors: ["Domain: y ≥ 0, Range: all real", "Domain: x ≠ 0, Range: y ≠ 0", "Domain: 0 to 1, Range: 0 to 1"], exp: "x² accepts any real input and outputs y ≥ 0." },
        { f: "f(x) = √x", ans: "Domain: x ≥ 0, Range: y ≥ 0", distractors: ["Domain: all real, Range: y ≥ 0", "Domain: x > 0, Range: y > 0", "Domain: x ≤ 0, Range: y ≥ 0"], exp: "√x requires x ≥ 0; output is always non-negative." },
        { f: "f(x) = 1/x", ans: "Domain: x ≠ 0, Range: y ≠ 0", distractors: ["Domain: all real, Range: all real", "Domain: x > 0, Range: y > 0", "Domain: x ≥ 0, Range: y ≥ 0"], exp: "1/x is undefined at 0 and never reaches 0." },
        { f: "f(x) = eˣ", ans: "Domain: all real, Range: y > 0", distractors: ["Domain: x > 0, Range: y > 0", "Domain: all real, Range: y ≥ 0", "Domain: y > 0, Range: all real"], exp: "eˣ is defined everywhere; output is strictly positive." },
        { f: "f(x) = ln x", ans: "Domain: x > 0, Range: all real", distractors: ["Domain: all real, Range: y > 0", "Domain: x ≥ 0, Range: y ≥ 0", "Domain: x ≠ 0, Range: y ≠ 0"], exp: "ln x requires x > 0; output is unbounded." },
        { f: "f(x) = sin x", ans: "Domain: all real, Range: −1 ≤ y ≤ 1", distractors: ["Domain: 0 ≤ x ≤ 2π, Range: y ≥ 0", "Domain: all real, Range: y ≥ 0", "Domain: y ∈ [−1,1], Range: all real"], exp: "sin x is defined everywhere; output is bounded by ±1." },
        { f: "f(x) = |x|", ans: "Domain: all real, Range: y ≥ 0", distractors: ["Domain: y ≥ 0, Range: all real", "Domain: all real, Range: y > 0", "Domain: x ≥ 0, Range: y ≥ 0"], exp: "Absolute value is defined for all x and never negative." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", `Identify domain and range of ${v.f}.`, { kind: "icon", icon: m.emoji, title: v.f, subtitle: "Domain & range" }),
        hint: "Domain = inputs, Range = outputs.", hints: ["Look for restrictions (zeros, roots, logs).", "Range comes from the function's output behavior."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "piecewiseSwitch": {
      const x = rand(-4, 5);
      const y = x < 0 ? -x : x * x;
      const ans = String(y);
      return makeChoice({ ...base(m, difficulty, "choice", `Piecewise f(x) = |x| if x<0, x² otherwise. f(${x}) = ?`, { kind: "icon", icon: m.emoji, title: `f(${x})`, subtitle: "Pick correct branch" }),
        hint: "Check which branch applies.", hints: ["Compare x to 0.", "Use the matching rule."], explanation: `For x=${x}, the ${x < 0 ? "|x|" : "x²"} branch gives ${y}.` }, ans, numberChoices(y));
    }
    case "absValueDistance": {
      const a = rand(-9, 9), b = rand(-9, 9);
      const ans = Math.abs(a - b);
      return numpadEng(m, difficulty, `Distance on the number line from ${a} to ${b}?`, { kind: "icon", icon: m.emoji, title: `|${a} − ${b}|`, subtitle: "Absolute difference" },
        ans, "Use |a − b|.", ["Subtract first.", "Take the absolute value."], `|${a}−${b}| = ${ans}.`);
    }
    case "inequalityGate": {
      const t = rand(2, 9); const c = rand(2, 12);
      const ans = `x > ${(c - t)}`;
      return makeChoice({ ...base(m, difficulty, "choice", `Solve x + ${t} > ${c}.`, { kind: "icon", icon: m.emoji, title: `x + ${t} > ${c}`, subtitle: "Pick the inequality" }),
        hint: "Subtract from both sides.", hints: [`x > ${c} − ${t}.`, "Direction stays the same."], explanation: `x > ${c - t}.` }, ans, [`x < ${c - t}`, `x ≥ ${c - t + 1}`, `x = ${c - t}`]);
    }
    case "inequalityNumberLine": {
      const target = rand(2, 8);
      return sliderEng(m, difficulty, `Slide x to a value that satisfies x > ${target}.`, { min: 0, max: 12, step: 1, initial: 0, target: target + 1 },
        `Need x > ${target}`, "Pick the smallest integer that works.", [`The smallest integer greater than ${target} is ${target + 1}.`], `Any x > ${target} works; ${target + 1} is the smallest.`);
    }
    case "algebraTiles": {
      const a = rand(2, 6), b = rand(2, 6), c = rand(2, 6);
      const ans = `${a + b}x + ${c}`;
      return dragEng(m, difficulty, `Combine tiles: ${a}x + ${b}x + ${c}.`, ans, [`${a * b}x + ${c}`, `${a + b}x²`, `${a + b + c}x`],
        "Combined expression", "Add like-term tiles.", ["Tiles for x merge.", "Constant tile stays alone."], `${a}x + ${b}x = ${a + b}x; add ${c} to get ${ans}.`);
    }
    case "distributiveProperty": {
      const a = rand(2, 7);
      const bCoef = rand(2, 9);
      const cConst = rand(2, 9);
      const useMinus = Math.random() < 0.4;
      const opStr = useMinus ? "−" : "+";
      const product = a * cConst;
      const answer = useMinus ? `${a * bCoef}x − ${product}` : `${a * bCoef}x + ${product}`;
      const distractors = [
        useMinus ? `${a * bCoef}x − ${cConst}` : `${a * bCoef}x + ${cConst}`,
        `${a + bCoef}x ${opStr} ${a + cConst}`,
        `${bCoef * cConst}x ${opStr} ${a}`,
      ];
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Distribute: ${a}(${bCoef}x ${opStr} ${cConst}).`, {
            kind: "icon",
            icon: m.emoji,
            title: `${a}(${bCoef}x ${opStr} ${cConst})`,
            subtitle: "a(b ± c) = ab ± ac",
          }),
          hint: "Multiply a into every term inside the parentheses.",
          hints: [`${a} × ${bCoef}x = ${a * bCoef}x.`, `${a} × ${cConst} = ${product}.`],
          explanation: `${a}(${bCoef}x ${opStr} ${cConst}) = ${answer}.`,
        },
        answer,
        distractors,
      );
    }
    case "compoundInequality": {
      const b = rand(1, 6);
      const lo = rand(-4, 4);
      const span = rand(2, 6);
      const hi = lo + span;
      const xLo = lo - b;
      const xHi = hi - b;
      const useMinus = Math.random() < 0.5;
      const bDisplay = useMinus ? -b : b;
      const xLoEff = useMinus ? lo - bDisplay : lo - b;
      const xHiEff = useMinus ? hi - bDisplay : hi - b;
      const opText = useMinus ? `− ${b}` : `+ ${b}`;
      const answer = `${xLoEff} ≤ x ≤ ${xHiEff}`;
      const distractors = [
        `${lo} ≤ x ≤ ${hi}`,
        `${xLoEff + 1} ≤ x ≤ ${xHiEff + 1}`,
        `${-xHiEff} ≤ x ≤ ${-xLoEff}`,
      ];
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Solve: ${lo} ≤ x ${opText} ≤ ${hi}.`, {
            kind: "icon",
            icon: m.emoji,
            title: `${lo} ≤ x ${opText} ≤ ${hi}`,
            subtitle: "Apply the same step to all three parts",
          }),
          hint: `${useMinus ? "Add" : "Subtract"} ${b} to/from every part.`,
          hints: [
            `Treat it like two inequalities at once.`,
            `${lo} ${useMinus ? "+" : "−"} ${b} ≤ x ≤ ${hi} ${useMinus ? "+" : "−"} ${b}.`,
          ],
          explanation: `${useMinus ? "Add" : "Subtract"} ${b} from each side: ${answer}.`,
        },
        answer,
        distractors,
      );
    }
    case "slopeIntercept": {
      const slope = pick([-3, -2, -1, 1, 2, 3, 4] as const);
      const x0 = rand(-3, 5);
      const bIntercept = rand(-6, 8);
      const y0 = slope * x0 + bIntercept;
      return numpadEng(
        m, difficulty,
        `A line has slope ${slope} and passes through (${x0}, ${y0}). Find the y-intercept b.`,
        { kind: "coordinate", title: `slope = ${slope}, point (${x0}, ${y0})`, subtitle: "y = mx + b" },
        bIntercept,
        "Use y = mx + b and solve for b.",
        [`b = y − m·x.`, `b = ${y0} − (${slope})·(${x0}).`],
        `b = ${y0} − ${slope}·${x0} = ${bIntercept}.`,
        true,
      );
    }
    case "pointSlopeMatch": {
      return bankMatch(m, difficulty, [
        {
          prompt: "Pair each point-slope form with its slope-intercept equivalent.",
          pairs: [
            ["y − 3 = 2(x − 1)", "y = 2x + 1"],
            ["y − 5 = −1(x + 2)", "y = −x + 3"],
            ["y + 4 = 3(x − 2)", "y = 3x − 10"],
            ["y − 1 = (1/2)(x + 4)", "y = (1/2)x + 3"],
          ],
          hint: "Distribute the slope, then isolate y.",
          hints: ["y − y₁ = m(x − x₁).", "Solve for y: y = mx + (y₁ − m·x₁)."],
          explanation: "Distribute m, then add y₁ to both sides.",
        },
        {
          prompt: "Pair each line description with its slope-intercept equation.",
          pairs: [
            ["slope 4, through (0, 2)", "y = 4x + 2"],
            ["slope −2, through (1, 3)", "y = −2x + 5"],
            ["slope 1, through (−1, −1)", "y = x"],
            ["slope 0, through (3, 7)", "y = 7"],
          ],
          hint: "Use y = mx + b and the given point.",
          hints: ["b = y − m·x.", "Plug the point into the formula."],
          explanation: "Compute b from the point, then write y = mx + b.",
        },
        {
          prompt: "Pair each pair of points with the slope of the line through them.",
          pairs: [
            ["(0, 0) and (2, 4)", "slope 2"],
            ["(1, 2) and (3, 8)", "slope 3"],
            ["(0, 5) and (5, 0)", "slope −1"],
            ["(−2, 1) and (2, 1)", "slope 0"],
          ],
          hint: "Slope = (y₂ − y₁) / (x₂ − x₁).",
          hints: ["Rise over run.", "Watch the signs in the subtraction."],
          explanation: "Use the slope formula on each pair.",
        },
        {
          prompt: "Pair each line with its parallel or perpendicular partner through the origin.",
          pairs: [
            ["y = 2x + 5 (parallel)", "y = 2x"],
            ["y = 2x + 5 (perpendicular)", "y = −(1/2)x"],
            ["y = −3x + 1 (parallel)", "y = −3x"],
            ["y = −3x + 1 (perpendicular)", "y = (1/3)x"],
          ],
          hint: "Parallel keeps slope; perpendicular uses negative reciprocal.",
          hints: ["Parallel: same m.", "Perpendicular: m → −1/m."],
          explanation: "Match slopes for parallel; flip and negate for perpendicular.",
        },
      ]);
    }
    case "absoluteValueEquation": {
      const bConst = rand(1, 6) * (Math.random() < 0.5 ? 1 : -1);
      const cVal = rand(2, 10);
      const x1 = cVal - bConst;
      const x2 = -cVal - bConst;
      const sortedX = x1 < x2 ? [x1, x2] : [x2, x1];
      const answer = `x = ${sortedX[0]} or x = ${sortedX[1]}`;
      const bStr = bConst >= 0 ? `+ ${bConst}` : `− ${Math.abs(bConst)}`;
      const distractors = [
        `x = ${cVal - bConst} only`,
        `x = ${cVal} or x = −${cVal}`,
        `No solution`,
      ].filter((d) => d !== answer);
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Solve |x ${bStr}| = ${cVal}.`, {
            kind: "icon",
            icon: m.emoji,
            title: `|x ${bStr}| = ${cVal}`,
            subtitle: "Absolute value splits into two cases",
          }),
          hint: `x ${bStr} = ±${cVal}.`,
          hints: [
            "An absolute value equation has two cases.",
            `Positive case: x ${bStr} = ${cVal}.`,
            `Negative case: x ${bStr} = −${cVal}.`,
          ],
          explanation: `Split into two: x = ${cVal} − (${bConst}) = ${x1}, and x = −${cVal} − (${bConst}) = ${x2}.`,
        },
        answer,
        distractors,
      );
    }
    case "quadraticFormula": {
      const r1 = pick([1, 2, 3, 4, 5] as const);
      const r2 = -pick([1, 2, 3, 4, 5] as const);
      const bCoef = -(r1 + r2);
      const cConst = r1 * r2;
      const delta = bCoef * bCoef - 4 * cConst;
      const bStr = bCoef >= 0 ? `+ ${bCoef}` : `− ${Math.abs(bCoef)}`;
      const cStr = cConst >= 0 ? `+ ${cConst}` : `− ${Math.abs(cConst)}`;
      const sortedRoots = [r1, r2].sort((p, q) => p - q);
      const answer = `x = ${sortedRoots[0]} or x = ${sortedRoots[1]}`;
      const distractors = [
        `x = ${-r1} or x = ${-r2}`,
        `x = ${r1 + r2} or x = ${r1 * r2}`,
        `x = ±√${Math.abs(cConst)}`,
      ];
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Use the quadratic formula to solve x² ${bStr}x ${cStr} = 0.`, {
            kind: "icon",
            icon: m.emoji,
            title: `x² ${bStr}x ${cStr} = 0`,
            subtitle: "x = (−b ± √(b² − 4ac)) / 2a",
          }),
          hint: "Start by computing the discriminant Δ = b² − 4ac.",
          hints: [
            `a = 1, b = ${bCoef}, c = ${cConst}.`,
            `Δ = b² − 4ac = ${delta}.`,
            `Plug into x = (−b ± √Δ) / 2a.`,
          ],
          explanation: `Δ = ${delta}; √Δ = ${Math.sqrt(delta)}. Roots: ${sortedRoots[0]} and ${sortedRoots[1]}.`,
        },
        answer,
        distractors,
      );
    }
    case "discriminantClassify": {
      const variants: { quad: string; delta: number; label: string }[] = [
        { quad: "x² − 5x + 6", delta: 1, label: "Two distinct real roots" },
        { quad: "x² + x − 6", delta: 25, label: "Two distinct real roots" },
        { quad: "x² − 7x + 12", delta: 1, label: "Two distinct real roots" },
        { quad: "x² − 4x + 4", delta: 0, label: "One repeated real root" },
        { quad: "x² + 6x + 9", delta: 0, label: "One repeated real root" },
        { quad: "x² − 10x + 25", delta: 0, label: "One repeated real root" },
        { quad: "x² + 2x + 5", delta: -16, label: "Two complex conjugate roots" },
        { quad: "x² − 2x + 5", delta: -16, label: "Two complex conjugate roots" },
        { quad: "x² + 4x + 8", delta: -16, label: "Two complex conjugate roots" },
      ];
      const v = pick(variants);
      const allLabels = ["Two distinct real roots", "One repeated real root", "Two complex conjugate roots"];
      const distractors = allLabels.filter((label) => label !== v.label);
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Classify the roots of ${v.quad} = 0.`, {
            kind: "icon",
            icon: m.emoji,
            title: `${v.quad} = 0`,
            subtitle: "Use Δ = b² − 4ac",
          }),
          hint: "Compute the discriminant first.",
          hints: [
            `Δ = ${v.delta}.`,
            "Δ > 0: two distinct real roots.",
            "Δ = 0: one repeated real root.",
            "Δ < 0: two complex conjugate roots.",
          ],
          explanation: `Δ = ${v.delta} → ${v.label.toLowerCase()}.`,
        },
        v.label,
        distractors,
      );
    }
    case "geometricSeriesSum": {
      const a1 = pick([1, 2, 3, 4] as const);
      const r = pick([2, 3] as const);
      const n = pick([3, 4, 5] as const);
      const rn = Math.pow(r, n);
      const sum = (a1 * (rn - 1)) / (r - 1);
      return numpadEng(
        m, difficulty,
        `Geometric series: a₁ = ${a1}, r = ${r}, n = ${n}. Find Sₙ.`,
        { kind: "icon", icon: m.emoji, title: `Σ ${a1}·${r}^(k−1), k=1..${n}`, subtitle: `Sₙ = a₁(rⁿ − 1)/(r − 1)` },
        sum,
        "Apply Sₙ = a₁·(rⁿ − 1)/(r − 1).",
        [`rⁿ = ${r}^${n} = ${rn}.`, `Sₙ = ${a1}·(${rn} − 1)/${r - 1}.`],
        `Sₙ = ${a1}·(${rn} − 1)/${r - 1} = ${sum}.`,
        false,
      );
    }
    case "literalEquation": {
      return bankChoice(m, difficulty, [
        {
          prompt: "Solve A = ½bh for h.",
          visual: { kind: "icon", icon: m.emoji, title: "A = ½bh", subtitle: "Triangle area, solve for h" },
          answer: "h = 2A / b",
          distractors: ["h = A / (2b)", "h = 2A − b", "h = b / (2A)"],
          hint: "Multiply both sides by 2, then divide by b.",
          hints: ["2A = bh.", "Divide both sides by b."],
          explanation: "A = ½bh → 2A = bh → h = 2A / b.",
        },
        {
          prompt: "Solve C = 2πr for r.",
          visual: { kind: "icon", icon: m.emoji, title: "C = 2πr", subtitle: "Circle circumference" },
          answer: "r = C / (2π)",
          distractors: ["r = 2πC", "r = C − 2π", "r = π / (2C)"],
          hint: "Divide both sides by 2π.",
          hints: ["Isolate r.", "C / (2π) = r."],
          explanation: "C = 2πr → r = C / (2π).",
        },
        {
          prompt: "Solve y = mx + b for x.",
          visual: { kind: "icon", icon: m.emoji, title: "y = mx + b", subtitle: "Slope-intercept" },
          answer: "x = (y − b) / m",
          distractors: ["x = (y + b) / m", "x = y − b − m", "x = m(y − b)"],
          hint: "Subtract b, then divide by m.",
          hints: ["y − b = mx.", "Divide both sides by m."],
          explanation: "Move b across first, then divide by m.",
        },
        {
          prompt: "Solve F = (9/5)C + 32 for C.",
          visual: { kind: "icon", icon: m.emoji, title: "F = (9/5)C + 32", subtitle: "Temperature" },
          answer: "C = (5/9)(F − 32)",
          distractors: ["C = (9/5)(F + 32)", "C = F − 32", "C = (F − 32) / 9"],
          hint: "Subtract 32, then multiply by 5/9.",
          hints: ["F − 32 = (9/5)C.", "Multiply both sides by 5/9."],
          explanation: "Reverse each operation in order.",
        },
        {
          prompt: "Solve V = πr²h for h.",
          visual: { kind: "icon", icon: m.emoji, title: "V = πr²h", subtitle: "Cylinder volume" },
          answer: "h = V / (πr²)",
          distractors: ["h = V · πr²", "h = πr² − V", "h = V / r²"],
          hint: "Divide both sides by πr².",
          hints: ["Isolate h.", "Divide V by the base area."],
          explanation: "V = πr²h → h = V / (πr²).",
        },
        {
          prompt: "Solve d = rt for t.",
          visual: { kind: "icon", icon: m.emoji, title: "d = rt", subtitle: "Distance-rate-time" },
          answer: "t = d / r",
          distractors: ["t = r / d", "t = d · r", "t = d − r"],
          hint: "Divide both sides by r.",
          hints: ["Isolate t.", "Travel time = distance / rate."],
          explanation: "d = rt → t = d / r.",
        },
      ]);
    }
    case "directVariation": {
      const k = rand(2, 9);
      const x = rand(2, 7);
      const y = k * x;
      const askY = Math.random() < 0.5;
      if (askY) {
        const x2 = rand(2, 9);
        const y2 = k * x2;
        return numpadEng(
          m, difficulty,
          `y varies directly with x. When x = ${x}, y = ${y}. Find y when x = ${x2}.`,
          { kind: "icon", icon: m.emoji, title: "y = kx", subtitle: `k = ${k}` },
          y2,
          "Find k first, then multiply.",
          [`k = y / x = ${y} / ${x} = ${k}.`, `y = ${k} · ${x2}.`],
          `k = ${k}; y = ${k} · ${x2} = ${y2}.`,
          false,
        );
      }
      return numpadEng(
        m, difficulty,
        `y varies directly with x. When x = ${x}, y = ${y}. Find the constant k in y = kx.`,
        { kind: "icon", icon: m.emoji, title: "y = kx", subtitle: `(${x}, ${y})` },
        k,
        "k = y / x.",
        ["Direct variation: y / x is constant.", `${y} / ${x} = ?`],
        `k = ${y} / ${x} = ${k}.`,
        false,
      );
    }
    case "inverseVariation": {
      const kChoices = [12, 18, 24, 30, 36, 48, 60] as const;
      const k = pick(kChoices);
      const xCandidates = [2, 3, 4, 6].filter((v) => k % v === 0);
      const x1 = pick(xCandidates);
      const y1 = k / x1;
      const x2 = pick(xCandidates.filter((v) => v !== x1));
      const y2 = k / x2;
      return numpadEng(
        m, difficulty,
        `y varies inversely with x. When x = ${x1}, y = ${y1}. Find y when x = ${x2}.`,
        { kind: "icon", icon: m.emoji, title: "y = k / x", subtitle: `k = ${k}` },
        y2,
        "First find k = x · y, then divide by the new x.",
        [`k = ${x1} · ${y1} = ${k}.`, `y = ${k} / ${x2}.`],
        `k = ${k}; y = ${k} / ${x2} = ${y2}.`,
        false,
      );
    }
    case "exponentRules": {
      const a = rand(2, 5);
      const m1 = rand(2, 6);
      const n1 = rand(2, 6);
      return bankChoice(m, difficulty, [
        {
          prompt: `Simplify ${a}^${m1} · ${a}^${n1}.`,
          visual: { kind: "icon", icon: m.emoji, title: `${a}^${m1} · ${a}^${n1}`, subtitle: "Product of powers" },
          answer: `${a}^${m1 + n1}`,
          distractors: [`${a}^${m1 * n1}`, `${a * a}^${m1 + n1}`, `${m1 + n1}^${a}`],
          hint: "Same base → add exponents.",
          hints: ["a^m · a^n = a^(m+n).", `${m1} + ${n1} = ${m1 + n1}.`],
          explanation: `${a}^${m1} · ${a}^${n1} = ${a}^${m1 + n1}.`,
        },
        {
          prompt: `Simplify (${a}^${m1})^${n1}.`,
          visual: { kind: "icon", icon: m.emoji, title: `(${a}^${m1})^${n1}`, subtitle: "Power of a power" },
          answer: `${a}^${m1 * n1}`,
          distractors: [`${a}^${m1 + n1}`, `${a * n1}^${m1}`, `${a}^${Math.pow(m1, n1)}`],
          hint: "Multiply the exponents.",
          hints: ["(a^m)^n = a^(m·n).", `${m1} · ${n1} = ${m1 * n1}.`],
          explanation: `(${a}^${m1})^${n1} = ${a}^${m1 * n1}.`,
        },
        {
          prompt: `Simplify ${a}^${m1 + n1} / ${a}^${n1}.`,
          visual: { kind: "icon", icon: m.emoji, title: `${a}^${m1 + n1} / ${a}^${n1}`, subtitle: "Quotient of powers" },
          answer: `${a}^${m1}`,
          distractors: [`${a}^${m1 + 2 * n1}`, `1^${m1}`, `${a}^${Math.abs(n1 - m1)}`],
          hint: "Same base → subtract exponents.",
          hints: ["a^m / a^n = a^(m−n).", `${m1 + n1} − ${n1} = ${m1}.`],
          explanation: `${a}^${m1 + n1} / ${a}^${n1} = ${a}^${m1}.`,
        },
        {
          prompt: `Simplify ${a}^0 · ${a}^${m1}.`,
          visual: { kind: "icon", icon: m.emoji, title: `${a}^0 · ${a}^${m1}`, subtitle: "Zero exponent" },
          answer: `${a}^${m1}`,
          distractors: ["0", "1", `${a}^${m1 + 1}`],
          hint: "Any nonzero base to the 0 is 1.",
          hints: ["a^0 = 1.", "1 · a^m = a^m."],
          explanation: `${a}^0 = 1, so the product is ${a}^${m1}.`,
        },
        {
          prompt: `Rewrite ${a}^(−${m1}) without a negative exponent.`,
          visual: { kind: "icon", icon: m.emoji, title: `${a}^−${m1}`, subtitle: "Negative exponent" },
          answer: `1 / ${a}^${m1}`,
          distractors: [`−${a}^${m1}`, "0", `${a}^${m1}`],
          hint: "Negative exponent → reciprocal.",
          hints: ["a^(−n) = 1 / a^n.", "Flip to the denominator."],
          explanation: `${a}^(−${m1}) = 1 / ${a}^${m1}.`,
        },
      ]);
    }
    case "completingSquare": {
      const half = rand(1, 6);
      const bCoef = 2 * half;
      const cConst = rand(-4, 9);
      const k = cConst - half * half;
      const useMinus = Math.random() < 0.5;
      const sign = useMinus ? "−" : "+";
      const innerSign = useMinus ? "−" : "+";
      const cStr = cConst >= 0 ? `+ ${cConst}` : `− ${Math.abs(cConst)}`;
      const kStr = k >= 0 ? `+ ${k}` : `− ${Math.abs(k)}`;
      const answer = `(x ${innerSign} ${half})² ${kStr}`;
      const distractors = [
        `(x ${useMinus ? "+" : "−"} ${half})² ${kStr}`,
        `(x ${innerSign} ${bCoef})² ${cStr}`,
        `(x ${innerSign} ${half})² ${cStr}`,
      ];
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Complete the square: x² ${sign} ${bCoef}x ${cStr}.`, {
            kind: "icon",
            icon: m.emoji,
            title: `x² ${sign} ${bCoef}x ${cStr}`,
            subtitle: "Convert to vertex form",
          }),
          hint: "Take half the x-coefficient and square it.",
          hints: [
            `Half of ${bCoef} is ${half}; ${half}² = ${half * half}.`,
            `Adjust the constant: ${cConst} − ${half * half} = ${k}.`,
          ],
          explanation: `x² ${sign} ${bCoef}x ${cStr} = (x ${innerSign} ${half})² + (${cConst} − ${half * half}) = ${answer}.`,
        },
        answer,
        distractors,
      );
    }
    case "absValueInequality": {
      const aOffset = rand(-5, 5);
      const cVal = rand(2, 8);
      const lessThan = Math.random() < 0.5;
      const aStr = aOffset >= 0 ? `− ${aOffset}` : `+ ${Math.abs(aOffset)}`;
      const opStr = lessThan ? "<" : ">";
      const lo = aOffset - cVal;
      const hi = aOffset + cVal;
      const answer = lessThan
        ? `${lo} < x < ${hi}`
        : `x < ${lo} or x > ${hi}`;
      const distractors = lessThan
        ? [
            `x < ${lo} or x > ${hi}`,
            `${-hi} < x < ${-lo}`,
            `${lo} ≤ x ≤ ${hi - 1}`,
          ]
        : [
            `${lo} < x < ${hi}`,
            `x > ${hi}`,
            `x < ${lo}`,
          ];
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Solve |x ${aStr}| ${opStr} ${cVal}.`, {
            kind: "icon",
            icon: m.emoji,
            title: `|x ${aStr}| ${opStr} ${cVal}`,
            subtitle: "Absolute value inequality",
          }),
          hint: lessThan
            ? `< means "inside": −${cVal} < x ${aStr} < ${cVal}.`
            : `> means "outside": x ${aStr} > ${cVal} or x ${aStr} < −${cVal}.`,
          hints: [
            lessThan ? "Rewrite as a compound inequality." : "Rewrite as a disjunction (two parts).",
            lessThan
              ? `Add ${aOffset} to each part: ${lo} < x < ${hi}.`
              : `Solve each: x > ${hi} or x < ${lo}.`,
          ],
          explanation: `|x ${aStr}| ${opStr} ${cVal} → ${answer}.`,
        },
        answer,
        distractors,
      );
    }
    case "logEquation": {
      const baseA = pick([2, 3, 5, 10] as const);
      const dExp = rand(2, baseA === 10 ? 3 : baseA === 2 ? 5 : 3);
      const cOffset = rand(-5, 5);
      const power = Math.pow(baseA, dExp);
      const x = power - cOffset;
      const cStr = cOffset >= 0 ? `+ ${cOffset}` : `− ${Math.abs(cOffset)}`;
      return numpadEng(
        m, difficulty,
        `Solve log_${baseA}(x ${cStr}) = ${dExp}.`,
        { kind: "icon", icon: m.emoji, title: `log_${baseA}(x ${cStr}) = ${dExp}`, subtitle: "Solve for x" },
        x,
        "Rewrite in exponential form, then isolate x.",
        [`${baseA}^${dExp} = x ${cStr}.`, `${baseA}^${dExp} = ${power}.`, `x = ${power} ${cOffset >= 0 ? "−" : "+"} ${Math.abs(cOffset)}.`],
        `x = ${baseA}^${dExp} − (${cOffset}) = ${power} − (${cOffset}) = ${x}.`,
        true,
      );
    }
    case "binomialExpansion": {
      const n = pick([2, 3, 4] as const);
      const k = rand(1, 4);
      const variants = [
        {
          n: 2,
          ans: `x² + ${2 * k}x + ${k * k}`,
          distractors: [`x² + ${k}x + ${k * k}`, `x² + ${2 * k}x − ${k * k}`, `x² + ${k * k}`],
          exp: `(x + ${k})² = x² + 2·${k}·x + ${k}² = x² + ${2 * k}x + ${k * k}.`,
          row: "1, 2, 1",
        },
        {
          n: 3,
          ans: `x³ + ${3 * k}x² + ${3 * k * k}x + ${k * k * k}`,
          distractors: [
            `x³ + ${k}x² + ${k * k}x + ${k * k * k}`,
            `x³ + ${3 * k}x² − ${3 * k * k}x + ${k * k * k}`,
            `x³ + ${3 * k * k}x + ${k * k * k}`,
          ],
          exp: `(x + ${k})³ uses Pascal's row 1, 3, 3, 1 with descending x and ascending ${k}.`,
          row: "1, 3, 3, 1",
        },
        {
          n: 4,
          ans: `x⁴ + ${4 * k}x³ + ${6 * k * k}x² + ${4 * k * k * k}x + ${k * k * k * k}`,
          distractors: [
            `x⁴ + ${k}x³ + ${k * k}x² + ${k * k * k}x + ${k * k * k * k}`,
            `x⁴ + ${4 * k}x³ + ${4 * k * k}x² + ${4 * k * k * k}x + ${k * k * k * k}`,
            `x⁴ + ${k * k * k * k}`,
          ],
          exp: `(x + ${k})⁴ uses Pascal's row 1, 4, 6, 4, 1.`,
          row: "1, 4, 6, 4, 1",
        },
      ];
      const v = variants.find((item) => item.n === n)!;
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Expand (x + ${k})^${n}.`, {
            kind: "icon",
            icon: m.emoji,
            title: `(x + ${k})^${n}`,
            subtitle: "Binomial theorem",
          }),
          hint: `Use Pascal's triangle row for n = ${n}.`,
          hints: [
            `Row: ${v.row}.`,
            `Multiply each coefficient by descending powers of x and ascending powers of ${k}.`,
          ],
          explanation: v.exp,
        },
        v.ans,
        v.distractors,
      );
    }
    case "exponentMatch": {
      const a = rand(2, 5);
      return matchPuzzle(m, difficulty, "Match each expression to its value.", [[`${a}²`, String(a * a)], [`${a}³`, String(a * a * a)], [`${a}⁰`, "1"], [`${a}¹`, String(a)]]);
    }
    case "scientificNotation": {
      const k = rand(2, 9), n = rand(2, 6);
      const ans = `${k} × 10^${n}`;
      const distractors = [`${k} × 10^${n + 1}`, `${k * 10} × 10^${n - 1}`, `${k}^${n}`];
      const expanded = k * Math.pow(10, n);
      return makeChoice({ ...base(m, difficulty, "choice", `Write ${expanded.toLocaleString("en-US")} in scientific notation.`, { kind: "icon", icon: m.emoji, title: expanded.toLocaleString("en-US"), subtitle: "Scientific form" }),
        hint: "Move the decimal so one digit is left of it.", hints: [`Coefficient between 1 and 10.`, "Count the digits moved."], explanation: `${expanded.toLocaleString("en-US")} = ${ans}.` }, ans, distractors);
    }
    case "graphLine": {
      const slope = rand(-3, 3) || 2; const yint = rand(-4, 6);
      const ans = `y = ${slope}x + ${yint}`;
      return makeChoice({ ...base(m, difficulty, "choice", `Pick the line with slope ${slope} and y-intercept ${yint}.`, { kind: "coordinate", title: ans, subtitle: "Slope-intercept" }),
        hint: "Slope is the x coefficient, y-intercept is the constant.", hints: [`Slope: ${slope}.`, `Y-intercept: ${yint}.`], explanation: `${ans} matches both clues.` }, ans, [`y = ${slope + 1}x + ${yint}`, `y = ${slope}x + ${yint + 1}`, `y = ${-slope}x + ${yint}`]);
    }
    case "slopeRunner": {
      const x1 = rand(0, 5), y1 = rand(0, 5), x2 = x1 + rand(1, 5), y2 = y1 + rand(-5, 6);
      const slope = (y2 - y1) / (x2 - x1);
      const ans = slope.toFixed(2);
      return makeChoice({ ...base(m, difficulty, "choice", `Slope between (${x1}, ${y1}) and (${x2}, ${y2})?`, { kind: "coordinate", title: `(${x1},${y1}) → (${x2},${y2})`, subtitle: "Rise over run" }),
        hint: "(y2 − y1) / (x2 − x1).", hints: [`Δy = ${y2 - y1}.`, `Δx = ${x2 - x1}.`], explanation: `Slope = ${y2 - y1}/${x2 - x1} = ${ans}.` }, ans, [(slope + 1).toFixed(2), (slope - 1).toFixed(2), (-slope).toFixed(2)]);
    }
    case "functionRule": {
      const mult = rand(2, 4), add = rand(1, 5);
      const ans = `f(x) = ${mult}x + ${add}`;
      return makeChoice({ ...base(m, difficulty, "choice", `f(1)=${mult + add}, f(2)=${mult * 2 + add}, f(3)=${mult * 3 + add}. Find the rule.`, { kind: "machine", title: "Discover f", subtitle: "Linear rule" }),
        hint: "Differences reveal the slope.", hints: ["First differences are constant.", "Plug in to find the constant."], explanation: `${ans} fits all three.` }, ans, [`f(x) = ${mult + 1}x + ${add}`, `f(x) = ${mult}x + ${add - 1}`, `f(x) = ${mult * 2}x`]);
    }
    case "systemsScale": {
      const x = rand(1, 8), y = rand(1, 8);
      const a = rand(2, 5), b = rand(2, 5);
      const sum1 = a * x + b * y, sum2 = x + y;
      const ans = `(${x}, ${y})`;
      return makeChoice({ ...base(m, difficulty, "choice", `Solve the system: ${a}x + ${b}y = ${sum1}, x + y = ${sum2}.`, { kind: "icon", icon: m.emoji, title: "Two equations", subtitle: "Find (x, y)" }),
        hint: "Use substitution from the simpler equation.", hints: [`Solve for y in the second.`, "Plug into the first."], explanation: `x=${x}, y=${y} satisfies both.` }, ans, [`(${y}, ${x})`, `(${x + 1}, ${y - 1})`, `(${x - 1}, ${y + 1})`]);
    }
    case "compositionMachine": {
      const a = rand(2, 4), b = rand(1, 5);
      const x = rand(2, 5);
      const inner = x + b;
      const ans = a * inner;
      return makeChoice({ ...base(m, difficulty, "choice", `f(x) = ${a}x, g(x) = x + ${b}. Find (f ∘ g)(${x}).`, { kind: "machine", title: "f(g(x))", subtitle: `Inputs: x=${x}` }),
        hint: "Apply g first, then f.", hints: [`g(${x}) = ${inner}.`, `f(${inner}) = ?`], explanation: `g(${x}) = ${inner}; f(${inner}) = ${ans}.` }, String(ans), numberChoices(ans));
    }
    case "angleChase": {
      const a = rand(20, 70); const b = rand(20, 70); const c = 180 - a - b;
      return makeChoice({ ...base(m, difficulty, "choice", `Two angles in a triangle are ${a}° and ${b}°. The third?`, { kind: "icon", icon: m.emoji, title: `${a}°, ${b}°`, subtitle: "Triangle sums to 180°" }),
        hint: "Triangle angles sum to 180°.", hints: [`180 − ${a} − ${b}.`, "Subtract from 180°."], explanation: `${c}° completes the triangle.` }, `${c}°`, [`${c + 10}°`, `${c - 10}°`, `${180 - c}°`]);
    }
    case "angleDetective": {
      const a = rand(30, 80); const supp = 180 - a;
      return numpadEng(m, difficulty, `Find the supplement of ${a}°.`, { kind: "icon", icon: m.emoji, title: `${a}° + ? = 180°`, subtitle: "Supplementary" },
        supp, "Supplementary angles sum to 180°.", ["180 − a.", `180 − ${a} = ?`], `Supplement = ${supp}°.`);
    }
    case "parallelTransversal": {
      const a = rand(40, 130); const ans = `${a}°`;
      const distractors = [`${180 - a}°`, `${90 - a}°`, `${a + 10}°`];
      return makeChoice({ ...base(m, difficulty, "choice", `Two parallel lines cut by a transversal. One angle is ${a}°. Its corresponding angle?`, { kind: "icon", icon: m.emoji, title: `Given: ${a}°`, subtitle: "Corresponding angles" }),
        hint: "Corresponding angles are equal.", hints: ["Mark the F-pattern.", "Both equal the same value."], explanation: `Corresponding angles are equal: ${a}°.` }, ans, distractors);
    }
    case "polygonAngles": {
      const n = pick([4, 5, 6, 7, 8]);
      const ans = (n - 2) * 180;
      return numpadEng(m, difficulty, `Sum of interior angles of a ${n}-gon (in degrees)?`, { kind: "icon", icon: m.emoji, title: `${n} sides`, subtitle: "(n−2)·180" },
        ans, "Each triangle adds 180°.", [`(${n}−2) = ?`, `Multiply by 180.`], `(${n}−2)·180 = ${ans}°.`);
    }
    case "triangleCongruence": {
      const banks: [string, string][][] = [
        [["SSS", "All sides equal"], ["SAS", "Two sides + included angle"], ["ASA", "Two angles + included side"], ["HL", "Right triangle hypotenuse + leg"], ["AAS", "Two angles + non-included side"]],
        [["SSS triangles", "Always congruent"], ["AAA triangles", "Similar, not necessarily congruent"], ["SSA (donkey)", "Ambiguous case"], ["HL (right triangles only)", "Always congruent"]],
        [["Reflexive property", "AB ≅ AB"], ["Vertical angles", "Congruent"], ["Alternate interior angles", "Congruent if lines parallel"], ["CPCTC", "Used after proving triangles ≅"]],
      ];
      return matchPuzzle(m, difficulty, "Pair each geometry concept with its meaning.", pick(banks));
    }
    case "similarTriangles": {
      const k = pick([2, 3, 4]); const side = rand(3, 9);
      const ans = String(side * k);
      return makeChoice({ ...base(m, difficulty, "choice", `Triangles are similar with scale factor ${k}. A side of ${side} corresponds to ?`, { kind: "icon", icon: m.emoji, title: `Side ${side} × ${k}`, subtitle: "Scale up" }),
        hint: "Multiply by the scale factor.", hints: ["Similarity preserves ratios.", `${side}·${k}`], explanation: `${side}·${k} = ${ans}.` }, ans, [String(side + k), String(side / k), String(side * k + 1)]);
    }
    case "triangleProof": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order the steps of a triangle congruence proof.",
          order: ["Given", "Mark congruent parts", "Identify shortcut", "Apply SAS/ASA/SSS", "QED"],
          hint: "Start with given, end with conclusion.",
          hints: ["Mark before you cite.", "Conclusion is last."],
          explanation: "Standard congruence proof order.",
        },
        {
          prompt: "Order the steps of a parallel-lines proof.",
          order: ["Draw a transversal", "Mark angle pairs", "Identify alternate interior angles", "Argue angles equal → lines parallel", "Conclude"],
          hint: "Transversal first.",
          hints: ["Alternate interior angles signal parallelism.", "Use angle properties to conclude."],
          explanation: "Classical parallel-lines proof structure.",
        },
        {
          prompt: "Order the structure of a two-column proof.",
          order: ["State given information", "Write statement", "Provide justification", "Build to next statement", "Reach desired conclusion"],
          hint: "Each row pairs statement with reason.",
          hints: ["Justifications come from postulates/theorems.", "Conclusion is the goal."],
          explanation: "Two-column proofs alternate statements and reasons.",
        },
      ]);
    }
    case "circleTheorem": {
      const r = rand(2, 8); const ans = `2π·${r}`;
      return makeChoice({ ...base(m, difficulty, "choice", `Pick the circumference of a circle with radius ${r}.`, { kind: "icon", icon: "⭕", title: `r = ${r}`, subtitle: "C = 2πr" }),
        hint: "C = 2πr.", hints: ["Use π.", "Don't square."], explanation: `C = 2π·${r}.` }, ans, [`π·${r}²`, `π·${r}`, `2π·${r * 2}`]);
    }
    case "arcSector": {
      const r = rand(3, 9); const ang = pick([60, 90, 120]);
      const area = +((Math.PI * r * r * ang) / 360).toFixed(2);
      return numpadEng(m, difficulty, `Sector of radius ${r} with central angle ${ang}°. Area?`, { kind: "icon", icon: "🥧", title: `r=${r}, θ=${ang}°`, subtitle: "(θ/360)·π·r²" },
        area, "(θ/360)·π·r².", [`Convert ${ang}/360.`, "Multiply by π·r²."], `Sector = (${ang}/360)·π·${r}² ≈ ${area}.`);
    }
    case "areaVolume": {
      const w = rand(2, 6), l = rand(2, 6), h = rand(2, 6);
      const ans = w * l * h;
      return dragEng(m, difficulty, `Box ${w}×${l}×${h}. Drop the volume.`, String(ans), [String(w * l + h), String(2 * (w * l + l * h + w * h)), String(w + l + h)],
        "Box volume", "V = l·w·h.", ["Multiply all three.", `${w}·${l}·${h}`], `Volume = ${w}·${l}·${h} = ${ans}.`);
    }
    case "surfaceArea": {
      const r = rand(3, 8); const ans = Math.round(4 * Math.PI * r * r);
      return numpadEng(m, difficulty, `Sphere with radius ${r}. Surface area (round to nearest int)?`, { kind: "icon", icon: "⚪", title: `r=${r}`, subtitle: "4πr²" },
        ans, "SA = 4πr².", ["Use 3.14 for π.", `4·π·${r}²`], `4·π·${r}² ≈ ${ans}.`);
    }
    case "volumeFill": {
      const r = rand(2, 6); const h = rand(3, 10);
      const ans = +(Math.PI * r * r * h).toFixed(2);
      return numpadEng(m, difficulty, `Cylinder r=${r}, h=${h}. Volume?`, { kind: "icon", icon: m.emoji, title: `r=${r}, h=${h}`, subtitle: "π·r²·h" },
        ans, "V = π·r²·h.", ["Square r first.", "Multiply by h."], `π·${r}²·${h} ≈ ${ans}.`);
    }
    case "netFolding": {
      const target = pick([90, 180, 270] as const);
      return rotateEng(m, difficulty, `Rotate the net ${target}° to align with the solid.`, target, 90,
        `${target / 90} quarter-turn${target === 90 ? "" : "s"}.`, [`Tap to rotate by 90° at a time.`, `Stop at ${target}°.`], `A ${target}° rotation aligns this net.`);
    }
    case "transformationsGrid": {
      const target = pick([90, 180, 270] as const);
      return rotateEng(m, difficulty, `Rotate the shape ${target}° about its center.`, target, 90,
        `${target / 90} quarter-turn${target === 90 ? "" : "s"}.`, [`Each tap rotates 90°.`, `Stop at ${target}°.`], `${target / 90} × 90° rotation = ${target}°.`);
    }
    case "coordinateGeometry": {
      const x1 = rand(0, 6), y1 = rand(0, 6), x2 = x1 + rand(2, 6), y2 = y1 + rand(2, 6);
      const dx = x2 - x1, dy = y2 - y1;
      const dist = +Math.sqrt(dx * dx + dy * dy).toFixed(2);
      return makeChoice({ ...base(m, difficulty, "choice", `Distance between (${x1},${y1}) and (${x2},${y2})?`, { kind: "coordinate", title: `(${x1},${y1}) — (${x2},${y2})`, subtitle: "Distance formula" }),
        hint: "√((Δx)² + (Δy)²).", hints: [`Δx=${dx}.`, `Δy=${dy}.`], explanation: `√(${dx}² + ${dy}²) ≈ ${dist}.` }, String(dist), [(dist + 1).toFixed(2), (dist - 1).toFixed(2), String(dx + dy)]);
    }
    case "coordTransform": {
      const target = pick([90, 180, 270] as const);
      return rotateEng(m, difficulty, `Rotate the figure ${target}° about the origin.`, target, 90,
        `${target / 90} quarter-turn${target === 90 ? "" : "s"}.`, [`Each tap rotates 90°.`, `Stop at ${target}°.`], `${target}° = ${target / 90} × 90° rotations.`);
    }
    case "geometricConstruction": {
      const target = pick([180, 270, 360] as const);
      const what = target === 360 ? "scribe a full circle" : target === 270 ? "sweep three-quarters of an arc" : "sweep a half circle";
      return rotateEng(m, difficulty, `Rotate the compass ${target}° to ${what}.`, target, 90,
        `${target / 90} quarter-turns total.`, [`Each tap rotates 90°.`, `Stop at ${target}°.`], `${target}° rotation completes the construction.`);
    }
    case "proofSequence": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order the steps of a two-column proof.",
          order: ["Statement", "Justification", "Diagram check", "Next statement", "Conclusion"],
          hint: "Statement before justification.",
          hints: ["Each step builds on prior ones.", "Conclusion is last."],
          explanation: "Standard two-column proof flow.",
        },
        {
          prompt: "Order the steps of a paragraph proof.",
          order: ["State the given", "Identify the goal", "Build deductive chain", "Cite each theorem/postulate", "State conclusion"],
          hint: "Same structure as two-column but in prose.",
          hints: ["Cite reasons inline.", "Build chain from givens."],
          explanation: "Paragraph proofs explain reasoning in prose.",
        },
        {
          prompt: "Order an indirect (proof-by-contradiction) argument.",
          order: ["State the claim", "Assume the negation", "Derive a contradiction", "Reject the negation", "Conclude the claim is true"],
          hint: "Indirect proofs negate then derive contradiction.",
          hints: ["Assumption is opposite of claim.", "Contradiction forces rejection."],
          explanation: "Standard indirect proof structure.",
        },
      ]);
    }
    case "similarityMap": {
      const k = pick([2, 3]); const len = rand(3, 9);
      const ans = len * k;
      return numpadEng(m, difficulty, `Two similar polygons. Original side ${len} maps to ? under scale ${k}.`, { kind: "icon", icon: m.emoji, title: `${len} × ${k}`, subtitle: "Similar scale" },
        ans, "Multiply by scale factor.", ["Lengths scale linearly.", `${len}·${k}`], `${len}·${k} = ${ans}.`);
    }
    case "triangleHeight": {
      const b = rand(4, 12); const area = rand(20, 80);
      const h = +((2 * area) / b).toFixed(2);
      return numpadEng(m, difficulty, `Triangle area = ${area}, base = ${b}. Find height.`, { kind: "icon", icon: m.emoji, title: `A=${area}, b=${b}`, subtitle: "A = ½·b·h" },
        h, "Solve A = ½·b·h.", ["h = 2A / b.", `${2 * area}/${b}.`], `h = (2·${area})/${b} ≈ ${h}.`);
    }
    case "unitCircle": {
      const variants = [
        { ans: "1/2", q: "On the unit circle, sin 30°?", title: "sin 30°", distractors: ["√3/2", "1", "0"], exp: "sin 30° = 1/2." },
        { ans: "√3/2", q: "On the unit circle, cos 30°?", title: "cos 30°", distractors: ["1/2", "√2/2", "1"], exp: "cos 30° = √3/2." },
        { ans: "√2/2", q: "On the unit circle, sin 45°?", title: "sin 45°", distractors: ["1/2", "√3/2", "1"], exp: "sin 45° = cos 45° = √2/2." },
        { ans: "1", q: "On the unit circle, sin 90°?", title: "sin 90°", distractors: ["0", "1/2", "√3/2"], exp: "sin 90° = 1." },
        { ans: "0", q: "On the unit circle, cos 90°?", title: "cos 90°", distractors: ["1", "1/2", "−1"], exp: "cos 90° = 0." },
        { ans: "−1", q: "On the unit circle, cos 180°?", title: "cos 180°", distractors: ["1", "0", "−1/2"], exp: "cos 180° = −1." },
        { ans: "1/2", q: "On the unit circle, sin 150°?", title: "sin 150°", distractors: ["−1/2", "√3/2", "0"], exp: "sin 150° = sin(180−30) = 1/2." },
        { ans: "−√3/2", q: "On the unit circle, cos 150°?", title: "cos 150°", distractors: ["√3/2", "−1/2", "0"], exp: "cos 150° = −cos 30° = −√3/2." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", v.q, { kind: "icon", icon: "⭕", title: v.title, subtitle: "Unit circle" }),
        hint: "Use the reference angle on the special-angle table.", hints: ["Quadrant sets the sign.", "30/45/60 are the special angles."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "unitCircleMemory": {
      const banks: [string, string][][] = [
        [["0°", "0"], ["30°", "1/2"], ["45°", "√2/2"], ["60°", "√3/2"], ["90°", "1"]],
        [["0°", "1"], ["30°", "√3/2"], ["45°", "√2/2"], ["60°", "1/2"], ["90°", "0"]],
        [["180°", "−1"], ["270°", "0"], ["360°", "1"], ["120°", "−1/2"], ["240°", "−1/2"]],
        [["sin 30°", "1/2"], ["sin 60°", "√3/2"], ["cos 30°", "√3/2"], ["cos 60°", "1/2"], ["tan 45°", "1"]],
        [["tan 0°", "0"], ["tan 30°", "1/√3"], ["tan 45°", "1"], ["tan 60°", "√3"], ["tan 90°", "undefined"]],
      ];
      const v = pick(banks);
      const prompt = v[0]?.[0].startsWith("tan") || v[0]?.[0].startsWith("sin") || v[0]?.[0].startsWith("cos")
        ? "Pair each trig expression with its value."
        : v[0]?.[1] === "1" || v[0]?.[1] === "−1"
          ? "Pair each angle with cos θ."
          : "Pair each angle with sin θ.";
      return matchPuzzle(m, difficulty, prompt, v);
    }
    case "trigRatioFinder": {
      const opp = rand(3, 8), hyp = opp + rand(2, 6);
      const ratio = +(opp / hyp).toFixed(2);
      return numpadEng(m, difficulty, `Right triangle: opposite ${opp}, hypotenuse ${hyp}. sin θ?`, { kind: "icon", icon: m.emoji, title: `${opp}/${hyp}`, subtitle: "sin θ" },
        ratio, "sin θ = opp/hyp.", ["Identify opp and hyp.", `${opp}/${hyp}`], `sin θ = ${opp}/${hyp} ≈ ${ratio}.`);
    }
    case "sineWave": {
      const target = +(rand(1, 5)).toFixed(0);
      return sliderEng(m, difficulty, `Slide the amplitude to match A = ${target}.`, { min: 0, max: 10, step: 1, initial: 1, target }, `Amplitude ${target}`,
        "Stop the slider on the target value.", ["A controls vertical stretch.", "Aim for the exact integer."], `Amplitude target was ${target}.`);
    }
    case "sinCosWave": {
      const target = +(rand(1, 5)).toFixed(0);
      return sliderEng(m, difficulty, `Tune the phase shift to ${target}.`, { min: 0, max: 6, step: 1, initial: 0, target }, `Phase shift ${target}`,
        "Slide to the labeled shift.", ["Each step is 1 unit.", "Stop at the exact value."], `Phase target was ${target}.`);
    }
    case "referenceAngle": {
      const ang = pick([120, 135, 150, 210, 225, 300]);
      const ref = ang > 180 ? Math.abs(ang - (ang > 270 ? 360 : 180)) : 180 - ang;
      const correctRef = ang === 120 ? 60 : ang === 135 ? 45 : ang === 150 ? 30 : ang === 210 ? 30 : ang === 225 ? 45 : 60;
      return numpadEng(m, difficulty, `Reference angle of ${ang}°?`, { kind: "icon", icon: m.emoji, title: `${ang}°`, subtitle: "Closest x-axis angle" },
        correctRef, "Use the closest x-axis distance.", [`Find quadrant first.`, "Subtract to nearest 180° or 360°."], `Reference angle = ${correctRef}°.`);
    }
    case "trigIdentity": {
      const banks: [string, string][][] = [
        [["sin²θ + cos²θ", "1"], ["1 + tan²θ", "sec²θ"], ["1 + cot²θ", "csc²θ"], ["sin(2θ)", "2 sinθ cosθ"], ["cos(2θ)", "cos²θ − sin²θ"]],
        [["sin(A+B)", "sinA cosB + cosA sinB"], ["cos(A+B)", "cosA cosB − sinA sinB"], ["sin(A−B)", "sinA cosB − cosA sinB"], ["cos(A−B)", "cosA cosB + sinA sinB"]],
        [["1 − cos(2θ)", "2 sin²θ"], ["1 + cos(2θ)", "2 cos²θ"], ["tan(2θ)", "2 tanθ / (1 − tan²θ)"], ["sin²θ", "(1 − cos 2θ)/2"]],
        [["sec θ", "1/cosθ"], ["csc θ", "1/sinθ"], ["tan θ", "sinθ/cosθ"], ["cot θ", "cosθ/sinθ"]],
      ];
      return matchPuzzle(m, difficulty, "Pair each identity with its equivalent expression.", pick(banks));
    }
    case "inverseTrig": {
      const cases = [
        { q: "arcsin(1/2)", v: 30, fn: "sin⁻¹(1/2)" },
        { q: "arcsin(√3/2)", v: 60, fn: "sin⁻¹(√3/2)" },
        { q: "arcsin(√2/2)", v: 45, fn: "sin⁻¹(√2/2)" },
        { q: "arcsin(0)", v: 0, fn: "sin⁻¹(0)" },
        { q: "arcsin(1)", v: 90, fn: "sin⁻¹(1)" },
        { q: "arccos(1)", v: 0, fn: "cos⁻¹(1)" },
        { q: "arccos(1/2)", v: 60, fn: "cos⁻¹(1/2)" },
        { q: "arccos(0)", v: 90, fn: "cos⁻¹(0)" },
        { q: "arccos(√3/2)", v: 30, fn: "cos⁻¹(√3/2)" },
        { q: "arctan(1)", v: 45, fn: "tan⁻¹(1)" },
        { q: "arctan(√3)", v: 60, fn: "tan⁻¹(√3)" },
        { q: "arctan(1/√3)", v: 30, fn: "tan⁻¹(1/√3)" },
      ];
      const c = pick(cases);
      return numpadEng(m, difficulty, `${c.q} in degrees?`, { kind: "icon", icon: m.emoji, title: c.fn, subtitle: "Principal value" },
        c.v, "Match the special-angle table.", ["Principal range matters.", "Use 30/45/60 reference values."], `${c.q} = ${c.v}°.`);
    }
    case "radianDegree": {
      const ang = pick([30, 45, 60, 90, 180]);
      const rad = +((ang * Math.PI) / 180).toFixed(2);
      return numpadEng(m, difficulty, `${ang}° in radians (2 decimals)?`, { kind: "icon", icon: m.emoji, title: `${ang}°`, subtitle: "× π/180" },
        rad, "Multiply degrees by π/180.", ["Use π ≈ 3.14.", `${ang}·π/180.`], `${ang}·π/180 ≈ ${rad}.`);
    }
    case "lawOfSines": {
      const A = rand(30, 60), B = rand(30, 70); const a = rand(5, 12);
      const b = +((a * Math.sin((B * Math.PI) / 180)) / Math.sin((A * Math.PI) / 180)).toFixed(2);
      return makeChoice({ ...base(m, difficulty, "choice", `In a triangle, ∠A=${A}°, ∠B=${B}°, a=${a}. Find b.`, { kind: "icon", icon: m.emoji, title: `A=${A}°, B=${B}°`, subtitle: "Law of Sines" }),
        hint: "a/sin A = b/sin B.", hints: ["Cross-multiply.", `${a}·sin(${B})/sin(${A}).`], explanation: `b ≈ ${b}.` }, String(b), [(b + 1).toFixed(2), (b - 1).toFixed(2), String(a)]);
    }
    case "ferrisWheel": {
      const target = +(rand(2, 8)).toFixed(0);
      return sliderEng(m, difficulty, `Sinusoidal model peaks at h=${target} m. Slide the amplitude.`, { min: 0, max: 10, step: 1, initial: 1, target }, `Peak ${target} m`,
        "Amplitude = peak − midline.", ["Stop on the labeled peak.", "Match the exact integer."], `Amplitude target was ${target}.`);
    }
    case "harmonicMotion": {
      const target = +(rand(1, 6)).toFixed(0);
      return sliderEng(m, difficulty, `Tune the angular frequency ω to ${target}.`, { min: 0, max: 8, step: 1, initial: 0, target }, `ω = ${target}`,
        "Adjust until ω matches.", ["Frequency controls oscillation speed.", "Stop at the integer target."], `ω target was ${target}.`);
    }
    case "vectorNav": {
      const xa = rand(1, 6), ya = rand(1, 6), xb = rand(1, 6), yb = rand(1, 6);
      const ans = `(${xa + xb}, ${ya + yb})`;
      return makeChoice({ ...base(m, difficulty, "choice", `Add vectors (${xa},${ya}) + (${xb},${yb})?`, { kind: "coordinate", title: "Vector sum", subtitle: `Add components` }),
        hint: "Add component by component.", hints: [`x: ${xa}+${xb}.`, `y: ${ya}+${yb}.`], explanation: `Component sum: ${ans}.` }, ans, [`(${xa - xb}, ${ya - yb})`, `(${xa * xb}, ${ya * yb})`, `(${xa + xb}, ${ya - yb})`]);
    }
    case "matrixTransform": {
      const variants = [
        { ans: "Rotation by 90°", matrix: "[[0,-1],[1,0]]", distractors: ["Reflection over x-axis", "Scaling by 2", "Identity"], exp: "This matrix rotates points 90° counter-clockwise." },
        { ans: "Rotation by 180°", matrix: "[[-1,0],[0,-1]]", distractors: ["Identity", "Reflection over x-axis", "Scaling by −1 then rotation"], exp: "This matrix flips both axes — a 180° rotation." },
        { ans: "Reflection over x-axis", matrix: "[[1,0],[0,-1]]", distractors: ["Reflection over y-axis", "Rotation 180°", "Identity"], exp: "Negates y while keeping x — reflection across x-axis." },
        { ans: "Reflection over y-axis", matrix: "[[-1,0],[0,1]]", distractors: ["Reflection over x-axis", "Rotation 180°", "Identity"], exp: "Negates x while keeping y — reflection across y-axis." },
        { ans: "Identity", matrix: "[[1,0],[0,1]]", distractors: ["Rotation 90°", "Reflection over x-axis", "Zero map"], exp: "The identity matrix leaves every vector unchanged." },
        { ans: "Scale by 3 (uniform)", matrix: "[[3,0],[0,3]]", distractors: ["Rotation 90°", "Reflection", "Identity"], exp: "Diagonal entries scale x and y equally by 3." },
        { ans: "Horizontal shear (k=1)", matrix: "[[1,1],[0,1]]", distractors: ["Rotation", "Vertical shear", "Identity"], exp: "Upper-right entry shears x along y." },
        { ans: "Reflection over y=x", matrix: "[[0,1],[1,0]]", distractors: ["Rotation 90°", "Identity", "Reflection over x-axis"], exp: "Swapping rows/cols reflects across y=x." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", `Matrix ${v.matrix} represents which transformation?`, { kind: "icon", icon: "🔢", title: v.matrix, subtitle: "Standard matrices" }),
        hint: "Apply the matrix to (1,0) and (0,1).", hints: ["Trace where the basis vectors land.", "Identify rotation / reflection / scaling."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "matrixGrid": {
      const variants = [
        { ans: "[[2,0],[0,3]]", q: "Pick the matrix that stretches x by 2 and y by 3.", distractors: ["[[2,3],[0,0]]", "[[1,2],[3,1]]", "[[2,0],[3,0]]"], exp: "Diagonal matrix [[2,0],[0,3]] performs the stretch." },
        { ans: "[[5,0],[0,1]]", q: "Pick the matrix that stretches x by 5 only.", distractors: ["[[1,0],[0,5]]", "[[5,5],[0,0]]", "[[5,1],[0,1]]"], exp: "Diagonal [[5,0],[0,1]] stretches only the x-axis." },
        { ans: "[[1,0],[0,4]]", q: "Pick the matrix that stretches y by 4 only.", distractors: ["[[4,0],[0,1]]", "[[1,4],[0,4]]", "[[1,0],[4,0]]"], exp: "Diagonal [[1,0],[0,4]] stretches only the y-axis." },
        { ans: "[[−1,0],[0,1]]", q: "Pick the matrix that reflects across the y-axis.", distractors: ["[[1,0],[0,−1]]", "[[0,1],[1,0]]", "[[−1,0],[0,−1]]"], exp: "Negating x reflects across the y-axis." },
        { ans: "[[1,1],[0,1]]", q: "Pick the matrix that shears x = x + y, y unchanged.", distractors: ["[[1,0],[1,1]]", "[[1,−1],[0,1]]", "[[2,0],[0,1]]"], exp: "Upper-right '1' adds y to x." },
        { ans: "[[3,0],[0,3]]", q: "Pick the matrix that scales uniformly by 3.", distractors: ["[[3,3],[3,3]]", "[[3,0],[3,0]]", "[[1,3],[3,1]]"], exp: "Uniform scaling matrix has identical diagonal entries." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", v.q, { kind: "icon", icon: m.emoji, title: "Matrix transform", subtitle: "Diagonal/shear" }),
        hint: "Trace where (1,0) and (0,1) go.", hints: ["Stretches go on the diagonal.", "Shears are on off-diagonals."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "dotProduct": {
      const xa = rand(1, 6), ya = rand(1, 6), xb = rand(1, 6), yb = rand(1, 6);
      const ans = xa * xb + ya * yb;
      return numpadEng(m, difficulty, `Dot product (${xa},${ya})·(${xb},${yb})?`, { kind: "icon", icon: m.emoji, title: "Vector dot", subtitle: "x·x + y·y" },
        ans, "Pairwise multiply, then add.", [`x·x = ${xa * xb}.`, `y·y = ${ya * yb}.`], `${xa}·${xb} + ${ya}·${yb} = ${ans}.`);
    }
    case "complexPlane": {
      const a = rand(1, 5), b = rand(1, 5);
      const ans = `${a}+${b}i`;
      return makeChoice({ ...base(m, difficulty, "choice", `Plot the point ${a}+${b}i. Which is it on the complex plane?`, { kind: "coordinate", title: `${a}+${b}i`, subtitle: "Real and imaginary axes" }),
        hint: "Real on x, imaginary on y.", hints: [`x=${a}.`, `y=${b}.`], explanation: `(${a}, ${b}) is ${a}+${b}i.` }, ans, [`(${b},${a})`, `${b}+${a}i`, `${a}−${b}i`]);
    }
    case "quadraticLauncher": {
      const a = rand(1, 3), h = rand(1, 5), k = rand(1, 9);
      const ans = `y = ${a}(x − ${h})² + ${k}`;
      return makeChoice({ ...base(m, difficulty, "choice", `Vertex at (${h}, ${k}), opens up with a=${a}. Pick the equation.`, { kind: "icon", icon: m.emoji, title: `Vertex (${h},${k})`, subtitle: "Vertex form" }),
        hint: "Vertex form: y = a(x − h)² + k.", hints: ["h is shifted x.", "k is shifted y."], explanation: ans } , ans, [`y = ${a}(x + ${h})² + ${k}`, `y = ${a}(x − ${h})² − ${k}`, `y = ${a + 1}(x − ${h})² + ${k}`]);
    }
    case "parabolaMatch": {
      const banks: [string, string][][] = [
        [["Vertex form", "y = a(x−h)² + k"], ["Standard form", "y = ax² + bx + c"], ["Axis of symmetry", "x = −b/(2a)"], ["Focus (vertex at origin, opens up)", "(0, 1/(4a))"]],
        [["Roots (a, b)", "Sum = −b/a, Product = c/a"], ["Vertex x", "x = −b/(2a)"], ["Vertex y", "Substitute x into the equation"], ["Discriminant", "b² − 4ac"]],
        [["Opens up", "a > 0"], ["Opens down", "a < 0"], ["Narrow vs. wide", "|a| larger → narrower"], ["Roots distinct", "Δ > 0"]],
      ];
      return matchPuzzle(m, difficulty, "Pair each parabola feature with its formula or condition.", pick(banks));
    }
    case "factoringTiles": {
      const r1 = rand(1, 4), r2 = rand(1, 4);
      const b = r1 + r2, c = r1 * r2;
      const ans = `(x + ${r1})(x + ${r2})`;
      return dragEng(m, difficulty, `Factor x² + ${b}x + ${c}.`, ans, [`(x + ${r1 + 1})(x + ${r2})`, `(x − ${r1})(x − ${r2})`, `(x + ${r1})(x − ${r2})`],
        "Factored form", "Find numbers that multiply to c and sum to b.", [`Product: ${c}.`, `Sum: ${b}.`], `x² + ${b}x + ${c} = ${ans}.`);
    }
    case "polynomialPuzzle": {
      const a = rand(1, 3), b = rand(2, 6), c = rand(2, 6);
      const ans = `${a}x³ + ${a * b}x² + ${a * c}x`;
      const distractors = [`${a}x² + ${b}x + ${c}`, `${a + 1}x³ + ${b}x² + ${c}x`, `${a}x³ + ${b}x² + ${c}`];
      return makeChoice({ ...base(m, difficulty, "choice", `Factor ${ans} completely.`, { kind: "icon", icon: m.emoji, title: ans, subtitle: "Common factor" }),
        hint: "Pull out greatest common factor.", hints: [`GCF includes x.`, `Pull out ${a}x.`], explanation: `${ans} = ${a}x(x² + ${b}x + ${c}).` }, `${a}x(x² + ${b}x + ${c})`, distractors);
    }
    case "polynomialRoots": {
      const r1 = rand(1, 5), r2 = -rand(1, 5);
      const ans = `x = ${r1} or x = ${r2}`;
      const b = -(r1 + r2), c = r1 * r2;
      return makeChoice({ ...base(m, difficulty, "choice", `Solve x² ${b >= 0 ? "+ " + b : "− " + Math.abs(b)}x ${c >= 0 ? "+ " + c : "− " + Math.abs(c)} = 0.`, { kind: "icon", icon: m.emoji, title: "Find the roots", subtitle: "Quadratic" }),
        hint: "Factor the quadratic.", hints: ["Roots sum to −b/a.", "Roots multiply to c/a."], explanation: ans }, ans, [`x = ${-r1} or x = ${-r2}`, `x = ${r1} only`, `No real roots`]);
    }
    case "syntheticDivision": {
      const k = rand(2, 5); const ans = `x² + 0x + ${k * k}`;
      return makeChoice({ ...base(m, difficulty, "choice", `Divide x³ − ${k * k * k} by (x − ${k}). Quotient?`, { kind: "icon", icon: m.emoji, title: `(x³ − ${k * k * k}) ÷ (x − ${k})`, subtitle: "Synthetic" }),
        hint: "Use synthetic division with root k.", hints: [`Bring down 1.`, `Coefficients: 1, ${k}, ${k * k}.`], explanation: `Quotient: x² + ${k}x + ${k * k}, remainder 0.` }, `x² + ${k}x + ${k * k}`, [`x² − ${k}x + ${k * k}`, `x² + ${k}x − ${k * k}`, ans]);
    }
    case "rationalMatch": {
      const banks: [string, string][][] = [
        [["1/x", "Vertical asymptote at 0"], ["1/(x−2)", "Vertical asymptote at 2"], ["(x²−1)/(x−1)", "Hole at x=1"], ["1/(x²+1)", "No real asymptote"], ["x/(x²−9)", "VA at x = ±3"]],
        [["(x−2)/(x−2)", "Hole at x=2"], ["(x+3)/((x+3)(x−1))", "Hole at x=−3; VA at x=1"], ["x/(x−5)", "VA at x=5"], ["1/(x²)", "Both-side asymptote at 0"]],
        [["Horizontal asymptote y=0", "Degree numerator < denominator"], ["Horizontal asymptote y=a/b", "Equal degrees, leading-coeff ratio"], ["Slant asymptote", "Degree numerator = denominator + 1"], ["No HA", "Numerator degree > denominator + 1"]],
      ];
      return matchPuzzle(m, difficulty, "Pair each rational function with its key feature.", pick(banks));
    }
    case "radicalSimplify": {
      const k = pick([2, 3, 5, 7]); const sq = k * k;
      const ans = `${k}√2`;
      return makeChoice({ ...base(m, difficulty, "choice", `Simplify √${sq * 2}.`, { kind: "icon", icon: m.emoji, title: `√${sq * 2}`, subtitle: "Factor perfect squares" }),
        hint: "Pull out perfect squares.", hints: [`${sq * 2} = ${sq}·2.`, `√${sq} = ${k}.`], explanation: `√${sq * 2} = ${k}√2.` }, ans, [`${k * 2}`, `${k}√${k}`, `√${k}·2`]);
    }
    case "asymptoteHunt": {
      const k = rand(1, 5);
      const ans = `x = ${k}`;
      return makeChoice({ ...base(m, difficulty, "choice", `Vertical asymptote of f(x) = 1/(x − ${k})?`, { kind: "icon", icon: m.emoji, title: `1/(x − ${k})`, subtitle: "Find VA" }),
        hint: "Denominator zero gives VA.", hints: [`Set x − ${k} = 0.`, "Solve."], explanation: `x = ${k} makes the denominator zero.` }, ans, [`x = ${-k}`, `y = ${k}`, `x = 0`]);
    }
    case "exponentialGrowth": {
      const a = rand(2, 5); const t = rand(2, 5);
      const ans = `y = ${a}·${a}^${t}`;
      return makeChoice({ ...base(m, difficulty, "choice", `Population doubles each year starting at ${a}. After ${t} years?`, { kind: "icon", icon: "📈", title: `Growth t=${t}`, subtitle: "Exponential" }),
        hint: "y = a·2^t.", hints: ["Use 2 since it doubles.", `${a}·2^${t}.`], explanation: `${a}·2^${t} = ${a * Math.pow(2, t)}.` }, String(a * Math.pow(2, t)), numberChoices(a * Math.pow(2, t)));
    }
    case "patternMachine": {
      const start = rand(2, 5), inc = rand(2, 5);
      const arr = [start, start + inc, start + 2 * inc, start + 3 * inc];
      const next = start + 4 * inc;
      return makeChoice({ ...base(m, difficulty, "choice", `Pattern: ${arr.join(", ")}, ?`, { kind: "icon", icon: m.emoji, title: arr.join(", "), subtitle: "Find the next term" }),
        hint: "Differences are constant.", hints: [`Δ = ${inc}.`, `Add ${inc}.`], explanation: `Arithmetic +${inc} → ${next}.` }, String(next), numberChoices(next));
    }
    case "sequenceBuilder": {
      const a1 = rand(1, 5), d = rand(2, 5);
      const ans = `aₙ = ${a1} + (n − 1)·${d}`;
      const distractors = [`aₙ = ${a1}·${d}^(n−1)`, `aₙ = ${d}n + ${a1}`, `aₙ = n + ${a1}`];
      return makeChoice({ ...base(m, difficulty, "choice", `Arithmetic: a₁=${a1}, d=${d}. Pick the formula.`, { kind: "icon", icon: m.emoji, title: `a₁=${a1}, d=${d}`, subtitle: "Explicit form" }),
        hint: "aₙ = a₁ + (n−1)d.", hints: ["d is the common difference.", "Plug into the template."], explanation: ans }, ans, distractors);
    }
    case "sequenceSum": {
      const a1 = rand(1, 5), d = rand(1, 4), n = rand(4, 8);
      const an = a1 + (n - 1) * d;
      const sum = (n * (a1 + an)) / 2;
      return numpadEng(m, difficulty, `Arithmetic sum: a₁=${a1}, d=${d}, n=${n}. Sₙ?`, { kind: "icon", icon: m.emoji, title: `Σ to n=${n}`, subtitle: "Arithmetic series" },
        sum, "Sₙ = n(a₁ + aₙ)/2.", [`aₙ = ${an}.`, `n·(${a1}+${an})/2.`], `Sₙ = ${n}(${a1}+${an})/2 = ${sum}.`);
    }
    case "limitExplorer": {
      const variants = [
        { q: "lim_(x→0) sin(x)/x", title: "sin x / x", ans: "1", distractors: ["0", "∞", "−1"], exp: "lim_{x→0} sin(x)/x = 1." },
        { q: "lim_(x→0) (1 − cos x)/x", title: "(1 − cos x) / x", ans: "0", distractors: ["1", "1/2", "∞"], exp: "lim_{x→0} (1 − cos x)/x = 0." },
        { q: "lim_(x→0) (1 − cos x)/x²", title: "(1 − cos x) / x²", ans: "1/2", distractors: ["0", "1", "∞"], exp: "lim_{x→0} (1 − cos x)/x² = 1/2." },
        { q: "lim_(x→∞) 1/x", title: "1 / x as x → ∞", ans: "0", distractors: ["1", "∞", "−1"], exp: "1/x shrinks to 0 as x → ∞." },
        { q: "lim_(x→∞) (1 + 1/x)^x", title: "(1 + 1/x)^x", ans: "e", distractors: ["1", "0", "∞"], exp: "This is the definition of e." },
        { q: "lim_(x→0⁺) ln(x)", title: "ln x as x → 0⁺", ans: "−∞", distractors: ["0", "∞", "1"], exp: "ln x heads to −∞ as x → 0⁺." },
        { q: "lim_(x→2) (x²−4)/(x−2)", title: "(x²−4)/(x−2)", ans: "4", distractors: ["0", "∞", "2"], exp: "Factor: (x−2)(x+2)/(x−2) → x+2 → 4." },
        { q: "lim_(x→0) tan(x)/x", title: "tan x / x", ans: "1", distractors: ["0", "∞", "1/2"], exp: "tan x / x → sin x / (x cos x) → 1." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", `${v.q} = ?`, { kind: "icon", icon: "∞", title: v.title, subtitle: "Evaluate the limit" }),
        hint: "Try direct substitution, then factor or use a known limit.", hints: ["Watch for 0/0 forms.", "Use squeeze, Taylor, or L'Hôpital."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "limitTable": {
      const banks: [string, string][][] = [
        [["lim x→0 sin x / x", "1"], ["lim x→∞ 1/x", "0"], ["lim x→0 (1−cos x)/x", "0"], ["lim x→∞ (1+1/x)^x", "e"]],
        [["lim x→0 tan x / x", "1"], ["lim x→0 (1−cos x)/x²", "1/2"], ["lim x→∞ ln x / x", "0"], ["lim x→∞ x e^(−x)", "0"]],
        [["lim x→0⁺ x ln x", "0"], ["lim x→0 (e^x − 1)/x", "1"], ["lim x→∞ x^(1/x)", "1"], ["lim x→0⁺ x^x", "1"]],
        [["lim x→2 (x²−4)/(x−2)", "4"], ["lim x→1 (x³−1)/(x−1)", "3"], ["lim x→0 sin(2x)/x", "2"], ["lim x→0 sin(kx)/x", "k"]],
      ];
      return matchPuzzle(m, difficulty, "Pair each limit with its value.", pick(banks));
    }
    case "continuityRepair": {
      const variants = [
        { f: "(x²−1)/(x−1) at x=1", ans: "Removable discontinuity", distractors: ["Jump discontinuity", "Vertical asymptote", "Infinite oscillation"], exp: "Factor: (x−1)(x+1)/(x−1) cancels → hole at x=1." },
        { f: "1/(x−2) at x=2", ans: "Vertical asymptote", distractors: ["Removable discontinuity", "Jump discontinuity", "Continuous"], exp: "Denominator zero with no cancellation → vertical asymptote." },
        { f: "floor(x) at x=3", ans: "Jump discontinuity", distractors: ["Continuous", "Removable", "Vertical asymptote"], exp: "Left and right limits differ → jump." },
        { f: "sin(1/x) at x=0", ans: "Infinite oscillation", distractors: ["Removable", "Vertical asymptote", "Jump"], exp: "sin(1/x) oscillates without a limit at x=0." },
        { f: "(x²−4)/(x−2) at x=2", ans: "Removable discontinuity", distractors: ["Continuous", "Vertical asymptote", "Jump"], exp: "Factor cancels → removable hole at x=2." },
        { f: "|x|/x at x=0", ans: "Jump discontinuity", distractors: ["Removable", "Continuous", "Vertical asymptote"], exp: "Left limit −1, right limit +1 → jump of 2." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", `What kind of discontinuity does ${v.f} have?`, { kind: "icon", icon: m.emoji, title: v.f, subtitle: "Classify continuity" }),
        hint: "Compare one-sided limits and the value.", hints: ["Limits equal but value undefined → removable.", "Limits differ → jump.", "Limit infinite → asymptote."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "derivativeRule": {
      const banks: [string, string][][] = [
        [["Power", "d/dx x³ = 3x²"], ["Product", "d/dx (uv) = u'v + uv'"], ["Quotient", "d/dx (u/v) = (u'v − uv')/v²"], ["Chain", "d/dx f(g(x)) = f'(g)·g'"]],
        [["d/dx sin x", "cos x"], ["d/dx cos x", "−sin x"], ["d/dx tan x", "sec²x"], ["d/dx eˣ", "eˣ"], ["d/dx ln x", "1/x"]],
        [["d/dx x⁵", "5x⁴"], ["d/dx (1/x)", "−1/x²"], ["d/dx √x", "1/(2√x)"], ["d/dx 1", "0"]],
        [["d/dx aˣ", "aˣ ln a"], ["d/dx logₐ x", "1/(x ln a)"], ["d/dx arctan x", "1/(1+x²)"], ["d/dx arcsin x", "1/√(1−x²)"]],
        [["d/dx (x² sin x)", "2x sin x + x² cos x"], ["d/dx (x/cos x)", "(cos x + x sin x)/cos²x"], ["d/dx (e^(2x))", "2 e^(2x)"], ["d/dx ln(x²+1)", "2x/(x²+1)"]],
      ];
      return matchPuzzle(m, difficulty, "Pair each derivative with its result or rule.", pick(banks));
    }
    case "chainRule": {
      const variants = [
        { ans: "6x·cos(3x² + 1)", q: "d/dx sin(3x² + 1) = ?", outer: "sin(3x²+1)", distractors: ["cos(3x² + 1)", "sin(6x)", "6x"], exp: "cos(3x²+1)·6x = 6x·cos(3x²+1)." },
        { ans: "2(x²+1)·2x", q: "d/dx (x² + 1)² = ?", outer: "(x²+1)²", distractors: ["2x", "2(x²+1)", "(x²+1)²·2x"], exp: "2(x²+1) · 2x = 4x(x²+1)." },
        { ans: "−sin(2x)·2", q: "d/dx cos(2x) = ?", outer: "cos(2x)", distractors: ["−sin(2x)", "cos(2x)·2", "sin(2x)·2"], exp: "Chain rule: −sin(2x) · 2 = −2 sin(2x)." },
        { ans: "3x²·e^(x³)", q: "d/dx e^(x³) = ?", outer: "e^(x³)", distractors: ["e^(x³)", "e^(3x²)", "3x² e^x"], exp: "e^(x³) · d(x³)/dx = e^(x³) · 3x²." },
        { ans: "1/(x ln 10)", q: "d/dx log₁₀(x) = ?", outer: "log₁₀ x", distractors: ["1/x", "1/x²", "ln 10 / x"], exp: "d/dx logₐ x = 1/(x ln a)." },
        { ans: "10x(x²+3)⁴", q: "d/dx (x²+3)⁵ = ?", outer: "(x²+3)⁵", distractors: ["5(x²+3)⁴", "10(x²+3)⁴", "5x²(x²+3)⁴"], exp: "5(x²+3)⁴ · 2x = 10x(x²+3)⁴." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", v.q, { kind: "icon", icon: m.emoji, title: v.outer, subtitle: "Apply chain rule" }),
        hint: "Outer derivative × inner derivative.", hints: ["Identify outer and inner functions.", "Multiply outer'(inner) by inner'."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "productQuotient": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each derivative form into product or quotient rule.",
          categories: ["Product rule", "Quotient rule"],
          items: [
            { label: "d/dx (x sin x)", category: "Product rule" }, { label: "d/dx (x²·eˣ)", category: "Product rule" }, { label: "d/dx (x² ln x)", category: "Product rule" },
            { label: "d/dx (sin x / x)", category: "Quotient rule" }, { label: "d/dx (1/x²)", category: "Quotient rule" }, { label: "d/dx ((x+1)/(x−1))", category: "Quotient rule" },
          ],
          hint: "Multiplication = product; division = quotient.",
          hints: ["Look at the operator.", "Then pick the matching rule."],
          explanation: "Multiply → product; divide → quotient.",
        },
        {
          prompt: "Classify each derivative form by required rule.",
          categories: ["Power", "Product", "Quotient", "Chain"],
          items: [
            { label: "d/dx x⁴", category: "Power" }, { label: "d/dx x⁻²", category: "Power" },
            { label: "d/dx (x e^x)", category: "Product" }, { label: "d/dx (x ln x)", category: "Product" },
            { label: "d/dx (sin x / x²)", category: "Quotient" }, { label: "d/dx (ln x / x)", category: "Quotient" },
            { label: "d/dx sin(2x)", category: "Chain" }, { label: "d/dx (x²+1)⁵", category: "Chain" }, { label: "d/dx e^(x²)", category: "Chain" },
          ],
          hint: "Operator and composition pick the rule.",
          hints: ["Pure power → power rule.", "Composition → chain rule."],
          explanation: "Each form has a single canonical rule.",
        },
      ]);
    }
    case "criticalPoint": {
      const variants = [
        { f: "f(x) = x² − 4x", deriv: "f'(x) = 2x − 4", ans: "x = 2", distractors: ["x = 0", "x = 4", "x = −2"], exp: "Set 2x − 4 = 0 → x = 2." },
        { f: "f(x) = x³ − 12x", deriv: "f'(x) = 3x² − 12", ans: "x = ±2", distractors: ["x = 0", "x = ±4", "x = ±√3"], exp: "3x² − 12 = 0 → x² = 4 → x = ±2." },
        { f: "f(x) = x² − 6x + 5", deriv: "f'(x) = 2x − 6", ans: "x = 3", distractors: ["x = 5", "x = 1", "x = −3"], exp: "2x − 6 = 0 → x = 3." },
        { f: "f(x) = x³ − 3x² + 4", deriv: "f'(x) = 3x² − 6x", ans: "x = 0 or x = 2", distractors: ["x = 0 only", "x = 2 only", "x = 1"], exp: "3x(x − 2) = 0 → x = 0, 2." },
        { f: "f(x) = ½x² − 5x", deriv: "f'(x) = x − 5", ans: "x = 5", distractors: ["x = 0", "x = 10", "x = −5"], exp: "x − 5 = 0 → x = 5." },
        { f: "f(x) = x⁴ − 4x², ", deriv: "f'(x) = 4x³ − 8x", ans: "x = 0 or x = ±√2", distractors: ["x = 0 only", "x = ±2", "x = ±1"], exp: "4x(x²−2) = 0 → x = 0, ±√2." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", `${v.f}. Critical point(s) at x = ?`, { kind: "icon", icon: m.emoji, title: v.deriv, subtitle: "Set derivative to zero" }),
        hint: "Set f'(x) = 0 and solve.", hints: [`${v.deriv}.`, "Factor or use the quadratic formula."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "curveSketch": {
      const banks: string[][] = [
        ["Find critical points", "Test second derivative", "Identify inflection", "Sketch endpoints", "Connect smoothly"],
        ["Find domain", "Find intercepts", "Find asymptotes", "Find critical points", "Identify concavity", "Sketch curve"],
        ["Compute f'(x)", "Solve f'(x) = 0", "Check sign of f'", "Compute f''(x)", "Identify min/max", "Sketch"],
        ["Identify symmetry", "Find limits at ±∞", "Locate asymptotes", "Find critical & inflection points", "Build sign chart", "Draw"],
      ];
      const stops = pick(banks);
      return pathEng(m, difficulty, "Trace the steps of curve sketching.", stops, "Move from analysis to picture.", ["Find criticals first.", "Then concavity."], "Curve-sketch path varies by what's tested.");
    }
    case "tangentLine": {
      const target = +(rand(1, 6)).toFixed(0);
      return sliderEng(m, difficulty, `Slope of tangent should equal ${target}. Tune the slider.`, { min: 0, max: 10, step: 1, initial: 0, target }, `Target slope ${target}`,
        "Find f'(x) and match.", ["Slope = f'(a).", "Stop on the integer."], `Target slope was ${target}.`);
    }
    case "optimization": {
      const variants = [
        { q: "Fixed perimeter 20. Which rectangle maximizes area?", ans: "Square with side 5", distractors: ["Long thin rectangle 1×9", "Rectangle 2×8", "Rectangle 3×7"], exp: "Square maximizes area for fixed perimeter; side = P/4 = 5." },
        { q: "Fixed area 36. Which rectangle minimizes perimeter?", ans: "Square with side 6", distractors: ["Rectangle 1×36", "Rectangle 2×18", "Rectangle 4×9"], exp: "Square minimizes perimeter for fixed area; side = √36 = 6." },
        { q: "Open box from 12×12 sheet by cutting squares. Maximizing volume cuts side x = ?", ans: "x = 2", distractors: ["x = 1", "x = 3", "x = 4"], exp: "V(x) = x(12−2x)²; V'(x) = 0 → x = 2." },
        { q: "Inscribe a rectangle in a semicircle of radius 5 with one side on the diameter. Max area at width = ?", ans: "Width 5√2 (≈ 7.07)", distractors: ["Width 5", "Width 10", "Width 3"], exp: "Maximize A = 2x·√(25 − x²); x = 5/√2 → width = 2x." },
        { q: "Minimize the sum of x + 1/x for x > 0. Minimum at x = ?", ans: "x = 1", distractors: ["x = 0", "x = 2", "x = 1/2"], exp: "Derivative 1 − 1/x² = 0 → x = 1; min value = 2." },
        { q: "Cylinder with surface area 6π. Maximize volume at radius = ?", ans: "r = 1", distractors: ["r = 2", "r = 1/2", "r = √3"], exp: "Solving the area constraint and maximizing yields r = 1, h = 2." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", v.q, { kind: "icon", icon: m.emoji, title: "Optimization", subtitle: "Use calculus" }),
        hint: "Set the derivative of the objective to zero.", hints: ["Define variables and constraint.", "Differentiate, set to zero, verify max/min."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "relatedRates": {
      const variants = [
        { ans: "dV/dt = 4πr²·dr/dt", q: "Sphere expands. Relate dV/dt to dr/dt.", title: "V = (4/3)πr³", distractors: ["dV/dt = πr²·dr/dt", "dV/dt = 2πr·dr/dt", "dV/dt = dr/dt"], exp: "Differentiate V = (4/3)πr³ → dV/dt = 4πr² · dr/dt." },
        { ans: "dA/dt = 2πr·dr/dt", q: "Circle's radius grows. Relate dA/dt to dr/dt.", title: "A = πr²", distractors: ["dA/dt = πr·dr/dt", "dA/dt = 4πr²·dr/dt", "dA/dt = dr/dt"], exp: "A = πr² → dA/dt = 2πr · dr/dt." },
        { ans: "dV/dt = πr²·dh/dt", q: "Cylinder of fixed radius fills with water. Relate dV/dt to dh/dt.", title: "V = πr²h, r fixed", distractors: ["dV/dt = 2πrh·dh/dt", "dV/dt = πrh²·dh/dt", "dV/dt = dh/dt"], exp: "V = πr²h with r constant → dV/dt = πr² · dh/dt." },
        { ans: "dA/dt = s·ds/dt", q: "Square's side grows. Relate dA/dt to ds/dt.", title: "A = s²", distractors: ["dA/dt = 2s²·ds/dt", "dA/dt = s²·ds/dt", "dA/dt = 4·ds/dt"], exp: "A = s² → dA/dt = 2s · ds/dt; '×s' here is shorthand." },
        { ans: "dd/dt = (x·dx/dt + y·dy/dt)/d", q: "Two cars meet at a corner. Relate dd/dt of distance to dx/dt and dy/dt.", title: "d² = x² + y²", distractors: ["dd/dt = dx/dt + dy/dt", "dd/dt = dx/dt · dy/dt", "dd/dt = (dx/dt + dy/dt)/2"], exp: "Differentiate x² + y² = d² implicitly and solve for dd/dt." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", v.q, { kind: "icon", icon: "🔁", title: v.title, subtitle: "Differentiate w.r.t. t" }),
        hint: "Differentiate both sides implicitly with respect to t.", hints: ["Use the chain rule.", "Multiply by dr/dt or ds/dt as appropriate."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "integralArea": {
      const a = rand(1, 4), b = a + rand(2, 5);
      const ans = (b * b * b - a * a * a) / 3;
      return dragEng(m, difficulty, `∫ x² dx from ${a} to ${b}. Drop the value.`, String(ans), [String(b - a), String(b * b - a * a), String((b - a) ** 3)],
        `∫_${a}^${b} x²dx`, "Use the power rule.", ["F(x) = x³/3.", `F(${b}) − F(${a}).`], `(${b}³ − ${a}³)/3 = ${ans}.`);
    }
    case "integralMatch": {
      const banks: [string, string][][] = [
        [["x²", "x³/3"], ["1/x", "ln|x|"], ["cos x", "sin x"], ["eˣ", "eˣ"], ["1", "x"]],
        [["x³", "x⁴/4"], ["x⁻¹/²", "2√x"], ["sin x", "−cos x"], ["sec²x", "tan x"], ["2x", "x²"]],
        [["1/(1+x²)", "arctan x"], ["1/√(1−x²)", "arcsin x"], ["e^(2x)", "e^(2x)/2"], ["sec x tan x", "sec x"], ["csc²x", "−cot x"]],
        [["sin(2x)", "−cos(2x)/2"], ["cos(3x)", "sin(3x)/3"], ["e^(−x)", "−e^(−x)"], ["1/(2x)", "(1/2) ln|x|"]],
      ];
      return matchPuzzle(m, difficulty, "Pair each integrand with its antiderivative.", pick(banks));
    }
    case "riemannSum": {
      const target = +(rand(2, 8)).toFixed(0);
      return sliderEng(m, difficulty, `Increase N (rectangles) to reach approximate area ${target}.`, { min: 1, max: 10, step: 1, initial: 2, target }, `N ≈ ${target}`,
        "More rectangles → tighter estimate.", ["Tap to add more partitions.", "Stop on the labeled N."], `Target N was ${target}.`);
    }
    case "accumulation": {
      const variants = [
        { ans: "F(x) = x² / 2", q: "F(x) = ∫₀ˣ t dt. Find F(x).", distractors: ["F(x) = x", "F(x) = x³/3", "F(x) = 2x"], exp: "Antiderivative of t is t²/2; evaluated from 0 to x." },
        { ans: "F(x) = x³ / 3", q: "F(x) = ∫₀ˣ t² dt. Find F(x).", distractors: ["F(x) = x²/2", "F(x) = 3x²", "F(x) = x"], exp: "Antiderivative of t² is t³/3." },
        { ans: "F(x) = sin x", q: "F(x) = ∫₀ˣ cos t dt. Find F(x).", distractors: ["F(x) = cos x", "F(x) = −cos x", "F(x) = sin x − 1"], exp: "Antiderivative of cos t is sin t; sin 0 = 0." },
        { ans: "F(x) = eˣ − 1", q: "F(x) = ∫₀ˣ eᵗ dt. Find F(x).", distractors: ["F(x) = eˣ", "F(x) = e^(x²)", "F(x) = e^x · x"], exp: "Antiderivative of eᵗ is eᵗ; eˣ − e⁰ = eˣ − 1." },
        { ans: "F(x) = ln|x|", q: "F(x) = ∫₁ˣ (1/t) dt. Find F(x).", distractors: ["F(x) = 1/x", "F(x) = −1/x", "F(x) = ln x + 1"], exp: "Antiderivative of 1/t is ln|t|; ln|x| − ln 1 = ln|x|." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", v.q, { kind: "icon", icon: m.emoji, title: "Accumulation function", subtitle: "Apply FTC" }),
        hint: "Use the Fundamental Theorem.", hints: ["Find an antiderivative.", "Evaluate at the upper and lower bounds."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "differentialFlow": {
      const variants = [
        { ans: "y = Ce^(2x)", q: "Solve dy/dx = 2y.", title: "dy/dx = 2y", distractors: ["y = 2x", "y = e^(x/2) + C", "y = sin(2x)"], exp: "Separable: dy/y = 2 dx → ln|y| = 2x + C → y = Ce^(2x)." },
        { ans: "y = Ce^(−x)", q: "Solve dy/dx = −y.", title: "dy/dx = −y", distractors: ["y = −x + C", "y = e^x + C", "y = Cx"], exp: "Separable: dy/y = −dx → ln|y| = −x + C → y = Ce^(−x)." },
        { ans: "y = x²/2 + C", q: "Solve dy/dx = x.", title: "dy/dx = x", distractors: ["y = x + C", "y = x² + C", "y = e^x + C"], exp: "Direct integration of x." },
        { ans: "y = Ce^(kx)", q: "Solve dy/dx = ky for constant k.", title: "dy/dx = ky", distractors: ["y = kx + C", "y = Cx^k", "y = sin(kx)"], exp: "Separable: dy/y = k dx → y = Ce^(kx)." },
        { ans: "y = (x² + 1) · C", q: "Solve dy/dx = (2x/(x²+1)) · y.", title: "Variable separable", distractors: ["y = x² + C", "y = C / (x² + 1)", "y = e^(x²+1) + C"], exp: "Separate: dy/y = 2x/(x²+1) dx → ln|y| = ln|x²+1| + C → y = C(x²+1)." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", v.q, { kind: "icon", icon: m.emoji, title: v.title, subtitle: "Separable ODE" }),
        hint: "Separate variables and integrate.", hints: ["Get dy/g(y) = h(x) dx.", "Integrate both sides."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "parametric": {
      const variants = [
        { ans: "x² + y² = 1", q: "Parametric: x = cos t, y = sin t. Cartesian?", title: "x = cos t, y = sin t", distractors: ["y = x²", "x² − y² = 1", "y = sin x"], exp: "Use sin² + cos² = 1." },
        { ans: "y = x²", q: "Parametric: x = t, y = t². Cartesian?", title: "x = t, y = t²", distractors: ["y = x", "y = 2x", "y² = x"], exp: "Substitute t = x." },
        { ans: "y = √x (x ≥ 0)", q: "Parametric: x = t², y = t. Cartesian?", title: "x = t², y = t", distractors: ["y = x²", "y = x", "y² = x²"], exp: "From x = t², t = √x; so y = √x." },
        { ans: "x²/9 + y²/4 = 1", q: "Parametric: x = 3 cos t, y = 2 sin t. Cartesian?", title: "x = 3 cos t, y = 2 sin t", distractors: ["x² + y² = 1", "x²/4 + y²/9 = 1", "y = (2/3) x"], exp: "Divide and use sin² + cos² = 1." },
        { ans: "y = 2x + 1", q: "Parametric: x = t, y = 2t + 1. Cartesian?", title: "x = t, y = 2t + 1", distractors: ["y = 2x", "y = x + 1", "y = x² + 1"], exp: "Substitute t = x." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", v.q, { kind: "icon", icon: m.emoji, title: v.title, subtitle: "Eliminate the parameter" }),
        hint: "Express t in terms of x, or use identities.", hints: ["Trig identity sin² + cos² = 1.", "Direct substitution when possible."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "parametricMotion": {
      const banks: string[][] = [
        ["Set t = 0", "Compute x(t), y(t)", "Plot point", "Increment t", "Connect path"],
        ["Decide parameter range", "Sample t-values", "Compute (x, y) at each", "Plot and label", "Indicate direction of motion"],
        ["Identify x(t), y(t)", "Compute velocity (x', y')", "Compute speed = √(x'² + y'²)", "Plot trajectory", "Mark velocity vectors"],
        ["Tabulate t, x, y", "Plot the points", "Sketch the path", "Add direction arrow", "Note start/end points"],
      ];
      const stops = pick(banks);
      return pathEng(m, difficulty, "Trace parametric motion step by step.", stops, "Move through t-values in order.", ["Each t gives one point.", "Connect smoothly."], "Parametric plotting flow varies by emphasis.");
    }
    case "polarMatch": {
      const banks: [string, string][][] = [
        [["r = a", "Circle at origin"], ["r = a cos θ", "Circle off-origin"], ["r = a + b cos θ", "Limaçon"], ["r = a θ", "Spiral"]],
        [["r = a sin(nθ)", "Rose with n or 2n petals"], ["r² = a² cos(2θ)", "Lemniscate"], ["r = a(1 − cos θ)", "Cardioid"], ["r = a sec θ", "Vertical line"]],
        [["θ = α", "Ray through origin"], ["r = a/(1 − cos θ)", "Parabola"], ["r = a/(1 − e cos θ)", "Conic with eccentricity e"], ["r = a + a cos θ", "Cardioid"]],
      ];
      return matchPuzzle(m, difficulty, "Pair each polar equation with its shape.", pick(banks));
    }
    case "conicMatch": {
      const banks: [string, string][][] = [
        [["Circle", "x² + y² = r²"], ["Ellipse", "x²/a² + y²/b² = 1"], ["Parabola", "y = ax² + bx + c"], ["Hyperbola", "x²/a² − y²/b² = 1"]],
        [["Circle (origin)", "x² + y² = 25"], ["Ellipse", "x²/16 + y²/9 = 1"], ["Parabola (vertical)", "y² = 8x"], ["Hyperbola (vertical)", "y²/4 − x²/9 = 1"]],
        [["Vertex form parabola", "y = a(x − h)² + k"], ["Standard ellipse", "(x−h)²/a² + (y−k)²/b² = 1"], ["Standard hyperbola", "(x−h)²/a² − (y−k)²/b² = 1"], ["Standard circle", "(x−h)² + (y−k)² = r²"]],
      ];
      return matchPuzzle(m, difficulty, "Pair each conic with its equation form.", pick(banks));
    }
    case "conicSorter": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each equation into its conic.",
          categories: ["Ellipse", "Parabola", "Hyperbola"],
          items: [
            { label: "x²/4 + y²/9 = 1", category: "Ellipse" }, { label: "x²/16 + y² = 1", category: "Ellipse" }, { label: "x²/25 + y²/4 = 1", category: "Ellipse" },
            { label: "y = x²", category: "Parabola" }, { label: "y² = 8x", category: "Parabola" }, { label: "x = y² − 4", category: "Parabola" },
            { label: "x²/4 − y²/9 = 1", category: "Hyperbola" }, { label: "y² − x² = 1", category: "Hyperbola" }, { label: "x²/16 − y²/4 = 1", category: "Hyperbola" },
          ],
          hint: "Look at signs and squares.",
          hints: ["Ellipse: both positive squares = 1.", "Hyperbola: subtraction."],
          explanation: "Sign and degree decide the conic.",
        },
        {
          prompt: "Sort each conic by axis orientation.",
          categories: ["Horizontal", "Vertical"],
          items: [
            { label: "y = x²", category: "Vertical" }, { label: "(x−1)² = 4(y+2)", category: "Vertical" },
            { label: "x = y²", category: "Horizontal" }, { label: "y² = 4x", category: "Horizontal" },
            { label: "x²/9 + y²/4 = 1", category: "Horizontal" }, { label: "x²/4 + y²/9 = 1", category: "Vertical" },
            { label: "y²/9 − x²/4 = 1", category: "Vertical" }, { label: "x²/9 − y²/4 = 1", category: "Horizontal" },
          ],
          hint: "Compare which axis the major/transverse axis lies on.",
          hints: ["Larger denominator under x → horizontal.", "Square term ratio sets the axis."],
          explanation: "Standard forms encode orientation in the denominators.",
        },
      ]);
    }
    case "regressionModel": {
      const variants = [
        { data: "(1,2), (2,4), (3,6), (4,8)", title: "y = 2x", ans: "Linear", distractors: ["Quadratic", "Exponential", "Logarithmic"], exp: "Constant differences (Δy = 2) → linear." },
        { data: "(1,1), (2,4), (3,9), (4,16)", title: "y = x²", ans: "Quadratic", distractors: ["Linear", "Exponential", "Logarithmic"], exp: "Second differences constant → quadratic." },
        { data: "(0,1), (1,2), (2,4), (3,8)", title: "y = 2^x", ans: "Exponential", distractors: ["Linear", "Quadratic", "Logarithmic"], exp: "Constant ratio (×2) → exponential." },
        { data: "(1,0), (2,0.69), (4,1.39), (8,2.08)", title: "y = ln x", ans: "Logarithmic", distractors: ["Linear", "Exponential", "Quadratic"], exp: "Equal multiplicative x produces equal additive y → logarithmic." },
        { data: "(1,1), (2,0.5), (4,0.25), (8,0.125)", title: "y = 2^(−x) or 1/x²", ans: "Exponential decay", distractors: ["Linear", "Logarithmic", "Quadratic"], exp: "Constant ratio (×0.5 per +1) → exponential decay." },
        { data: "(1,1), (2,1.41), (4,2), (9,3)", title: "y = √x", ans: "Power (square root)", distractors: ["Linear", "Logarithmic", "Quadratic"], exp: "y² is linear in x → power function." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", `Data: ${v.data}. Best regression?`, { kind: "icon", icon: m.emoji, title: v.title, subtitle: "Pattern shape" }),
        hint: "Look at the pattern in y as x increases.", hints: ["Constant differences = linear.", "Constant ratios = exponential."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "endBehaviorSort": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each polynomial by end behavior.",
          categories: ["Up-Up", "Down-Down", "Down-Up", "Up-Down"],
          items: [
            { label: "x⁴", category: "Up-Up" }, { label: "2x⁶", category: "Up-Up" }, { label: "x²", category: "Up-Up" },
            { label: "−x⁴", category: "Down-Down" }, { label: "−3x²", category: "Down-Down" }, { label: "−x⁶", category: "Down-Down" },
            { label: "x³", category: "Down-Up" }, { label: "x⁵", category: "Down-Up" }, { label: "x⁷ + 2x", category: "Down-Up" },
            { label: "−x³", category: "Up-Down" }, { label: "−x⁵", category: "Up-Down" }, { label: "−2x⁷", category: "Up-Down" },
          ],
          hint: "Even/odd degree + sign of leading.",
          hints: ["Even degree: same on both ends.", "Sign decides which way."],
          explanation: "Leading coefficient + parity determine ends.",
        },
        {
          prompt: "Classify each polynomial by degree parity and leading sign.",
          categories: ["Even degree, +", "Even degree, −", "Odd degree, +", "Odd degree, −"],
          items: [
            { label: "x⁴", category: "Even degree, +" }, { label: "5x² + 1", category: "Even degree, +" },
            { label: "−x⁶", category: "Even degree, −" }, { label: "−2x²", category: "Even degree, −" },
            { label: "x³", category: "Odd degree, +" }, { label: "3x⁵", category: "Odd degree, +" },
            { label: "−x⁵", category: "Odd degree, −" }, { label: "−4x³", category: "Odd degree, −" },
          ],
          hint: "Look at the leading term.",
          hints: ["Parity of degree controls ends matching.", "Sign of leading controls direction."],
          explanation: "Each polynomial belongs to one parity/sign bucket.",
        },
      ]);
    }
    case "expLogMatch": {
      const banks: [string, string][][] = [
        [["2³ = 8", "log₂ 8 = 3"], ["10² = 100", "log₁₀ 100 = 2"], ["e¹ = e", "ln e = 1"], ["5⁰ = 1", "log₅ 1 = 0"]],
        [["3⁴ = 81", "log₃ 81 = 4"], ["10⁻¹ = 0.1", "log 0.1 = −1"], ["e² ≈ 7.39", "ln 7.39 ≈ 2"], ["2⁻³ = 1/8", "log₂(1/8) = −3"]],
        [["log(ab)", "log a + log b"], ["log(a/b)", "log a − log b"], ["log(aⁿ)", "n · log a"], ["log_a a", "1"]],
        [["ln(eˣ)", "x"], ["e^(ln x)", "x"], ["log_b 1", "0"], ["log_b b^n", "n"]],
      ];
      return matchPuzzle(m, difficulty, "Pair each statement with its equivalent log form.", pick(banks));
    }
    case "inverseMirror": {
      const banks: [string, string][][] = [
        [["f(x) = 2x", "f⁻¹(x) = x/2"], ["f(x) = x + 5", "f⁻¹(x) = x − 5"], ["f(x) = x³", "f⁻¹(x) = ∛x"], ["f(x) = eˣ", "f⁻¹(x) = ln x"]],
        [["f(x) = 3x − 7", "f⁻¹(x) = (x + 7)/3"], ["f(x) = (x − 4)/2", "f⁻¹(x) = 2x + 4"], ["f(x) = 1/x", "f⁻¹(x) = 1/x"], ["f(x) = 10ˣ", "f⁻¹(x) = log₁₀ x"]],
        [["f(x) = √x", "f⁻¹(x) = x²"], ["f(x) = 2ˣ", "f⁻¹(x) = log₂ x"], ["f(x) = x − 9", "f⁻¹(x) = x + 9"], ["f(x) = 5x + 2", "f⁻¹(x) = (x − 2)/5"]],
      ];
      return matchPuzzle(m, difficulty, "Pair each function with its inverse.", pick(banks));
    }
    case "rationalGraph": {
      const variants = [
        { f: "f(x) = (x²−1)/(x−1)", ans: "Reduces to x+1 with a hole at x=1", distractors: ["No holes or asymptotes", "Vertical asymptote at x=1", "Hole at x=−1"], exp: "Factor: (x−1)(x+1)/(x−1) → x+1 with a hole at x=1." },
        { f: "f(x) = 1/(x−2)", ans: "Vertical asymptote x=2, horizontal asymptote y=0", distractors: ["Hole at x=2", "No asymptote", "Horizontal asymptote y=2"], exp: "Denominator zero with no cancellation → VA; degree of denom > num → HA y=0." },
        { f: "f(x) = (x²−4)/(x+2)", ans: "Reduces to x−2 with a hole at x=−2", distractors: ["VA at x=−2", "VA at x=2", "No discontinuity"], exp: "Factor: (x−2)(x+2)/(x+2) → x−2 with hole at x=−2." },
        { f: "f(x) = (3x²+1)/x²", ans: "Horizontal asymptote y=3, VA x=0", distractors: ["HA y=1", "HA y=0, VA x=0", "No asymptote"], exp: "Equal degree → HA = leading-coeff ratio = 3; denominator 0 at x=0." },
        { f: "f(x) = (x+1)/((x+1)(x−3))", ans: "Hole at x=−1, VA at x=3", distractors: ["VA at x=−1 and x=3", "Hole at x=3", "No asymptote"], exp: "(x+1) cancels → hole at x=−1; (x−3) remains in denom → VA at x=3." },
        { f: "f(x) = x²/(x−1)", ans: "Slant asymptote y=x+1, VA x=1", distractors: ["HA y=1", "Hole at x=1", "No asymptote"], exp: "Polynomial long division: x² ÷ (x−1) → x+1 + 1/(x−1) → slant asymptote y=x+1." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", `${v.f}. Describe its graph.`, { kind: "icon", icon: m.emoji, title: v.f, subtitle: "Holes / asymptotes" }),
        hint: "Factor and cancel before reading the graph.", hints: ["Common factors cancel → holes.", "Remaining zeros in denominator → vertical asymptotes."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "quadraticSystems": {
      const variants = [
        { q: "Solve y = x² + 1 and y = −x + 3.", ans: "(1, 2) and (−2, 5)", distractors: ["(0, 1) and (1, 2)", "(2, 5) only", "No solution"], exp: "x² + 1 = −x + 3 → x² + x − 2 = 0 → x = 1, −2." },
        { q: "Solve y = x² and y = 4.", ans: "(2, 4) and (−2, 4)", distractors: ["(2, 4) only", "(4, 16) only", "No solution"], exp: "x² = 4 → x = ±2." },
        { q: "Solve y = x² − 4 and y = 0.", ans: "(2, 0) and (−2, 0)", distractors: ["(0, 0) only", "(2, 0) only", "No solution"], exp: "x² − 4 = 0 → x = ±2." },
        { q: "Solve y = x² and y = x.", ans: "(0, 0) and (1, 1)", distractors: ["(1, 1) only", "(0, 0) only", "No solution"], exp: "x² = x → x(x − 1) = 0 → x = 0, 1." },
        { q: "Solve x² + y² = 25 and y = x.", ans: "(±5/√2, ±5/√2)", distractors: ["(5, 5) and (−5, −5)", "(0, 5) and (0, −5)", "No solution"], exp: "Substitute y = x: 2x² = 25 → x = ±5/√2." },
        { q: "Solve y = x² + 2x − 3 and y = 0.", ans: "(1, 0) and (−3, 0)", distractors: ["(0, 0) and (1, 0)", "(2, 0) only", "(3, 0) and (−1, 0)"], exp: "Factor x² + 2x − 3 = (x + 3)(x − 1) → x = 1, −3." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", v.q, { kind: "icon", icon: m.emoji, title: "Quadratic system", subtitle: "Find intersection points" }),
        hint: "Substitute and solve the resulting quadratic.", hints: ["Set the equations equal.", "Factor or use the quadratic formula."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "abTest": {
      const a = rand(20, 90);
      const b = a + rand(10, 40);
      const aRate = (a / 500 * 100).toFixed(1);
      const bRate = (b / 500 * 100).toFixed(1);
      const sameRate = Math.random() < 0.1;
      if (sameRate) {
        return makeChoice({ ...base(m, difficulty, "choice", `A: ${a}/500 conversions. B: ${a}/500. Which wins?`, { kind: "icon", icon: "🧪", title: `Both = ${aRate}%`, subtitle: "Compare rates" }),
          hint: "Compare raw rates and sample size.", hints: ["Rates equal.", "Need more data for confidence."], explanation: "Equal rates — call it a tie / need more data." }, "Tie at this sample size", ["Variant A wins", "Variant B wins", "Both equal 50%"]);
      }
      return makeChoice({ ...base(m, difficulty, "choice", `A: ${a}/500 conversions. B: ${b}/500. Which wins?`, { kind: "icon", icon: "🧪", title: `A: ${aRate}% · B: ${bRate}%`, subtitle: "Compare rates" }),
        hint: "Compare conversion rates.", hints: [`A: ${a}/500 = ${aRate}%.`, `B: ${b}/500 = ${bRate}%.`], explanation: `Variant B converts at ${bRate}% vs A at ${aRate}%.` }, "Variant B has higher conversion", ["Variant A wins", "Tie", "Need more data, both 50%"]);
    }
    case "probabilitySpinner": {
      const r = rand(2, 6); const total = r + rand(2, 6) + rand(2, 6);
      const ans = `${r}/${total}`;
      return makeChoice({ ...base(m, difficulty, "choice", `Spinner: ${r} red, total ${total} slices. P(red)?`, { kind: "icon", icon: "🎯", title: `${r}/${total}`, subtitle: "Simple probability" }),
        hint: "Probability = favorable / total.", hints: ["Count red slices.", "Divide by total."], explanation: `P(red) = ${r}/${total}.` }, ans, [`${total - r}/${total}`, `${r}/${total - r}`, `1/${total}`]);
    }
    case "sampleSpace": {
      const variants = [
        { ans: "36 outcomes", q: "Two fair dice rolled. Drop the size of the sample space.", distractors: ["12 outcomes", "6 outcomes", "11 outcomes"], exp: "6·6 = 36 outcomes." },
        { ans: "8 outcomes", q: "Three coins flipped. Drop the size of the sample space.", distractors: ["6 outcomes", "3 outcomes", "9 outcomes"], exp: "2·2·2 = 8 outcomes." },
        { ans: "52 outcomes", q: "Draw one card from a standard deck. Drop the size of the sample space.", distractors: ["13 outcomes", "26 outcomes", "104 outcomes"], exp: "52 cards in a standard deck." },
        { ans: "216 outcomes", q: "Three fair dice rolled. Drop the size of the sample space.", distractors: ["36 outcomes", "18 outcomes", "108 outcomes"], exp: "6·6·6 = 216 outcomes." },
        { ans: "2,652 outcomes", q: "Draw two cards without replacement. Drop the size of the sample space.", distractors: ["2,704 outcomes", "1,326 outcomes", "52² outcomes"], exp: "52·51 = 2,652 (order matters, no replacement)." },
        { ans: "120 outcomes", q: "Arrange 5 books on a shelf. Drop the number of orderings.", distractors: ["25 outcomes", "60 outcomes", "5 outcomes"], exp: "5! = 120 permutations." },
        { ans: "32 outcomes", q: "Flip a coin 5 times. Drop the size of the sample space.", distractors: ["10 outcomes", "16 outcomes", "64 outcomes"], exp: "2⁵ = 32 outcomes." },
      ];
      const v = pick(variants);
      return dragEng(m, difficulty, v.q, v.ans, v.distractors,
        "Sample space size", "Multiply or factorial as needed.", ["Independent events: multiply.", "Permutations: factorial."], v.exp);
    }
    case "probTree": {
      const banks: string[][] = [
        ["Stage 1 outcome", "Branch probabilities", "Stage 2 outcomes", "Multiply down a path", "Sum the paths"],
        ["Define root", "List Stage 1 outcomes", "Assign branch probabilities", "List Stage 2 conditional outcomes", "Multiply along chosen path", "Sum across paths for total event"],
        ["P(rain) at root", "Branch: with-umbrella / no-umbrella", "Conditional dry / wet branches", "Multiply along chosen path", "Sum all paths that end 'dry'"],
        ["Drawing 2 marbles without replacement", "Branch for first color", "Conditional branches for second", "Multiply along chosen path", "Sum favorable paths"],
      ];
      const stops = pick(banks);
      return pathEng(m, difficulty, "Trace a probability tree path.", stops, "Walk the tree from root to leaves.", ["Multiply along branches.", "Sum across branches."], "Tree probability flow: branch → product → sum.");
    }
    case "conditionalTree": {
      const variants = [
        { q: "Formula for conditional probability P(A | B)?", ans: "P(A | B) = P(A∩B) / P(B)", distractors: ["P(A) + P(B)", "P(A) · P(B)", "P(A) − P(B)"], exp: "Condition on B by dividing by P(B)." },
        { q: "Bayes' theorem expresses P(A | B) as?", ans: "P(B | A)·P(A) / P(B)", distractors: ["P(A) · P(B)", "P(A) / P(B)", "P(A∩B) − P(B)"], exp: "Bayes flips the conditional using the priors." },
        { q: "P(A and B) when A and B are independent equals?", ans: "P(A) · P(B)", distractors: ["P(A) + P(B)", "max(P(A), P(B))", "P(A|B)"], exp: "Independence: joint = product of marginals." },
        { q: "Law of total probability for partition {B₁, B₂}:", ans: "P(A) = P(A|B₁)P(B₁) + P(A|B₂)P(B₂)", distractors: ["P(A) = P(B₁) + P(B₂)", "P(A) = P(A|B₁)P(A|B₂)", "P(A) = max(P(A|Bᵢ))"], exp: "Sum over a partition weights each conditional." },
        { q: "If P(A|B) = P(A), A and B are?", ans: "Independent", distractors: ["Mutually exclusive", "Complementary", "Always equal"], exp: "Independence: B does not change P(A)." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", v.q, { kind: "icon", icon: m.emoji, title: "Probability rule", subtitle: "Conditioning / Bayes" }),
        hint: "Use definitions: conditional, Bayes, independence.", hints: ["P(A|B) = P(A∩B)/P(B).", "Independent ⇒ P(A∩B) = P(A)P(B)."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "expectedValue": {
      const a = rand(1, 4), b = rand(5, 9);
      const ev = (a + b) / 2;
      return numpadEng(m, difficulty, `Fair die with values ${a} and ${b} (equal chance). Expected value?`, { kind: "icon", icon: m.emoji, title: `½·${a} + ½·${b}`, subtitle: "Weighted average" },
        ev, "Sum (value × prob).", ["Each side prob ½.", "Average the values."], `(${a} + ${b}) / 2 = ${ev}.`);
    }
    case "binomialSpinner": {
      const target = +(rand(2, 8)).toFixed(0);
      return sliderEng(m, difficulty, `Set n trials to ${target} for binomial(n, p=0.5).`, { min: 0, max: 10, step: 1, initial: 1, target }, `n = ${target}`,
        "Slide to the target n.", ["Trials count must match.", "Stop on the integer."], `Trials target was ${target}.`);
    }
    case "normalShade": {
      const variants = [
        { range: "±1σ", ans: "~68%", distractors: ["~50%", "~95%", "~99%"], exp: "Empirical rule: 68% within 1σ." },
        { range: "±2σ", ans: "~95%", distractors: ["~68%", "~99.7%", "~50%"], exp: "Empirical rule: 95% within 2σ." },
        { range: "±3σ", ans: "~99.7%", distractors: ["~95%", "~99.9%", "~99%"], exp: "Empirical rule: 99.7% within 3σ." },
        { range: "above 0 (z > 0)", ans: "~50%", distractors: ["~68%", "~84%", "~95%"], exp: "Symmetric about 0, so 50% above." },
        { range: "z > 1", ans: "~16%", distractors: ["~32%", "~68%", "~84%"], exp: "100% − 84% (left of 1σ) = 16%." },
        { range: "between 0 and 1σ", ans: "~34%", distractors: ["~50%", "~68%", "~16%"], exp: "Half of the 68% band lies on each side." },
        { range: "between 1σ and 2σ", ans: "~13.5%", distractors: ["~27%", "~16%", "~34%"], exp: "(95% − 68%)/2 ≈ 13.5%." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", `Standard normal: probability ${v.range}?`, { kind: "icon", icon: m.emoji, title: v.range, subtitle: "68-95-99.7 rule" }),
        hint: "Use the empirical rule.", hints: ["±1σ ≈ 68%, ±2σ ≈ 95%, ±3σ ≈ 99.7%.", "Use symmetry of the curve."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "stdDevBalancer": {
      const target = +(rand(1, 5)).toFixed(0);
      return sliderEng(m, difficulty, `Tune σ until the spread matches σ=${target}.`, { min: 0, max: 8, step: 1, initial: 1, target }, `σ target ${target}`,
        "Increase σ widens the curve.", ["Slide to labeled value.", "Stop on the integer."], `σ target was ${target}.`);
    }
    case "correlationMatch": {
      const banks: [string, string][][] = [
        [["r ≈ +1", "Strong positive"], ["r ≈ −1", "Strong negative"], ["r ≈ 0", "No linear trend"], ["r ≈ 0.5", "Moderate positive"], ["r ≈ −0.5", "Moderate negative"]],
        [["Height vs. weight", "Positive correlation"], ["Outside temp vs. heating bill", "Negative correlation"], ["Shoe size vs. test score", "≈ Zero correlation"], ["Hours studied vs. grade", "Positive correlation"]],
        [["r²", "Fraction of variance explained"], ["r", "Linear association strength"], ["Slope sign", "Direction of association"], ["Sample size", "Affects significance"]],
      ];
      return matchPuzzle(m, difficulty, "Pair each statistic / scenario with its meaning.", pick(banks));
    }
    case "residualPlot": {
      const variants = [
        { q: "A good linear model produces what residual plot?", ans: "Random scatter around 0", distractors: ["U-shape pattern", "Fan-out pattern", "Sloped line of residuals"], exp: "Good models leave structureless residuals." },
        { q: "What does a U-shape residual plot indicate?", ans: "Missing quadratic term", distractors: ["Good linear fit", "Non-constant variance", "Random scatter"], exp: "U-shape signals the model misses curvature." },
        { q: "What does a fan-out residual plot indicate?", ans: "Heteroscedasticity (non-constant variance)", distractors: ["Good fit", "Missing intercept", "Missing slope"], exp: "Variance grows with x — violates equal-variance assumption." },
        { q: "Residuals show a clear positive slope. Means?", ans: "Model systematically under-predicts at larger x", distractors: ["Good fit", "Random scatter", "Non-constant variance"], exp: "Slope in residuals means the model is biased across x." },
        { q: "A scatter plot of residuals vs. fitted shows tight clustering at 0 and a few far-away points. Means?", ans: "Outliers / influential points", distractors: ["Heteroscedasticity", "Non-linearity", "Multicollinearity"], exp: "Stray residuals far from 0 are outliers." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", v.q, { kind: "icon", icon: "📊", title: "Residuals", subtitle: "Diagnostic" }),
        hint: "Residuals should look random with no structure.", hints: ["Curve in residuals → wrong functional form.", "Fan-out → heteroscedasticity."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "samplingBias": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each scenario into biased or unbiased sampling.",
          categories: ["Biased", "Unbiased"],
          items: [
            { label: "Survey on football forum about sports", category: "Biased" }, { label: "Ask only first 10 people in line", category: "Biased" }, { label: "Volunteers respond online", category: "Biased" }, { label: "Phone survey at 9 a.m. on weekday", category: "Biased" },
            { label: "Random number generator picks IDs", category: "Unbiased" }, { label: "Random stratified sample", category: "Unbiased" }, { label: "Simple random sample of customer DB", category: "Unbiased" }, { label: "Systematic sample every 10th visitor", category: "Unbiased" },
          ],
          hint: "Random selection avoids bias.",
          hints: ["Convenience samples are biased.", "Random methods are unbiased."],
          explanation: "Convenience or self-selection → bias; randomization → unbiased.",
        },
        {
          prompt: "Classify each scenario by bias type.",
          categories: ["Selection bias", "Response bias", "Non-response bias", "Voluntary-response bias"],
          items: [
            { label: "Sampling only landlines", category: "Selection bias" }, { label: "Mall-intercept survey", category: "Selection bias" },
            { label: "Leading question wording", category: "Response bias" }, { label: "Interviewer of intimidating dress", category: "Response bias" },
            { label: "50% don't return mail survey", category: "Non-response bias" }, { label: "Customers who churn don't respond", category: "Non-response bias" },
            { label: "Yelp review crowd self-selects", category: "Voluntary-response bias" }, { label: "Online petition signers", category: "Voluntary-response bias" },
          ],
          hint: "Bias type depends on how the data was collected.",
          hints: ["Selection bias is about who is in the sample.", "Response bias is about how they answer."],
          explanation: "Different biases enter at different stages of the data process.",
        },
      ]);
    }
    case "hypothesisTest": {
      const p = +(Math.random() * 0.2).toFixed(3);
      const alpha = pick([0.01, 0.05, 0.10]);
      const decide = p < alpha ? "Reject H₀" : "Fail to reject H₀";
      const distractors = decide === "Reject H₀"
        ? ["Fail to reject H₀", "Accept H₀", "Need bigger sample"]
        : ["Reject H₀", "Accept H₀", "Need bigger sample"];
      return makeChoice({ ...base(m, difficulty, "choice", `p = ${p.toFixed(3)} with α = ${alpha}. Decision?`, { kind: "icon", icon: m.emoji, title: `p = ${p.toFixed(3)}`, subtitle: `α = ${alpha}` }),
        hint: "Compare p to α.", hints: ["If p < α, reject H₀.", "If p ≥ α, fail to reject."], explanation: `p ${p < alpha ? "<" : "≥"} α → ${decide}.` }, decide, distractors);
    }
    case "confidenceInterval": {
      const target = +(rand(1, 5)).toFixed(0);
      return sliderEng(m, difficulty, `Widen the CI margin to ${target}.`, { min: 0, max: 8, step: 1, initial: 0, target }, `Margin ${target}`,
        "Wider margin = wider interval.", ["Increase σ or decrease n widens it.", "Stop on integer target."], `Margin target was ${target}.`);
    }
    case "scatterPlot": {
      const variants = [
        { q: "Points trend up-right. What correlation?", title: "Up-right trend", ans: "Positive correlation", distractors: ["Negative correlation", "No correlation", "Quadratic"], exp: "Up-right trend = positive correlation." },
        { q: "Points trend down-right. What correlation?", title: "Down-right trend", ans: "Negative correlation", distractors: ["Positive correlation", "No correlation", "Quadratic"], exp: "Down-right trend = negative correlation." },
        { q: "Points form a tight upward line. What r value?", title: "Tight up-right line", ans: "r ≈ +0.95", distractors: ["r ≈ 0", "r ≈ −0.95", "r ≈ 0.5"], exp: "Tight upward line → r close to +1." },
        { q: "Points scatter randomly with no slope. What correlation?", title: "Random scatter", ans: "No correlation", distractors: ["Positive correlation", "Negative correlation", "Quadratic"], exp: "Random scatter → r ≈ 0." },
        { q: "Points form a downward parabola, not a line. What correlation?", title: "Down-parabola", ans: "Non-linear relationship", distractors: ["Strong negative linear", "No relationship", "Strong positive"], exp: "Curvature suggests non-linear, even if r is near 0." },
        { q: "Points form a moderate up-right cloud. What r value?", title: "Loose up-right", ans: "r ≈ +0.5", distractors: ["r ≈ +0.95", "r ≈ 0", "r ≈ −0.5"], exp: "Loose upward trend → r moderate positive." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", v.q, { kind: "icon", icon: m.emoji, title: v.title, subtitle: "Sign + strength of r" }),
        hint: "Look at the direction and tightness.", hints: ["Direction sets the sign.", "Tightness sets the magnitude."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "boxPlot": {
      const q1 = rand(2, 7);
      const q3 = q1 + rand(3, 7);
      const median = Math.round((q1 + q3) / 2);
      const distractors = [
        `Median ≈ ${q1}`,
        `Median ≈ ${q3}`,
        `Median ≈ ${q3 + rand(2, 6)}`,
      ];
      return dragEng(m, difficulty, `Drop the median onto the box plot with Q1=${q1} and Q3=${q3}.`, `Median ≈ ${median}`, distractors,
        "Place the median", "Median lies between Q1 and Q3.", ["Look halfway in the box.", `Around (${q1}+${q3})/2 = ${median}.`], `Median ≈ ${median} sits between Q1=${q1} and Q3=${q3}.`);
    }
    case "probDistribution": {
      const variants = [
        { ans: "Sum to 1", q: "Pick the requirement for a probability distribution.", distractors: ["Sum to 0", "Sum to 100", "Sum to n"], exp: "All probabilities must sum to 1." },
        { ans: "Each P ≥ 0", q: "Pick a required property of probabilities.", distractors: ["Each P ≤ 1/2", "Sum to 0", "Equal probabilities"], exp: "Probabilities are never negative." },
        { ans: "P(A) + P(Aᶜ) = 1", q: "Complement rule states?", distractors: ["P(A) = 1 − P(B)", "P(A) − P(Aᶜ) = 1", "P(A) · P(Aᶜ) = 1"], exp: "Probability of an event plus its complement equals 1." },
        { ans: "E[X] = Σ x P(x)", q: "Definition of expected value for discrete X?", distractors: ["E[X] = Σ P(x)", "E[X] = max(x)", "E[X] = Σ x²"], exp: "Weighted average over possible outcomes." },
        { ans: "Var(X) = E[X²] − (E[X])²", q: "Identity for variance?", distractors: ["Var(X) = E[X]² − E[X²]", "Var(X) = (E[X])²", "Var(X) = E[X²]"], exp: "Standard variance identity." },
        { ans: "0 ≤ P(A) ≤ 1", q: "Pick a Kolmogorov axiom.", distractors: ["P(A) > 1 allowed", "P(A) negative allowed", "P(A) = 1 always"], exp: "Probability is bounded between 0 and 1." },
      ];
      const v = pick(variants);
      return dragEng(m, difficulty, v.q, v.ans, v.distractors,
        "Required property", "Use the axioms of probability.", ["Each between 0 and 1.", "Total mass = 1."], v.exp);
    }
    case "photosynthesisFlow": {
      const banks: string[][] = [
        ["Light absorbed", "Water split", "ATP and NADPH made", "Calvin cycle", "Glucose formed"],
        ["Photon hits chlorophyll", "Electron excited in PSII", "Photolysis of H₂O", "Electron transport chain", "NADPH formed in PSI"],
        ["Calvin: CO₂ enters stroma", "RuBisCO fixes CO₂", "3-PGA made", "ATP/NADPH reduce to G3P", "Glucose assembled from G3P"],
      ];
      const stops = pick(banks);
      return pathEng(m, difficulty, "Trace the steps of photosynthesis.", stops, "Light first, sugar last.", ["Light reactions before Calvin.", "Glucose ends the chain."], "Light → split → ATP/NADPH → Calvin → glucose.");
    }
    case "foodWeb": {
      const variants = [
        { answer: "Hawk", distractors: ["Grass", "Rabbit", "Fox"], scenario: "meadow" },
        { answer: "Orca", distractors: ["Phytoplankton", "Sardine", "Seal"], scenario: "ocean" },
        { answer: "Lion", distractors: ["Acacia", "Gazelle", "Cheetah"], scenario: "savanna" },
        { answer: "Polar bear", distractors: ["Ice algae", "Krill", "Seal"], scenario: "arctic" },
        { answer: "Crocodile", distractors: ["Reeds", "Fish", "Bird"], scenario: "wetland" },
      ];
      const v = pick(variants);
      return dragEng(m, difficulty, `Drop the apex predator of the ${v.scenario} food web into the top tier.`, v.answer, v.distractors,
        "Apex predator", "Top of the chain has no predators.", ["Producers are at the bottom.", "Carnivores eat carnivores."], `${v.answer} is the apex predator in this ${v.scenario}.`);
    }
    case "dnaBasePair": {
      const variants: [string, string][][] = [
        [["A", "T"], ["T", "A"], ["C", "G"], ["G", "C"]],
        [["A", "U"], ["U", "A"], ["C", "G"], ["G", "C"]],
        [["Adenine", "Thymine"], ["Thymine", "Adenine"], ["Cytosine", "Guanine"], ["Guanine", "Cytosine"]],
      ];
      const v = pick(variants);
      const first = v[0]?.[1];
      const prompt = first === "U" ? "Pair each DNA base with its RNA complement." : "Pair each DNA base with its complement.";
      return matchPuzzle(m, difficulty, prompt, v);
    }
    case "mitosisStage": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order the stages of mitosis.",
          order: ["Prophase", "Metaphase", "Anaphase", "Telophase", "Cytokinesis"],
          hint: "Start with chromosomes condensing.",
          hints: ["Metaphase aligns at equator.", "Cytokinesis splits cytoplasm."],
          explanation: "Classic PMAT(C) order.",
        },
        {
          prompt: "Order the events of one cell cycle.",
          order: ["G1 growth", "S phase (DNA copy)", "G2 prep", "Mitosis", "Cytokinesis"],
          hint: "Interphase ➜ mitosis ➜ split.",
          hints: ["S phase replicates DNA.", "Mitosis divides chromosomes."],
          explanation: "Interphase has G1/S/G2 before mitosis.",
        },
        {
          prompt: "Order the stages of meiosis I and II.",
          order: ["Prophase I", "Metaphase I", "Anaphase I", "Telophase I", "Prophase II", "Metaphase II", "Anaphase II", "Telophase II"],
          hint: "Two divisions, eight phases.",
          hints: ["Crossing-over happens in Prophase I.", "Meiosis II resembles mitosis."],
          explanation: "Meiosis runs PMAT twice.",
        },
      ]);
    }
    case "bodySystemPath": {
      const banks: string[][] = [
        ["Mouth", "Stomach", "Small intestine", "Large intestine", "Out"],
        ["Mouth", "Esophagus", "Stomach", "Duodenum", "Jejunum", "Ileum", "Colon", "Rectum"],
        ["Nose", "Trachea", "Bronchi", "Bronchioles", "Alveoli"],
        ["Kidney", "Ureter", "Bladder", "Urethra"],
      ];
      const stops = pick(banks);
      const prompt = stops[0] === "Nose"
        ? "Trace air through the respiratory system."
        : stops[0] === "Kidney"
          ? "Trace urine through the excretory system."
          : "Trace food through the digestive system.";
      return pathEng(m, difficulty, prompt, stops, "Enter → process → exit.", ["Use anatomical order.", "Trace top-down or proximal-distal."], `${stops[0]} → ... → ${stops[stops.length - 1]}.`);
    }
    case "enzymeLockKey": {
      const banks: [string, string][][] = [
        [["Amylase", "Starch"], ["Lipase", "Lipid"], ["Protease", "Protein"], ["Lactase", "Lactose"]],
        [["Pepsin", "Protein in stomach"], ["Trypsin", "Protein in intestine"], ["Sucrase", "Sucrose"], ["Maltase", "Maltose"]],
        [["DNA polymerase", "DNA template"], ["RNA polymerase", "DNA → RNA"], ["Helicase", "Unwinds DNA"], ["Ligase", "Joins fragments"]],
      ];
      return matchPuzzle(m, difficulty, "Pair each enzyme with its substrate or action.", pick(banks));
    }
    case "punnettSquare": {
      const variants = [
        { cross: "Aa × Aa", ans: "1 AA : 2 Aa : 1 aa", distractors: ["All Aa", "3 AA : 1 aa", "1 AA : 1 aa"], note: "Classic monohybrid heterozygous cross." },
        { cross: "AA × aa", ans: "100% Aa", distractors: ["1:2:1 AA:Aa:aa", "1:1 AA:aa", "100% AA"], note: "Homozygous dominant × homozygous recessive." },
        { cross: "Aa × aa", ans: "1 Aa : 1 aa", distractors: ["100% Aa", "3:1 dominant:recessive", "1 AA : 1 aa"], note: "Test cross of heterozygote against recessive." },
        { cross: "AA × Aa", ans: "1 AA : 1 Aa (all dominant phenotype)", distractors: ["100% AA", "3:1 AA:Aa", "1:1:1:1"], note: "Homozygous dominant × heterozygote." },
        { cross: "Aa × Aa (phenotype ratio)", ans: "3 dominant : 1 recessive", distractors: ["1:2:1", "1:1", "All dominant"], note: "Monohybrid phenotype ratio." },
      ];
      const v = pick(variants);
      return makeChoice(
        {
          ...base(m, difficulty, "choice", `Cross ${v.cross}. Predict the offspring ratio.`, { kind: "icon", icon: "🧬", title: v.cross, subtitle: "Punnett square" }),
          hint: "Draw the 2×2 square.",
          hints: ["Each parent contributes one allele.", "Count by genotype, then phenotype."],
          explanation: `${v.cross} → ${v.ans}. ${v.note}`,
        },
        v.ans,
        v.distractors,
      );
    }
    case "ecosystemBalance": {
      const target = +(rand(3, 7)).toFixed(0);
      return sliderEng(m, difficulty, `Balance predator population to target ${target}.`, { min: 0, max: 10, step: 1, initial: 1, target }, `Predator ${target}`,
        "Adjust predators to match prey.", ["Too few → prey explodes.", "Too many → prey crashes."], `Balanced predator count: ${target}.`);
    }
    case "evolutionMatch": {
      const banks: [string, string][][] = [
        [["Natural selection", "Fittest survive"], ["Mutation", "Random change"], ["Drift", "Random fluctuation"], ["Migration", "Gene flow"]],
        [["Convergent evolution", "Similar form, different ancestor"], ["Divergent evolution", "Same ancestor, different forms"], ["Coevolution", "Two species adapt together"], ["Adaptive radiation", "Rapid diversification"]],
        [["Homologous structure", "Shared ancestry"], ["Analogous structure", "Independent origin"], ["Vestigial trait", "Lost function"], ["Transitional fossil", "Evidence between groups"]],
        [["Allopatric speciation", "Geographic isolation"], ["Sympatric speciation", "Same area, divergence"], ["Bottleneck", "Sudden population drop"], ["Founder effect", "Small migrant group"]],
      ];
      return matchPuzzle(m, difficulty, "Pair each evolutionary concept with its definition.", pick(banks));
    }
    case "periodicHunt": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each element into its family.",
          categories: ["Alkali", "Halogen", "Noble"],
          items: [
            { label: "Li", category: "Alkali" }, { label: "Na", category: "Alkali" }, { label: "K", category: "Alkali" }, { label: "Cs", category: "Alkali" },
            { label: "F", category: "Halogen" }, { label: "Cl", category: "Halogen" }, { label: "Br", category: "Halogen" }, { label: "I", category: "Halogen" },
            { label: "He", category: "Noble" }, { label: "Ne", category: "Noble" }, { label: "Ar", category: "Noble" }, { label: "Kr", category: "Noble" },
          ],
          hint: "Use the periodic table groups.",
          hints: ["Alkali = column 1.", "Halogens = column 17.", "Noble gases = column 18."],
          explanation: "Each element belongs to a single group column.",
        },
        {
          prompt: "Classify each element as metal, non-metal, or metalloid.",
          categories: ["Metal", "Non-metal", "Metalloid"],
          items: [
            { label: "Au (gold)", category: "Metal" }, { label: "Fe (iron)", category: "Metal" }, { label: "Cu (copper)", category: "Metal" },
            { label: "S (sulfur)", category: "Non-metal" }, { label: "O (oxygen)", category: "Non-metal" }, { label: "N (nitrogen)", category: "Non-metal" },
            { label: "Si (silicon)", category: "Metalloid" }, { label: "B (boron)", category: "Metalloid" }, { label: "As (arsenic)", category: "Metalloid" },
          ],
          hint: "Metalloids lie along the periodic-table staircase.",
          hints: ["Left side = metals.", "Right side = non-metals."],
          explanation: "Each element falls into one zone.",
        },
        {
          prompt: "Sort each element by period (row).",
          categories: ["Period 1", "Period 2", "Period 3"],
          items: [
            { label: "H", category: "Period 1" }, { label: "He", category: "Period 1" },
            { label: "Li", category: "Period 2" }, { label: "C", category: "Period 2" }, { label: "O", category: "Period 2" }, { label: "Ne", category: "Period 2" },
            { label: "Na", category: "Period 3" }, { label: "Mg", category: "Period 3" }, { label: "Cl", category: "Period 3" }, { label: "Ar", category: "Period 3" },
          ],
          hint: "Periods are rows on the table.",
          hints: ["Period 1 has only H and He.", "Period 3 starts at Na."],
          explanation: "Each row is a period; same row = same number of shells.",
        },
      ]);
    }
    case "elementSymbol": {
      const banks: [string, string][][] = [
        [["Hydrogen", "H"], ["Oxygen", "O"], ["Iron", "Fe"], ["Sodium", "Na"]],
        [["Carbon", "C"], ["Nitrogen", "N"], ["Sulfur", "S"], ["Phosphorus", "P"]],
        [["Gold", "Au"], ["Silver", "Ag"], ["Mercury", "Hg"], ["Lead", "Pb"]],
        [["Potassium", "K"], ["Calcium", "Ca"], ["Magnesium", "Mg"], ["Aluminum", "Al"]],
        [["Chlorine", "Cl"], ["Bromine", "Br"], ["Iodine", "I"], ["Fluorine", "F"]],
      ];
      return matchPuzzle(m, difficulty, "Pair each element with its symbol.", pick(banks));
    }
    case "atomicStructure": {
      const variants = [
        { answer: "Electron", distractors: ["Proton", "Neutron", "Nucleus"], target: "Electron cloud", prompt: "Drop the particle that carries negative charge into the electron cloud.", hint: "Electrons orbit the nucleus.", exp: "Electrons carry the negative charge in atoms." },
        { answer: "Proton", distractors: ["Electron", "Neutron", "Photon"], target: "Nucleus (positive)", prompt: "Drop the particle that carries positive charge into the nucleus.", hint: "Protons are in the nucleus.", exp: "Protons carry the positive charge inside the nucleus." },
        { answer: "Neutron", distractors: ["Proton", "Electron", "Quark"], target: "Nucleus (neutral)", prompt: "Drop the particle that carries no charge into the nucleus.", hint: "Neutrons are neutral.", exp: "Neutrons sit in the nucleus and carry zero charge." },
        { answer: "Quark", distractors: ["Proton", "Neutron", "Electron"], target: "Inside a proton", prompt: "Drop the fundamental particle that makes up protons and neutrons.", hint: "Protons/neutrons are not fundamental.", exp: "Three quarks bind via gluons to form each nucleon." },
      ];
      const v = pick(variants);
      return dragEng(m, difficulty, v.prompt, v.answer, v.distractors,
        v.target, v.hint, ["Different particles live in different shells.", "Charge tells you the location."], v.exp);
    }
    case "bondTypeMatch": {
      const banks: [string, string][][] = [
        [["Ionic", "NaCl"], ["Covalent", "H₂O"], ["Metallic", "Cu"], ["Hydrogen", "DNA strands"]],
        [["Polar covalent", "H–O bond in water"], ["Nonpolar covalent", "O=O in O₂"], ["Coordinate covalent", "NH₃·BF₃"], ["Disulfide", "S–S in proteins"]],
        [["Ionic", "Metal + non-metal"], ["Covalent", "Two non-metals"], ["Metallic", "Sea of electrons"], ["Hydrogen", "H to N/O/F"]],
      ];
      return matchPuzzle(m, difficulty, "Pair each bond type with an example or rule.", pick(banks));
    }
    case "reactionSort": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each reaction by type.",
          categories: ["Synthesis", "Decomposition", "Single replacement", "Double replacement"],
          items: [
            { label: "A + B → AB", category: "Synthesis" },
            { label: "2H₂ + O₂ → 2H₂O", category: "Synthesis" },
            { label: "AB → A + B", category: "Decomposition" },
            { label: "2H₂O → 2H₂ + O₂", category: "Decomposition" },
            { label: "Zn + CuSO₄ → ZnSO₄ + Cu", category: "Single replacement" },
            { label: "Fe + CuCl₂ → FeCl₂ + Cu", category: "Single replacement" },
            { label: "AgNO₃ + NaCl → AgCl + NaNO₃", category: "Double replacement" },
            { label: "Pb(NO₃)₂ + KI → PbI₂ + KNO₃", category: "Double replacement" },
          ],
          hint: "Look at how many reactants split or recombine.",
          hints: ["One element swaps in → single replacement.", "Ion pairs swap → double replacement."],
          explanation: "Each reaction type has a distinct pattern.",
        },
        {
          prompt: "Sort each reaction by energy change.",
          categories: ["Exothermic", "Endothermic"],
          items: [
            { label: "Combustion of methane", category: "Exothermic" },
            { label: "Neutralization (HCl + NaOH)", category: "Exothermic" },
            { label: "Rusting of iron", category: "Exothermic" },
            { label: "Photosynthesis", category: "Endothermic" },
            { label: "Melting ice", category: "Endothermic" },
            { label: "Cooking an egg", category: "Endothermic" },
          ],
          hint: "Releasing heat = exothermic; absorbing = endothermic.",
          hints: ["Combustion releases heat.", "Phase changes from solid → liquid absorb heat."],
          explanation: "Sign of ΔH determines the category.",
        },
        {
          prompt: "Classify each statement by what it tells you about a reaction.",
          categories: ["Reactant", "Product", "Catalyst"],
          items: [
            { label: "Hydrogen burns in oxygen", category: "Reactant" },
            { label: "Yields water", category: "Product" },
            { label: "Platinum speeds up reaction", category: "Catalyst" },
            { label: "Enzyme unchanged after", category: "Catalyst" },
            { label: "Glucose enters", category: "Reactant" },
            { label: "Carbon dioxide released", category: "Product" },
          ],
          hint: "Reactants enter; products leave; catalysts return.",
          hints: ["Catalysts lower activation energy.", "Products are written on the right of →."],
          explanation: "Each species plays one role per reaction.",
        },
      ]);
    }
    case "phScaleSort": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each substance by pH range.",
          categories: ["Acid", "Neutral", "Base"],
          items: [
            { label: "Lemon juice (2)", category: "Acid" }, { label: "Vinegar (3)", category: "Acid" }, { label: "Stomach acid (1.5)", category: "Acid" },
            { label: "Pure water (7)", category: "Neutral" }, { label: "Blood (7.4)", category: "Neutral" }, { label: "Saliva (~6.8)", category: "Neutral" },
            { label: "Bleach (12.5)", category: "Base" }, { label: "Ammonia (11)", category: "Base" }, { label: "Soap (9-10)", category: "Base" },
          ],
          hint: "pH < 7 acid, 7 neutral, > 7 base.",
          hints: ["Citrus is acidic.", "Cleaners are basic."],
          explanation: "pH groups by acidity.",
        },
        {
          prompt: "Sort each pH measurement by strength.",
          categories: ["Strong acid", "Weak acid/base", "Strong base"],
          items: [
            { label: "pH 0 (battery acid)", category: "Strong acid" }, { label: "pH 1 (HCl)", category: "Strong acid" }, { label: "pH 2 (lemon)", category: "Strong acid" },
            { label: "pH 5 (coffee)", category: "Weak acid/base" }, { label: "pH 7 (water)", category: "Weak acid/base" }, { label: "pH 9 (baking soda)", category: "Weak acid/base" },
            { label: "pH 13 (NaOH)", category: "Strong base" }, { label: "pH 14 (lye)", category: "Strong base" },
          ],
          hint: "Strong acids/bases sit at the extremes.",
          hints: ["Extreme pH = stronger species.", "Around 5-9 is weak/neutral."],
          explanation: "Distance from pH 7 = strength.",
        },
        {
          prompt: "Classify each by acid–base type.",
          categories: ["Strong acid", "Weak acid", "Strong base", "Weak base"],
          items: [
            { label: "HCl", category: "Strong acid" }, { label: "HNO₃", category: "Strong acid" }, { label: "H₂SO₄", category: "Strong acid" },
            { label: "CH₃COOH", category: "Weak acid" }, { label: "HF", category: "Weak acid" },
            { label: "NaOH", category: "Strong base" }, { label: "KOH", category: "Strong base" },
            { label: "NH₃", category: "Weak base" }, { label: "CH₃NH₂", category: "Weak base" },
          ],
          hint: "Strong acids/bases dissociate completely.",
          hints: ["Common strong acids: HCl, HNO₃, H₂SO₄.", "NH₃ is the canonical weak base."],
          explanation: "Strength = degree of dissociation in water.",
        },
      ]);
    }
    case "electronShell": {
      const variants = [
        { answer: "2", distractors: ["8", "4", "1"], target: "First shell", prompt: "How many electrons fill the first shell?", hint: "First shell holds 2 electrons (1s²).", exp: "First shell max is 2." },
        { answer: "8", distractors: ["2", "10", "18"], target: "Second shell", prompt: "How many electrons fill the second shell?", hint: "2s²2p⁶ = 8.", exp: "Second shell max is 8." },
        { answer: "18", distractors: ["8", "10", "32"], target: "Third shell", prompt: "How many electrons fill the third shell (n=3)?", hint: "3s²3p⁶3d¹⁰ = 18.", exp: "Third shell max is 18 (2n²)." },
        { answer: "2", distractors: ["6", "8", "10"], target: "s-subshell", prompt: "How many electrons fit in one s subshell?", hint: "s has 1 orbital.", exp: "An s subshell holds 2 electrons." },
        { answer: "6", distractors: ["2", "10", "8"], target: "p-subshell", prompt: "How many electrons fit in one p subshell?", hint: "p has 3 orbitals.", exp: "A p subshell holds 6 electrons." },
        { answer: "10", distractors: ["6", "14", "8"], target: "d-subshell", prompt: "How many electrons fit in one d subshell?", hint: "d has 5 orbitals.", exp: "A d subshell holds 10 electrons." },
      ];
      const v = pick(variants);
      return dragEng(m, difficulty, v.prompt, v.answer, v.distractors,
        v.target, v.hint, ["2n² gives the shell max.", "Subshells fit 2·(2ℓ+1) electrons."], v.exp);
    }
    case "stoichRecipe": {
      const k = pick([2, 3, 4]);
      const ans = k * 2;
      return numpadEng(m, difficulty, `For 2H₂ + O₂ → 2H₂O, ${k * 2} mol H₂ produces how many mol H₂O?`, { kind: "icon", icon: m.emoji, title: `${k * 2} mol H₂`, subtitle: "Stoichiometry" },
        ans, "1:1 H₂ → H₂O.", ["Same coefficient.", `${k * 2} mol H₂ → ${k * 2} mol H₂O.`], `${k * 2} mol H₂ produces ${ans} mol H₂O.`);
    }
    case "motionGraph": {
      const banks: [string, string][][] = [
        [["Flat distance-time", "At rest"], ["Sloped distance-time", "Constant speed"], ["Sloped velocity-time", "Acceleration"], ["Flat velocity-time", "Constant velocity"]],
        [["Positive slope d-t", "Moving forward"], ["Negative slope d-t", "Moving backward"], ["Curving up d-t", "Speeding up"], ["Curving down d-t", "Slowing down"]],
        [["Area under v-t", "Displacement"], ["Slope of v-t", "Acceleration"], ["Slope of d-t", "Velocity"], ["Area under a-t", "Change in velocity"]],
      ];
      return matchPuzzle(m, difficulty, "Pair each motion graph with its meaning.", pick(banks));
    }
    case "energyChain": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order an energy chain from source to sink.",
          order: ["Sun", "Plant (chemical)", "Animal (kinetic)", "Heat lost", "Atmosphere"],
          hint: "Energy flows downhill.",
          hints: ["Producers absorb light.", "Heat dissipates last."],
          explanation: "Sun → plant → animal → heat → atmosphere.",
        },
        {
          prompt: "Order energy transformations when riding a bike up a hill.",
          order: ["Food (chemical)", "Muscle (chemical → kinetic)", "Kinetic of pedaling", "Potential energy at top", "Heat & sound dissipated"],
          hint: "Each step loses some energy as heat.",
          hints: ["Food fuels muscle.", "Climbing converts kinetic to potential."],
          explanation: "Chemical → kinetic → potential, with heat losses.",
        },
        {
          prompt: "Order energy flow in a hydroelectric dam.",
          order: ["Solar (drives water cycle)", "Gravitational PE of reservoir", "Kinetic energy of falling water", "Mechanical energy of turbine", "Electrical energy to grid"],
          hint: "Each stage transforms energy form.",
          hints: ["Reservoir stores potential.", "Turbine converts to mechanical."],
          explanation: "Solar → PE → KE → mechanical → electrical.",
        },
        {
          prompt: "Order energy flow in a gas-powered car.",
          order: ["Chemical (fuel)", "Heat (combustion)", "Mechanical (pistons)", "Kinetic (wheels)", "Heat & sound losses"],
          hint: "Internal combustion converts chemical to motion.",
          hints: ["Only ~25% becomes motion.", "Most exits as heat."],
          explanation: "Fuel → heat → mechanical → kinetic with losses.",
        },
      ]);
    }
    case "circuitBuilder": {
      const variants = [
        { answer: "Switch", distractors: ["Resistor", "Capacitor", "LED"], target: "Closing component", prompt: "Drop the component that closes the loop.", hint: "A switch completes circuits.", exp: "The switch closes the circuit." },
        { answer: "Resistor", distractors: ["Wire", "LED", "Switch"], target: "Limits current", prompt: "Drop the component that limits current to protect an LED.", hint: "Resistors set the current.", exp: "A resistor in series limits LED current." },
        { answer: "LED", distractors: ["Resistor", "Switch", "Capacitor"], target: "Light emitter", prompt: "Drop the component that emits light when current flows in one direction.", hint: "Diodes are directional.", exp: "LEDs only conduct one way and emit light." },
        { answer: "Capacitor", distractors: ["Resistor", "Inductor", "Switch"], target: "Stores charge", prompt: "Drop the component that stores charge briefly to smooth voltage.", hint: "Capacitors hold charge on plates.", exp: "Capacitors store and release charge to smooth signals." },
        { answer: "Battery", distractors: ["LED", "Switch", "Resistor"], target: "Energy source", prompt: "Drop the component that drives current around the loop.", hint: "Batteries supply EMF.", exp: "The battery's EMF pushes current through the circuit." },
      ];
      const v = pick(variants);
      return dragEng(m, difficulty, v.prompt, v.answer, v.distractors,
        v.target, v.hint, ["Each part has a single job.", "Match the symbol to its function."], v.exp);
    }
    case "gravityDrop": {
      const target = +(rand(1, 9)).toFixed(0);
      return sliderEng(m, difficulty, `Drop time should reach ${target}s. Tune the height.`, { min: 0, max: 12, step: 1, initial: 0, target }, `t ≈ ${target}s`,
        "h = ½g·t². Slide until t matches.", ["Use g ≈ 10 m/s².", "Stop on integer t."], `Target drop time: ${target}s.`);
    }
    case "waveFrequency": {
      const target = +(rand(1, 10)).toFixed(0);
      return sliderEng(m, difficulty, `Tune frequency to ${target} Hz.`, { min: 0, max: 12, step: 1, initial: 1, target }, `${target} Hz`,
        "Slide to the labeled frequency.", ["Each step = 1 Hz.", "Match exactly."], `Frequency target was ${target} Hz.`);
    }
    case "opticsReflect": {
      const variants = [
        { target: 45, exp: "A 45° rotation reflects at twice the rotation angle (90°)." },
        { target: 90, exp: "A 90° mirror rotation flips the beam by 180°." },
        { target: 135, exp: "A 135° rotation directs the beam back toward the source side." },
        { target: 30, exp: "A 30° rotation reflects the beam by 60°." },
        { target: 60, exp: "A 60° rotation reflects the beam by 120°." },
      ];
      const v = pick(variants);
      const step = pick([15, 30, 45] as const);
      return rotateEng(m, difficulty, `Rotate the mirror by ${v.target}° to redirect the beam.`, v.target, step,
        "Mirror rotation by θ changes beam direction by 2θ.", [`Each tap rotates ${step}°.`, `Reach ${v.target}°.`], v.exp);
    }
    case "workPower": {
      const f = rand(10, 50), d = rand(2, 10);
      const work = f * d;
      return numpadEng(m, difficulty, `Force ${f}N over ${d}m. Work done?`, { kind: "icon", icon: m.emoji, title: `${f}N · ${d}m`, subtitle: "W = F·d" },
        work, "W = F·d (parallel).", ["Multiply.", `${f}·${d}`], `W = ${f}·${d} = ${work} J.`);
    }
    case "momentumCollide": {
      const m1 = rand(2, 6), v1 = rand(2, 6), m2 = rand(2, 6), v2 = rand(2, 6);
      const p = m1 * v1 + m2 * v2;
      return numpadEng(m, difficulty, `Combined momentum: ${m1}kg·${v1}m/s + ${m2}kg·${v2}m/s.`, { kind: "icon", icon: m.emoji, title: "Σ m·v", subtitle: "Conservation" },
        p, "p = m·v.", [`p1 = ${m1 * v1}.`, `p2 = ${m2 * v2}.`], `Total = ${m1 * v1} + ${m2 * v2} = ${p}.`);
    }
    case "simpleMachines": {
      const variants = [
        { ans: "Inclined plane", distractors: ["Wheel", "Wedge", "Screw"], q: "Which simple machine reduces force needed to lift over a height?", exp: "An inclined plane reduces force at the cost of distance." },
        { ans: "Pulley", distractors: ["Lever", "Screw", "Wedge"], q: "Which machine redirects rope force, letting you pull down to lift up?", exp: "A single fixed pulley reverses the direction of force." },
        { ans: "Lever", distractors: ["Wheel", "Pulley", "Wedge"], q: "Which simple machine amplifies force around a fulcrum?", exp: "A first-class lever trades distance for force around a fulcrum." },
        { ans: "Wheel and axle", distractors: ["Lever", "Wedge", "Screw"], q: "Which simple machine spins a large wheel to turn a small axle (gain torque)?", exp: "The wheel-and-axle multiplies torque." },
        { ans: "Screw", distractors: ["Wedge", "Pulley", "Wheel"], q: "Which simple machine is essentially an inclined plane wrapped around a cylinder?", exp: "A screw is a coiled inclined plane." },
        { ans: "Wedge", distractors: ["Screw", "Lever", "Pulley"], q: "Which simple machine splits objects apart by applied force?", exp: "A wedge concentrates force at a sharp edge." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", v.q, { kind: "icon", icon: m.emoji, title: "Simple machine", subtitle: "Trade force for distance" }),
        hint: "Each machine trades force or direction.", hints: ["Six classical types.", "Identify by motion + advantage."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "plateTectonics": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each phenomenon by plate boundary.",
          categories: ["Divergent", "Convergent", "Transform"],
          items: [
            { label: "Mid-ocean ridge", category: "Divergent" }, { label: "Sea-floor spreading", category: "Divergent" }, { label: "East African Rift", category: "Divergent" },
            { label: "Subduction zone", category: "Convergent" }, { label: "Mountain building", category: "Convergent" }, { label: "Andes uplift", category: "Convergent" },
            { label: "San Andreas fault", category: "Transform" }, { label: "Sliding plates", category: "Transform" }, { label: "Strike-slip motion", category: "Transform" },
          ],
          hint: "Look at plate motion.",
          hints: ["Apart = divergent.", "Past each other = transform."],
          explanation: "Plate motion sets the boundary type.",
        },
        {
          prompt: "Classify each feature by tectonic setting.",
          categories: ["Continental–Continental", "Oceanic–Continental", "Oceanic–Oceanic"],
          items: [
            { label: "Himalayas", category: "Continental–Continental" }, { label: "Alps", category: "Continental–Continental" },
            { label: "Andes mountains", category: "Oceanic–Continental" }, { label: "Cascade volcanoes", category: "Oceanic–Continental" },
            { label: "Mariana Trench", category: "Oceanic–Oceanic" }, { label: "Aleutian arc", category: "Oceanic–Oceanic" },
          ],
          hint: "Identify the colliding crust types.",
          hints: ["Two continents → mountain belts.", "Two oceans → island arcs."],
          explanation: "Crust pairing controls the resulting feature.",
        },
      ]);
    }
    case "weatherFront": {
      const banks: [string, string][][] = [
        [["Cold front", "Sudden storms"], ["Warm front", "Steady rain"], ["Stationary front", "Lingering clouds"], ["Occluded front", "Mixed weather"]],
        [["Cold front symbol", "Triangles"], ["Warm front symbol", "Semi-circles"], ["Stationary symbol", "Alternating triangles + semis"], ["Occluded symbol", "Combined shapes"]],
        [["High pressure", "Clear, dry weather"], ["Low pressure", "Storms, precipitation"], ["Ridge", "Stable, sunny"], ["Trough", "Unstable, wet"]],
      ];
      return matchPuzzle(m, difficulty, "Pair each weather feature with its description.", pick(banks));
    }
    case "waterCycle": {
      const banks: string[][] = [
        ["Evaporation", "Condensation", "Precipitation", "Collection", "Infiltration"],
        ["Transpiration", "Condensation", "Cloud formation", "Precipitation", "Runoff"],
        ["Surface evaporation", "Cloud condensation", "Precipitation", "Groundwater recharge", "Spring discharge"],
        ["Snowmelt", "Runoff", "River flow", "Ocean inflow", "Ocean evaporation"],
      ];
      const stops = pick(banks);
      return pathEng(m, difficulty, "Trace one full water-cycle path.", stops, "Up first, then back down.", ["Heat lifts water.", "Cooling forms clouds."], `${stops[0]} → … → ${stops[stops.length - 1]}.`);
    }
    case "climateDetect": {
      const variants = [
        { ans: "Tropical rainforest", distractors: ["Tundra", "Desert", "Grassland"], q: "High rainfall, near equator, dense forest. Which biome?", exp: "Tropical rainforests sit near the equator with heavy rainfall." },
        { ans: "Desert", distractors: ["Tundra", "Rainforest", "Wetland"], q: "Low rainfall (<25 cm/year), extreme temperature swings. Which biome?", exp: "Deserts are defined by minimal precipitation." },
        { ans: "Tundra", distractors: ["Desert", "Boreal forest", "Savanna"], q: "Permafrost, no trees, very cold winters. Which biome?", exp: "Tundra has permafrost and very short growing seasons." },
        { ans: "Boreal forest (taiga)", distractors: ["Tundra", "Temperate forest", "Grassland"], q: "Cold winters, dominated by conifers, found at high latitudes. Which biome?", exp: "Boreal forests are dominated by spruce/pine/fir." },
        { ans: "Savanna", distractors: ["Desert", "Rainforest", "Wetland"], q: "Tropical grassland with scattered trees and a long dry season. Which biome?", exp: "Tropical savanna has wet/dry seasons and grass-dominated cover." },
        { ans: "Mediterranean", distractors: ["Tundra", "Rainforest", "Boreal"], q: "Mild wet winters, hot dry summers, shrub-dominated. Which biome?", exp: "Mediterranean climates support chaparral and similar shrublands." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", v.q, { kind: "icon", icon: "🌍", title: v.ans.slice(0, 14), subtitle: "Biome" }),
        hint: "Climate + plant life determines biome.", hints: ["Look at temperature.", "Look at precipitation."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "earthLayers": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order Earth's layers from surface to center.",
          order: ["Crust", "Upper mantle", "Lower mantle", "Outer core", "Inner core"],
          hint: "Start at the surface.",
          hints: ["Mantle is below crust.", "Inner core is solid iron."],
          explanation: "Crust → mantle → outer core → inner core.",
        },
        {
          prompt: "Order Earth's layers by mechanical behavior (top to bottom).",
          order: ["Lithosphere (rigid)", "Asthenosphere (plastic)", "Mesosphere", "Outer core (liquid)", "Inner core (solid)"],
          hint: "Mechanical layers differ from chemical layers.",
          hints: ["Lithosphere = crust + uppermost mantle.", "Asthenosphere can flow slowly."],
          explanation: "Mechanically: rigid → plastic → solid → liquid → solid.",
        },
        {
          prompt: "Order Earth's atmosphere layers from ground to space.",
          order: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere", "Exosphere"],
          hint: "Weather lives in the troposphere.",
          hints: ["Ozone is in the stratosphere.", "Aurora occurs in the thermosphere."],
          explanation: "Atmospheric layers stack from ground upward.",
        },
      ]);
    }
    case "moonPhase": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order moon phases from new to full.",
          order: ["New", "Waxing crescent", "First quarter", "Waxing gibbous", "Full"],
          hint: "Light grows each step.",
          hints: ["Crescent comes before quarter.", "Gibbous before full."],
          explanation: "Half a lunar cycle: new → full.",
        },
        {
          prompt: "Order moon phases from full back to new.",
          order: ["Full", "Waning gibbous", "Last quarter", "Waning crescent", "New"],
          hint: "Light shrinks each step.",
          hints: ["Waning means decreasing.", "Crescent precedes new."],
          explanation: "Second half of the cycle: full → new.",
        },
        {
          prompt: "Order a complete lunar cycle starting from waxing crescent.",
          order: ["Waxing crescent", "First quarter", "Waxing gibbous", "Full", "Waning gibbous", "Last quarter", "Waning crescent", "New"],
          hint: "Continue waxing then wane.",
          hints: ["8 phases per cycle.", "Quarter and gibbous come in pairs."],
          explanation: "Full 8-phase cycle starting from crescent.",
        },
      ]);
    }
    case "solarOrbit": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order the first six planets by distance from the Sun.",
          order: ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn"],
          hint: "Start closest to the Sun.",
          hints: ["Mercury is closest.", "Saturn is furthest of the six."],
          explanation: "Mercury through Saturn in order.",
        },
        {
          prompt: "Order all eight planets from closest to farthest.",
          order: ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"],
          hint: "All 8 in standard order.",
          hints: ["After Saturn come the ice giants.", "Neptune is outermost."],
          explanation: "Standard solar-system order.",
        },
        {
          prompt: "Order the gas/ice giants by distance from the Sun.",
          order: ["Jupiter", "Saturn", "Uranus", "Neptune"],
          hint: "All four are outer planets.",
          hints: ["Jupiter and Saturn are gas.", "Uranus and Neptune are ice."],
          explanation: "Outer planet order by distance.",
        },
      ]);
    }
    case "disasterRisk": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each disaster by its primary trigger.",
          categories: ["Tectonic", "Atmospheric"],
          items: [
            { label: "Earthquake", category: "Tectonic" }, { label: "Volcano", category: "Tectonic" }, { label: "Tsunami (from quake)", category: "Tectonic" },
            { label: "Hurricane", category: "Atmospheric" }, { label: "Tornado", category: "Atmospheric" }, { label: "Heatwave", category: "Atmospheric" }, { label: "Blizzard", category: "Atmospheric" },
          ],
          hint: "Land vs sky.",
          hints: ["Plates → tectonic.", "Air → atmospheric."],
          explanation: "Group by whether the trigger is in the crust or atmosphere.",
        },
        {
          prompt: "Sort each disaster by primary trigger across all four spheres.",
          categories: ["Geosphere", "Hydrosphere", "Atmosphere", "Biosphere"],
          items: [
            { label: "Earthquake", category: "Geosphere" }, { label: "Landslide", category: "Geosphere" },
            { label: "Flood", category: "Hydrosphere" }, { label: "Tsunami", category: "Hydrosphere" }, { label: "Drought", category: "Hydrosphere" },
            { label: "Hurricane", category: "Atmosphere" }, { label: "Tornado", category: "Atmosphere" }, { label: "Lightning fire", category: "Atmosphere" },
            { label: "Wildfire (vegetation)", category: "Biosphere" }, { label: "Pandemic", category: "Biosphere" },
          ],
          hint: "Which sphere directly drives the event?",
          hints: ["Plates and rocks → geosphere.", "Water → hydrosphere.", "Living things → biosphere."],
          explanation: "Each disaster has a dominant Earth-system trigger.",
        },
      ]);
    }
    case "fossilTimeline": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order fossils from oldest to youngest.",
          order: ["Trilobites (Cambrian)", "Fish (Devonian)", "Dinosaurs (Mesozoic)", "Mammals (Cenozoic)", "Humans"],
          hint: "Oldest first.",
          hints: ["Trilobites came early.", "Humans came last."],
          explanation: "Standard fossil chronology.",
        },
        {
          prompt: "Order Earth's eras from oldest to youngest.",
          order: ["Precambrian", "Paleozoic", "Mesozoic", "Cenozoic"],
          hint: "Four big eras.",
          hints: ["Precambrian is most of Earth's history.", "Cenozoic is current."],
          explanation: "Earth-history era order.",
        },
        {
          prompt: "Order major hominin species from oldest to youngest.",
          order: ["Australopithecus", "Homo habilis", "Homo erectus", "Homo neanderthalensis", "Homo sapiens"],
          hint: "Australopithecus came first.",
          hints: ["Habilis was the first 'Homo'.", "Sapiens emerged last."],
          explanation: "Hominin chronology over ~4 million years.",
        },
        {
          prompt: "Order mass extinctions from oldest to youngest.",
          order: ["Ordovician-Silurian", "Late Devonian", "Permian-Triassic", "Triassic-Jurassic", "Cretaceous-Paleogene"],
          hint: "Five major events.",
          hints: ["Permian-Triassic was the largest.", "K-Pg ended the dinosaurs."],
          explanation: "Big 5 mass extinctions in order.",
        },
      ]);
    }
    case "methodEscape": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order the scientific method to escape the room.",
          order: ["Observe", "Question", "Hypothesize", "Experiment", "Conclude"],
          hint: "Observation before questioning.",
          hints: ["Hypothesis precedes experiment.", "Conclusion is last."],
          explanation: "Classic scientific method order.",
        },
        {
          prompt: "Order the full scientific method (extended form).",
          order: ["Observe phenomenon", "Ask question", "Background research", "Form hypothesis", "Design experiment", "Run experiment", "Analyze data", "Draw conclusion", "Communicate results"],
          hint: "Adds research, analysis, and reporting.",
          hints: ["Background research informs the hypothesis.", "Communication is the last step."],
          explanation: "Extended scientific method spans 9 steps.",
        },
        {
          prompt: "Order the engineering design process.",
          order: ["Define problem", "Research", "Brainstorm solutions", "Prototype", "Test", "Iterate", "Communicate"],
          hint: "Designs cycle through test-and-iterate.",
          hints: ["Prototyping comes after brainstorming.", "Iteration loops back."],
          explanation: "Engineering process emphasizes prototypes and iteration.",
        },
      ]);
    }
    case "labSafety": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each behavior into safe or unsafe lab practice.",
          categories: ["Safe", "Unsafe"],
          items: [
            { label: "Wear goggles", category: "Safe" }, { label: "Tie hair back", category: "Safe" }, { label: "Label all chemicals", category: "Safe" }, { label: "Use a fume hood", category: "Safe" }, { label: "Know exit + eye-wash location", category: "Safe" },
            { label: "Eat in lab", category: "Unsafe" }, { label: "Mix unknown chemicals", category: "Unsafe" }, { label: "Run with glassware", category: "Unsafe" }, { label: "Pipette by mouth", category: "Unsafe" }, { label: "Pour acid into water reversed", category: "Unsafe" },
          ],
          hint: "PPE = safe; risky behavior = unsafe.",
          hints: ["Anything food-related is unsafe.", "Wearing protection is safe."],
          explanation: "Standard lab safety rules.",
        },
        {
          prompt: "Classify each item by what it protects against.",
          categories: ["Eye protection", "Skin protection", "Respiratory protection", "Fire protection"],
          items: [
            { label: "Goggles", category: "Eye protection" }, { label: "Face shield", category: "Eye protection" },
            { label: "Lab coat", category: "Skin protection" }, { label: "Nitrile gloves", category: "Skin protection" }, { label: "Closed-toe shoes", category: "Skin protection" },
            { label: "Respirator", category: "Respiratory protection" }, { label: "Fume hood", category: "Respiratory protection" },
            { label: "Fire blanket", category: "Fire protection" }, { label: "Extinguisher", category: "Fire protection" },
          ],
          hint: "Each PPE has a specific hazard target.",
          hints: ["Eyes need shielding from splash.", "Lungs need fume control."],
          explanation: "PPE is task-specific.",
        },
      ]);
    }
    case "variableControl": {
      const variants = [
        { ans: "Sunlight (controlled)", distractors: ["Water amount", "Plant growth", "Plant species (controlled)"], q: "Testing plant growth vs water amount. What's the controlled variable?", exp: "Sunlight is held constant across groups." },
        { ans: "Water amount", distractors: ["Sunlight", "Plant growth", "Plant species"], q: "Testing plant growth vs water. What's the independent variable?", exp: "Independent variables are what you change." },
        { ans: "Plant growth", distractors: ["Water amount", "Sunlight", "Soil type"], q: "Testing plant growth vs water. What's the dependent variable?", exp: "Dependent variables are what you measure." },
        { ans: "Temperature (controlled)", distractors: ["Sugar amount", "Yeast bubbles produced", "Yeast strain (controlled)"], q: "Testing yeast bubble rate vs sugar amount. What's a controlled variable?", exp: "Controlled variables stay constant across groups." },
        { ans: "Reaction rate", distractors: ["Catalyst dose", "Stir speed", "Beaker size"], q: "Testing reaction rate vs catalyst dose. What's the dependent variable?", exp: "Reaction rate is what's being measured." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", v.q, { kind: "icon", icon: m.emoji, title: "Experiment design", subtitle: "Identify the variable" }),
        hint: "Controlled = constant; independent = changed; dependent = measured.", hints: ["Independent variables are the cause.", "Dependent variables are the effect."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "dataGraph": {
      const variants = [
        { ans: "Bar chart for categorical", distractors: ["Line chart", "Scatter plot", "Histogram of x"], q: "You have counts of three plant species. Best graph?", exp: "Bar charts compare counts across categories." },
        { ans: "Line chart over time", distractors: ["Bar chart", "Pie chart", "Box plot"], q: "Temperature recorded every hour for a day. Best graph?", exp: "Line charts show trends over time." },
        { ans: "Scatter plot", distractors: ["Bar chart", "Line chart", "Pie chart"], q: "Studying how exercise time relates to heart rate. Best graph?", exp: "Scatter plots show relationships between two continuous variables." },
        { ans: "Histogram", distractors: ["Bar chart", "Line chart", "Pie chart"], q: "Showing the distribution of student test scores. Best graph?", exp: "Histograms show distributions of one continuous variable." },
        { ans: "Pie chart", distractors: ["Bar chart", "Line chart", "Scatter plot"], q: "Showing relative parts of a single whole (budget split). Best graph?", exp: "Pie charts represent parts of a whole." },
        { ans: "Box plot", distractors: ["Bar chart", "Pie chart", "Scatter plot"], q: "Comparing distributions of test scores across 4 classrooms. Best graph?", exp: "Box plots compare distributions side-by-side." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", v.q, { kind: "icon", icon: m.emoji, title: "Pick the graph", subtitle: "Data → visualization" }),
        hint: "Match data type to graph.", hints: ["Categorical → bar/pie.", "Continuous → histogram/scatter/line."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "hypothesisBuild": {
      const variants = [
        { ans: "If light increases, then growth increases", distractors: ["Plants are pretty", "I think growth might vary", "Nothing happens to plants"], q: "Pick a testable hypothesis about plant growth." },
        { ans: "If we add salt, water boils at a higher temperature", distractors: ["Salt is good for cooking", "Maybe water changes when salty", "Salt does something to water"], q: "Pick a testable hypothesis about boiling water." },
        { ans: "If the spring's mass doubles, its period increases by √2", distractors: ["Springs are stretchy", "Maybe spring period depends on mass", "Springs and mass are linked"], q: "Pick a testable hypothesis about a spring's oscillation." },
        { ans: "If yeast is warmer, it produces more CO₂ per minute", distractors: ["Yeast likes warmth", "Yeast is alive", "Warm yeast is happy"], q: "Pick a testable hypothesis about yeast fermentation." },
        { ans: "If a metal is heated, its electrical resistance rises", distractors: ["Metals are interesting", "Resistance may change", "Hot metal is weird"], q: "Pick a testable hypothesis about a metal wire's resistance." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", v.q, { kind: "icon", icon: m.emoji, title: "Hypothesis", subtitle: "If…then" }),
        hint: "Should be falsifiable.", hints: ["Avoid vague claims.", "Use If…then…"], explanation: "If-then hypotheses can be tested and disproven." }, v.ans, v.distractors);
    }
    case "experimentDesign": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order one rigorous experiment.",
          order: ["Define question", "Form hypothesis", "Control variables", "Run trials", "Analyze results"],
          hint: "Define before testing.",
          hints: ["Set hypothesis first.", "Analyze last."],
          explanation: "Standard experimental design.",
        },
        {
          prompt: "Order a clinical trial design (rigorous version).",
          order: ["Define question", "Recruit participants", "Randomize to groups", "Blind the trial", "Apply intervention", "Measure outcomes", "Analyze data", "Publish results"],
          hint: "Randomization comes before intervention.",
          hints: ["Blinding reduces bias.", "Publication is final."],
          explanation: "Clinical trials use randomization, blinding, and replication.",
        },
        {
          prompt: "Order the parts of writing a lab report.",
          order: ["Title", "Abstract", "Introduction", "Methods", "Results", "Discussion", "References"],
          hint: "Standard scientific paper structure.",
          hints: ["Abstract summarizes everything.", "Discussion interprets results."],
          explanation: "IMRaD-style structure.",
        },
      ]);
    }
    case "measureUnit": {
      const banks: [string, string][][] = [
        [["Length", "meter"], ["Mass", "kilogram"], ["Time", "second"], ["Current", "ampere"]],
        [["Temperature", "kelvin"], ["Luminous intensity", "candela"], ["Amount of substance", "mole"], ["Frequency", "hertz"]],
        [["Force", "newton"], ["Energy", "joule"], ["Power", "watt"], ["Pressure", "pascal"]],
        [["Voltage", "volt"], ["Resistance", "ohm"], ["Capacitance", "farad"], ["Inductance", "henry"]],
        [["Speed", "m/s"], ["Acceleration", "m/s²"], ["Density", "kg/m³"], ["Charge", "coulomb"]],
      ];
      return matchPuzzle(m, difficulty, "Pair each quantity with its SI unit.", pick(banks));
    }
    case "obsInference": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each statement into observation or inference.",
          categories: ["Observation", "Inference"],
          items: [
            { label: "The leaf is green", category: "Observation" }, { label: "Mass = 3.2 g", category: "Observation" }, { label: "There were 12 marks", category: "Observation" }, { label: "pH measured at 6.4", category: "Observation" },
            { label: "It must be sick", category: "Inference" }, { label: "It was a good year", category: "Inference" }, { label: "They were happy", category: "Inference" }, { label: "Soil was probably acidic", category: "Inference" },
          ],
          hint: "Observations are direct; inferences interpret.",
          hints: ["Measure or describe = observation.", "Explain or judge = inference."],
          explanation: "Senses = observation; interpretation = inference.",
        },
        {
          prompt: "Classify each statement as qualitative or quantitative observation.",
          categories: ["Qualitative", "Quantitative"],
          items: [
            { label: "The leaf is shiny", category: "Qualitative" }, { label: "Smell of sulfur", category: "Qualitative" }, { label: "Liquid is blue", category: "Qualitative" },
            { label: "Mass = 5.4 g", category: "Quantitative" }, { label: "Length = 12 cm", category: "Quantitative" }, { label: "Temperature = 38 °C", category: "Quantitative" }, { label: "pH = 3.2", category: "Quantitative" },
          ],
          hint: "Numbers = quantitative; descriptions = qualitative.",
          hints: ["Quantitative has units.", "Qualitative uses words only."],
          explanation: "Each observation is either descriptive or measured.",
        },
      ]);
    }
    case "evidenceRank": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Rank evidence by quality (best first).",
          order: ["Primary peer-reviewed", "Secondary review", "Reputable news", "Blog post", "Unverified claim"],
          hint: "Peer-reviewed beats unverified.",
          hints: ["Reviews summarize primary work.", "Blogs are usually opinion."],
          explanation: "Standard evidence pyramid.",
        },
        {
          prompt: "Order types of medical evidence from strongest to weakest.",
          order: ["Systematic review / meta-analysis", "Randomized controlled trial", "Cohort study", "Case-control study", "Case series", "Expert opinion"],
          hint: "Meta-analyses sit at the top.",
          hints: ["RCTs control bias.", "Case series are anecdotal."],
          explanation: "Hierarchy of medical evidence.",
        },
        {
          prompt: "Rank these sources by reliability for a research paper.",
          order: ["Peer-reviewed journal", "Academic textbook", "Reputable news article", "Wikipedia", "Social media post"],
          hint: "Peer review > editorial > unedited.",
          hints: ["Wikipedia is a starting point only.", "Social media is unverified."],
          explanation: "Editorial rigor determines reliability.",
        },
      ]);
    }
    case "claimEvidence": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order a CER-style argument.",
          order: ["Make claim", "Gather evidence", "Connect reasoning", "Address counter", "Conclude"],
          hint: "Claim first, conclusion last.",
          hints: ["Reasoning ties evidence to claim.", "Counterargument tests it."],
          explanation: "Claim → evidence → reasoning → counter → conclusion.",
        },
        {
          prompt: "Order the structure of a Toulmin argument.",
          order: ["Claim", "Data", "Warrant", "Backing", "Qualifier", "Rebuttal"],
          hint: "Toulmin's six elements.",
          hints: ["Warrant connects data to claim.", "Qualifiers limit the claim."],
          explanation: "Toulmin model lays out six argument parts.",
        },
        {
          prompt: "Order the parts of a strong evidence-based answer.",
          order: ["State position", "Provide evidence", "Explain reasoning", "Acknowledge counter", "Refute counter", "Restate position"],
          hint: "Defense includes addressing the opposition.",
          hints: ["Counterarguments strengthen the position.", "Refute before restating."],
          explanation: "Strong arguments concede and refute.",
        },
      ]);
    }
    case "codeTrace": {
      const a = rand(2, 6), b = rand(2, 6);
      const ans = a + b;
      return makeChoice({ ...base(m, difficulty, "choice", `let a = ${a}; let b = ${b}; return a + b;  → ?`, { kind: "code", title: "JS trace", subtitle: "What is returned?", code: { lines: [`let a = ${a};`, `let b = ${b};`, `return a + b;`], highlight: 2 } }),
        hint: "Read top to bottom.", hints: ["Compute the sum.", `${a} + ${b}`], explanation: `Return value: ${ans}.` }, String(ans), numberChoices(ans));
    }
    case "debugFunction": {
      const variants = [
        {
          ans: "Off-by-one in loop bound",
          q: "for (i=0; i<=n; i++) sum += arr[i]; — what's the bug?",
          code: ["for (i=0; i<=n; i++)", "  sum += arr[i];"],
          distractors: ["sum not initialized", "i never updates", "arr is read-only"],
          exp: "Using <= n reads past the array; should be < n.",
        },
        {
          ans: "Missing return inside the loop",
          q: "function find(x, arr) { for (e of arr) if (e===x) true; return false; } — bug?",
          code: ["function find(x, arr) {", "  for (e of arr) if (e===x) true;", "  return false;", "}"],
          distractors: ["arr is undefined", "Wrong comparison operator", "Loop never runs"],
          exp: "The 'true' inside the loop isn't returned, so the function always returns false.",
        },
        {
          ans: "Mutating array while iterating",
          q: "for (i=0;i<arr.length;i++) arr.splice(i,1); — bug?",
          code: ["for (i=0;i<arr.length;i++)", "  arr.splice(i,1);"],
          distractors: ["arr is read-only", "Off-by-one", "Wrong operator"],
          exp: "Splicing during iteration skips elements; index drift leaves half the array.",
        },
        {
          ans: "Floating-point comparison with ==",
          q: "if (0.1+0.2 === 0.3) alert('ok'); — bug?",
          code: ["if (0.1 + 0.2 === 0.3)", "  alert('ok');"],
          distractors: ["alert is undefined", "Off-by-one", "Syntax error"],
          exp: "0.1+0.2 ≠ 0.3 in IEEE 754; compare with an epsilon.",
        },
        {
          ans: "Async function isn't awaited",
          q: "function load() { const data = fetch(url).json(); return data; } — bug?",
          code: ["function load() {", "  const data = fetch(url).json();", "  return data;", "}"],
          distractors: ["fetch is undefined", "url is read-only", "Off-by-one"],
          exp: "fetch returns a Promise; you must await it before calling .json().",
        },
        {
          ans: "Closure captures the same variable",
          q: "for (var i=0; i<3; i++) setTimeout(() => log(i), 0); — what prints?",
          code: ["for (var i=0;i<3;i++)", "  setTimeout(()=>log(i),0);"],
          distractors: ["Always prints 0", "Throws an error", "Prints nothing"],
          exp: "var hoists; all closures share i, which equals 3 by the time callbacks run.",
        },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", v.q, { kind: "code", title: "Spot the bug", subtitle: "What's wrong?", code: { lines: v.code } }),
        hint: "Read carefully, then trace one iteration.", hints: ["Bugs hide near boundaries.", "Watch loops, returns, and async."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "algorithmSorter": {
      const traceAlgos = [
        {
          name: "bubble sort",
          run: (input: number[]) => {
            const cur = input.slice();
            const states: number[][] = [cur.slice()];
            for (let i = 0; i < cur.length - 1; i++) {
              for (let j = 0; j < cur.length - 1 - i; j++) {
                const left = cur[j] as number;
                const right = cur[j + 1] as number;
                if (left > right) {
                  cur[j] = right;
                  cur[j + 1] = left;
                }
              }
              states.push(cur.slice());
            }
            return states;
          },
          hint: "After each full pass, the largest unsorted value lands at the right.",
        },
        {
          name: "selection sort",
          run: (input: number[]) => {
            const cur = input.slice();
            const states: number[][] = [cur.slice()];
            for (let i = 0; i < cur.length - 1; i++) {
              let minIdx = i;
              for (let j = i + 1; j < cur.length; j++) {
                if ((cur[j] as number) < (cur[minIdx] as number)) minIdx = j;
              }
              if (minIdx !== i) {
                const tmp = cur[i] as number;
                cur[i] = cur[minIdx] as number;
                cur[minIdx] = tmp;
              }
              states.push(cur.slice());
            }
            return states;
          },
          hint: "Each pass swaps the next smallest value into place.",
        },
        {
          name: "insertion sort",
          run: (input: number[]) => {
            const cur = input.slice();
            const states: number[][] = [cur.slice()];
            for (let i = 1; i < cur.length; i++) {
              let j = i;
              while (j > 0 && (cur[j - 1] as number) > (cur[j] as number)) {
                const tmp = cur[j] as number;
                cur[j] = cur[j - 1] as number;
                cur[j - 1] = tmp;
                j--;
              }
              states.push(cur.slice());
            }
            return states;
          },
          hint: "Each step inserts the next element into the sorted prefix.",
        },
      ];
      const traceStarts: number[][] = [
        [3, 1, 4, 2],
        [5, 2, 4, 1],
        [4, 1, 3, 2],
        [2, 4, 1, 3],
        [3, 4, 1, 2],
        [5, 1, 3, 2],
        [4, 2, 1, 3],
        [6, 2, 5, 3, 1],
        [4, 1, 5, 2, 3],
      ];
      const traceCandidates: { algoName: string; algoHint: string; labels: string[] }[] = [];
      for (const algo of traceAlgos) {
        for (const start of traceStarts) {
          const labels = algo.run(start).map((s) => `[${s.join(",")}]`);
          if (new Set(labels).size === labels.length) {
            traceCandidates.push({ algoName: algo.name, algoHint: algo.hint, labels });
          }
        }
      }
      if (Math.random() < 0.45 && traceCandidates.length > 0) {
        const candidate = pick(traceCandidates);
        return reorderEng(
          m,
          difficulty,
          `Trace ${candidate.algoName} on ${candidate.labels[0]}. Order the array after each pass.`,
          candidate.labels,
          candidate.algoHint,
          ["Simulate the algorithm one pass at a time.", "Compare each pass against the previous state."],
          `${candidate.algoName} produces ${candidate.labels.join(" → ")}.`,
        );
      }

      const banks: { title: string; order: string[]; hint: string; hints: string[]; explanation: string }[] = [
        {
          title: "bubble sort (one pass)",
          order: [
            "Compare adjacent pair",
            "Swap if left > right",
            "Advance to next pair",
            "Reach the end of the array",
            "Largest now sits at the end",
          ],
          hint: "Compare → maybe swap → advance.",
          hints: ["Each pass bubbles the max to the right.", "Repeat passes until no swaps."],
          explanation: "Bubble sort compares neighbours, swaps, advances, and repeats.",
        },
        {
          title: "selection sort (one pass)",
          order: [
            "Mark the next position",
            "Scan the rest for the minimum",
            "Swap minimum into position",
            "Advance the boundary",
            "Sorted region grew by one",
          ],
          hint: "Find the min, swap it into the next slot.",
          hints: ["Each pass adds one element to the sorted prefix.", "The unsorted region shrinks by one."],
          explanation: "Selection sort places the smallest remaining value each pass.",
        },
        {
          title: "insertion sort (one pass)",
          order: [
            "Pick the next unsorted element",
            "Compare to the sorted prefix",
            "Shift larger elements right",
            "Insert at the correct slot",
            "Sorted prefix grows by one",
          ],
          hint: "Shift larger items right, then drop the value in.",
          hints: ["Sorted prefix lives on the left.", "Like sorting playing cards in hand."],
          explanation: "Insertion sort keeps a sorted prefix and inserts each new value.",
        },
        {
          title: "merge sort",
          order: [
            "Split array in half",
            "Recurse on the left half",
            "Recurse on the right half",
            "Merge the two sorted halves",
            "Return the combined sorted array",
          ],
          hint: "Divide → conquer → merge.",
          hints: ["Base case is length-1.", "Merge step is linear in n."],
          explanation: "Merge sort recursively splits, sorts, and merges in O(n log n).",
        },
        {
          title: "quicksort",
          order: [
            "Pick a pivot",
            "Partition: less-than left, greater-than right",
            "Recurse on left side",
            "Recurse on right side",
            "Return the concatenated result",
          ],
          hint: "Pivot → partition → recurse.",
          hints: ["Pivot choice matters.", "Bad pivots → O(n²) worst case."],
          explanation: "Quicksort partitions around a pivot and recurses on each side.",
        },
        {
          title: "heapsort",
          order: [
            "Build a max-heap from the array",
            "Swap root with last element",
            "Shrink the heap by one",
            "Sift down the new root",
            "Repeat until the heap is empty",
          ],
          hint: "Heapify → swap root → sift.",
          hints: ["Max-heap puts the max on top.", "Sift-down restores the heap property."],
          explanation: "Heapsort uses a max-heap to extract the max each pass.",
        },
        {
          title: "counting sort",
          order: [
            "Find the value range",
            "Count occurrences per value",
            "Compute prefix sums of counts",
            "Place each value at its index",
            "Read off the sorted array",
          ],
          hint: "Count, accumulate, place.",
          hints: ["Linear time when the range is small.", "Stable when iterated right-to-left."],
          explanation: "Counting sort runs in O(n + k) for small integer ranges.",
        },
        {
          title: "radix sort (LSD)",
          order: [
            "Find the max digit count",
            "Bucket by least-significant digit",
            "Reassemble in bucket order",
            "Move to the next digit",
            "Final pass yields the sorted array",
          ],
          hint: "Bucket digit-by-digit, low → high.",
          hints: ["Stable per-digit sort is required.", "Works for fixed-width integer keys."],
          explanation: "Radix sort sorts digit-by-digit using a stable bucket sort.",
        },
        {
          title: "shell sort",
          order: [
            "Choose a gap sequence",
            "Sort sub-lists separated by the gap",
            "Reduce the gap",
            "Repeat sub-list sorts",
            "Final pass with gap = 1",
          ],
          hint: "Gapped insertion, shrinking gap.",
          hints: ["Last pass is plain insertion sort.", "Gap choice affects complexity."],
          explanation: "Shell sort generalises insertion sort with shrinking gaps.",
        },
        {
          title: "topological sort",
          order: [
            "Compute indegree of every node",
            "Queue all zero-indegree nodes",
            "Pop a node and emit it",
            "Decrement indegree of its neighbours",
            "Repeat until the queue is empty",
          ],
          hint: "Kahn's algorithm: track indegrees, drain zeros.",
          hints: ["Cycle → some node never reaches indegree 0.", "Use a queue for FIFO ordering."],
          explanation: "Kahn's topological sort drains zero-indegree nodes one by one.",
        },
      ];

      const bank = pick(banks);
      return reorderEng(
        m,
        difficulty,
        `Order the steps of ${bank.title}.`,
        bank.order,
        bank.hint,
        bank.hints,
        bank.explanation,
      );
    }
    case "apiFlow": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order a REST API round-trip.",
          order: ["Build request", "Send to server", "Server processes", "Return response", "Client renders"],
          hint: "Client first, server second.",
          hints: ["Requests precede responses.", "Render is last."],
          explanation: "Standard request → response → render flow.",
        },
        {
          prompt: "Order the steps of a GraphQL request flow.",
          order: ["Build query", "Send to /graphql", "Server validates schema", "Resolvers fetch data", "Compose response", "Client caches result"],
          hint: "GraphQL queries pass through resolvers.",
          hints: ["Schema validation comes early.", "Caching is client-side."],
          explanation: "GraphQL adds schema validation and resolver dispatch.",
        },
        {
          prompt: "Order the OAuth 2.0 authorization-code flow.",
          order: ["Client redirects user to auth server", "User authenticates", "Auth server returns code", "Client exchanges code for token", "Client calls API with token", "API returns data"],
          hint: "Code first, then token, then API call.",
          hints: ["The auth code is short-lived.", "Tokens grant API access."],
          explanation: "OAuth 2 authorization-code grant has six well-defined steps.",
        },
        {
          prompt: "Order a webhook delivery sequence.",
          order: ["Event happens on source service", "Source builds payload", "Source POSTs to target URL", "Target verifies signature", "Target processes event", "Target returns 200 OK"],
          hint: "Webhooks are reverse APIs.",
          hints: ["Signature verification is crucial.", "Target must respond quickly."],
          explanation: "Webhooks push events from source to target.",
        },
      ]);
    }
    case "neuralNetwork": {
      const variants = [
        { ans: "ReLU", distractors: ["Identity", "Constant", "Linear scale"], target: "Activation function", q: "Drop the activation that introduces non-linearity into the network.", hint: "Linear functions stack to linear.", exp: "ReLU adds the non-linearity neural nets need." },
        { ans: "Softmax", distractors: ["ReLU", "Sigmoid", "Tanh"], target: "Output layer", q: "Drop the activation that turns logits into a probability distribution.", hint: "Used at the output of multiclass classifiers.", exp: "Softmax normalizes scores to sum to 1." },
        { ans: "Sigmoid", distractors: ["ReLU", "Softmax", "Linear"], target: "Binary output", q: "Drop the activation that squashes to (0,1) for binary classification.", hint: "Logistic curve.", exp: "Sigmoid outputs a single probability for binary tasks." },
        { ans: "Cross-entropy loss", distractors: ["MSE", "L1", "Hinge"], target: "Classification loss", q: "Drop the loss function used for multiclass classification.", hint: "Use with softmax outputs.", exp: "Cross-entropy is standard for classification probabilities." },
        { ans: "MSE", distractors: ["Cross-entropy", "Hinge", "Triplet"], target: "Regression loss", q: "Drop the loss function used for regression problems.", hint: "Squares of errors.", exp: "Mean squared error penalizes large errors in regression." },
        { ans: "Adam", distractors: ["SGD", "BFGS", "Newton"], target: "Optimizer", q: "Drop the adaptive momentum optimizer that combines momentum and RMSProp.", hint: "Adam = Adaptive Moment estimation.", exp: "Adam adapts learning rate per parameter using moment estimates." },
        { ans: "Dropout", distractors: ["BatchNorm", "Pooling", "Padding"], target: "Regularization", q: "Drop the regularization technique that randomly zeros out activations during training.", hint: "Prevents co-adaptation.", exp: "Dropout randomly masks units to reduce overfitting." },
      ];
      const v = pick(variants);
      return dragEng(m, difficulty, v.q, v.ans, v.distractors,
        v.target, v.hint, ["Each ML component has a distinct role.", "Match function to purpose."], v.exp);
    }
    case "phishingSort": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each email behavior into phishing or legitimate.",
          categories: ["Phishing", "Legitimate"],
          items: [
            { label: "Misspelled domain", category: "Phishing" },
            { label: "Urgent transfer demand", category: "Phishing" },
            { label: "Asks for password by email", category: "Phishing" },
            { label: "Internal newsletter from known sender", category: "Legitimate" },
            { label: "Receipt from real order", category: "Legitimate" },
            { label: "Verified two-factor prompt", category: "Legitimate" },
          ],
          hint: "Watch for pressure and spoofed details.",
          hints: ["Urgency + odd asks = phishing.", "Verified known senders are legit."],
          explanation: "Phishing has pressure and spoofed details; legitimate mail is expected and verifiable.",
        },
        {
          prompt: "Classify each red flag as a phishing signal or a benign signal.",
          categories: ["Red flag", "Benign"],
          items: [
            { label: "Display name mimics CEO", category: "Red flag" },
            { label: "Reply-to domain doesn't match", category: "Red flag" },
            { label: "Attachment with macros", category: "Red flag" },
            { label: "DKIM + SPF pass", category: "Benign" },
            { label: "Link to canonical company domain", category: "Benign" },
            { label: "Plain text receipt from order history", category: "Benign" },
          ],
          hint: "Mismatched identity + pressure = phishing.",
          hints: ["Check reply-to and SPF/DKIM.", "Legit mail tolerates skepticism."],
          explanation: "Phishing leans on spoofed identity, urgency, and risky attachments.",
        },
        {
          prompt: "Sort each user response as safe or risky when an unknown email arrives.",
          categories: ["Safe", "Risky"],
          items: [
            { label: "Hover the link, inspect URL", category: "Safe" },
            { label: "Forward to security team", category: "Safe" },
            { label: "Open attachment from unknown sender", category: "Risky" },
            { label: "Enter password into linked form", category: "Risky" },
            { label: "Reply to verify sender via known channel", category: "Safe" },
            { label: "Click 'unsubscribe' on unsolicited mail", category: "Risky" },
          ],
          hint: "Never trust the email's own links to verify itself.",
          hints: ["Use known channels.", "Don't act on pressure."],
          explanation: "Safe responses verify identity through trusted channels; risky ones trust the email.",
        },
      ]);
    }
    case "queryMatch": {
      return bankMatch(m, difficulty, [
        {
          prompt: "Pair each SQL clause with what it does.",
          pairs: [
            ["SELECT", "Read columns"],
            ["WHERE", "Filter rows"],
            ["GROUP BY", "Bucket rows"],
            ["ORDER BY", "Sort output"],
            ["HAVING", "Filter groups"],
            ["LIMIT", "Cap row count"],
          ],
          hint: "Each clause shapes a different phase of the query.",
          hints: ["WHERE filters before grouping.", "HAVING filters after grouping."],
          explanation: "Each SQL clause has a distinct role in the query pipeline.",
        },
        {
          prompt: "Match each SQL aggregate to what it computes.",
          pairs: [
            ["COUNT(*)", "Number of rows"],
            ["SUM(x)", "Total of x"],
            ["AVG(x)", "Mean of x"],
            ["MIN(x)", "Smallest x"],
            ["MAX(x)", "Largest x"],
          ],
          hint: "Aggregates collapse many rows into one number.",
          hints: ["AVG ignores NULLs.", "COUNT(*) includes NULLs."],
          explanation: "Aggregates summarize groups of rows into a single value.",
        },
        {
          prompt: "Pair each clause with the query phase it controls.",
          pairs: [
            ["FROM", "Source tables"],
            ["JOIN", "Combine tables"],
            ["WHERE", "Row filter"],
            ["GROUP BY", "Buckets"],
            ["SELECT", "Projection"],
          ],
          hint: "FROM/JOIN feed the rest of the pipeline.",
          hints: ["FROM is logically first.", "SELECT is logically last."],
          explanation: "SQL clauses correspond to distinct query phases.",
        },
      ]);
    }
    case "robotCommand": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order the robot commands to draw an L-shape.",
          order: ["forward(1)", "turn(90)", "forward(2)", "turn(-90)", "forward(1)"],
          hint: "Move → turn → move.",
          hints: ["Turn 90° after the first leg.", "Final move closes the L."],
          explanation: "Move-turn-move pattern draws the L.",
        },
        {
          prompt: "Order the robot commands to drive a square.",
          order: ["forward(2)", "turn(90)", "forward(2)", "turn(90)", "forward(2)", "turn(90)", "forward(2)"],
          hint: "Four legs of equal length with 90° turns.",
          hints: ["Each turn is 90°.", "Path returns to start."],
          explanation: "Four equal moves with three 90° turns close the square.",
        },
        {
          prompt: "Order the commands so the robot stops at the wall safely.",
          order: ["sense()", "if too_close: stop", "else forward(1)", "loop()"],
          hint: "Always sense before moving.",
          hints: ["Sensor reading drives the decision."],
          explanation: "Sense → branch → act → loop is the standard reactive pattern.",
        },
        {
          prompt: "Order the commands to pick up an item to the right.",
          order: ["sense()", "turn(90)", "forward(1)", "grip()", "back(1)", "turn(-90)"],
          hint: "Face the target, grasp, retreat, re-align.",
          hints: ["Always grip after positioning.", "Reverse the turn at the end."],
          explanation: "Position, grip, retreat, re-align is a safe pickup sequence.",
        },
      ]);
    }
    case "bridgeStrength": {
      const target = +(rand(2, 8)).toFixed(0);
      return sliderEng(m, difficulty, `Tune truss member count to ${target} for safe bridge.`, { min: 0, max: 10, step: 1, initial: 0, target }, `${target} members`,
        "More members = stiffer.", ["Triangles are stable.", "Stop on the labeled count."], `Target member count: ${target}.`);
    }
    case "pulleyForce": {
      const target = +(rand(1, 4)).toFixed(0);
      return sliderEng(m, difficulty, `Add pulleys until effort = load / ${target}.`, { min: 1, max: 5, step: 1, initial: 1, target }, `MA = ${target}`,
        "Each additional pulley adds advantage.", ["MA equals supporting strands.", "Stop on the labeled MA."], `Mechanical advantage target was ${target}.`);
    }
    case "structuralLoad": {
      const variants = [
        { q: "Uniform load on a simply-supported beam — where will it fail?", ans: "Mid-span beam fails first", distractors: ["End support fails first", "Edges always fail", "Top corner fails"], exp: "Uniformly loaded simple beam has max bending moment at mid-span." },
        { q: "Cantilever beam with a tip load — where will it fail?", ans: "At the fixed end (base)", distractors: ["At the free tip", "Mid-span", "Top corner"], exp: "Cantilever bending moment maxes at the wall." },
        { q: "Simply-supported beam with a point load at center — where will it fail?", ans: "Right under the load", distractors: ["At supports", "Halfway between support and load", "Both ends"], exp: "Bending moment peaks directly beneath a center point load." },
        { q: "Tall column with axial load — what mode of failure is most likely if column is slender?", ans: "Euler buckling", distractors: ["Tension failure", "Local crushing only", "Brittle fracture only"], exp: "Slender columns fail by Euler buckling before crushing." },
        { q: "Frame with lateral wind load — where do shear forces concentrate?", ans: "At the base columns", distractors: ["At the roof apex", "At interior beams", "At the windows"], exp: "Lateral wind shear is reacted at the base supports." },
        { q: "Truss bridge with a heavy live load at mid-span — which member sees max compression?", ans: "Top chord at mid-span", distractors: ["Bottom chord at end", "Diagonal at end", "Vertical at quarter span"], exp: "Top chord compresses; bottom chord tensions; mid-span gets max axial forces." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", v.q, { kind: "icon", icon: "🏗️", title: "Find max stress location", subtitle: "Bending / buckling / shear" }),
        hint: "Map load → bending moment & shear diagrams.", hints: ["Supports react with shear.", "Bending moment usually peaks under loads or at fixed ends."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "waterFlowSystem": {
      const banks: string[][] = [
        ["Reservoir", "Pump", "Pipe", "Valve", "Outlet"],
        ["Source", "Intake screen", "Pump", "Filter", "Distribution pipe", "Tap"],
        ["Roof catchment", "Gutter", "Downspout", "Cistern", "First-flush diverter", "Filter", "Tap"],
        ["River", "Intake", "Sedimentation", "Filtration", "Disinfection", "Distribution main", "Home tap"],
        ["Wastewater drain", "Sewer pipe", "Lift station", "Treatment plant", "Effluent outfall"],
      ];
      const stops = pick(banks);
      return pathEng(m, difficulty, "Trace water through this system in order.", stops, "Follow the flow path.", ["Pumps add pressure.", "Filters/treatments clean water."], `${stops[0]} → ... → ${stops[stops.length - 1]}.`);
    }
    case "rocketLaunch": {
      const target = +(rand(3, 9)).toFixed(0);
      return sliderEng(m, difficulty, `Tune fuel ratio to target ${target}.`, { min: 0, max: 12, step: 1, initial: 0, target }, `Fuel ratio ${target}`,
        "Higher Δv needs more fuel.", ["Stop on the labeled ratio.", "Use Tsiolkovsky intuition."], `Fuel ratio target: ${target}.`);
    }
    case "robotArmAngle": {
      const target = pick([60, 90, 120, 150, 180, 270] as const);
      const step = pick([15, 30, 45, 60] as const);
      return rotateEng(m, difficulty, `Rotate the gripper to ${target}° to face the target.`, target, step,
        `Each tap rotates ${step}°.`, [`Reach ${target}° total.`, `${target / step} tap${target / step === 1 ? "" : "s"} of ${step}°.`], `${target / step} × ${step}° rotations align the gripper to ${target}°.`);
    }
    case "circuitCompletion": {
      const variants = [
        { ans: "Wire", distractors: ["Switch open", "Air gap", "Broken trace"], target: "Closing element", q: "Drop the wire that closes the open loop.", hint: "Conductive path closes the circuit.", exp: "A wire restores the conductive path." },
        { ans: "Closed switch", distractors: ["Open switch", "Diode reversed", "Capacitor full"], target: "Closing element", q: "Drop the component that closes the loop when toggled.", hint: "Switches toggle conduction.", exp: "Closing the switch creates a complete loop." },
        { ans: "Forward-biased diode", distractors: ["Reverse-biased diode", "Open switch", "Empty socket"], target: "Conducting element", q: "Drop the element that conducts when oriented correctly.", hint: "Diodes conduct in one direction.", exp: "Forward-biased diode conducts; reverse-biased blocks." },
        { ans: "Conductor", distractors: ["Insulator", "Open break", "Burned fuse"], target: "Path element", q: "Drop the path element that allows current to flow.", hint: "Conductors allow electrons through.", exp: "Conductors complete circuits; insulators do not." },
        { ans: "Replacement fuse", distractors: ["Blown fuse", "Cut wire", "Loose connector"], target: "Repair element", q: "Drop the part that restores a circuit after a blown fuse.", hint: "Replace the failed safety element.", exp: "Replacing the fuse restores the conductive path." },
      ];
      const v = pick(variants);
      return dragEng(m, difficulty, v.q, v.ans, v.distractors,
        v.target, v.hint, ["A circuit needs a continuous path.", "Identify what's preventing conduction."], v.exp);
    }
    case "materialStrength": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each material into stiff or flexible.",
          categories: ["Stiff", "Flexible"],
          items: [
            { label: "Steel", category: "Stiff" }, { label: "Diamond", category: "Stiff" }, { label: "Tungsten", category: "Stiff" }, { label: "Titanium", category: "Stiff" },
            { label: "Rubber", category: "Flexible" }, { label: "Silicone", category: "Flexible" }, { label: "Foam", category: "Flexible" }, { label: "Soft plastic", category: "Flexible" },
          ],
          hint: "Stiff materials resist bending.",
          hints: ["High modulus = stiff.", "Elastic and squishy = flexible."],
          explanation: "Stiff = high modulus; flexible = low modulus.",
        },
        {
          prompt: "Sort each material by failure mode.",
          categories: ["Brittle", "Ductile"],
          items: [
            { label: "Cast iron", category: "Brittle" }, { label: "Glass", category: "Brittle" }, { label: "Ceramic", category: "Brittle" }, { label: "Concrete", category: "Brittle" },
            { label: "Copper", category: "Ductile" }, { label: "Mild steel", category: "Ductile" }, { label: "Aluminum", category: "Ductile" }, { label: "Lead", category: "Ductile" },
          ],
          hint: "Brittle materials shatter; ductile ones stretch.",
          hints: ["Glass/ceramic crack suddenly.", "Metals usually deform first."],
          explanation: "Failure mode depends on the material's stress-strain curve.",
        },
        {
          prompt: "Sort each material by weight-to-strength.",
          categories: ["Light & strong", "Heavy & strong", "Light & weak"],
          items: [
            { label: "Carbon fiber composite", category: "Light & strong" }, { label: "Titanium", category: "Light & strong" }, { label: "Aluminum alloy", category: "Light & strong" },
            { label: "Steel", category: "Heavy & strong" }, { label: "Cast iron", category: "Heavy & strong" }, { label: "Tungsten", category: "Heavy & strong" },
            { label: "Foam", category: "Light & weak" }, { label: "Balsa wood", category: "Light & weak" }, { label: "Polystyrene", category: "Light & weak" },
          ],
          hint: "Compare density vs. tensile strength.",
          hints: ["Aerospace prefers light & strong.", "Civil prefers heavy & strong for compression."],
          explanation: "Specific strength sorts material choices in design.",
        },
      ]);
    }
    case "designConstraint": {
      const variants = [
        { q: "Cost ≤ $100, weight ≤ 2 kg, water-resistant required. Best strategy?", ans: "Pick the option that fits all hard constraints first", distractors: ["Maximize features then cut", "Pick cheapest regardless", "Ignore constraints"], exp: "Always satisfy hard constraints before optimizing trade-offs." },
        { q: "Battery life ≥ 8 h, weight ≤ 1 kg, screen ≥ 13\". Which trade-off applies?", ans: "Larger screen and longer battery usually cost weight or money", distractors: ["No trade-offs exist", "Cheaper is always better", "Bigger is always better"], exp: "Bigger screens add weight; longer battery adds weight or cost." },
        { q: "Hard constraint is one that…", ans: "Must be satisfied or the design fails", distractors: ["Can be ignored if needed", "Is the cheapest option", "Is decided last"], exp: "Hard constraints are non-negotiable requirements." },
        { q: "When two soft goals conflict, the design should…", ans: "Trade them off to optimize overall value", distractors: ["Pick one and abandon the other", "Pick the cheaper one", "Ignore both"], exp: "Soft goals are balanced via trade-off analysis." },
        { q: "A constraint matrix is used to…", ans: "Compare alternatives against the same constraints", distractors: ["Generate constraints from scratch", "Hide weak options", "Pick the most expensive option"], exp: "Constraint matrices systematize evaluation." },
        { q: "If all alternatives fail a hard constraint, you should…", ans: "Relax or redesign the constraint, not the alternatives", distractors: ["Pick the closest one", "Disable testing", "Choose randomly"], exp: "Unmet hard constraints require requirement renegotiation." },
      ];
      const v = pick(variants);
      return makeChoice({ ...base(m, difficulty, "choice", v.q, { kind: "icon", icon: "🧩", title: "Hard vs soft constraints", subtitle: "Trade-off" }),
        hint: "Hard constraints first, then optimize.", hints: ["Filter on hard requirements.", "Then optimize soft ones."], explanation: v.exp }, v.ans, v.distractors);
    }
    case "slopeField": {
      const variants = [
        { slope: 0, angle: 0, exp: "Horizontal line has slope 0 (angle 0°)." },
        { slope: 1, angle: 45, exp: "Slope 1 corresponds to 45°." },
        { slope: -1, angle: 135, exp: "Slope -1 corresponds to 135° (downward at 45°)." },
        { slope: Math.SQRT2, angle: 45, exp: "Slope ~√2 is close to 45° (use the nearest 45° tick)." },
        { slope: 0.58, angle: 30, exp: "Slope tan(30°) ≈ 0.58 corresponds to 30°." },
        { slope: 1.73, angle: 60, exp: "Slope √3 ≈ 1.73 corresponds to 60°." },
        { slope: -0.58, angle: 150, exp: "Slope -tan(30°) corresponds to 150°." },
      ];
      const v = pick(variants);
      const target = v.angle;
      const start = pick([0, 45, 90, 135]) as number;
      return rotateEng(m, difficulty, `Rotate the sample slope to align with dy/dx = ${v.slope.toFixed(2)}.`, target, start,
        "Slope = tan(angle).", [`Slope ${v.slope.toFixed(2)} → angle ${target}°.`, "Each tap rotates 45°."], v.exp);
    }
    case "areaBetween": {
      const a = rand(0, 3), b = a + rand(2, 4);
      const ans = (b * b * b - a * a * a) / 3 - (b * b - a * a) / 2;
      const rounded = +ans.toFixed(2);
      return dragEng(m, difficulty, `Area between y=x² and y=x from x=${a} to x=${b}. Drop the value.`, String(rounded),
        [String((b - a)), String((b * b - a * a) / 2), String((b - a) ** 2)],
        `∫_${a}^${b} (x²−x) dx`, "Integrate the difference.", ["Antiderivative x³/3 − x²/2.", "Evaluate at bounds."], `(${b}³/3 − ${b}²/2) − (${a}³/3 − ${a}²/2) ≈ ${rounded}.`);
    }

    case "probSpinner2": {
      const slices = pick([6, 8, 10, 12]);
      const red = rand(1, slices - 1);
      const ans = +(red / slices).toFixed(2);
      return numpadEng(
        m,
        difficulty,
        `A ${slices}-slice spinner has ${red} red slices. What is P(red) as a decimal?`,
        { kind: "icon", icon: "🎯", title: `${red}/${slices}`, subtitle: "Probability as decimal" },
        ans,
        "Probability = favorable ÷ total.",
        [`P(red) = ${red}/${slices}.`, "Divide red by total slices."],
        `${red} ÷ ${slices} = ${ans}.`,
      );
    }
    case "probAndOr": {
      const a = rand(2, 6), b = rand(2, 6);
      const isAnd = Math.random() < 0.5;
      const pA = a / 10, pB = b / 10;
      const ans = isAnd ? +(pA * pB).toFixed(2) : +(pA + pB - pA * pB).toFixed(2);
      return choiceEng(
        m,
        difficulty,
        `Independent events: P(A)=${pA}, P(B)=${pB}. What is ${isAnd ? "P(A and B)" : "P(A or B)"}?`,
        { kind: "icon", icon: "🎲", title: isAnd ? "P(A∩B)" : "P(A∪B)", subtitle: "Independent events" },
        String(ans),
        [String(+(pA + pB).toFixed(2)), String(+(pA * pB).toFixed(2)), String(+(pA + pB - pA).toFixed(2))].filter((x) => x !== String(ans)).slice(0, 3),
        isAnd ? "Multiply for AND." : "Add and subtract overlap for OR.",
        isAnd ? ["P(A∩B) = P(A)·P(B)."] : ["P(A∪B) = P(A) + P(B) − P(A∩B)."],
        isAnd ? `${pA}·${pB} = ${ans}.` : `${pA} + ${pB} − ${pA * pB} = ${ans}.`,
      );
    }
    case "combinations": {
      const n = rand(4, 8);
      const k = rand(2, Math.min(4, n - 1));
      const fact = (x: number): number => (x <= 1 ? 1 : x * fact(x - 1));
      const ans = fact(n) / (fact(k) * fact(n - k));
      return numpadEng(
        m,
        difficulty,
        `Compute C(${n}, ${k}).`,
        { kind: "icon", icon: "🧮", title: `C(${n},${k})`, subtitle: "n choose k" },
        ans,
        "Order does not matter.",
        [`C(n,k) = n! / (k!(n−k)!).`, `${n}! / (${k}!·${n - k}!).`],
        `${n}! / (${k}!·${n - k}!) = ${ans}.`,
      );
    }
    case "permutations": {
      const n = rand(4, 8);
      const k = rand(2, Math.min(4, n - 1));
      let ans = 1;
      for (let i = 0; i < k; i++) ans *= n - i;
      return numpadEng(
        m,
        difficulty,
        `Compute P(${n}, ${k}).`,
        { kind: "icon", icon: "🔢", title: `P(${n},${k})`, subtitle: "Ordered arrangements" },
        ans,
        "Order matters.",
        [`P(n,k) = n! / (n−k)!.`, `Product of ${k} terms starting at ${n}.`],
        `${n}·${n - 1}${k > 2 ? `·${n - 2}` : ""}${k > 3 ? `·${n - 3}` : ""} = ${ans}.`,
      );
    }
    case "conditionalProb": {
      const both = rand(2, 5);
      const a = both + rand(2, 5);
      const ans = +(both / a).toFixed(2);
      return numpadEng(
        m,
        difficulty,
        `Of ${a} students who play tennis, ${both} also play chess. What is P(chess | tennis)?`,
        { kind: "icon", icon: "🪙", title: `P(B|A) = ${both}/${a}`, subtitle: "Conditional probability" },
        ans,
        "Restrict the sample space to A.",
        [`P(B|A) = P(A∩B)/P(A).`, `${both} ÷ ${a}.`],
        `${both} ÷ ${a} = ${ans}.`,
      );
    }
    case "gcdHunt": {
      const a = rand(8, 60);
      const b = rand(8, 60);
      const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
      const ans = gcd(a, b);
      return numpadEng(
        m,
        difficulty,
        `Find GCD(${a}, ${b}).`,
        { kind: "icon", icon: "🧩", title: `gcd(${a}, ${b})`, subtitle: "Greatest common divisor" },
        ans,
        "Use the Euclidean algorithm.",
        [`gcd(a,b) = gcd(b, a mod b).`, `Stop when the remainder is 0.`],
        `gcd(${a}, ${b}) = ${ans}.`,
      );
    }
    case "lcmHunt": {
      const a = rand(4, 18);
      const b = rand(4, 18);
      const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
      const ans = (a * b) / gcd(a, b);
      return numpadEng(
        m,
        difficulty,
        `Find LCM(${a}, ${b}).`,
        { kind: "icon", icon: "🧠", title: `lcm(${a}, ${b})`, subtitle: "Least common multiple" },
        ans,
        "LCM × GCD = a × b.",
        [`lcm(a,b) = (a·b) / gcd(a,b).`],
        `(${a}·${b}) / ${gcd(a, b)} = ${ans}.`,
      );
    }
    case "modArithmetic": {
      const a = rand(20, 200);
      const n = rand(3, 12);
      const ans = a % n;
      return numpadEng(
        m,
        difficulty,
        `Compute ${a} mod ${n}.`,
        { kind: "icon", icon: "🔁", title: `${a} mod ${n}`, subtitle: "Remainder" },
        ans,
        "Find the remainder after dividing.",
        [`${a} = ${Math.floor(a / n)}·${n} + r.`, `r is between 0 and ${n - 1}.`],
        `${a} − ${Math.floor(a / n)}·${n} = ${ans}.`,
      );
    }
    case "primeFactor": {
      const targets = [12, 18, 20, 24, 30, 36, 40, 45, 48, 60, 72, 84, 90];
      const n = pick(targets);
      const factor = (x: number): number[] => {
        const out: number[] = [];
        let cur = x;
        for (let p = 2; cur > 1; p++) {
          while (cur % p === 0) {
            out.push(p);
            cur = cur / p;
          }
        }
        return out;
      };
      const fmt = (arr: number[]) => {
        const map = new Map<number, number>();
        for (const p of arr) map.set(p, (map.get(p) ?? 0) + 1);
        return [...map.entries()].map(([p, c]) => (c === 1 ? `${p}` : `${p}^${c}`)).join("·");
      };
      const ans = fmt(factor(n));
      const decoys = shuffle(targets.filter((x) => x !== n)).slice(0, 3).map((x) => fmt(factor(x)));
      return choiceEng(
        m,
        difficulty,
        `Pick the prime factorization of ${n}.`,
        { kind: "icon", icon: "🔱", title: `${n}`, subtitle: "Prime factorization" },
        ans,
        decoys,
        "Divide by the smallest primes first.",
        ["Try 2, then 3, then 5, …", "Stop when only primes remain."],
        `${n} = ${ans}.`,
      );
    }
    case "divisibilityRule": {
      const pool: Record<string, number[]> = {
        "÷ by 2": [12, 18, 24, 36, 50, 88, 102, 246],
        "÷ by 3": [21, 36, 48, 57, 84, 102, 123, 171],
        "÷ by 4": [16, 24, 28, 44, 60, 132, 216, 308],
        "÷ by 5": [15, 20, 35, 50, 85, 100, 145, 200],
        "÷ by 6": [12, 18, 24, 36, 54, 102, 126, 246],
        "÷ by 9": [18, 27, 36, 45, 54, 81, 117, 198],
        "÷ by 10": [10, 20, 50, 80, 100, 220, 540, 700],
        "÷ by 11": [22, 33, 44, 55, 121, 187, 242, 363],
      };
      const categories = sample(Object.keys(pool), rand(2, 3));
      const items: { label: string; category: string }[] = [];
      for (const cat of categories) {
        const nums = sample(pool[cat] ?? [], 2);
        for (const n of nums) items.push({ label: String(n), category: cat });
      }
      return sortEng(
        m,
        difficulty,
        "Sort each number by which divisibility rule it satisfies.",
        categories,
        items,
        "Apply the digit-based rule for each divisor.",
        ["Sum digits for ÷3 and ÷9.", "Last two digits for ÷4.", "Last digit for ÷2/5/10."],
        "Use the divisibility test for each candidate divisor.",
      );
    }
    case "simpleInterest": {
      const p = pick([500, 800, 1000, 1200, 1500, 2000]);
      const r = pick([0.04, 0.05, 0.06, 0.08, 0.1]);
      const t = rand(2, 5);
      const ans = +(p * r * t).toFixed(2);
      return numpadEng(
        m,
        difficulty,
        `$${p} at ${r * 100}% simple interest for ${t} years. Interest = ?`,
        { kind: "icon", icon: "💰", title: `I = P·r·t`, subtitle: `P=${p}, r=${r}, t=${t}` },
        ans,
        "I = P · r · t.",
        [`Multiply principal, rate, and time.`],
        `${p}·${r}·${t} = ${ans}.`,
      );
    }
    case "compoundInterest": {
      const p = pick([1000, 1500, 2000, 2500]);
      const r = pick([0.05, 0.06, 0.08, 0.1]);
      const t = rand(2, 4);
      const ans = +(p * Math.pow(1 + r, t)).toFixed(2);
      return numpadEng(
        m,
        difficulty,
        `$${p} compounded annually at ${r * 100}% for ${t} years. Final balance?`,
        { kind: "icon", icon: "📈", title: `A = P(1+r)^t`, subtitle: `P=${p}, r=${r}, t=${t}` },
        ans,
        "A = P(1+r)^t.",
        [`(1+${r})^${t} multiplies the principal.`],
        `${p}·(${(1 + r).toFixed(2)})^${t} ≈ ${ans}.`,
      );
    }
    case "percentDiscount": {
      const price = pick([20, 25, 40, 50, 60, 80, 100, 120]);
      const off = pick([10, 15, 20, 25, 30, 40]);
      const ans = +(price * (1 - off / 100)).toFixed(2);
      return numpadEng(
        m,
        difficulty,
        `Item costs $${price}. Take ${off}% off. Sale price?`,
        { kind: "icon", icon: "🏷️", title: `${off}% off`, subtitle: `Was $${price}` },
        ans,
        "Multiply by (1 − discount).",
        [`Discount = ${price}·${off / 100}.`, `Sale = price − discount.`],
        `${price} − ${price}·${off / 100} = ${ans}.`,
      );
    }
    case "taxTip": {
      const subtotal = pick([20, 25, 30, 40, 50, 60, 80]);
      const tax = pick([0.07, 0.08, 0.09, 0.1]);
      const tip = pick([0.15, 0.18, 0.2]);
      const ans = +(subtotal * (1 + tax + tip)).toFixed(2);
      return numpadEng(
        m,
        difficulty,
        `Subtotal $${subtotal}. Add ${(tax * 100).toFixed(0)}% tax and ${tip * 100}% tip. Total?`,
        { kind: "icon", icon: "🧾", title: `+ tax + tip`, subtitle: `Subtotal $${subtotal}` },
        ans,
        "Total = subtotal · (1 + tax + tip).",
        [`Tax = ${subtotal}·${tax}.`, `Tip = ${subtotal}·${tip}.`],
        `${subtotal}·(1+${tax}+${tip}) = ${ans}.`,
      );
    }
    case "budgetSort": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each line item into needs, wants, or savings.",
          categories: ["Needs", "Wants", "Savings"],
          items: [
            { label: "Rent", category: "Needs" }, { label: "Groceries", category: "Needs" }, { label: "Health insurance", category: "Needs" }, { label: "Utilities", category: "Needs" },
            { label: "Streaming subscription", category: "Wants" }, { label: "New game", category: "Wants" }, { label: "Concert tickets", category: "Wants" }, { label: "Designer coffee", category: "Wants" },
            { label: "Emergency fund", category: "Savings" }, { label: "Retirement contrib.", category: "Savings" }, { label: "Index fund deposit", category: "Savings" },
          ],
          hint: "Needs keep you alive; wants are extras; savings grow your future.",
          hints: ["Rent and food are needs.", "Subscriptions are usually wants."],
          explanation: "Use a 50/30/20 lens — needs, wants, savings.",
        },
        {
          prompt: "Sort each financial choice by impact on net worth.",
          categories: ["Increases net worth", "Decreases net worth"],
          items: [
            { label: "Pay off credit-card debt", category: "Increases net worth" }, { label: "Buy index fund shares", category: "Increases net worth" }, { label: "Repay student loan principal", category: "Increases net worth" }, { label: "Contribute to 401(k)", category: "Increases net worth" },
            { label: "Take out cash advance", category: "Decreases net worth" }, { label: "Lease a new luxury car", category: "Decreases net worth" }, { label: "Splurge on vacation on credit", category: "Decreases net worth" }, { label: "Pay only minimums", category: "Decreases net worth" },
          ],
          hint: "Net worth = assets − liabilities.",
          hints: ["Paying debt reduces liabilities.", "Borrowing for depreciating items hurts net worth."],
          explanation: "Each decision raises or lowers net worth.",
        },
        {
          prompt: "Classify each by asset, liability, income, or expense.",
          categories: ["Asset", "Liability", "Income", "Expense"],
          items: [
            { label: "Index fund balance", category: "Asset" }, { label: "House equity", category: "Asset" }, { label: "Checking account", category: "Asset" },
            { label: "Credit-card balance", category: "Liability" }, { label: "Student loan", category: "Liability" }, { label: "Auto loan", category: "Liability" },
            { label: "Salary", category: "Income" }, { label: "Side gig revenue", category: "Income" }, { label: "Dividend payout", category: "Income" },
            { label: "Rent payment", category: "Expense" }, { label: "Grocery bill", category: "Expense" }, { label: "Phone bill", category: "Expense" },
          ],
          hint: "Balance sheet vs. income statement.",
          hints: ["Assets and liabilities are balance-sheet items.", "Income and expense are income-statement items."],
          explanation: "Each item slots into one of the four core categories.",
        },
      ]);
    }
    case "truthTableRead": {
      const gate = pick(["AND", "OR", "XOR"] as const);
      const a = rand(0, 1), b = rand(0, 1);
      const out = gate === "AND" ? a & b : gate === "OR" ? a | b : a ^ b;
      return choiceEng(
        m,
        difficulty,
        `Gate: ${gate}. A=${a}, B=${b}. Output?`,
        { kind: "truthTable", truthTable: { gate, rows: [{ a, b, out }] }, title: `${gate}(${a},${b})` },
        String(out),
        ["0", "1"].filter((x) => x !== String(out)).concat(["A", "B"]).slice(0, 3),
        gate === "AND" ? "Only 1 when both are 1." : gate === "OR" ? "1 if any input is 1." : "1 when inputs differ.",
        [`${gate} truth: ${gate === "AND" ? "1·1=1, else 0" : gate === "OR" ? "0+0=0, else 1" : "different = 1"}`],
        `${gate}(${a}, ${b}) = ${out}.`,
      );
    }
    case "setOperations": {
      const aSize = rand(4, 9);
      const bSize = rand(4, 9);
      const inter = rand(1, Math.min(aSize, bSize) - 1);
      const op = pick(["union", "intersection", "difference"] as const);
      const ans = op === "union" ? aSize + bSize - inter : op === "intersection" ? inter : aSize - inter;
      return numpadEng(
        m,
        difficulty,
        `|A|=${aSize}, |B|=${bSize}, |A∩B|=${inter}. |A ${op === "union" ? "∪" : op === "intersection" ? "∩" : "−"} B| = ?`,
        { kind: "icon", icon: "🔵", title: `|A ${op === "union" ? "∪" : op === "intersection" ? "∩" : "−"} B|`, subtitle: `|A|=${aSize}, |B|=${bSize}, |A∩B|=${inter}` },
        ans,
        "Inclusion-exclusion for union; subtract overlap for difference.",
        [`Union: |A|+|B|−|A∩B|.`, `Difference: |A|−|A∩B|.`],
        op === "union"
          ? `${aSize}+${bSize}−${inter} = ${ans}.`
          : op === "intersection"
          ? `Intersection size = ${inter}.`
          : `${aSize}−${inter} = ${ans}.`,
      );
    }

    case "planetOrder": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order the planets from closest to the Sun outward.",
          order: ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"],
          hint: "My Very Educated Mother Just Served Us Nachos.",
          hints: ["Mercury is closest.", "Neptune is farthest."],
          explanation: "Standard order is Mercury → Neptune.",
        },
        {
          prompt: "Order these planets from smallest to largest by diameter.",
          order: ["Mercury", "Mars", "Venus", "Earth", "Neptune", "Uranus", "Saturn", "Jupiter"],
          hint: "Gas giants dominate the top.",
          hints: ["Mercury is smallest.", "Jupiter is largest."],
          explanation: "Diameter order: Mercury < Mars < Venus < Earth < Neptune < Uranus < Saturn < Jupiter.",
        },
        {
          prompt: "Order these planets from shortest to longest year (orbital period).",
          order: ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"],
          hint: "Distance from the Sun determines orbital period.",
          hints: ["Mercury orbits in 88 days.", "Neptune takes ~165 years."],
          explanation: "Closer planets orbit faster (Kepler's third law).",
        },
        {
          prompt: "Order the four rocky inner planets by surface temperature, coolest to hottest.",
          order: ["Mars", "Earth", "Mercury", "Venus"],
          hint: "Atmosphere matters more than distance.",
          hints: ["Venus has a runaway greenhouse.", "Mercury has no atmosphere."],
          explanation: "Mars cool, Earth temperate, Mercury hot, Venus hottest (≈465 °C).",
        },
        {
          prompt: "Order moons by distance from their parent planet (closest first).",
          order: ["Io", "Europa", "Ganymede", "Callisto"],
          hint: "Galilean moons orbit Jupiter.",
          hints: ["Io is most volcanic.", "Ganymede is the largest moon in the solar system."],
          explanation: "Io → Europa → Ganymede → Callisto outward from Jupiter.",
        },
      ]);
    }
    case "moonPhaseSeq": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order the moon phases starting from New Moon.",
          order: ["New", "Waxing Crescent", "First Quarter", "Waxing Gibbous", "Full", "Waning Gibbous", "Last Quarter", "Waning Crescent"],
          hint: "Waxing means growing; waning means shrinking.",
          hints: ["After New comes a thin crescent.", "Full sits opposite New."],
          explanation: "New → Waxing Crescent → First Quarter → Waxing Gibbous → Full → Waning Gibbous → Last Quarter → Waning Crescent.",
        },
        {
          prompt: "Order these phases from least illuminated to most illuminated.",
          order: ["New", "Crescent", "Quarter", "Gibbous", "Full"],
          hint: "Phase ↔ percentage of lit face visible.",
          hints: ["New ≈ 0% lit.", "Full ≈ 100% lit."],
          explanation: "Lit fraction grows from new (0%) to full (100%).",
        },
        {
          prompt: "Order the events of a complete lunar cycle starting from First Quarter.",
          order: ["First Quarter", "Waxing Gibbous", "Full", "Waning Gibbous", "Last Quarter", "Waning Crescent", "New", "Waxing Crescent"],
          hint: "Continue the same waxing-then-waning rhythm.",
          hints: ["First Quarter is half-lit and growing.", "Last Quarter is half-lit and shrinking."],
          explanation: "Same 8-phase cycle, just shifted to start at First Quarter.",
        },
      ]);
    }
    case "keplerPeriod": {
      const a = pick([4, 9, 16, 25]);
      const ans = +Math.sqrt(a * a * a).toFixed(2);
      return numpadEng(
        m,
        difficulty,
        `Planet with semi-major axis ${a} AU. Period in Earth years?`,
        { kind: "icon", icon: "🌌", title: `T² = a³`, subtitle: `a = ${a} AU` },
        ans,
        "T = a^(3/2) when a is in AU and T is in years.",
        [`Cube the axis, then take square root.`],
        `√(${a}³) = √${a * a * a} ≈ ${ans} years.`,
      );
    }
    case "starClassify": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each star by spectral class based on its temperature.",
          categories: ["Hot (O/B)", "Sun-like (F/G)", "Cool (K/M)"],
          items: [
            { label: "30 000 K bright blue", category: "Hot (O/B)" },
            { label: "12 000 K white-blue", category: "Hot (O/B)" },
            { label: "Sun at 5 800 K", category: "Sun-like (F/G)" },
            { label: "6 500 K yellow-white", category: "Sun-like (F/G)" },
            { label: "4 200 K orange", category: "Cool (K/M)" },
            { label: "3 200 K red dwarf", category: "Cool (K/M)" },
          ],
          hint: "Hot stars are blue; cool stars are red.",
          hints: ["O/B stars > 10 000 K.", "K/M stars < 5 000 K."],
          explanation: "Spectral class is set by surface temperature.",
        },
        {
          prompt: "Sort each star by stage on the Hertzsprung–Russell diagram.",
          categories: ["Main sequence", "Giant", "White dwarf"],
          items: [
            { label: "Sun (G2)", category: "Main sequence" },
            { label: "Sirius A (A1)", category: "Main sequence" },
            { label: "Proxima Centauri (M5)", category: "Main sequence" },
            { label: "Betelgeuse (red supergiant)", category: "Giant" },
            { label: "Aldebaran (red giant)", category: "Giant" },
            { label: "Sirius B", category: "White dwarf" },
            { label: "Procyon B", category: "White dwarf" },
          ],
          hint: "Stage depends on luminosity and surface temperature.",
          hints: ["Main sequence is hydrogen fusion.", "White dwarfs are stellar remnants."],
          explanation: "Each star sits in one HR region by life stage.",
        },
        {
          prompt: "Sort each object by approximate luminosity (Sun = 1).",
          categories: ["Dim (<0.1 L☉)", "Sun-like (0.1–10 L☉)", "Luminous (>10 L☉)"],
          items: [
            { label: "Red dwarf (~0.01)", category: "Dim (<0.1 L☉)" },
            { label: "Brown dwarf (~0.001)", category: "Dim (<0.1 L☉)" },
            { label: "Sun (1)", category: "Sun-like (0.1–10 L☉)" },
            { label: "Sirius A (~25)", category: "Luminous (>10 L☉)" },
            { label: "Rigel (~120 000)", category: "Luminous (>10 L☉)" },
          ],
          hint: "Mass strongly drives luminosity.",
          hints: ["L ∝ M³·⁵ on main sequence.", "Supergiants vastly outshine the Sun."],
          explanation: "Mass-luminosity relation sets the rough brightness.",
        },
      ]);
    }
    case "lightYearDist": {
      const ly = pick([1, 2, 4, 8, 10]);
      const ans = +(ly).toFixed(1);
      return numpadEng(
        m,
        difficulty,
        `Light travels for ${ly} years. Distance in light-years?`,
        { kind: "icon", icon: "💫", title: `c · t`, subtitle: `t = ${ly} years` },
        ans,
        "By definition, 1 light-year is the distance light travels in 1 year.",
        [`Multiply time (in years) by 1 ly/year.`],
        `${ly} years × 1 ly/year = ${ans} ly.`,
      );
    }
    case "dnaTranscribe": {
      const dna = pick(["ATGC", "TACG", "CGAT", "GCTA", "AATC", "TTAG"]);
      const map: Record<string, string> = { A: "U", T: "A", C: "G", G: "C" };
      const ans = dna.split("").map((c) => map[c]).join("");
      const distractors = ["AUGC", dna, dna.split("").reverse().join("")].filter((x) => x !== ans);
      return choiceEng(
        m,
        difficulty,
        `Transcribe the DNA template strand 5'-${dna}-3' to mRNA.`,
        { kind: "icon", icon: "🧬", title: dna, subtitle: "Template → mRNA" },
        ans,
        distractors.slice(0, 3),
        "A↔U, T→A, C↔G.",
        ["DNA T pairs with RNA A.", "RNA has U instead of T."],
        `Transcribing ${dna} gives ${ans}.`,
      );
    }
    case "traitMendel": {
      const cases = [
        { cross: "Tt × Tt", phenotype: "3 : 1 dominant : recessive" },
        { cross: "TT × tt", phenotype: "100% heterozygous" },
        { cross: "Tt × tt", phenotype: "1 : 1 dominant : recessive" },
        { cross: "TT × Tt", phenotype: "100% dominant phenotype" },
      ];
      const pickIt = pick(cases);
      const distractors = cases.filter((c) => c.phenotype !== pickIt.phenotype).map((c) => c.phenotype);
      return choiceEng(
        m,
        difficulty,
        `Cross ${pickIt.cross}. Predict the phenotype ratio.`,
        { kind: "icon", icon: "🟢", title: pickIt.cross, subtitle: "Mendelian inheritance" },
        pickIt.phenotype,
        distractors,
        "Draw a Punnett square.",
        ["Each parent contributes one allele.", "Count dominant vs recessive offspring."],
        `${pickIt.cross} predicts ${pickIt.phenotype}.`,
      );
    }
    case "mutationSort": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each mutation by its effect type.",
          categories: ["Silent", "Missense", "Nonsense"],
          items: [
            { label: "Codon → same amino acid", category: "Silent" },
            { label: "GAA → GAG, same Glu", category: "Silent" },
            { label: "GAA → GTA, Glu → Val", category: "Missense" },
            { label: "Single base swap, new amino", category: "Missense" },
            { label: "TAC → TAA, early stop", category: "Nonsense" },
            { label: "Stop codon introduced", category: "Nonsense" },
          ],
          hint: "Silent keeps the amino; nonsense truncates the protein.",
          hints: ["Different amino but no stop → missense.", "Premature stop → nonsense."],
          explanation: "Silent / missense / nonsense by amino-acid effect.",
        },
        {
          prompt: "Sort each mutation by structural type.",
          categories: ["Substitution", "Insertion", "Deletion", "Frameshift"],
          items: [
            { label: "A → G at one base", category: "Substitution" },
            { label: "GAA → GAC point change", category: "Substitution" },
            { label: "Extra GAT inserted", category: "Insertion" },
            { label: "3-base codon added", category: "Insertion" },
            { label: "GAA removed entirely", category: "Deletion" },
            { label: "Codon dropped from sequence", category: "Deletion" },
            { label: "One base inserted → shifts reading frame", category: "Frameshift" },
            { label: "Two bases deleted → frame shifts", category: "Frameshift" },
          ],
          hint: "Frame shifts happen when (insert/delete) is not a multiple of 3.",
          hints: ["3-base indels preserve frame.", "Frame shifts garble downstream codons."],
          explanation: "Each mutation slots into one structural category.",
        },
        {
          prompt: "Classify each mutation by likely health impact.",
          categories: ["Likely benign", "Likely harmful"],
          items: [
            { label: "Silent codon change", category: "Likely benign" },
            { label: "Conservative missense (similar amino)", category: "Likely benign" },
            { label: "Synonymous substitution", category: "Likely benign" },
            { label: "Nonsense in early exon", category: "Likely harmful" },
            { label: "Frameshift near gene start", category: "Likely harmful" },
            { label: "Splice-site disruption", category: "Likely harmful" },
          ],
          hint: "Truncations and frameshifts usually break protein.",
          hints: ["Conservative substitutions often preserve function.", "Splice sites are critical for mRNA assembly."],
          explanation: "Severity depends on how much of the protein is disrupted.",
        },
      ]);
    }
    case "pedigreeRead": {
      const opts = [
        "Autosomal recessive",
        "Autosomal dominant",
        "X-linked recessive",
        "Mitochondrial",
      ];
      const ans = pick(opts);
      return choiceEng(
        m,
        difficulty,
        `Two unaffected parents have an affected son and an unaffected daughter. Most likely mode of inheritance?`,
        { kind: "icon", icon: "🌳", title: "Pedigree clue", subtitle: "Parents unaffected, son affected" },
        ans === "X-linked recessive" ? "X-linked recessive" : "X-linked recessive",
        opts.filter((o) => o !== "X-linked recessive"),
        "Skipping a generation and male bias hints at X-linked recessive.",
        ["Carrier mother passes affected X to son.", "Daughters get the unaffected paternal X."],
        "X-linked recessive fits: unaffected carriers, affected males.",
      );
    }
    case "chromosomeCount": {
      const opts = [
        { q: "human somatic cell", a: 46 },
        { q: "human gamete (sperm/egg)", a: 23 },
        { q: "human after meiosis I", a: 23 },
        { q: "human cell during G2", a: 46 },
      ];
      const it = pick(opts);
      return numpadEng(
        m,
        difficulty,
        `How many chromosomes are in a ${it.q}?`,
        { kind: "icon", icon: "🧫", title: it.q, subtitle: "Human chromosomes" },
        it.a,
        it.a === 23 ? "Haploid (n) = 23." : "Diploid (2n) = 46.",
        ["Somatic = diploid.", "Gametes = haploid."],
        `${it.q} has ${it.a} chromosomes.`,
      );
    }
    case "trophicLevels": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order the trophic levels from base to apex.",
          order: ["Producer (grass)", "Primary consumer (rabbit)", "Secondary consumer (fox)", "Tertiary consumer (eagle)"],
          hint: "Energy flows from producers upward.",
          hints: ["Producers fix sunlight into biomass.", "Apex predators eat secondary consumers."],
          explanation: "Producer → primary → secondary → tertiary consumer.",
        },
        {
          prompt: "Order this savanna food chain from base to apex.",
          order: ["Acacia tree", "Zebra", "Cheetah"],
          hint: "Sun → plant → herbivore → carnivore.",
          hints: ["Acacia is the producer.", "Cheetah is the apex predator."],
          explanation: "Plants → herbivores → predators.",
        },
        {
          prompt: "Order this ocean food chain from base to apex.",
          order: ["Phytoplankton", "Krill", "Sardine", "Tuna", "Killer whale"],
          hint: "Phytoplankton power the whole web.",
          hints: ["Krill graze on plankton.", "Apex predators sit at the top."],
          explanation: "Plankton → krill → forage fish → tuna → killer whale.",
        },
        {
          prompt: "Order these forest organisms by trophic level (lowest to highest).",
          order: ["Fern", "Caterpillar", "Songbird", "Hawk"],
          hint: "Each level eats the level below.",
          hints: ["Caterpillars eat plants.", "Hawks eat songbirds."],
          explanation: "Plant → herbivore → small carnivore → apex.",
        },
      ]);
    }
    case "nicheSort": {
      return bankSort(m, difficulty, [
        {
          prompt: "Classify each organism by its ecological role.",
          categories: ["Producer", "Consumer", "Decomposer"],
          items: [
            { label: "Oak tree", category: "Producer" },
            { label: "Algae", category: "Producer" },
            { label: "Moss", category: "Producer" },
            { label: "Deer", category: "Consumer" },
            { label: "Hawk", category: "Consumer" },
            { label: "Wolf", category: "Consumer" },
            { label: "Mushroom", category: "Decomposer" },
            { label: "Earthworm", category: "Decomposer" },
            { label: "Bacteria in soil", category: "Decomposer" },
          ],
          hint: "Producers photosynthesize; decomposers break down dead matter.",
          hints: ["Plants and algae are producers.", "Fungi are decomposers."],
          explanation: "Sort by role in the energy flow.",
        },
        {
          prompt: "Classify each organism by feeding strategy.",
          categories: ["Herbivore", "Carnivore", "Omnivore"],
          items: [
            { label: "Rabbit", category: "Herbivore" },
            { label: "Cow", category: "Herbivore" },
            { label: "Caterpillar", category: "Herbivore" },
            { label: "Lion", category: "Carnivore" },
            { label: "Shark", category: "Carnivore" },
            { label: "Owl", category: "Carnivore" },
            { label: "Bear", category: "Omnivore" },
            { label: "Pig", category: "Omnivore" },
            { label: "Human", category: "Omnivore" },
          ],
          hint: "Diet defines the category.",
          hints: ["Herbivores eat only plants.", "Omnivores eat both."],
          explanation: "Each organism's diet places it in one category.",
        },
        {
          prompt: "Classify each species pair by interaction type.",
          categories: ["Mutualism", "Commensalism", "Parasitism", "Competition"],
          items: [
            { label: "Bee + flower", category: "Mutualism" },
            { label: "Clownfish + anemone", category: "Mutualism" },
            { label: "Barnacle on whale", category: "Commensalism" },
            { label: "Bird nesting in tree", category: "Commensalism" },
            { label: "Tapeworm in mammal", category: "Parasitism" },
            { label: "Tick on dog", category: "Parasitism" },
            { label: "Two lions for prey", category: "Competition" },
            { label: "Trees competing for light", category: "Competition" },
          ],
          hint: "Who benefits and who is harmed?",
          hints: ["Mutualism: both win.", "Parasitism: one wins, one loses."],
          explanation: "Each interaction has a defined +/− pattern.",
        },
      ]);
    }
    case "popGrowth": {
      const n0 = pick([100, 200, 500]);
      const r = pick([0.1, 0.2, 0.25]);
      const t = rand(2, 4);
      const ans = Math.round(n0 * Math.pow(1 + r, t));
      return numpadEng(
        m,
        difficulty,
        `Population starts at ${n0}, grows ${(r * 100).toFixed(0)}% per year. After ${t} years?`,
        { kind: "icon", icon: "📊", title: `N = N₀(1+r)^t`, subtitle: `N₀=${n0}, r=${r}, t=${t}` },
        ans,
        "Exponential growth compounds the rate.",
        [`Multiply N₀ by (1+r) each year.`],
        `${n0}·(${(1 + r).toFixed(2)})^${t} ≈ ${ans}.`,
      );
    }
    case "organSystemMatch": {
      return bankMatch(m, difficulty, [
        {
          prompt: "Match each organ to its body system.",
          pairs: [
            ["Heart", "Cardiovascular"],
            ["Lungs", "Respiratory"],
            ["Kidneys", "Excretory"],
            ["Stomach", "Digestive"],
            ["Brain", "Nervous"],
            ["Skin", "Integumentary"],
          ],
          hint: "Function names the system.",
          hints: ["Kidneys filter waste.", "Stomach digests food."],
          explanation: "Each organ belongs to the system that performs its function.",
        },
        {
          prompt: "Match each organ to its primary role.",
          pairs: [
            ["Liver", "Filters and detoxifies blood"],
            ["Pancreas", "Releases insulin"],
            ["Spleen", "Filters worn red cells"],
            ["Thyroid", "Regulates metabolism"],
            ["Adrenal", "Releases stress hormones"],
          ],
          hint: "Each organ has a distinct function.",
          hints: ["Pancreas controls blood sugar.", "Thyroid controls metabolic rate."],
          explanation: "Each organ pairs with its core job.",
        },
        {
          prompt: "Match each gland to the hormone it primarily releases.",
          pairs: [
            ["Pancreas", "Insulin"],
            ["Thyroid", "Thyroxine"],
            ["Adrenal", "Cortisol"],
            ["Pituitary", "Growth hormone"],
            ["Ovary", "Estrogen"],
            ["Testis", "Testosterone"],
          ],
          hint: "Glands secrete specific hormones.",
          hints: ["Pituitary is the master gland.", "Adrenals release stress hormones."],
          explanation: "Each endocrine gland is named for the hormone it produces.",
        },
      ]);
    }
    case "bloodFlowOrder": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Trace a red blood cell's path from the body back to the body.",
          order: ["Right atrium", "Right ventricle", "Pulmonary artery", "Lungs", "Pulmonary vein", "Left atrium", "Left ventricle", "Aorta"],
          hint: "Deoxygenated blood goes right; oxygenated blood goes left.",
          hints: ["Right side serves the lungs.", "Aorta is the body's main artery."],
          explanation: "Right atrium → right ventricle → lungs → left atrium → left ventricle → aorta.",
        },
        {
          prompt: "Order the path of pulmonary circulation only.",
          order: ["Right ventricle", "Pulmonary trunk", "Pulmonary arteries", "Lung capillaries", "Pulmonary veins", "Left atrium"],
          hint: "Pulmonary circuit moves blood through the lungs.",
          hints: ["Pulmonary arteries carry deoxygenated blood.", "Pulmonary veins carry oxygenated blood."],
          explanation: "Right ventricle → lungs → left atrium.",
        },
        {
          prompt: "Order the systemic circulation steps after the aorta.",
          order: ["Aorta", "Arteries", "Arterioles", "Capillaries", "Venules", "Veins", "Vena cava", "Right atrium"],
          hint: "Vessels shrink to capillaries, then grow back.",
          hints: ["Capillaries exchange gases.", "Vena cava returns blood to the heart."],
          explanation: "Systemic vessels follow the diameter cascade.",
        },
        {
          prompt: "Order the heart's electrical activation sequence.",
          order: ["SA node", "Atrial contraction", "AV node", "Bundle of His", "Purkinje fibers", "Ventricular contraction"],
          hint: "Impulse starts at the SA node.",
          hints: ["SA node is the natural pacemaker.", "Purkinje fibers spread the signal."],
          explanation: "SA → atria → AV → His → Purkinje → ventricles.",
        },
      ]);
    }
    case "neuronImpulse": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Sequence the steps of an action potential.",
          order: ["Resting potential", "Stimulus", "Depolarization", "Repolarization", "Hyperpolarization", "Return to resting"],
          hint: "Sodium opens first, then potassium.",
          hints: ["Stimulus opens Na⁺ channels.", "K⁺ outflow repolarizes the membrane."],
          explanation: "Resting → stimulus → Na⁺ in → depolarize → K⁺ out → repolarize → hyperpolarize → rest.",
        },
        {
          prompt: "Order the steps of synaptic transmission across a chemical synapse.",
          order: ["AP arrives at axon terminal", "Ca²⁺ influx", "Vesicle fusion", "Neurotransmitter release", "Receptor binding", "Postsynaptic potential"],
          hint: "Calcium triggers vesicle release.",
          hints: ["Vesicles store the neurotransmitter.", "Receptors are on the postsynaptic membrane."],
          explanation: "AP → Ca²⁺ → vesicle release → receptor binding → postsynaptic response.",
        },
        {
          prompt: "Order the channels' activity during one action potential.",
          order: ["Voltage-gated Na⁺ opens", "Na⁺ inactivates", "Voltage-gated K⁺ opens", "K⁺ closes slowly", "Na⁺/K⁺ pump restores gradient"],
          hint: "Na⁺ leads, K⁺ follows, pump cleans up.",
          hints: ["Inactivation prevents re-firing immediately.", "The pump uses ATP."],
          explanation: "Na⁺ open → Na⁺ inactivate → K⁺ open → K⁺ close → pump restores rest.",
        },
      ]);
    }
    case "carbonPoolSort": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each carbon reservoir into its sphere.",
          categories: ["Atmosphere", "Biosphere", "Hydrosphere", "Lithosphere"],
          items: [
            { label: "Atmospheric CO₂", category: "Atmosphere" },
            { label: "Methane in air", category: "Atmosphere" },
            { label: "Tree biomass", category: "Biosphere" },
            { label: "Coral skeletons", category: "Biosphere" },
            { label: "Plankton in surface ocean", category: "Biosphere" },
            { label: "Limestone bedrock", category: "Lithosphere" },
            { label: "Methane in permafrost", category: "Lithosphere" },
            { label: "Fossil fuel deposits", category: "Lithosphere" },
            { label: "Dissolved CO₂ in ocean", category: "Hydrosphere" },
            { label: "Bicarbonate in seawater", category: "Hydrosphere" },
          ],
          hint: "Trees → biosphere; rocks → lithosphere.",
          hints: ["Oceans store dissolved CO₂.", "Limestone is rock."],
          explanation: "Each pool belongs to one Earth sphere.",
        },
        {
          prompt: "Sort each process by whether it adds or removes atmospheric CO₂.",
          categories: ["Adds CO₂", "Removes CO₂"],
          items: [
            { label: "Burning gasoline", category: "Adds CO₂" },
            { label: "Coal-fired power plant", category: "Adds CO₂" },
            { label: "Wildfire", category: "Adds CO₂" },
            { label: "Cellular respiration", category: "Adds CO₂" },
            { label: "Photosynthesis", category: "Removes CO₂" },
            { label: "Ocean dissolution", category: "Removes CO₂" },
            { label: "Reforestation", category: "Removes CO₂" },
            { label: "Carbonate weathering", category: "Removes CO₂" },
          ],
          hint: "Burning and respiration release CO₂; photosynthesis stores it.",
          hints: ["Plants fix carbon during photosynthesis.", "Combustion oxidizes carbon."],
          explanation: "Each process either emits or absorbs CO₂.",
        },
        {
          prompt: "Sort each carbon flux by timescale.",
          categories: ["Fast (years–decades)", "Slow (millennia+)"],
          items: [
            { label: "Plant respiration", category: "Fast (years–decades)" },
            { label: "Ocean surface CO₂ exchange", category: "Fast (years–decades)" },
            { label: "Soil microbial decomposition", category: "Fast (years–decades)" },
            { label: "Rock weathering", category: "Slow (millennia+)" },
            { label: "Volcanic outgassing", category: "Slow (millennia+)" },
            { label: "Carbonate sediment burial", category: "Slow (millennia+)" },
          ],
          hint: "Biological cycles are fast; geological cycles are slow.",
          hints: ["Plants exchange CO₂ yearly.", "Rocks take millennia to weather."],
          explanation: "Carbon flows on two distinct timescales.",
        },
      ]);
    }
    case "renewableSort": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each energy source by renewability.",
          categories: ["Renewable", "Non-renewable"],
          items: [
            { label: "Solar", category: "Renewable" },
            { label: "Wind", category: "Renewable" },
            { label: "Hydro", category: "Renewable" },
            { label: "Geothermal", category: "Renewable" },
            { label: "Tidal", category: "Renewable" },
            { label: "Coal", category: "Non-renewable" },
            { label: "Natural gas", category: "Non-renewable" },
            { label: "Uranium", category: "Non-renewable" },
            { label: "Oil", category: "Non-renewable" },
          ],
          hint: "Renewables replenish on human timescales.",
          hints: ["Sun, wind, water → renewable.", "Fossils and uranium → non-renewable."],
          explanation: "Replenish rate distinguishes the two categories.",
        },
        {
          prompt: "Sort each energy source by carbon footprint.",
          categories: ["Low-carbon", "High-carbon"],
          items: [
            { label: "Solar PV", category: "Low-carbon" },
            { label: "Wind turbine", category: "Low-carbon" },
            { label: "Nuclear fission", category: "Low-carbon" },
            { label: "Hydroelectric", category: "Low-carbon" },
            { label: "Coal", category: "High-carbon" },
            { label: "Lignite", category: "High-carbon" },
            { label: "Diesel", category: "High-carbon" },
            { label: "Natural gas", category: "High-carbon" },
          ],
          hint: "Burning fossil fuels emits CO₂.",
          hints: ["Renewables + nuclear are low-carbon.", "All fossil fuels are high-carbon."],
          explanation: "Each source's lifecycle CO₂ defines the category.",
        },
        {
          prompt: "Sort by intermittency: do they need storage or backup?",
          categories: ["Intermittent (variable)", "Dispatchable (on-demand)"],
          items: [
            { label: "Solar PV", category: "Intermittent (variable)" },
            { label: "Wind turbine", category: "Intermittent (variable)" },
            { label: "Wave energy", category: "Intermittent (variable)" },
            { label: "Hydroelectric reservoir", category: "Dispatchable (on-demand)" },
            { label: "Nuclear", category: "Dispatchable (on-demand)" },
            { label: "Geothermal", category: "Dispatchable (on-demand)" },
            { label: "Natural gas peaker", category: "Dispatchable (on-demand)" },
          ],
          hint: "Sun and wind aren't always available.",
          hints: ["Hydro and nuclear run on demand.", "Solar and wind need batteries."],
          explanation: "Intermittent vs dispatchable shapes grid design.",
        },
      ]);
    }
    case "greenhouseCause": {
      return bankChoice(m, difficulty, [
        {
          prompt: "Which factor is the dominant driver of modern climate change?",
          visual: { kind: "icon", icon: "🌫️", title: "Modern CO₂ rise", subtitle: "Pick the main driver" },
          answer: "Fossil fuel combustion",
          distractors: ["Solar flares", "Earth's axial wobble", "Volcanic dust"],
          hint: "CO₂ from burning fuels traps heat.",
          hints: ["Pre-industrial CO₂ ≈ 280 ppm.", "Today CO₂ > 420 ppm."],
          explanation: "Anthropogenic CO₂ emissions are the leading driver.",
        },
        {
          prompt: "Which greenhouse gas is the largest single contributor to anthropogenic warming?",
          visual: { kind: "icon", icon: "💨", title: "Greenhouse gas", subtitle: "Largest single share" },
          answer: "Carbon dioxide (CO₂)",
          distractors: ["Methane (CH₄)", "Nitrous oxide (N₂O)", "Water vapor"],
          hint: "Most fossil-fuel emissions are this gas.",
          hints: ["CO₂ has very long atmospheric lifetime.", "Methane is more potent but shorter-lived."],
          explanation: "CO₂ contributes about two-thirds of anthropogenic forcing.",
        },
        {
          prompt: "Which sector emits the largest share of global CO₂?",
          visual: { kind: "icon", icon: "🏭", title: "Largest emitter", subtitle: "Pick a sector" },
          answer: "Energy & electricity",
          distractors: ["Aviation", "Cement industry", "Livestock"],
          hint: "Burning coal and gas to make power dominates.",
          hints: ["Energy is roughly 70% of emissions.", "Aviation is small in comparison."],
          explanation: "Electricity + heat is the single largest CO₂ source.",
        },
        {
          prompt: "Which action provides the largest individual CO₂ reduction?",
          visual: { kind: "icon", icon: "🌱", title: "Individual choice", subtitle: "Pick the biggest lever" },
          answer: "Avoid one long-haul flight per year",
          distractors: ["Recycle paper weekly", "Use cold-water laundry", "Unplug chargers"],
          hint: "Flying is extremely carbon-intense.",
          hints: ["A round-trip flight can emit tons of CO₂.", "Tiny actions help but rank low."],
          explanation: "Avoided air travel is the largest typical individual lever.",
        },
      ]);
    }

    case "forLoopTrace": {
      const start = rand(0, 3);
      const stop = rand(start + 3, start + 7);
      const inc = rand(1, 3);
      let total = 0;
      for (let i = start; i < stop; i += inc) total += i;
      return numpadEng(
        m,
        difficulty,
        `total = 0\nfor i in range(${start}, ${stop}, ${inc}): total += i\nFinal total?`,
        { kind: "code", code: { lines: ["total = 0", `for i in range(${start}, ${stop}, ${inc}):`, "    total += i"] }, title: "Trace the loop" },
        total,
        "Iterate by hand and accumulate.",
        [`Loop runs while i < ${stop}.`, `Step is ${inc}.`],
        `Sum of ${start}, ${start + inc}, …, < ${stop} = ${total}.`,
      );
    }
    case "ifElseResult": {
      const x = rand(-6, 10);
      const ans = x > 0 ? "positive" : x < 0 ? "negative" : "zero";
      return choiceEng(
        m,
        difficulty,
        `if x > 0: "positive" / elif x < 0: "negative" / else: "zero". With x = ${x}, what prints?`,
        { kind: "code", code: { lines: [`x = ${x}`, "if x > 0: print('positive')", "elif x < 0: print('negative')", "else: print('zero')"] }, title: `x = ${x}` },
        ans,
        ["positive", "negative", "zero"].filter((c) => c !== ans),
        "Compare x to 0.",
        ["First check x > 0.", "Else branch covers x == 0."],
        `x = ${x} → ${ans}.`,
      );
    }
    case "recursionDepth": {
      const n = rand(3, 6);
      return numpadEng(
        m,
        difficulty,
        `factorial(${n}) calls itself how many additional times before reaching the base case factorial(1)?`,
        { kind: "code", code: { lines: ["def fact(n):", "    if n == 1: return 1", "    return n * fact(n-1)"] }, title: `fact(${n})` },
        n - 1,
        "Count calls until hitting the base case.",
        [`fact(${n}) → fact(${n - 1}) → … → fact(1).`],
        `fact(${n}) makes ${n - 1} recursive calls (depth ${n - 1}).`,
      );
    }
    case "bigOSort": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order these complexity classes from fastest to slowest growth.",
          order: ["O(1)", "O(log n)", "O(√n)", "O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)", "O(n!)"],
          hint: "Constant beats logarithmic beats linear.",
          hints: ["Factorial is worst.", "n² is worse than n log n."],
          explanation: "Standard ranking: constant → log → √n → linear → n log n → quadratic → exponential → factorial.",
        },
        {
          prompt: "Order these by space complexity from least to most memory.",
          order: ["O(1) in-place", "O(log n) recursion", "O(n) auxiliary", "O(n²) matrix"],
          hint: "In-place uses no extra memory.",
          hints: ["Recursive stack grows with depth.", "Matrices scale quadratically."],
          explanation: "In-place < recursion stack < linear buffer < matrix.",
        },
        {
          prompt: "Rank these operations from cheapest to most expensive on n inputs.",
          order: ["Hash lookup O(1)", "Binary search O(log n)", "Linear scan O(n)", "Mergesort O(n log n)", "Bubble sort O(n²)"],
          hint: "Hashing is amortized constant.",
          hints: ["Comparison sort floor is n log n.", "Bubble sort is quadratic."],
          explanation: "Hash < binary search < linear < n log n < n².",
        },
      ]);
    }
    case "binarySearchSteps": {
      const ns = [16, 32, 64, 128, 256, 512, 1024];
      const n = pick(ns);
      const ans = Math.ceil(Math.log2(n));
      return numpadEng(
        m,
        difficulty,
        `Worst-case binary search steps on a sorted array of ${n} items?`,
        { kind: "icon", icon: "🔎", title: `n = ${n}`, subtitle: "⌈log₂ n⌉ steps" },
        ans,
        "Each step halves the search space.",
        [`log₂ ${n} = ${Math.log2(n)}.`],
        `Ceiling of log₂(${n}) = ${ans}.`,
      );
    }
    case "sortAlgoMatch": {
      return bankMatch(m, difficulty, [
        {
          prompt: "Match each sort algorithm to its core idea.",
          pairs: [
            ["Bubble sort", "Repeatedly swap adjacent"],
            ["Merge sort", "Divide, sort halves, merge"],
            ["Quick sort", "Partition around pivot"],
            ["Insertion sort", "Insert into sorted prefix"],
            ["Selection sort", "Find min, swap to front"],
            ["Heap sort", "Extract from a max-heap"],
          ],
          hint: "Names hint at strategy.",
          hints: ["Merge means combine.", "Quick uses a pivot."],
          explanation: "Each algorithm pairs with its defining step.",
        },
        {
          prompt: "Match each sort to its average-case time complexity.",
          pairs: [
            ["Bubble sort", "O(n²)"],
            ["Insertion sort", "O(n²)"],
            ["Merge sort", "O(n log n)"],
            ["Quick sort", "O(n log n)"],
            ["Counting sort", "O(n + k)"],
            ["Radix sort", "O(d · n)"],
          ],
          hint: "Comparison sorts floor at n log n.",
          hints: ["Counting/radix beat the floor via assumptions.", "Bubble/insertion are quadratic."],
          explanation: "Each algorithm pairs with its standard average complexity.",
        },
        {
          prompt: "Match each sort to its key trade-off.",
          pairs: [
            ["Quick sort", "Fast but unstable"],
            ["Merge sort", "Stable but extra memory"],
            ["Insertion sort", "Great for small/nearly sorted"],
            ["Heap sort", "In-place, n log n worst-case"],
          ],
          hint: "Trade-offs are about stability, memory, and worst-case.",
          hints: ["Stability preserves equal-key order.", "Quick is in-place but worst-case n²."],
          explanation: "Each sort earns a place based on its strongest trade-off.",
        },
      ]);
    }
    case "precisionRecall": {
      const tp = rand(20, 80);
      const fp = rand(5, 25);
      const fn = rand(5, 25);
      const isPrecision = Math.random() < 0.5;
      const ans = isPrecision ? +(tp / (tp + fp)).toFixed(2) : +(tp / (tp + fn)).toFixed(2);
      return numpadEng(
        m,
        difficulty,
        `Classifier: TP=${tp}, FP=${fp}, FN=${fn}. ${isPrecision ? "Precision" : "Recall"} as a decimal?`,
        { kind: "icon", icon: "🤖", title: isPrecision ? "Precision" : "Recall", subtitle: `TP=${tp}, FP=${fp}, FN=${fn}` },
        ans,
        isPrecision ? "Precision = TP / (TP + FP)." : "Recall = TP / (TP + FN).",
        [isPrecision ? "Among predicted positives, how many are correct?" : "Among actual positives, how many did we find?"],
        isPrecision ? `${tp}/(${tp}+${fp}) = ${ans}.` : `${tp}/(${tp}+${fn}) = ${ans}.`,
      );
    }
    case "gradientStep": {
      const slopes = [
        { slope: 2, dir: "Decrease x" },
        { slope: -3, dir: "Increase x" },
        { slope: 0, dir: "Stay (minimum)" },
      ];
      const pickIt = pick(slopes);
      return choiceEng(
        m,
        difficulty,
        `Loss f(x). Current gradient f'(x) = ${pickIt.slope}. Gradient descent says…`,
        { kind: "icon", icon: "📉", title: `f'(x) = ${pickIt.slope}`, subtitle: "Update rule" },
        pickIt.dir,
        slopes.filter((s) => s.dir !== pickIt.dir).map((s) => s.dir),
        "Move opposite the gradient direction.",
        ["Positive slope → decrease x.", "Zero slope → stop."],
        `x ← x − η·f'(x) = ${pickIt.dir.toLowerCase()}.`,
      );
    }
    case "normalizeData": {
      const min = rand(0, 5);
      const max = min + rand(8, 20);
      const x = rand(min, max);
      const ans = +((x - min) / (max - min)).toFixed(2);
      return numpadEng(
        m,
        difficulty,
        `Min-max normalize x=${x} in range [${min}, ${max}].`,
        { kind: "icon", icon: "🧮", title: `(x−min)/(max−min)`, subtitle: `x=${x}, min=${min}, max=${max}` },
        ans,
        "Shift by min, scale by range.",
        [`x − min = ${x - min}.`, `max − min = ${max - min}.`],
        `(${x}−${min})/(${max}−${min}) = ${ans}.`,
      );
    }
    case "caesarCipher": {
      const shift = rand(1, 9);
      const orig = pick(["HELLO", "WORLD", "CODE", "CYBER", "ZEBRA", "QUARK", "PIXEL"]);
      const enc = orig.split("").map((c) => String.fromCharCode(((c.charCodeAt(0) - 65 + shift) % 26) + 65)).join("");
      return numpadEng(
        m,
        difficulty,
        `Caesar-shifted "${enc}" decodes to a real English word. What shift was used to encrypt?`,
        { kind: "icon", icon: "🔐", title: enc, subtitle: `Shift = ?  →  ${orig}` },
        shift,
        "Try shifting back letter by letter.",
        [`Each letter moved by ${shift}.`, `Subtract the shift to decode.`],
        `Shift of ${shift} encodes ${orig} → ${enc}.`,
      );
    }
    case "passwordStrength": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order these passwords from weakest to strongest.",
          order: ["password", "P@ss123", "Tr0ub4dor&3", "correct horse battery staple"],
          hint: "Length and unpredictability beat symbol soup.",
          hints: ["Dictionary words are weak.", "Long passphrases have high entropy."],
          explanation: "Common → simple substitution → mixed → long passphrase.",
        },
        {
          prompt: "Order from least to most entropy.",
          order: ["1234", "qwerty", "Spring2024", "Bl!ndF@lcon8", "purple-stapler-comet-river-42"],
          hint: "Entropy grows with length + character pool size.",
          hints: ["Sequential and common words are easy to guess.", "Random multi-word passphrases dominate."],
          explanation: "Each step adds length or randomness, raising entropy.",
        },
        {
          prompt: "Order these authentication factors from weakest to strongest.",
          order: ["Reused password", "Unique password", "Password + SMS code", "Password + TOTP app", "Hardware security key"],
          hint: "Phishing-resistant factors beat shared secrets.",
          hints: ["SMS is interceptable.", "Hardware keys bind to origin."],
          explanation: "Stronger factors bind to device or origin and resist phishing.",
        },
        {
          prompt: "Order common attacks by speed (fastest → slowest to crack a weak password).",
          order: ["Dictionary lookup", "Mask attack", "Brute-force 8 chars", "Brute-force 12 chars"],
          hint: "Smarter attacks try likely patterns first.",
          hints: ["Length doubles the time exponentially.", "Mask uses pattern hints."],
          explanation: "Dictionary → mask → brute-force; longer passwords slow everything.",
        },
      ]);
    }
    case "sqlJoinMatch": {
      return bankMatch(m, difficulty, [
        {
          prompt: "Match each SQL join to its behavior.",
          pairs: [
            ["INNER JOIN", "Only matching rows"],
            ["LEFT JOIN", "All left rows + matches"],
            ["RIGHT JOIN", "All right rows + matches"],
            ["FULL JOIN", "All rows, both sides"],
            ["CROSS JOIN", "Cartesian product"],
          ],
          hint: "Inner trims; outer keeps the side it names.",
          hints: ["LEFT keeps the left.", "FULL keeps both."],
          explanation: "Each join pairs with its row-keeping rule.",
        },
        {
          prompt: "Match each join scenario to the right join type.",
          pairs: [
            ["List orders only when a user exists", "INNER JOIN"],
            ["List all users + orders if any", "LEFT JOIN"],
            ["List every order + user if known", "RIGHT JOIN"],
            ["List everything from both sides", "FULL JOIN"],
            ["Generate all team-vs-team pairings", "CROSS JOIN"],
          ],
          hint: "Pick the join that keeps what's required.",
          hints: ["LEFT preserves the driver table.", "CROSS pairs everything."],
          explanation: "Each business need maps to a specific join type.",
        },
        {
          prompt: "Match each Venn region to the join that returns it.",
          pairs: [
            ["A ∩ B", "INNER JOIN"],
            ["A + (A ∩ B)", "LEFT JOIN"],
            ["B + (A ∩ B)", "RIGHT JOIN"],
            ["A ∪ B", "FULL JOIN"],
          ],
          hint: "Joins map directly to Venn regions.",
          hints: ["INNER is intersection.", "FULL is union."],
          explanation: "Each join corresponds to a Venn-style row set.",
        },
      ]);
    }
    case "sqlCount": {
      const rows = rand(5, 15);
      const distinct = rand(2, Math.min(rows, 6));
      const isDistinct = Math.random() < 0.5;
      const ans = isDistinct ? distinct : rows;
      return numpadEng(
        m,
        difficulty,
        `Table T has ${rows} rows and ${distinct} distinct user_id values. SELECT COUNT(${isDistinct ? "DISTINCT user_id" : "*"}) FROM T;`,
        { kind: "icon", icon: "🗄️", title: `COUNT(${isDistinct ? "DISTINCT user_id" : "*"})`, subtitle: `${rows} rows / ${distinct} unique` },
        ans,
        isDistinct ? "DISTINCT collapses duplicates." : "COUNT(*) counts every row.",
        [isDistinct ? `Unique user_id count = ${distinct}.` : `Row count = ${rows}.`],
        `Answer: ${ans}.`,
      );
    }
    case "normalizationSort": {
      return bankSort(m, difficulty, [
        {
          prompt: "Sort each statement into the normal form it defines.",
          categories: ["1NF", "2NF", "3NF"],
          items: [
            { label: "All columns hold atomic values", category: "1NF" },
            { label: "No repeating groups", category: "1NF" },
            { label: "Removes partial dependencies", category: "2NF" },
            { label: "Every non-key fully depends on PK", category: "2NF" },
            { label: "Removes transitive dependencies", category: "3NF" },
            { label: "Non-key cols depend only on PK", category: "3NF" },
          ],
          hint: "1NF: atomicity. 2NF: full key. 3NF: no transitive.",
          hints: ["Atomic values → 1NF.", "Partial dep removed → 2NF."],
          explanation: "Each rule belongs to a single normal form.",
        },
        {
          prompt: "Classify each design issue by which normal form it violates.",
          categories: ["Violates 1NF", "Violates 2NF", "Violates 3NF"],
          items: [
            { label: "Phone column stores 'a,b,c'", category: "Violates 1NF" },
            { label: "Multiple emails in one cell", category: "Violates 1NF" },
            { label: "Course name in (StudentId, CourseId) table", category: "Violates 2NF" },
            { label: "Author name depends on AuthorId, not BookId", category: "Violates 2NF" },
            { label: "ZIP determines City stored in Orders", category: "Violates 3NF" },
            { label: "Department name stored with each employee row", category: "Violates 3NF" },
          ],
          hint: "Pin down which key the attribute really depends on.",
          hints: ["Multi-value cells violate 1NF.", "Transitive dependencies violate 3NF."],
          explanation: "Each anomaly maps to a specific normal-form failure.",
        },
        {
          prompt: "Sort each schema fix by the normal form it achieves.",
          categories: ["Reaches 1NF", "Reaches 2NF", "Reaches 3NF"],
          items: [
            { label: "Split multi-valued column into rows", category: "Reaches 1NF" },
            { label: "Move course title into Courses table", category: "Reaches 2NF" },
            { label: "Move ZIP→City into Cities lookup table", category: "Reaches 3NF" },
            { label: "Use junction table for student/course", category: "Reaches 2NF" },
            { label: "Add Departments table referenced by deptId", category: "Reaches 3NF" },
            { label: "Store one phone per row", category: "Reaches 1NF" },
          ],
          hint: "Each refactor removes a specific anomaly.",
          hints: ["1NF removes multivalue.", "3NF removes transitive."],
          explanation: "Each fix advances the schema to a higher normal form.",
        },
      ]);
    }
    case "httpVerbMatch": {
      return bankMatch(m, difficulty, [
        {
          prompt: "Match each HTTP verb to its CRUD action.",
          pairs: [
            ["GET", "Read a resource"],
            ["POST", "Create a resource"],
            ["PUT", "Replace a resource"],
            ["PATCH", "Partially update"],
            ["DELETE", "Remove a resource"],
          ],
          hint: "Verbs map to CRUD.",
          hints: ["GET is safe and idempotent.", "POST creates."],
          explanation: "Each verb pairs with the CRUD operation it represents.",
        },
        {
          prompt: "Match each verb to its safety/idempotency profile.",
          pairs: [
            ["GET", "Safe + idempotent"],
            ["PUT", "Idempotent, not safe"],
            ["DELETE", "Idempotent, not safe"],
            ["POST", "Neither safe nor idempotent"],
            ["HEAD", "Safe + idempotent (no body)"],
          ],
          hint: "Safe = no side effects; idempotent = same result repeated.",
          hints: ["GET and HEAD are read-only.", "POST is non-idempotent by default."],
          explanation: "Each verb's properties are defined by the HTTP spec.",
        },
        {
          prompt: "Match each request scenario to the most appropriate verb.",
          pairs: [
            ["Fetch user profile", "GET"],
            ["Submit a new comment", "POST"],
            ["Replace a record entirely", "PUT"],
            ["Update a single field", "PATCH"],
            ["Remove an account", "DELETE"],
          ],
          hint: "Pick the verb that best matches intent.",
          hints: ["Full replace is PUT.", "Partial change is PATCH."],
          explanation: "Each operation has a canonical HTTP verb.",
        },
      ]);
    }
    case "statusCodeMatch": {
      return bankMatch(m, difficulty, [
        {
          prompt: "Match each HTTP status code to its meaning.",
          pairs: [
            ["200", "OK"],
            ["201", "Created"],
            ["301", "Moved permanently"],
            ["404", "Not found"],
            ["500", "Server error"],
          ],
          hint: "2xx success, 3xx redirect, 4xx client, 5xx server.",
          hints: ["404 is client-side.", "500 is server-side."],
          explanation: "Each code pairs with its standard meaning.",
        },
        {
          prompt: "Match each client-error code to its meaning.",
          pairs: [
            ["400", "Bad request"],
            ["401", "Unauthorized"],
            ["403", "Forbidden"],
            ["404", "Not found"],
            ["409", "Conflict"],
            ["429", "Too many requests"],
          ],
          hint: "All 4xx codes blame the client.",
          hints: ["401 is missing/invalid auth.", "403 is auth refused."],
          explanation: "Each 4xx code signals a specific client-side issue.",
        },
        {
          prompt: "Match each scenario to the right status code.",
          pairs: [
            ["Resource created successfully", "201"],
            ["Permanent URL change", "301"],
            ["Bad JSON in request body", "400"],
            ["User not logged in", "401"],
            ["Crashing server", "500"],
            ["Rate limit hit", "429"],
          ],
          hint: "Pick the most specific code.",
          hints: ["Auth-missing is 401, not 403.", "Permanent redirect is 301."],
          explanation: "Each scenario maps to a single canonical code.",
        },
      ]);
    }
    case "restRoute": {
      return bankChoice(m, difficulty, [
        {
          prompt: "Pick the most RESTful URL to list orders belonging to user 123.",
          visual: { kind: "icon", icon: "🛣️", title: "REST URL", subtitle: "Choose nouns over verbs" },
          answer: "GET /users/123/orders",
          distractors: [
            "GET /getUserOrders?id=123",
            "POST /users/123/orders/list",
            "GET /orders?userId=123&action=list",
          ],
          hint: "REST nouns + HTTP verbs.",
          hints: ["Avoid verbs in URLs.", "Use nested resources."],
          explanation: "GET /users/123/orders cleanly nests the resource.",
        },
        {
          prompt: "Pick the most RESTful URL to fetch a single book by id=42.",
          visual: { kind: "icon", icon: "📚", title: "Single resource", subtitle: "Pluralized noun + id" },
          answer: "GET /books/42",
          distractors: ["GET /getBook?id=42", "POST /books/find/42", "GET /book/42/show"],
          hint: "Resources are plural nouns; ids identify one item.",
          hints: ["No verbs in the URL.", "GET reads."],
          explanation: "GET /books/42 follows REST conventions cleanly.",
        },
        {
          prompt: "Pick the most RESTful URL to delete comment 7 on post 99.",
          visual: { kind: "icon", icon: "🗑️", title: "Nested resource", subtitle: "Verb is DELETE" },
          answer: "DELETE /posts/99/comments/7",
          distractors: ["POST /posts/99/comments/7/delete", "GET /deleteComment?id=7", "DELETE /comments?postId=99&id=7"],
          hint: "Nest comment under post; use DELETE.",
          hints: ["Avoid action segments.", "DELETE expresses intent."],
          explanation: "DELETE /posts/99/comments/7 is the canonical REST form.",
        },
        {
          prompt: "Pick the most RESTful URL to update part of user 8's profile.",
          visual: { kind: "icon", icon: "✏️", title: "Partial update", subtitle: "Use PATCH" },
          answer: "PATCH /users/8",
          distractors: ["POST /users/8/update", "PUT /users/8/edit", "POST /updateUser?id=8"],
          hint: "Partial updates use PATCH.",
          hints: ["PUT replaces the entire record.", "POST is generally for creation."],
          explanation: "PATCH /users/8 is the conventional REST partial update.",
        },
      ]);
    }
    case "osiLayerOrder": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order the OSI model layers from top (closest to user) to bottom.",
          order: ["Application", "Presentation", "Session", "Transport", "Network", "Data Link", "Physical"],
          hint: "All People Seem To Need Data Processing.",
          hints: ["Top: Application.", "Bottom: Physical."],
          explanation: "Application → Presentation → Session → Transport → Network → Data Link → Physical.",
        },
        {
          prompt: "Order the TCP/IP model layers from top (closest to user) to bottom.",
          order: ["Application", "Transport", "Internet", "Link"],
          hint: "TCP/IP has four layers.",
          hints: ["Internet ≈ OSI Network.", "Link covers Data Link + Physical."],
          explanation: "Application → Transport → Internet → Link.",
        },
        {
          prompt: "Order the layers a packet visits, top-down, as it leaves your app.",
          order: ["Browser app", "HTTP headers", "TCP segment", "IP packet", "Ethernet frame", "Wire signal"],
          hint: "Each layer wraps the one above it.",
          hints: ["Encapsulation flows top → bottom on send.", "Decapsulation flows bottom → top on receive."],
          explanation: "App data → HTTP → TCP → IP → Ethernet → signal.",
        },
      ]);
    }
    case "subnetCount": {
      const prefix = pick([24, 25, 26, 27, 28]);
      const hostBits = 32 - prefix;
      const ans = Math.pow(2, hostBits) - 2;
      return numpadEng(
        m,
        difficulty,
        `How many usable hosts in a /${prefix} IPv4 subnet?`,
        { kind: "icon", icon: "🛰️", title: `/${prefix}`, subtitle: "Usable hosts" },
        ans,
        "Hosts = 2^(host bits) − 2.",
        [`Host bits = 32 − ${prefix} = ${hostBits}.`, "Subtract network + broadcast."],
        `2^${hostBits} − 2 = ${ans}.`,
      );
    }
    case "dnsOrder": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order the steps a DNS lookup tries when resolving a fresh hostname.",
          order: ["Browser cache", "OS cache", "Recursive resolver", "Root server", "TLD server", "Authoritative server"],
          hint: "Cache first, then walk the hierarchy.",
          hints: ["Browser cache comes before OS cache.", "Recursive resolver queries the root."],
          explanation: "Cache → resolver → root → TLD → authoritative.",
        },
        {
          prompt: "Order the DNS hierarchy from most general to most specific.",
          order: ["Root (.)", "TLD (.com)", "Authoritative (example.com)", "Hostname (api.example.com)"],
          hint: "DNS reads right-to-left in the name.",
          hints: ["Root is implicit.", "Hostname is the leftmost label."],
          explanation: "DNS resolves from root → TLD → zone → host.",
        },
        {
          prompt: "Order the events that happen on the first packet of an HTTPS request.",
          order: ["DNS lookup", "TCP handshake", "TLS handshake", "HTTP request", "HTTP response"],
          hint: "Resolve, connect, encrypt, request, respond.",
          hints: ["DNS comes before TCP.", "TLS sits between TCP and HTTP."],
          explanation: "DNS → TCP → TLS → HTTP request → response is the canonical order.",
        },
      ]);
    }
    case "htmlTagSort": {
      return bankSort(m, difficulty, [
        {
          prompt: "Classify each tag as structural or content.",
          categories: ["Structure", "Content"],
          items: [
            { label: "<header>", category: "Structure" },
            { label: "<nav>", category: "Structure" },
            { label: "<footer>", category: "Structure" },
            { label: "<section>", category: "Structure" },
            { label: "<p>", category: "Content" },
            { label: "<img>", category: "Content" },
            { label: "<a>", category: "Content" },
            { label: "<span>", category: "Content" },
          ],
          hint: "Sectioning tags shape the layout.",
          hints: ["header/nav/footer wrap regions.", "p/img/a hold actual content."],
          explanation: "Each tag belongs to one category.",
        },
        {
          prompt: "Classify each tag as block-level or inline.",
          categories: ["Block", "Inline"],
          items: [
            { label: "<div>", category: "Block" },
            { label: "<p>", category: "Block" },
            { label: "<section>", category: "Block" },
            { label: "<article>", category: "Block" },
            { label: "<span>", category: "Inline" },
            { label: "<a>", category: "Inline" },
            { label: "<strong>", category: "Inline" },
            { label: "<em>", category: "Inline" },
          ],
          hint: "Block elements start on a new line.",
          hints: ["span/a/strong/em are inline.", "div/p/section/article are block."],
          explanation: "Each tag has a default display value.",
        },
        {
          prompt: "Classify each tag by HTML5 semantic intent.",
          categories: ["Semantic", "Non-semantic"],
          items: [
            { label: "<header>", category: "Semantic" },
            { label: "<article>", category: "Semantic" },
            { label: "<aside>", category: "Semantic" },
            { label: "<main>", category: "Semantic" },
            { label: "<div>", category: "Non-semantic" },
            { label: "<span>", category: "Non-semantic" },
          ],
          hint: "Semantic tags convey role; non-semantic are just containers.",
          hints: ["div/span carry no meaning.", "main/article describe intent."],
          explanation: "HTML5 added semantic tags so machines understand structure.",
        },
      ]);
    }
    case "cssBoxModel": {
      const content = rand(80, 200);
      const padding = rand(4, 16);
      const border = rand(1, 4);
      const margin = rand(4, 12);
      const ans = content + 2 * padding + 2 * border + 2 * margin;
      return numpadEng(
        m,
        difficulty,
        `Box: content ${content}px, padding ${padding}px, border ${border}px, margin ${margin}px. Total outer width?`,
        { kind: "icon", icon: "📦", title: `content+padding+border+margin`, subtitle: "Outer width" },
        ans,
        "Total = content + 2·(padding + border + margin).",
        [`Add both sides for each layer.`],
        `${content} + 2·${padding} + 2·${border} + 2·${margin} = ${ans}.`,
      );
    }
    case "domEventOrder": {
      return bankReorder(m, difficulty, [
        {
          prompt: "Order the phases of a DOM event after a user clicks an element.",
          order: ["Event triggered", "Capture phase (window → target)", "Target phase", "Bubble phase (target → window)", "Default action runs"],
          hint: "Capture goes down; bubble goes up.",
          hints: ["Target sits between capture and bubble.", "Default action is last unless prevented."],
          explanation: "Trigger → capture → target → bubble → default.",
        },
        {
          prompt: "Order the steps when a React component re-renders after setState.",
          order: ["setState called", "Reconciler diffs virtual DOM", "Compute minimal patch", "Commit phase updates DOM", "Effects run"],
          hint: "Render is pure; commit touches the DOM.",
          hints: ["Reconciliation is a diff.", "Effects run after the DOM is committed."],
          explanation: "Schedule → diff → commit → effects.",
        },
        {
          prompt: "Order the JS event loop steps for a click that fires a fetch().",
          order: ["Click handler runs", "Synchronous code completes", "Microtasks (promises) flush", "Macrotask queue picks next callback", "Render frame paints"],
          hint: "Microtasks drain before the next macrotask.",
          hints: ["Promises are microtasks.", "Browser paints once the queue is clear."],
          explanation: "Sync work → microtasks → next macrotask → paint.",
        },
      ]);
    }
    case "hexBinaryConvert": {
      const value = rand(0, 255);
      const isToBinary = Math.random() < 0.5;
      const ans = isToBinary ? value.toString(2).padStart(8, "0") : value.toString(16).toUpperCase().padStart(2, "0");
      const promptText = isToBinary
        ? `Convert 0x${value.toString(16).toUpperCase().padStart(2, "0")} to 8-bit binary.`
        : `Convert 0b${value.toString(2).padStart(8, "0")} to 2-digit hex.`;
      return numpadEng(
        m,
        difficulty,
        promptText,
        { kind: "binary", bits: value.toString(2).padStart(8, "0").split("").map(Number), title: isToBinary ? `Hex → Binary` : `Binary → Hex` },
        ans,
        "Group bits in fours when converting to hex.",
        ["Each hex digit = 4 bits.", "0xFF = 255 = 11111111."],
        `Value ${value} → binary ${value.toString(2).padStart(8, "0")} → hex ${value.toString(16).toUpperCase().padStart(2, "0")}.`,
      );
    } 

    default:
      return placeholderPuzzle(m, difficulty);
  }
}

function matchPuzzle(meta: PuzzleMeta, difficulty: Difficulty, prompt: string, rawPairs: [string, string][]): Puzzle {
  const pairs = sample(rawPairs, rawPairs.length > 4 ? rand(4, Math.min(6, rawPairs.length)) : rawPairs.length);
  return {
    ...base(meta, difficulty, "match", variedPrompt(prompt, "match"), {
      kind: "icon",
      icon: "🔗",
      title: "Pair the cards",
      subtitle: pairs.map(([left]) => left).join("  •  "),
    }),
    pairs: pairs.map(([left, right]) => ({ left, right })),
    hint: "Tap a left card, then the matching right card.",
    explanation: pairs.length === rawPairs.length ? "Every expression is matched to an equivalent value." : "This run sampled a fresh subset of the full matching bank.",
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
    MathFoundations: [["4 tens", "40"], ["1/2", "2/4"], ["25% of 80", "20"]],
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
  const step = difficulty === "hard" ? 0.05 : 0.1;
  const target = Number((rand(2, difficulty === "hard" ? 18 : 9) * step).toFixed(2));
  return {
    ...base(meta, difficulty, "slider", variedPrompt(`${meta.title}: slide to ${target}.`, "slider"), {
      kind: "icon",
      icon: meta.emoji,
      title: String(target),
      subtitle: "Tune the value",
    }),
    slider: { min: 0, max: difficulty === "hard" ? 1.5 : 1, step, initial: 0.5, target },
    hint: "Find the precise decimal.",
    explanation: `Target was ${target}.`,
  };
}

function placeholderDrag(meta: PuzzleMeta, difficulty: Difficulty): Puzzle {
  const targetValue = String(rand(5, difficulty === "hard" ? 40 : difficulty === "medium" ? 25 : 15));
  const distractors = sample([String(Number(targetValue) - 2), String(Number(targetValue) + 2), String(rand(2, 8)), String(rand(20, 45))], 3);
  return {
    ...base(meta, difficulty, "drag", variedPrompt(`${meta.title}: drag the matching value into the bowl.`, "drag"), {
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
  const start = rand(1, 6);
  const step = rand(1, 3);
  const tiles = Array.from({ length: rand(4, 6) }, (_, i) => String(start + i * step));
  return {
    ...base(meta, _difficulty, "reorder", variedPrompt(`${meta.title}: arrange the tiles in order.`, "reorder"), {
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
  const targetRotation = pick([90, 180, 270] as const);
  return {
    ...base(meta, _difficulty, "rotate", variedPrompt(`${meta.title}: rotate to ${targetRotation}°.`, "rotate"), {
      kind: "fold",
      title: "Rotate the figure",
    }),
    targetRotation,
    rotationStep: 90,
    hint: `${targetRotation / 90} quarter-turn${targetRotation === 90 ? "" : "s"} reach ${targetRotation}°.`,
    hints: [`${targetRotation / 90} quarter-turn${targetRotation === 90 ? "" : "s"} reach ${targetRotation}°.`, "Rotation is cumulative."],
    explanation: `A ${targetRotation}° turn completes the transformation.`,
  };
}

function placeholderNumpad(meta: PuzzleMeta, difficulty: Difficulty): Puzzle {
  const ranges: Record<Difficulty, [number, number]> = { easy: [3, 12], medium: [6, 24], hard: [10, 60] };
  const [lo, hi] = ranges[difficulty];
  const answer = rand(lo, hi);
  return {
    ...base(meta, difficulty, "numpad", variedPrompt(`${meta.title}: type the answer.`, "numpad"), {
      kind: "icon",
      icon: meta.emoji,
      title: `${meta.subject} drill ${rand(1, 99)}`,
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
    MathFoundations: {
      categories: ["Positive", "Negative"],
      items: [
        { label: "6", category: "Positive" },
        { label: "12", category: "Positive" },
        { label: "−4", category: "Negative" },
        { label: "−9", category: "Negative" },
      ],
    },
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
  return sortEng(
    meta,
    difficulty,
    `${meta.title}: sort each card into a bucket.`,
    bank.categories,
    bank.items,
    "Tap a card, then tap a bucket to place it.",
    ["Tap a card, then a bucket.", "All cards must be placed before you check."],
    `Correct grouping: ${bank.items.map((i) => `${i.label} → ${i.category}`).join("; ")}.`,
  );
}

function placeholderPath(meta: PuzzleMeta, difficulty: Difficulty): Puzzle {
  const stepCount = rand(3, difficulty === "hard" ? 6 : 4);
  const stops = ["Start", ...Array.from({ length: stepCount }, (_, i) => `Step ${i + 1}`), "Goal"];
  return {
    ...base(meta, difficulty, "path", variedPrompt(`${meta.title}: trace the path in order.`, "path"), {
      kind: "grid",
      title: stops.join(" → "),
      tiles: stops,
    }),
    pathTiles: stops,
    correctPath: stops.map((_, i) => i),
    hint: "Tap the stops in order from start to goal.",
    hints: ["Start at the leftmost tile.", "Each tap appends to the path."],
    explanation: "Walking the steps in order completes the trace.",
  };
}

function placeholderSwipe(meta: PuzzleMeta, difficulty: Difficulty): Puzzle {
  const target = pick(["left", "right", "up", "down"] as const);
  return {
    ...base(meta, difficulty, "swipe", variedPrompt(`${meta.title}: swipe to unlock.`, "swipe"), {
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

const SUBJECT_DISPLAY_OVERRIDES: Partial<Record<SubjectFilter, string>> = {
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

function subjectLabel(subject: SubjectFilter) {
  return SUBJECT_DISPLAY_OVERRIDES[subject] ?? subject;
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

  const activeMeta = active ? metaFor(active) : null;
  const setState = (next: Partial<PlayState>) => setRawState((prev) => ({ ...prev, ...next }));

  const resolveDifficulty = useCallback(
    (override?: number): Difficulty => {
      if (difficultyFilter !== "All") return difficultyFilter;
      return difficultyFor(typeof override === "number" ? override : solved);
    },
    [difficultyFilter, solved],
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
        energy?: number;
        lastEnergyAt?: number;
        completions?: Record<string, number>;
      };
      setXp(progress.xp ?? 0);
      setStreak(progress.streak ?? 0);
      setSolved(progress.solved ?? 0);
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
      JSON.stringify({ xp, streak, solved, energy, lastEnergyAt, completions: categoryCompletions }),
    );
  }, [xp, streak, solved, energy, lastEnergyAt, categoryCompletions]);

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

  const start = useCallback(
    async (type: PuzzleId) => {
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
      const useDifficulty: Difficulty = difficultyFilter !== "All" ? difficultyFilter : difficultyFor(solved);
      setActive(type);
      setHint(false);
      setHintIndex(0);

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
    },
    [difficultyFilter, solved, xp, categoryCompletions, energy, aiEnabled],
  );

  const nextPuzzle = useCallback(() => {
    if (!active) return;
    if (aiEnabled) {
      void start(active);
      return;
    }
    const useDifficulty: Difficulty = resolveDifficulty(solved + 1);
    const next = makePuzzle(active, useDifficulty);
    setPuzzle(next);
    setRawState(initialState(next));
    setResult("idle");
    setHint(false);
    setHintIndex(0);
    setAiSource("procedural");
  }, [active, aiEnabled, resolveDifficulty, solved, start]);

  const exitRun = () => {
    setActive(null);
    setPuzzle(null);
  };

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
      const reward = puzzle.xpReward ?? xpRewardFor(puzzle.difficulty);
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
    } else {
      setStreak(0);
      setEnergy((value) => Math.max(0, value - 1));
      setLastEnergyAt(Date.now());
    }
  };

  const currentHint = (() => {
    if (!puzzle) return "";
    if (puzzle.hints && puzzle.hints.length > 0) {
      return puzzle.hints[Math.min(hintIndex, puzzle.hints.length - 1)] ?? puzzle.hint;
    }
    return puzzle.hint;
  })();

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
                    <h2 className="mt-3 max-w-2xl text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl">
                      Play your way through STEM.
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-300 sm:text-base">
                      {METAS.length} interactive puzzles across math, science, technology &amp; engineering.
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
                        onClick={() => start(daily)}
                        className="rounded-2xl bg-amber-400 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-amber-950 shadow-xl shadow-amber-500/20"
                      >
                        Daily: {metaFor(daily).title}
                      </button>
                    </div>
                  </div>
                  <div className="relative grid grid-cols-2 gap-3 self-end">
                    <StatCard label="Visible" value={String(visibleMetas.length)} tone="cyan" />
                    <StatCard label="Solved" value={String(solved)} tone="emerald" />
                    <StatCard label="Streak" value={String(streak)} tone="amber" />
                    <StatCard label="XP" value={String(xp)} tone="violet" />
                  </div>
                </div>
              </section>

              <div className="grid gap-5 lg:grid-cols-[20rem_minmax(0,1fr)]">
                <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
                  <div className="rounded-[2rem] border border-white/10 bg-zinc-950/75 p-4 shadow-xl shadow-black/20 ring-1 ring-white/5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-black uppercase tracking-[0.18em] text-zinc-200">Filters</h3>
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
                    <div className="space-y-3">
                      <div>
                        <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Grade</p>
                        <FilterPills
                          options={GRADE_OPTIONS}
                          value={gradeFilter}
                          onChange={setGradeFilter}
                          render={(option) => (option === "All" ? "All" : option === "K-8" ? "K–8" : `Grade ${option}`)}
                        />
                      </div>
                      <div>
                        <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Subject</p>
                        <FilterPills options={subjectOptions} value={subjectFilter} onChange={setSubjectFilter} render={(o) => (o === "All" ? "All" : subjectLabel(o))} />
                      </div>
                      <div>
                        <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Difficulty</p>
                        <FilterPills
                          options={DIFFICULTY_OPTIONS}
                          value={difficultyFilter}
                          onChange={setDifficultyFilter}
                          render={(option) =>
                            option === "All" ? "Adaptive" : option.charAt(0).toUpperCase() + option.slice(1)
                          }
                        />
                      </div>
                      <div>
                        <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Status</p>
                        <FilterPills options={LOCK_OPTIONS} value={lockFilter} onChange={setLockFilter} />
                      </div>
                      <div>
                        <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Interaction</p>
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
                </aside>

                <section className="min-w-0 space-y-5">
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
                <div className="rounded-[2rem] border border-white/10 bg-zinc-950/70 p-4 shadow-xl shadow-black/20 ring-1 ring-white/5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">Your Move</p>
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-mono text-emerald-100 ring-1 ring-emerald-300/30">
                      +{puzzle.xpReward ?? XP_PER_WIN} XP
                    </span>
                  </div>
                  <Interaction puzzle={puzzle} state={state} setState={setState} locked={result === "correct"} />
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
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
