/**
 * MindOrbit Learn - Database Seed
 */

import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import {
  algebraClusters,
  algebraEdges,
  algebraNodes,
  biologyClusters,
  biologyEdges,
  biologyNodes,
  chemistryClusters,
  chemistryEdges,
  chemistryNodes,
  computerScienceClusters,
  computerScienceEdges,
  computerScienceNodes,
  VISUAL_ENGINE_LESSON_SEEDS,
  subjectSlugForVisualLessonSeed,
  geometryClusters,
  geometryEdges,
  geometryNodes,
  physicsClusters,
  physicsEdges,
  physicsNodes,
  satMathClusters,
  satMathEdges,
  satMathNodes,
  worldHistoryClusters,
  worldHistoryEdges,
  worldHistoryNodes,
} from "@mindorbit/content";

const prisma = new PrismaClient();

const SUBJECTS = [
  {
    slug: "community",
    title: "Community",
    description: "User-uploaded notes and summaries.",
    icon: "🌐",
    color: "#6B7280",
    createdById: null,
  },
  {
    slug: "algebra",
    title: "Algebra",
    description: "Master variables, equations, functions, and polynomials.",
    icon: "📐",
    color: "#3B82F6",
  },
  {
    slug: "geometry",
    title: "Geometry",
    description: "Shapes, proofs, trigonometry, and coordinate geometry.",
    icon: "📏",
    color: "#8B5CF6",
  },
  {
    slug: "biology",
    title: "Biology",
    description: "Cells, genetics, evolution, and human physiology.",
    icon: "🧬",
    color: "#22C55E",
  },
  {
    slug: "chemistry",
    title: "Chemistry",
    description: "Atomic structure, reactions, stoichiometry, and energy.",
    icon: "⚗️",
    color: "#10B981",
  },
  {
    slug: "computer-science",
    title: "Computer Science",
    description: "Programming, data structures, algorithms, and software design.",
    icon: "💻",
    color: "#8B5CF6",
  },
  {
    slug: "physics",
    title: "Physics",
    description: "Mechanics, waves, electricity, and modern physics.",
    icon: "🌌",
    color: "#F59E0B",
  },
  {
    slug: "world-history",
    title: "World History",
    description: "Civilizations, cultures, and major historical developments.",
    icon: "🌍",
    color: "#F59E0B",
  },
  {
    slug: "sat-math",
    title: "SAT Math",
    description: "Algebra, problem solving, advanced math, and geometry for the SAT.",
    icon: "📊",
    color: "#EC4899",
  },
];

const DIAGNOSTIC_QUESTIONS: Record<
  string,
  Array<{
    nodeSlug: string;
    prompt: string;
    type: "multiple_choice" | "short_answer" | "true_false";
    options: string[] | null;
    correctAnswer: string;
    explanation: string;
  }>
