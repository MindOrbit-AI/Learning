export type Difficulty = "easy" | "medium" | "hard";
export type DifficultyFilter = Difficulty | "All";
export type Result = "idle" | "correct" | "wrong";
export type Mode =
  | "choice"
  | "drag"
  | "slider"
  | "match"
  | "path"
  | "rotate"
  | "reorder"
  | "swipe"
  | "numpad"
  | "sort"
  | "coloring";
export type Grade = "K-8" | "9" | "10" | "11" | "12";
export type GradeFilter = Grade | "All";
export type Subject =
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
export type SubjectFilter = Subject | "All";

export type Domain = "Math" | "Science" | "Technology" | "Engineering";
export type DomainFilter = Domain | "All";
export type LockFilter = "All" | "Unlocked" | "Locked";
export type CatalogView = "grid" | "tree";

export type InteractionTypeKey =
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
  | "Simulation"
  | "Coloring puzzle";

export type InteractionFilter = InteractionTypeKey | "All";

export type PuzzleId =
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
  | "gcfFinder"
  | "longMultiplicationCol"
  | "systemSubstitution"
  | "circleCircumferenceCalc"
  | "sohcahtoaPick"
  | "polynomialRationalZero"
  | "productRuleBasic"
  | "standardDeviationStep"
  | "validInvalidArg"
  | "binomialTwoTrial"
  | "moduloRemainder"
  | "simpleInterestCalc"
  | "respirationVsPhoto"
  | "oxidationStateBasic"
  | "kinematicsV"
  | "mineralHardnessRank"
  | "siUnitMatcher"
  | "moonPhaseOrder"
  | "dnaReplicationSteps"
  | "nitrogenCycleSort"
  | "boneSystemMatch"
  | "recycleStreamSort"
  | "loopOutputTrace"
  | "complexityMatch"
  | "mlTermMatch"
  | "attackVectorMatch"
  | "joinTypeMatch"
  | "controllerMatch"
  | "httpResponseMatch"
  | "restVerbMatch"
  | "tcpHandshakeOrder"
  | "flipFlopMatch"
  | "gearTrainSpeed"
  | "parallelResistance"
  | "loadTypeSort"
  | "flightForcesMatch"
  | "actuatorTypeMatch"
  | "bridgeTypeMatch"
  | "materialPropertySort"
  | "seriesParallelCalc"
  | "vModelPhase"
  | "designPhaseOrder"
  | "divisibilityRules"
  | "longDivisionRemainder"
  | "inequalitySolve"
  | "triangleAreaCalc"
  | "pythagoreanIdentity"
  | "domainOfFunction"
  | "riemannSumBasic"
  | "correlationDirection"
  | "deMorganApply"
  | "conditionalProbBasic"
  | "primeFactorBuilder"
  | "loanMonthlyBasic"
  | "enzymeFitMatch"
  | "stateChangeOrder"
  | "momentumCalc"
  | "layersOfEarth"
  | "scientificMethodOrder"
  | "starLifecycleOrder"
  | "geneticTermMatch"
  | "biomeMatchClimate"
  | "organSystemFunction"
  | "renewableNonrenewableSort"
  | "truthyFalsyChoice"
  | "recursionBaseCase"
  | "trainTestSplitChoice"
  | "encryptionTypeMatch"
  | "normalFormOrder"
  | "robotSensorFusion"
  | "domEventMatch"
  | "apiPayloadFormatMatch"
  | "ipClassMatch"
  | "numberSystemConvert"
  | "leverMechAdvantage"
  | "kirchhoffCurrentChoice"
  | "concreteStrengthMatch"
  | "propulsionTypeMatch"
  | "dofCalc"
  | "bendingMomentMatch"
  | "corrosionTypeMatch"
  | "capacitorEnergy"
  | "lifecyclePhaseOrder"
  | "prototypeFidelityMatch"
  | "placeValueRound"
  | "additionCarryChain"
  | "factoringQuadratic"
  | "volumeRectPrism"
  | "lawOfSinesChoice"
  | "transformShiftMatch"
  | "quotientRuleBasic"
  | "quartileCalc"
  | "quantifierMatch"
  | "geometricProbBasic"
  | "eulerTotientBasic"
  | "taxBracketBasic"
  | "cellOrganelleSort"
  | "acidBaseClassify"
  | "forceDiagram"
  | "weatherFrontMatch"
  | "labSafetySort"
  | "galaxyTypeMatch"
  | "bloodTypeChoice"
  | "symbiosisMatch"
  | "muscleTypeMatch"
  | "pollutantSourceMatch"
  | "bitwiseOpChoice"
  | "dynamicProgrammingMatch"
  | "activationFunctionMatch"
  | "authFactorSort"
  | "indexUseMatch"
  | "kinematicsForwardChoice"
  | "cssBoxModelChoice"
  | "authSchemeMatch"
  | "apiPaginationCalc"
  | "rateLimitReset"
  | "idempotencyKeyMatch"
  | "corsHeaderMatch"
  | "webhookSignatureOrder"
  | "graphqlOperationMatch"
  | "apiVersioningChoice"
  | "errorResponseDesign"
  | "subnetMaskMatch"
  | "kMapSimplify"
  | "pulleyAdvantage"
  | "electricPowerCalc"
  | "soilTypeMatch"
  | "orbitTypeMatch"
  | "pathPlanningMatch"
  | "framingTypeMatch"
  | "compositeLayerOrder"
  | "rcTimeConstant"
  | "requirementTypeMatch"
  | "userResearchMatch"
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
  | "lossFunctionMatch"
  | "optimizerMatch"
  | "regularizationSort"
  | "mlPipelineOrder"
  | "transformerStageOrder"
  | "embeddingMatch"
  | "vectorSimilarityChoice"
  | "promptPatternMatch"
  | "ragPipelineOrder"
  | "modelEvalScenario"
  | "softmaxStep"
  | "f1ScoreCalc"
  | "biasTypeMLSort"
  | "samplingMethodChoice"
  | "convolutionOutput"
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
  | "hexBinaryConvert"
  | "colorFractionPizza"
  | "colorInequalityRegion"
  | "colorMatchingAngles"
  | "colorCellOrganelles"
  | "colorPhScale"
  | "colorCircuitFlow"
  | "colorBridgeStress"
  | "colorCodeBlocks"
  | "colorPlanetsByType"
  | "colorRockCycleStages"
  | "colorQuadrantSigns"
  | "colorVennRegions"
  | "colorFoodChainLevels"
  | "colorStatesOfMatter"
  | "colorCompassRose"
  | "colorPrimeCompositeStrip"
  | "colorSpinnerZones";