> = {
  chemistry: [
    {
      nodeSlug: "atomic-structure",
      prompt: "What determines the identity of an element?",
      type: "multiple_choice",
      options: ["Number of neutrons", "Number of protons", "Number of electrons", "Atomic mass"],
      correctAnswer: "Number of protons",
      explanation: "The atomic number (number of protons) uniquely identifies each element.",
    },
    {
      nodeSlug: "atomic-structure",
      prompt: "Isotopes of an element have the same number of protons but different numbers of neutrons.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Isotopes differ only in neutron count.",
    },
    {
      nodeSlug: "periodic-trends",
      prompt: "Which property generally decreases from left to right across a period?",
      type: "multiple_choice",
      options: ["Atomic radius", "Electronegativity", "Ionization energy", "Non-metallic character"],
      correctAnswer: "Atomic radius",
      explanation: "Atomic radius decreases across a period due to increasing nuclear charge.",
    },
    {
      nodeSlug: "chemical-bonding",
      prompt: "A covalent bond involves:",
      type: "multiple_choice",
      options: [
        "Transfer of electrons",
        "Sharing of electrons",
        "Sea of electrons",
        "Electrostatic attraction only",
      ],
      correctAnswer: "Sharing of electrons",
      explanation: "Covalent bonds form when atoms share electron pairs.",
    },
    {
      nodeSlug: "balancing-equations",
      prompt: "Balance: __ H₂ + __ O₂ → __ H₂O",
      type: "multiple_choice",
      options: ["1,1,1", "2,1,2", "2,2,2", "1,2,1"],
      correctAnswer: "2,1,2",
      explanation: "2H₂ + O₂ → 2H₂O gives 4H and 2O on both sides.",
    },
    {
      nodeSlug: "mole-concept",
      prompt: "One mole of any substance contains approximately how many particles?",
      type: "multiple_choice",
      options: ["10²³", "6.022 × 10²³", "6.022 × 10²²", "10²²"],
      correctAnswer: "6.022 × 10²³",
      explanation: "Avogadro's number is 6.022 × 10²³ particles per mole.",
    },
    {
      nodeSlug: "mole-concept",
      prompt: "The molar mass of a compound in g/mol equals its molecular mass in amu.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "One amu = 1 g/mol at the macroscopic scale.",
    },
    {
      nodeSlug: "stoichiometry-calc",
      prompt: "In 2H₂ + O₂ → 2H₂O, how many moles of H₂O form from 4 moles of H₂?",
      type: "multiple_choice",
      options: ["2", "4", "6", "8"],
      correctAnswer: "4",
      explanation: "2:2 ratio means 4 mol H₂ produces 4 mol H₂O.",
    },
    {
      nodeSlug: "limiting-reagents",
      prompt: "The limiting reagent determines the maximum amount of product that can form.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "The limiting reactant is consumed first and limits the reaction.",
    },
    {
      nodeSlug: "thermochemistry",
      prompt: "An exothermic reaction releases heat to the surroundings.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Exothermic: ΔH < 0, heat is released.",
    },
    {
      nodeSlug: "reaction-types",
      prompt: "A reaction where one compound breaks into simpler substances is best described as:",
      type: "multiple_choice",
      options: ["Synthesis", "Decomposition", "Single replacement", "Combustion only"],
      correctAnswer: "Decomposition",
      explanation: "Decomposition reactions split one reactant into multiple products.",
    },
    {
      nodeSlug: "enthalpy",
      prompt: "Hess's law lets you combine known reaction enthalpies to find an unknown ΔH for a target reaction.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Enthalpy is a state function, so pathways can be combined algebraically.",
    },
  ],
  algebra: [
    {
      nodeSlug: "variables",
      prompt: "In the expression 3x + 5, what is the coefficient of x?",
      type: "multiple_choice",
      options: ["3", "5", "x", "3x"],
      correctAnswer: "3",
      explanation: "The coefficient is the number multiplying the variable.",
    },
    {
      nodeSlug: "order-of-operations",
      prompt: "Simplify: 2 + 3 × 4",
      type: "multiple_choice",
      options: ["20", "14", "24", "12"],
      correctAnswer: "14",
      explanation: "Multiplication before addition: 3×4=12, then 2+12=14.",
    },
    {
      nodeSlug: "linear-equations",
      prompt: "Solve for x: 2x + 4 = 10",
      type: "multiple_choice",
      options: ["x=2", "x=3", "x=4", "x=6"],
      correctAnswer: "x=3",
      explanation: "2x=6, so x=3.",
    },
    {
      nodeSlug: "quadratic-equations",
      prompt: "The solutions to x² = 4 are x = 2 and x = -2.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Both 2² and (-2)² equal 4.",
    },
    {
      nodeSlug: "function-basics",
      prompt: "A function assigns exactly one output to each input.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "By definition, each input maps to exactly one output.",
    },
    {
      nodeSlug: "properties",
      prompt: "Which equation illustrates the distributive property: a(b + c) = ab + ac?",
      type: "multiple_choice",
      options: ["3(x + 2) = 3x + 6", "a + 0 = a", "a · 1 = a", "(a + b) + c = a + (b + c)"],
      correctAnswer: "3(x + 2) = 3x + 6",
      explanation: "The distributive property multiplies a sum by distributing the factor to each term.",
    },
    {
      nodeSlug: "inequalities",
      prompt: "If you multiply both sides of an inequality by a negative number, you must flip the inequality symbol.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Multiplying or dividing by a negative reverses the order of the numbers.",
    },
    {
      nodeSlug: "linear-functions",
      prompt: "A linear function f(x) = mx + b has a graph that is:",
      type: "multiple_choice",
      options: ["A parabola", "A straight line", "A hyperbola", "A circle"],
      correctAnswer: "A straight line",
      explanation: "Linear functions have constant slope m and graph as lines.",
    },
    {
      nodeSlug: "exponential-functions",
      prompt: "In y = a · b^x with b > 1, y grows exponentially as x increases.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "For b > 1, each step in x multiplies y by another factor of b.",
    },
    {
      nodeSlug: "polynomial-operations",
      prompt: "Add the polynomials: (2x² + 3x) + (x² − x)",
      type: "multiple_choice",
      options: ["3x² + 2x", "3x² + 4x", "x² + 2x", "3x² − 2x"],
      correctAnswer: "3x² + 2x",
      explanation: "Combine like terms: 2x² + x² = 3x² and 3x − x = 2x.",
    },
    {
      nodeSlug: "factoring",
      prompt: "Factor completely: x² − 9",
      type: "multiple_choice",
      options: ["(x − 3)²", "(x + 3)²", "(x − 3)(x + 3)", "(x − 9)(x + 1)"],
      correctAnswer: "(x − 3)(x + 3)",
      explanation: "Difference of squares: a² − b² = (a − b)(a + b).",
    },
  ],
  "sat-math": [
    {
      nodeSlug: "linear-equations-sat",
      prompt: "If 2x + 5 = 15, what is x?",
      type: "multiple_choice",
      options: ["5", "10", "7.5", "4"],
      correctAnswer: "5",
      explanation: "2x=10, so x=5.",
    },
    {
      nodeSlug: "systems-of-equations",
      prompt: "The system y=x+1 and y=2x-1 has how many solutions?",
      type: "multiple_choice",
      options: ["0", "1", "2", "Infinitely many"],
      correctAnswer: "1",
      explanation: "Two distinct lines intersect at exactly one point.",
    },
    {
      nodeSlug: "percentages",
      prompt: "What is 20% of 80?",
      type: "multiple_choice",
      options: ["16", "4", "100", "160"],
      correctAnswer: "16",
      explanation: "0.20 × 80 = 16.",
    },
    {
      nodeSlug: "quadratic-functions-sat",
      prompt: "The vertex of y = x² - 4x + 3 is at x = 2.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Vertex x = -b/(2a) = 4/2 = 2.",
    },
    {
      nodeSlug: "area-volume",
      prompt: "The area of a rectangle with length 6 and width 4 is 24.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Area = length × width = 6 × 4 = 24.",
    },
    {
      nodeSlug: "linear-inequalities-sat",
      prompt: "Which values of x satisfy 2x − 4 ≤ 6?",
      type: "multiple_choice",
      options: ["x ≤ 5", "x ≥ 5", "x ≤ 1", "x ≥ 1"],
      correctAnswer: "x ≤ 5",
      explanation: "2x ≤ 10, so x ≤ 5.",
    },
    {
      nodeSlug: "rates-ratios",
      prompt: "A car travels 180 miles in 3 hours. What is its average speed in miles per hour?",
      type: "multiple_choice",
      options: ["60", "90", "54", "120"],
      correctAnswer: "60",
      explanation: "Rate = distance/time = 180/3 = 60 mph.",
    },
    {
      nodeSlug: "data-interpretation",
      prompt: "The median of a data set is always equal to the mean.",
      type: "true_false",
      options: null,
      correctAnswer: "false",
      explanation: "Median and mean coincide only in symmetric distributions; skewed data often differs.",
    },
    {
      nodeSlug: "exponential-growth",
      prompt: "A quantity that doubles every fixed time period follows exponential growth.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Repeated multiplication by a constant factor is exponential behavior.",
    },
    {
      nodeSlug: "polynomials-sat",
      prompt: "What is (x + 2)(x + 3) expanded?",
      type: "multiple_choice",
      options: ["x² + 5x + 6", "x² + 6x + 5", "x² + 5x + 5", "2x + 5"],
      correctAnswer: "x² + 5x + 6",
      explanation: "FOIL: x² + 3x + 2x + 6 = x² + 5x + 6.",
    },
    {
      nodeSlug: "angles-triangles",
      prompt: "The sum of the interior angles of a triangle is:",
      type: "multiple_choice",
      options: ["90°", "180°", "360°", "270°"],
      correctAnswer: "180°",
      explanation: "Euclidean triangle angle sum is always 180°.",
    },
    {
      nodeSlug: "basic-trig",
      prompt: "In a right triangle, sin(θ) equals opposite/hypotenuse.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "SOH-CAH-TOA: sine is opposite over hypotenuse.",
    },
  ],
  geometry: [
    {
      nodeSlug: "angles-and-pairs",
      prompt: "Two angles that share a common side and vertex are called:",
      type: "multiple_choice",
      options: ["Vertical angles", "Adjacent angles", "Complementary angles", "Supplementary angles"],
      correctAnswer: "Adjacent angles",
      explanation: "Adjacent angles share a common vertex and a common side.",
    },
    {
      nodeSlug: "triangle-congruence",
      prompt: "Which is a valid triangle congruence shortcut?",
      type: "multiple_choice",
      options: ["AAA", "SSA", "SAS", "ASS"],
      correctAnswer: "SAS",
      explanation: "SAS (side-angle-side) is a standard congruence criterion when the angle is included.",
    },
    {
      nodeSlug: "right-triangles-trig",
      prompt: "In a right triangle with legs 3 and 4, the hypotenuse has length 5.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "3-4-5 is a Pythagorean triple: 3² + 4² = 5².",
    },
    {
      nodeSlug: "distance-midpoint-slope",
      prompt: "The slope between (0,0) and (2,4) is:",
      type: "multiple_choice",
      options: ["2", "4", "1/2", "8"],
      correctAnswer: "2",
      explanation: "Slope = (4−0)/(2−0) = 2.",
    },
    {
      nodeSlug: "points-lines-rays",
      prompt: "A ray has exactly one endpoint and extends infinitely in one direction.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "A ray is defined by one endpoint and a direction.",
    },
    {
      nodeSlug: "parallel-perpendicular",
      prompt: "Two distinct lines in a plane with the same slope are:",
      type: "multiple_choice",
      options: ["Perpendicular", "Parallel", "Skew", "Intersecting at 45°"],
      correctAnswer: "Parallel",
      explanation: "Equal slopes mean the lines never meet (unless coincident).",
    },
    {
      nodeSlug: "triangle-basics",
      prompt: "The sum of the lengths of any two sides of a triangle must be greater than the third side.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "This is the triangle inequality theorem.",
    },
    {
      nodeSlug: "triangle-similarity",
      prompt: "Two triangles are similar if their corresponding angles are congruent.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "AA similarity: two pairs of equal angles imply all three pairs match.",
    },
    {
      nodeSlug: "circle-angles-arcs",
      prompt: "An inscribed angle in a circle measures half the intercepted arc's central angle.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "The inscribed angle theorem relates inscribed and central angles.",
    },
    {
      nodeSlug: "area-and-volume",
      prompt: "The volume of a cube with side length 3 is:",
      type: "multiple_choice",
      options: ["9", "18", "27", "36"],
      correctAnswer: "27",
      explanation: "V = s³ = 3³ = 27 cubic units.",
    },
    {
      nodeSlug: "coordinate-plane",
      prompt: "The point (−2, 5) lies in which quadrant?",
      type: "multiple_choice",
      options: ["I", "II", "III", "IV"],
      correctAnswer: "II",
      explanation: "Negative x and positive y is quadrant II.",
    },
  ],
  "world-history": [
    {
      nodeSlug: "early-river-valleys",
      prompt: "Which early civilization is most associated with writing in cuneiform?",
      type: "multiple_choice",
      options: ["Ancient Egypt", "Mesopotamia", "Indus Valley", "Shang China"],
      correctAnswer: "Mesopotamia",
      explanation: "Cuneiform writing developed in Mesopotamia.",
    },
    {
      nodeSlug: "roman-world",
      prompt: "The Roman Republic was replaced by the Roman Empire under Augustus.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Augustus became the first Roman emperor, ending the Republic.",
    },
    {
      nodeSlug: "enlightenment-revolutions",
      prompt: "The American and French Revolutions were influenced by Enlightenment ideas about:",
      type: "multiple_choice",
      options: [
        "Divine right of kings",
        "Natural rights and popular sovereignty",
        "Mercantilism only",
        "Feudal obligations",
      ],
      correctAnswer: "Natural rights and popular sovereignty",
      explanation: "Enlightenment thinkers emphasized rights, reason, and legitimate government by consent.",
    },
    {
      nodeSlug: "cold-war-globalization",
      prompt: "The Cold War primarily described rivalry between which two blocs?",
      type: "multiple_choice",
      options: [
        "Allied vs. Central Powers",
        "NATO/Western allies vs. Soviet-led Eastern bloc",
        "Axis vs. Allies",
        "Colonial powers vs. indigenous states only",
      ],
      correctAnswer: "NATO/Western allies vs. Soviet-led Eastern bloc",
      explanation: "The Cold War framed US-led liberal democracies against the USSR and allies.",
    },
    {
      nodeSlug: "persian-greek-roots",
      prompt: "Athenian democracy of the classical period is most associated with which development?",
      type: "multiple_choice",
      options: [
        "Universal suffrage including women",
        "Citizen participation in assemblies and juries (for eligible citizens)",
        "Absolute monarchy",
        "Feudal vassalage",
      ],
      correctAnswer: "Citizen participation in assemblies and juries (for eligible citizens)",
      explanation: "Greek city-states experimented with citizen assemblies, though rights were limited by modern standards.",
    },
    {
      nodeSlug: "medieval-societies",
      prompt: "Feudalism in medieval Europe involved land granted in exchange for military service.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Lords granted fiefs to vassals who owed loyalty and military aid.",
    },
    {
      nodeSlug: "islamic-world-trade",
      prompt: "During much of the medieval period, cities like Baghdad and Cairo were important hubs for:",
      type: "multiple_choice",
      options: [
        "Only isolated subsistence farming",
        "Trade, scholarship, and cultural exchange across Afro-Eurasia",
        "Exclusive Viking longship routes only",
        "No written scholarship",
      ],
      correctAnswer: "Trade, scholarship, and cultural exchange across Afro-Eurasia",
      explanation: "The Islamic world connected trade networks and preserved and advanced learning.",
    },
    {
      nodeSlug: "renaissance-reformation",
      prompt: "The Protestant Reformation challenged the authority of the Roman Catholic Church in Western Europe.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Reformers questioned church practices and doctrine, splintering Western Christendom.",
    },
    {
      nodeSlug: "exploration-empires",
      prompt: "European overseas exploration in the 15th–17th centuries was driven partly by:",
      type: "multiple_choice",
      options: [
        "Desire for new trade routes and resources",
        "Complete rejection of navigation technology",
        "Uniform isolation from Asia",
        "Abandoning monarchical states",
      ],
      correctAnswer: "Desire for new trade routes and resources",
      explanation: "Spices, gold, and alternative routes to Asia motivated voyages and conquest.",
    },
    {
      nodeSlug: "industrial-imperialism",
      prompt: "Industrialization in the 19th century often increased demand for raw materials and overseas markets.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Industrial economies sought inputs for factories and outlets for manufactured goods.",
    },
    {
      nodeSlug: "world-wars",
      prompt: "World War I (1914–1918) was triggered primarily by:",
      type: "multiple_choice",
      options: [
        "The assassination of Archduke Franz Ferdinand and alliance system escalation",
        "The moon landing",
        "The fall of Constantinople in 1453",
        "The signing of Magna Carta",
      ],
      correctAnswer: "The assassination of Archduke Franz Ferdinand and alliance system escalation",
      explanation: "The July Crisis after Sarajevo pulled alliance blocs into general war.",
    },
  ],
  biology: [
    {
      nodeSlug: "cell-structure",
      prompt: "Which organelle is the primary site of protein synthesis in eukaryotic cells?",
      type: "multiple_choice",
      options: ["Mitochondria", "Ribosomes", "Golgi apparatus", "Lysosome"],
      correctAnswer: "Ribosomes",
      explanation: "Ribosomes translate mRNA into polypeptide chains.",
    },
    {
      nodeSlug: "cell-division",
      prompt: "Mitosis produces four genetically identical haploid cells.",
      type: "true_false",
      options: null,
      correctAnswer: "false",
      explanation: "Mitosis yields two diploid daughter cells genetically like the parent; meiosis yields four haploid cells.",
    },
    {
      nodeSlug: "cellular-respiration",
      prompt: "The main purpose of cellular respiration is to produce ATP from nutrients.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Cells extract energy through glycolysis, the citric acid cycle, and oxidative phosphorylation.",
    },
    {
      nodeSlug: "photosynthesis",
      prompt: "Photosynthesis converts light energy into chemical energy stored largely in:",
      type: "multiple_choice",
      options: ["ATP and sugars", "Only heat", "Only nitrogen gas", "Ethanol only"],
      correctAnswer: "ATP and sugars",
      explanation: "Light reactions make ATP/NADPH; Calvin cycle builds sugars.",
    },
    {
      nodeSlug: "dna-structure",
      prompt: "DNA typically forms a double helix with complementary base pairing: A with T and G with C.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Watson–Crick pairing rules underlie replication and stability.",
    },
    {
      nodeSlug: "protein-synthesis",
      prompt: "Translation occurs at the ribosome using mRNA as a template.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "tRNAs bring amino acids to the ribosome according to the mRNA codons.",
    },
    {
      nodeSlug: "genetics-inheritance",
      prompt: "If both alleles for a gene are identical, the organism is homozygous for that gene.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Homozygous means two copies of the same allele.",
    },
    {
      nodeSlug: "evolution-natural-selection",
      prompt: "Natural selection acts on heritable variation in populations over generations.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Traits that improve survival or reproduction become more common when heritable.",
    },
    {
      nodeSlug: "ecology-ecosystems",
      prompt: "In a food chain, producers typically:",
      type: "multiple_choice",
      options: [
        "Eat apex predators",
        "Convert sunlight to chemical energy (e.g., photosynthesis)",
        "Are always fungi",
        "Do not interact with consumers",
      ],
      correctAnswer: "Convert sunlight to chemical energy (e.g., photosynthesis)",
      explanation: "Autotrophs form the base of most ecosystems.",
    },
    {
      nodeSlug: "digestive-system",
      prompt: "Most nutrient absorption into the blood occurs in the small intestine.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "The small intestine has a large surface area and specialized absorptive cells.",
    },
    {
      nodeSlug: "circulatory-system",
      prompt: "The human heart has four chambers: two atria and two ventricles.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Separation of oxygenated and deoxygenated blood is refined in birds and mammals.",
    },
    {
      nodeSlug: "nervous-system",
      prompt: "Neurons transmit signals using electrical impulses and chemical synapses.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Action potentials travel axons; neurotransmitters cross synapses to the next cell.",
    },
  ],
  "computer-science": [
    {
      nodeSlug: "variables-types",
      prompt: "In most typed languages, a boolean variable can hold:",
      type: "multiple_choice",
      options: ["true or false", "Any string", "Only integers", "Only floating-point numbers"],
      correctAnswer: "true or false",
      explanation: "Booleans represent logical truth values.",
    },
    {
      nodeSlug: "control-flow",
      prompt: "A loop that checks its condition before each iteration is often called a while-loop style check.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "While and for-loops evaluate conditions to decide whether to continue.",
    },
    {
      nodeSlug: "functions",
      prompt: "A pure function always returns the same output for the same inputs and has no side effects.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Purity means no reliance on hidden state or I/O that would vary behavior.",
    },
    {
      nodeSlug: "arrays",
      prompt: "Array indexing in most languages starts at:",
      type: "multiple_choice",
      options: ["0", "1", "−1", "The middle element"],
      correctAnswer: "0",
      explanation: "C-style languages use zero-based indexing.",
    },
    {
      nodeSlug: "lists-linked",
      prompt: "A singly linked list allows O(1) insertion at the head if you maintain a pointer to the head.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Inserting after obtaining the head pointer avoids shifting elements like in arrays.",
    },
    {
      nodeSlug: "dictionaries",
      prompt: "A hash table provides average-case O(1) lookup for key-value pairs.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "A good hash function spreads keys to reduce collisions.",
    },
    {
      nodeSlug: "search-algorithms",
      prompt: "Binary search requires the underlying data to be sorted.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Halving the search space only works when ordering is defined.",
    },
    {
      nodeSlug: "sort-algorithms",
      prompt: "Merge sort typically has which time complexity in the worst case (for n elements)?",
      type: "multiple_choice",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"],
      correctAnswer: "O(n log n)",
      explanation: "Merge sort divides and merges in logarithmic depth with linear work per level.",
    },
    {
      nodeSlug: "big-o",
      prompt: "O(n²) always runs faster than O(n log n) for every input size.",
      type: "true_false",
      options: null,
      correctAnswer: "false",
      explanation: "Asymptotic notation ignores constants; for large n, n log n grows slower than n².",
    },
    {
      nodeSlug: "design-patterns",
      prompt: "The Singleton pattern restricts instantiation of a class to one object.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Useful for shared resources, but can complicate testing if overused.",
    },
    {
      nodeSlug: "testing-debugging",
      prompt: "A unit test typically verifies a small piece of code in isolation.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Unit tests target functions or modules with controlled inputs.",
    },
  ],
  physics: [
    {
      nodeSlug: "kinematics",
      prompt: "Average velocity is displacement divided by elapsed time.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Velocity includes direction; speed is the magnitude of velocity.",
    },
    {
      nodeSlug: "forces-newton",
      prompt: "Newton's second law states F = ma (net force equals mass times acceleration).",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Acceleration is proportional to net force and inversely proportional to mass.",
    },
    {
      nodeSlug: "work-energy",
      prompt: "The work done by a constant force parallel to displacement is:",
      type: "multiple_choice",
      options: ["F/d", "F · d", "F + d", "d/F"],
      correctAnswer: "F · d",
      explanation: "Work = force times displacement in the direction of the force (for constant parallel force).",
    },
    {
      nodeSlug: "momentum",
      prompt: "In an isolated system with no external forces, total momentum is conserved.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Momentum conservation follows from Newton's third law in collisions.",
    },
    {
      nodeSlug: "wave-basics",
      prompt: "Wavelength is the distance between two consecutive crests of a wave.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Wavelength, frequency, and speed relate by v = fλ.",
    },
    {
      nodeSlug: "sound",
      prompt: "Sound waves in air are longitudinal pressure waves.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Particles oscillate parallel to the direction energy travels.",
    },
    {
      nodeSlug: "light-optics",
      prompt: "The law of reflection states that the angle of incidence equals the angle of reflection.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Measured from the normal to the surface.",
    },
    {
      nodeSlug: "electric-circuits",
      prompt: "In series, the same current flows through each component.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Charge conservation implies identical current in a single series path.",
    },
    {
      nodeSlug: "electromagnetism",
      prompt: "A changing magnetic field can induce an electric field (Faraday's law).",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "This principle underlies generators and transformers.",
    },
    {
      nodeSlug: "atomic-physics",
      prompt: "The Bohr model associates electron energy levels with discrete orbits in hydrogen.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "It was an early quantization picture later refined by quantum mechanics.",
    },
    {
      nodeSlug: "nuclear-physics",
      prompt: "Nuclear fission splits heavy nuclei and can release energy.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Mass defect becomes energy according to E = mc².",
    },
  ],
};

const BADGES = [
  { slug: "first-diagnostic", title: "First Diagnostic", description: "Completed your first diagnostic", icon: "🎯" },
  { slug: "7-day-streak", title: "7-Day Streak", description: "Studied for 7 days in a row", icon: "🔥" },
  { slug: "mission-finisher", title: "Mission Finisher", description: "Completed your first mission", icon: "✅" },
  {
    slug: "mission-veteran",
    title: "Mission Veteran",
    description: "Completed 10 missions",
    icon: "🎖️",
  },
  {
    slug: "mission-legend",
    title: "Mission Legend",
    description: "Completed 25 missions",
    icon: "🏆",
  },
  {
    slug: "challenge-taker",
    title: "Challenge Taker",
    description: "Finished a challenge mission",
    icon: "⚡",
  },
  {
    slug: "scene-sharp",
    title: "Scene Sharp",
    description: "Cleared every scene on the first try",
    icon: "🎯",
  },
  {
    slug: "weekly-warrior",
    title: "Weekly Warrior",
    description: "Completed 3 missions in one week",
    icon: "📅",
  },
  { slug: "top-contributor", title: "Top Contributor", description: "Uploaded 10+ resources", icon: "🌟" },
  { slug: "stoichiometry-master", title: "Stoichiometry Master", description: "Mastered stoichiometry", icon: "⚗️" },
];