export type VisualKind =
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

export interface PuzzleMeta {
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

export interface Visual {
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

export type ColoringRegionShape = "circle" | "square" | "polygon" | "path" | "cell" | "graphRegion" | "ellipse";

export interface ColoringRegion {
  id: string;
  label: string;
  shape: ColoringRegionShape;
  correctColorId: string;
  explanation: string;
  /** Normalized layout 0–100 inside the diagram frame */
  box: { x: number; y: number; w: number; h: number };
  clipPath?: string;
}

export interface Puzzle {
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
  /** Region-fill coloring mode (UI label: Coloring puzzle). */
  colorPalette?: { id: string; label: string; color: string; meaning: string }[];
  regions?: ColoringRegion[];
  xpReward?: number;
}

/**
 * STEM puzzle solved by assigning palette colors to regions (external schema may use mode: "Coloring Puzzle").
 * In this arcade `Puzzle.mode` is `"coloring"`.
 */
export type ColoringPuzzle = Omit<Puzzle, "mode" | "colorPalette" | "regions"> & {
  mode: "coloring";
  colorPalette: NonNullable<Puzzle["colorPalette"]>;
  regions: NonNullable<Puzzle["regions"]>;
};

export interface PlayState {
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
  coloringTool: string | null;
  coloringFill: Record<string, string>;
  coloringUndo: { regionId: string; prev: string | undefined }[];
  coloringFeedback: Record<string, "correct" | "wrong"> | null;
}

export type AiPuzzleMode = "choice" | "match" | "sort" | "reorder" | "numpad";

export interface AiPuzzleSpec {
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

export interface ReorderVariant {
  prompt: string;
  order: string[];
  hint: string;
  hints?: string[];
  explanation: string;
}

export interface MatchVariant {
  prompt: string;
  pairs: [string, string][];
  hint: string;
  hints?: string[];
  explanation: string;
}

export interface SortVariant {
  prompt: string;
  categories: string[];
  items: { label: string; category: string }[];
  hint: string;
  hints?: string[];
  explanation: string;
}

export interface ChoiceVariant {
  prompt: string;
  visual: Visual;
  answer: string;
  distractors: string[];
  hint: string;
  hints?: string[];
  explanation: string;
}