async function seed() {
  console.log("Seeding database...");

  for (const badge of BADGES) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      create: badge,
      update: badge,
    });
  }
  console.log("Badges seeded");

  for (const subj of SUBJECTS) {
    const subject = await prisma.subject.upsert({
      where: { slug: subj.slug },
      create: { ...subj, status: "published" },
      update: { ...subj, status: "published" },
    });

    const SUBJECT_CONTENT: Record<
      string,
      {
        clusters: typeof algebraClusters;
        nodes: typeof algebraNodes;
        edges: typeof algebraEdges;
      }
    > = {
      algebra: { clusters: algebraClusters, nodes: algebraNodes, edges: algebraEdges },
      biology: { clusters: biologyClusters, nodes: biologyNodes, edges: biologyEdges },
      chemistry: { clusters: chemistryClusters, nodes: chemistryNodes, edges: chemistryEdges },
      "computer-science": {
        clusters: computerScienceClusters,
        nodes: computerScienceNodes,
        edges: computerScienceEdges,
      },
      physics: { clusters: physicsClusters, nodes: physicsNodes, edges: physicsEdges },
      "sat-math": { clusters: satMathClusters, nodes: satMathNodes, edges: satMathEdges },
      geometry: { clusters: geometryClusters, nodes: geometryNodes, edges: geometryEdges },
      "world-history": {
        clusters: worldHistoryClusters,
        nodes: worldHistoryNodes,
        edges: worldHistoryEdges,
      },
    };
    const { clusters: clusterData, nodes: nodeData, edges: edgeData } =
      SUBJECT_CONTENT[subj.slug] ?? { clusters: [], nodes: [], edges: [] };

    const clusterMap: Record<string, string> = {};
    for (const c of clusterData) {
      const cluster = await prisma.cluster.upsert({
        where: { subjectId_slug: { subjectId: subject.id, slug: c.slug } },
        create: {
          subjectId: subject.id,
          slug: c.slug,
          title: c.title,
          description: c.description,
          orderIndex: c.orderIndex,
        },
        update: { title: c.title, description: c.description, orderIndex: c.orderIndex },
      });
      clusterMap[c.slug] = cluster.id;
    }

    const nodeMap: Record<string, string> = {};
    for (const n of nodeData) {
      const clusterId = clusterMap[n.clusterSlug];
      if (!clusterId) continue;
      const node = await prisma.conceptNode.upsert({
        where: { subjectId_slug: { subjectId: subject.id, slug: n.slug } },
        create: {
          subjectId: subject.id,
          clusterId,
          slug: n.slug,
          title: n.title,
          description: `Learn ${n.title} - essential concept for mastery.`,
          orderIndex: n.orderIndex,
        },
        update: { title: n.title, orderIndex: n.orderIndex },
      });
      nodeMap[n.slug] = node.id;
    }

    for (const e of edgeData) {
      const sourceId = nodeMap[e.source];
      const targetId = nodeMap[e.target];
      if (!sourceId || !targetId) continue;
      await prisma.conceptEdge.upsert({
        where: {
          subjectId_sourceNodeId_targetNodeId: {
            subjectId: subject.id,
            sourceNodeId: sourceId,
            targetNodeId: targetId,
          },
        },
        create: {
          subjectId: subject.id,
          sourceNodeId: sourceId,
          targetNodeId: targetId,
          relationshipType: e.type,
        },
        update: { relationshipType: e.type },
      });
    }

    const questions = DIAGNOSTIC_QUESTIONS[subj.slug] ?? [];
    for (const q of questions) {
      const nodeId = nodeMap[q.nodeSlug];
      if (!nodeId) continue;
      await prisma.diagnosticQuestion.create({
        data: {
          subjectId: subject.id,
          nodeId,
          prompt: q.prompt,
          type: q.type,
          optionsJson: q.options ? JSON.stringify(q.options) : null,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        },
      });
    }

    console.log(`Subject ${subj.slug} seeded`);
  }

  const demoPassword = await bcrypt.hash("demo1234", 10);
  const adminPassword = await bcrypt.hash("admin1234", 10);
  const superAdminPassword = await bcrypt.hash("superadmin1234", 10);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@mindorbit.learn" },
    create: {
      email: "demo@mindorbit.learn",
      name: "Demo Student",
      passwordHash: demoPassword,
      gradeLevel: "11",
      studyGoal: "SAT prep",
      onboardingCompleted: true,
      xp: 150,
      streakCount: 3,
      planTier: "FREE",
      subscriptionStatus: "INACTIVE",
      referralCode: "DEMOINV1",
    },
    update: {},
  });

  const proUser = await prisma.user.upsert({
    where: { email: "pro@mindorbit.learn" },
    create: {
      email: "pro@mindorbit.learn",
      name: "Pro Test User",
      passwordHash: demoPassword,
      onboardingCompleted: true,
      planTier: "PRO",
      subscriptionStatus: "ACTIVE",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      referralCode: "PROINV01",
    },
    update: { planTier: "PRO", subscriptionStatus: "ACTIVE" },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@mindorbit.learn" },
    create: {
      email: "admin@mindorbit.learn",
      name: "Admin User",
      passwordHash: adminPassword,
      role: "ADMIN",
      onboardingCompleted: true,
      referralCode: "ADMINV01",
    },
    update: { role: "ADMIN", passwordHash: adminPassword },
  });

  const superAdminUser = await prisma.user.upsert({
    where: { email: "superadmin@mindorbit.learn" },
    create: {
      email: "superadmin@mindorbit.learn",
      name: "Super Admin",
      passwordHash: superAdminPassword,
      role: "SUPER_ADMIN",
      onboardingCompleted: true,
      referralCode: "SUPERINV1",
    },
    update: { role: "SUPER_ADMIN", passwordHash: superAdminPassword },
  });

  const allSubjects = await prisma.subject.findMany({ select: { id: true } });
  for (const userId of [demoUser.id, proUser.id, adminUser.id, superAdminUser.id]) {
    for (const { id: subjectId } of allSubjects) {
      await prisma.userSubjectAdd.upsert({
        where: { userId_subjectId: { userId, subjectId } },
        create: { userId, subjectId },
        update: {},
      });
    }
  }

  await prisma.userBadge.upsert({
    where: {
      userId_badgeId: {
        userId: demoUser.id,
        badgeId: (await prisma.badge.findUnique({ where: { slug: "first-diagnostic" } }))!.id,
      },
    },
    create: {
      userId: demoUser.id,
      badgeId: (await prisma.badge.findUnique({ where: { slug: "first-diagnostic" } }))!.id,
    },
    update: {},
  });

  const chemistrySubject = await prisma.subject.findUnique({ where: { slug: "chemistry" } });
  if (chemistrySubject) {
    const chemistryCluster = await prisma.cluster.findFirst({
      where: { subjectId: chemistrySubject.id, slug: "stoichiometry" },
    });
    const moleNode = await prisma.conceptNode.findFirst({
      where: { subjectId: chemistrySubject.id, slug: "mole-concept" },
    });
    const stoichiometryNode = await prisma.conceptNode.findFirst({
      where: { subjectId: chemistrySubject.id, slug: "stoichiometry-calc" },
    });
    if (chemistryCluster && moleNode) {
      await prisma.resource.create({
        data: {
          userId: demoUser.id,
          subjectId: chemistrySubject.id,
          clusterId: chemistryCluster.id,
          nodeId: moleNode.id,
          type: "note",
          title: "Mole Concept Quick Reference",
          description: "Essential formulas and examples for the mole concept",
          status: "approved",
          contentJson: JSON.stringify({
            markdown: `## Mole Concept\n\n- 1 mole = 6.022 × 10²³ particles\n- Moles = mass / molar mass\n- Molar volume of gas at STP = 22.4 L`,
          }),
        },
      });
      if (stoichiometryNode) {
        await prisma.resource.create({
          data: {
            userId: demoUser.id,
            subjectId: chemistrySubject.id,
            clusterId: chemistryCluster.id,
            nodeId: stoichiometryNode.id,
            type: "summary",
            title: "Stoichiometry Step-by-Step",
            description: "How to solve stoichiometry problems",
            status: "approved",
            contentJson: JSON.stringify({
              markdown: `## Stoichiometry\n\n1. Balance the equation\n2. Convert to moles\n3. Use mole ratio\n4. Convert to desired unit`,
            }),
          },
        });
      }
    }
  }

  for (const lessonSeed of VISUAL_ENGINE_LESSON_SEEDS) {
    const subSlug = subjectSlugForVisualLessonSeed(lessonSeed);
    const subjectRow = await prisma.subject.findUnique({ where: { slug: subSlug } });
    if (!subjectRow) continue;
    await prisma.sceneLesson.upsert({
      where: { id: lessonSeed.id },
      create: {
        id: lessonSeed.id,
        userId: demoUser.id,
        subjectId: subjectRow.id,
        topic: lessonSeed.topic,
        level: lessonSeed.level,
        title: lessonSeed.title,
        lessonJson: lessonSeed as object,
      },
      update: {
        lessonJson: lessonSeed as object,
        title: lessonSeed.title,
        topic: lessonSeed.topic,
        level: lessonSeed.level,
        subjectId: subjectRow.id,
      },
    });
  }
  console.log(`Visual Problem Engine: ${VISUAL_ENGINE_LESSON_SEEDS.length} seed lessons upserted`);

  console.log("Demo user, admin users, and resources seeded");
  console.log("Seed complete.");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
