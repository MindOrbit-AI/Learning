export type K12Topic = { id: string; title: string };

export type K12Subject = {
  id: string;
  name: string;
  topics: K12Topic[];
};

export type K12Grade = {
  id: string;
  label: string;
  /** Display order K, 1–12 */
  order: number;
  subjects: K12Subject[];
};

/**
 * Representative K–12 topics for browsing into the AI lesson demo.
 * Sorted by `order`; within each grade, subjects group their topics.
 */
export const k12Grades: K12Grade[] = [
  {
    id: "k",
    label: "Kindergarten",
    order: 0,
    subjects: [
      {
        id: "math",
        name: "Math",
        topics: [
          { id: "count-to-10", title: "Counting and writing numbers to 10" },
          { id: "shapes", title: "2D shapes: circles, squares, triangles" },
          { id: "more-less", title: "More, less, and same amount" },
          { id: "patterns", title: "Repeating color and shape patterns" },
          { id: "compare-length", title: "Longer, shorter, and same length" },
          { id: "subitize", title: "Recognizing small quantities without counting" },
        ],
      },
      {
        id: "ela",
        name: "English Language Arts",
        topics: [
          { id: "letters-sounds", title: "Letter names and beginning sounds" },
          { id: "rhyming", title: "Rhyming words and word families" },
          { id: "story-parts", title: "Characters and settings in stories" },
          { id: "print-awareness", title: "Books, titles, author, and direction of print" },
          { id: "listening", title: "Following one- and two-step directions" },
          { id: "sight-words", title: "High-frequency words in simple sentences" },
        ],
      },
      {
        id: "science",
        name: "Science",
        topics: [
          { id: "five-senses", title: "The five senses and how we observe" },
          { id: "weather", title: "Sunny, rainy, snowy: daily weather" },
          { id: "living-nonliving", title: "Living vs. nonliving things" },
          { id: "seasons", title: "Four seasons and how nature changes" },
          { id: "sky-day-night", title: "Sun, moon, and day vs. night" },
          { id: "magnets-simple", title: "What sticks to a magnet?" },
        ],
      },
      {
        id: "social",
        name: "Social Studies",
        topics: [
          { id: "self-family", title: "My family, classroom, and neighborhood" },
          { id: "holidays", title: "Community celebrations and traditions" },
          { id: "jobs", title: "Helpers in our community" },
        ],
      },
    ],
  },
  {
    id: "1",
    label: "Grade 1",
    order: 1,
    subjects: [
      {
        id: "math",
        name: "Math",
        topics: [
          { id: "add-subtract-20", title: "Addition and subtraction within 20" },
          { id: "place-value-tens", title: "Tens and ones place value" },
          { id: "time-half-hour", title: "Telling time to the hour and half hour" },
          { id: "data-simple", title: "Picture graphs and tally charts" },
          { id: "geometry-composite", title: "Combining shapes to make new shapes" },
          { id: "word-problems-20", title: "Solving story problems within 20" },
        ],
      },
      {
        id: "ela",
        name: "English Language Arts",
        topics: [
          { id: "phonics-blends", title: "Blends, digraphs, and short vowels" },
          { id: "sentences", title: "Writing complete sentences" },
          { id: "main-idea", title: "Main idea of a short passage" },
          { id: "nouns-verbs", title: "Nouns and verbs in sentences" },
          { id: "sequence", title: "Beginning, middle, and end of a story" },
          { id: "opinions", title: "Sharing opinions about books we read" },
        ],
      },
      {
        id: "science",
        name: "Science",
        topics: [
          { id: "plants-needs", title: "What plants need to live" },
          { id: "sound", title: "Sound: vibrations and volume" },
          { id: "light-shadows", title: "Light sources and shadows" },
          { id: "animal-parents", title: "How animal parents help their young" },
          { id: "sky-patterns", title: "Patterns we see in the daytime and nighttime sky" },
        ],
      },
      {
        id: "social",
        name: "Social Studies",
        topics: [
          { id: "rules-community", title: "Rules at home, school, and in the community" },
          { id: "maps-symbols", title: "Simple maps and map symbols" },
          { id: "then-now", title: "Life long ago vs. today" },
          { id: "needs-wants", title: "Needs, wants, and making choices" },
        ],
      },
    ],
  },
  {
    id: "2",
    label: "Grade 2",
    order: 2,
    subjects: [
      {
        id: "math",
        name: "Math",
        topics: [
          { id: "add-subtract-100", title: "Addition and subtraction within 100" },
          { id: "money", title: "Coins and making change" },
          { id: "measurement-length", title: "Measuring length in inches and centimeters" },
          { id: "arrays-intro", title: "Arrays as rows and columns" },
          { id: "number-lines", title: "Open number lines and skip counting" },
          { id: "shapes-attributes", title: "Sides, angles, and vertices of shapes" },
        ],
      },
      {
        id: "ela",
        name: "English Language Arts",
        topics: [
          { id: "opinion-writing", title: "Writing opinions with reasons" },
          { id: "prefixes-suffixes", title: "Prefixes, suffixes, and root words" },
          { id: "adjectives", title: "Describing words that paint a picture" },
          { id: "compare-contrast", title: "Comparing two versions of a story" },
          { id: "research-k2", title: "Asking questions and finding facts in sources" },
        ],
      },
      {
        id: "science",
        name: "Science",
        topics: [
          { id: "habitats", title: "Animal habitats and adaptations" },
          { id: "matter-states", title: "Solids, liquids, and gases" },
          { id: "erosion-simple", title: "Water and wind changing the land" },
          { id: "materials-properties", title: "Flexible, rigid, absorbent materials" },
        ],
      },
      {
        id: "social",
        name: "Social Studies",
        topics: [
          { id: "goods-services", title: "Goods, services, and producers" },
          { id: "landforms", title: "Mountains, valleys, rivers, and lakes" },
          { id: "consumers", title: "Consumers, producers, and saving money" },
          { id: "geography-us", title: "States, capitals, and major landforms of the U.S." },
        ],
      },
    ],
  },
  {
    id: "3",
    label: "Grade 3",
    order: 3,
    subjects: [
      {
        id: "math",
        name: "Math",
        topics: [
          { id: "multiplication-intro", title: "Introduction to multiplication" },
          { id: "fractions-parts", title: "Fractions as parts of a whole" },
          { id: "area-perimeter", title: "Area and perimeter of rectangles" },
          { id: "division-meaning", title: "Division as sharing and grouping" },
          { id: "rounding", title: "Rounding to the nearest 10 and 100" },
          { id: "mass-volume", title: "Mass and liquid volume in metric units" },
        ],
      },
      {
        id: "ela",
        name: "English Language Arts",
        topics: [
          { id: "central-message", title: "Central message and moral of a story" },
          { id: "compare-texts", title: "Comparing two texts on the same topic" },
          { id: "point-of-view", title: "First person vs. third person narration" },
          { id: "informative-writing", title: "Writing informative paragraphs with facts" },
          { id: "context-clues", title: "Using context clues to learn new words" },
        ],
      },
      {
        id: "science",
        name: "Science",
        topics: [
          { id: "forces-motion", title: "Forces and motion: push and pull" },
          { id: "life-cycles", title: "Plant and animal life cycles" },
          { id: "inheritance", title: "Traits passed from parents to offspring" },
          { id: "weather-data", title: "Recording and interpreting weather data" },
        ],
      },
      {
        id: "social",
        name: "Social Studies",
        topics: [
          { id: "local-government", title: "Local government and community leaders" },
          { id: "cultural-traditions", title: "Cultural traditions in communities" },
          { id: "immigration-stories", title: "Migration and cultural contributions" },
          { id: "civics-rights", title: "Rights and responsibilities of citizens" },
        ],
      },
    ],
  },
  {
    id: "4",
    label: "Grade 4",
    order: 4,
    subjects: [
      {
        id: "math",
        name: "Math",
        topics: [
          { id: "multi-digit-mult", title: "Multi-digit multiplication" },
          { id: "angles", title: "Angles, lines, and symmetry" },
          { id: "decimals-intro", title: "Decimals to hundredths" },
          { id: "division-place", title: "Division with place-value strategies" },
          { id: "fractions-equivalent", title: "Equivalent fractions on number lines" },
          { id: "measurement-convert", title: "Converting larger to smaller units" },
        ],
      },
      {
        id: "ela",
        name: "English Language Arts",
        topics: [
          { id: "theme", title: "Theme in literature" },
          { id: "research-intro", title: "Using sources for a short research paragraph" },
          { id: "mythology-allusions", title: "Mythology and allusions in language" },
          { id: "dialogue-punctuation", title: "Punctuating and formatting dialogue" },
          { id: "text-features", title: "Headings, captions, and text features" },
        ],
      },
      {
        id: "science",
        name: "Science",
        topics: [
          { id: "energy-transfer", title: "Energy transfer: light, sound, heat" },
          { id: "rocks-soil", title: "Rocks, minerals, and soil" },
          { id: "fossils", title: "Fossils and evidence of past environments" },
          { id: "human-body-systems", title: "Major human body systems and health" },
        ],
      },
      {
        id: "social",
        name: "Social Studies",
        topics: [
          { id: "regions-us", title: "Regions of the United States" },
          { id: "economics-choice", title: "Scarcity, choice, and opportunity cost" },
          { id: "native-nations", title: "Native nations and regions before contact" },
          { id: "explorers", title: "European exploration and exchange" },
        ],
      },
    ],
  },
  {
    id: "5",
    label: "Grade 5",
    order: 5,
    subjects: [
      {
        id: "math",
        name: "Math",
        topics: [
          { id: "fraction-ops", title: "Adding and subtracting fractions" },
          { id: "volume", title: "Volume of rectangular prisms" },
          { id: "coordinate-plane", title: "Plotting points on the coordinate plane" },
          { id: "fraction-mult-div", title: "Multiplying fractions and dividing with unit fractions" },
          { id: "decimals-ops", title: "Operations with decimals to hundredths" },
          { id: "expressions-patterns", title: "Numerical expressions and number patterns" },
        ],
      },
      {
        id: "ela",
        name: "English Language Arts",
        topics: [
          { id: "compare-genres", title: "Comparing drama, poetry, and prose" },
          { id: "evidence", title: "Citing text evidence in responses" },
          { id: "figurative-5", title: "Similes, metaphors, and idioms" },
          { id: "argument-5", title: "Writing short arguments with reasons" },
          { id: "summarize", title: "Summarizing fiction and nonfiction" },
        ],
      },
      {
        id: "science",
        name: "Science",
        topics: [
          { id: "ecosystems", title: "Food webs and ecosystems" },
          { id: "earth-systems", title: "Earth’s spheres: geosphere, hydrosphere, atmosphere" },
          { id: "stars-sun", title: "Stars, the sun, and apparent brightness" },
          { id: "matter-conservation", title: "Conservation of matter in mixing and changes" },
        ],
      },
      {
        id: "social",
        name: "Social Studies",
        topics: [
          { id: "colonial-america", title: "Colonial America and early government ideas" },
          { id: "westward", title: "Westward expansion and impacts" },
          { id: "revolution-prep", title: "Growing tension before the American Revolution" },
          { id: "constitution-basics", title: "Articles of Confederation to Constitution overview" },
        ],
      },
    ],
  },
  {
    id: "6",
    label: "Grade 6",
    order: 6,
    subjects: [
      {
        id: "math",
        name: "Math",
        topics: [
          { id: "ratios", title: "Ratios and unit rates" },
          { id: "integers", title: "Positive and negative integers on the number line" },
          { id: "expressions", title: "Algebraic expressions and equivalent forms" },
          { id: "area-surface", title: "Area of polygons and surface area of prisms" },
          { id: "stats-center", title: "Mean, median, mode, and range" },
          { id: "inequalities", title: "Inequalities on the number line" },
        ],
      },
      {
        id: "ela",
        name: "English Language Arts",
        topics: [
          { id: "argument", title: "Claims, reasons, and evidence in argument writing" },
          { id: "figurative", title: "Figurative language and tone" },
          { id: "theme-development", title: "How setting and plot develop theme" },
          { id: "compare-media", title: "Comparing a text to its film or audio version" },
        ],
      },
      {
        id: "science",
        name: "Science",
        topics: [
          { id: "cells", title: "Cells and basic body systems" },
          { id: "weather-climate", title: "Weather patterns vs. climate" },
          { id: "energy-gr6", title: "Kinetic vs. potential energy in systems" },
          { id: "water-cycle", title: "Water cycle and distribution of Earth’s water" },
        ],
      },
      {
        id: "social",
        name: "Social Studies",
        topics: [
          { id: "ancient-civ", title: "Ancient civilizations: geography and achievements" },
          { id: "gov-types", title: "Types of government: democracy, monarchy, dictatorship" },
          { id: "river-valleys", title: "Early river valley civilizations" },
          { id: "belief-systems", title: "Origins and spread of major belief systems" },
        ],
      },
      {
        id: "cs",
        name: "Computer Science",
        topics: [
          { id: "algo-6", title: "Algorithms, inputs, outputs, and debugging" },
          { id: "internet-safety", title: "Digital citizenship and online safety" },
          { id: "data-privacy", title: "Personal data, passwords, and privacy basics" },
        ],
      },
    ],
  },
  {
    id: "7",
    label: "Grade 7",
    order: 7,
    subjects: [
      {
        id: "math",
        name: "Math",
        topics: [
          { id: "proportions", title: "Proportional relationships" },
          { id: "probability", title: "Basic probability and sample space" },
          { id: "percent", title: "Percent, decimals, and real-world problems" },
          { id: "scale-drawings", title: "Scale drawings and similar figures" },
          { id: "circle-measure", title: "Circumference and area of a circle" },
        ],
      },
      {
        id: "ela",
        name: "English Language Arts",
        topics: [
          { id: "literary-analysis", title: "Analyzing character, conflict, and resolution" },
          { id: "info-structure", title: "Structure of informational texts" },
          { id: "mood-tone", title: "Mood, tone, and word choice" },
          { id: "collaborative-discussion", title: "Building on others’ ideas in discussion" },
        ],
      },
      {
        id: "science",
        name: "Science",
        topics: [
          { id: "genetics-intro", title: "Heredity, traits, and variation" },
          { id: "chemical-reactions", title: "Chemical reactions and conservation of mass" },
          { id: "plate-tectonics", title: "Plate tectonics and Earth’s surface" },
          { id: "photosynthesis-7", title: "Photosynthesis, respiration, and energy in ecosystems" },
        ],
      },
      {
        id: "social",
        name: "Social Studies",
        topics: [
          { id: "medieval", title: "Medieval societies and trade routes" },
          { id: "renaissance", title: "Renaissance ideas and exploration" },
          { id: "islamic-golden", title: "Islamic world, trade, and learning" },
          { id: "feudalism", title: "Feudalism, manorialism, and social roles" },
        ],
      },
      {
        id: "cs",
        name: "Computer Science",
        topics: [
          { id: "variables-loops", title: "Variables, conditionals, and loops in code" },
          { id: "binary", title: "Binary representation and encoding ideas" },
          { id: "hardware-software", title: "Hardware, software, and how computers work" },
        ],
      },
    ],
  },
  {
    id: "8",
    label: "Grade 8",
    order: 8,
    subjects: [
      {
        id: "math",
        name: "Math",
        topics: [
          { id: "linear-equations", title: "Linear equations and slope" },
          { id: "pythagorean", title: "The Pythagorean theorem" },
          { id: "exponents-8", title: "Integer exponents and scientific notation" },
          { id: "systems-graph", title: "Solving systems by graphing" },
          { id: "transformations", title: "Translations, rotations, reflections, dilations" },
        ],
      },
      {
        id: "ela",
        name: "English Language Arts",
        topics: [
          { id: "theme-poetry", title: "Theme and structure in poetry" },
          { id: "research-synthesis", title: "Synthesizing multiple sources" },
          { id: "analyze-arguments", title: "Evaluating claims and evidence in nonfiction" },
          { id: "verbals", title: "Participles, gerunds, and infinitives" },
        ],
      },
      {
        id: "science",
        name: "Science",
        topics: [
          { id: "evolution", title: "Natural selection and adaptation" },
          { id: "waves", title: "Properties of waves and the electromagnetic spectrum" },
          { id: "forces-8", title: "Forces, Newton’s first law, and inertia" },
          { id: "climate-change", title: "Human impacts on climate and resources" },
        ],
      },
      {
        id: "social",
        name: "Social Studies",
        topics: [
          { id: "american-revolution", title: "American Revolution: causes and outcomes" },
          { id: "constitution", title: "The U.S. Constitution and Bill of Rights" },
          { id: "early-republic", title: "Washington to Jefferson: shaping the new nation" },
          { id: "war-1812", title: "War of 1812 and growing U.S. identity" },
        ],
      },
      {
        id: "cs",
        name: "Computer Science",
        topics: [
          { id: "functions-abstraction", title: "Functions, parameters, and abstraction" },
          { id: "internet-protocols", title: "How data moves on the internet" },
          { id: "ai-ethics-intro", title: "What is AI? Bias, fairness, and ethics intro" },
        ],
      },
    ],
  },
  {
    id: "9",
    label: "Grade 9",
    order: 9,
    subjects: [
      {
        id: "math",
        name: "Math",
        topics: [
          { id: "algebra-linear", title: "Linear functions and graphs" },
          { id: "systems", title: "Systems of linear equations" },
          { id: "exponents", title: "Exponents and scientific notation" },
          { id: "quadratics-intro", title: "Quadratic expressions and basic factoring" },
          { id: "sequences-9", title: "Arithmetic sequences as linear patterns" },
        ],
      },
      {
        id: "ela",
        name: "English Language Arts",
        topics: [
          { id: "literary-devices", title: "Literary devices in fiction and drama" },
          { id: "rhetoric", title: "Rhetoric: ethos, pathos, logos" },
          { id: "close-reading", title: "Annotating and close reading strategies" },
          { id: "narrative-voice", title: "Unreliable narrators and perspective" },
        ],
      },
      {
        id: "science",
        name: "Science",
        topics: [
          { id: "biology-cells", title: "Cell structure, photosynthesis, and respiration" },
          { id: "chemistry-atoms", title: "Atoms, elements, and the periodic table" },
          { id: "motion-kinematics", title: "Position, velocity, and acceleration" },
          { id: "earth-systems-9", title: "Earth systems and geologic time scale" },
        ],
      },
      {
        id: "social",
        name: "Social Studies",
        topics: [
          { id: "world-religions", title: "World religions and cultural diffusion" },
          { id: "industrial-rev", title: "Industrial Revolution: causes and effects" },
          { id: "imperialism", title: "Imperialism and resistance in the 19th century" },
          { id: "ww1-origins", title: "Origins of World War I and total war" },
        ],
      },
      {
        id: "cs",
        name: "Computer Science",
        topics: [
          { id: "python-basics", title: "Python: variables, lists, and loops" },
          { id: "html-css-intro", title: "HTML structure and CSS styling basics" },
          { id: "cybersecurity", title: "Cybersecurity threats and safe practices" },
        ],
      },
    ],
  },
  {
    id: "10",
    label: "Grade 10",
    order: 10,
    subjects: [
      {
        id: "math",
        name: "Math",
        topics: [
          { id: "quadratics", title: "Quadratic functions and factoring" },
          { id: "geometry-proofs", title: "Geometric proofs and congruence" },
          { id: "trig-sohcahtoa", title: "Right triangle ratios: sine, cosine, tangent" },
          { id: "circles-10", title: "Circle equations, arcs, and sectors" },
        ],
      },
      {
        id: "ela",
        name: "English Language Arts",
        topics: [
          { id: "shakespeare-intro", title: "Reading Shakespeare: language and themes" },
          { id: "research-paper", title: "Developing a research question and thesis" },
          { id: "greek-lit", title: "Greek drama and the tragic hero" },
          { id: "literary-movements", title: "Romanticism and realism in literature" },
        ],
      },
      {
        id: "science",
        name: "Science",
        topics: [
          { id: "genetics-molecular", title: "DNA, genes, and protein synthesis" },
          { id: "stoichiometry-intro", title: "Chemical equations and stoichiometry basics" },
          { id: "energy-work", title: "Work, energy, and conservation of energy" },
          { id: "evolution-evidence", title: "Evidence for evolution: fossils, DNA, anatomy" },
        ],
      },
      {
        id: "social",
        name: "Social Studies",
        topics: [
          { id: "ww1", title: "World War I: alliances and trench warfare" },
          { id: "interwar", title: "Interwar years: rise of totalitarianism" },
          { id: "ww2", title: "World War II: theaters, Holocaust, and home front" },
          { id: "cold-war-origins", title: "Origins of the Cold War and containment" },
        ],
      },
      {
        id: "cs",
        name: "Computer Science",
        topics: [
          { id: "data-structures", title: "Arrays, dictionaries, and algorithm efficiency" },
          { id: "sql-intro", title: "Relational data and SQL queries" },
          { id: "apis", title: "REST APIs and JSON data" },
        ],
      },
    ],
  },
  {
    id: "11",
    label: "Grade 11",
    order: 11,
    subjects: [
      {
        id: "math",
        name: "Math",
        topics: [
          { id: "trig-ratios", title: "Right triangle trigonometry" },
          { id: "sequences", title: "Arithmetic and geometric sequences" },
          { id: "unit-circle", title: "The unit circle and radians" },
          { id: "log-intro", title: "Logarithms and exponential models" },
        ],
      },
      {
        id: "ela",
        name: "English Language Arts",
        topics: [
          { id: "american-lit", title: "American literature: movements and major authors" },
          { id: "satire", title: "Satire and social commentary" },
          { id: "modernism", title: "Modernism and disillusionment after WWI" },
          { id: "harlem-renaissance", title: "Harlem Renaissance and Black literary voices" },
        ],
      },
      {
        id: "science",
        name: "Science",
        topics: [
          { id: "newton-laws", title: "Newton’s laws and forces" },
          { id: "thermodynamics-intro", title: "Energy, heat, and thermodynamics intro" },
          { id: "electricity-magnetism", title: "Electric fields, circuits, and magnetism basics" },
          { id: "acid-base", title: "Acids, bases, pH, and neutralization" },
        ],
      },
      {
        id: "social",
        name: "Social Studies",
        topics: [
          { id: "cold-war", title: "The Cold War: containment and proxy conflicts" },
          { id: "civil-rights", title: "U.S. civil rights movement" },
          { id: "vietnam", title: "Vietnam War and domestic protest" },
          { id: "decolonization", title: "Decolonization and new nations after WWII" },
        ],
      },
      {
        id: "cs",
        name: "Computer Science",
        topics: [
          { id: "oop", title: "Object-oriented design and classes" },
          { id: "recursion", title: "Recursion and divide-and-conquer" },
          { id: "git-collab", title: "Version control and collaborative coding" },
        ],
      },
    ],
  },
  {
    id: "12",
    label: "Grade 12",
    order: 12,
    subjects: [
      {
        id: "math",
        name: "Math",
        topics: [
          { id: "limits-intro", title: "Introduction to limits and continuity" },
          { id: "derivatives-app", title: "Derivatives: rates of change and optimization" },
          { id: "integrals-intro", title: "Antiderivatives and area under a curve" },
          { id: "series", title: "Sequences, series, and convergence intuition" },
        ],
      },
      {
        id: "ela",
        name: "English Language Arts",
        topics: [
          { id: "british-lit", title: "British literature: Romantic and Victorian eras" },
          { id: "literary-theory-lite", title: "Critical lenses: historical and reader-response" },
          { id: "postcolonial", title: "Postcolonial literature and identity" },
          { id: "senior-portfolio", title: "Reflective writing and senior portfolio pieces" },
        ],
      },
      {
        id: "science",
        name: "Science",
        topics: [
          { id: "organic-intro", title: "Organic chemistry: hydrocarbons and functional groups" },
          { id: "ecology-advanced", title: "Population ecology and carrying capacity" },
          { id: "quantum-intro", title: "Light, photons, and atomic spectra intro" },
          { id: "climate-policy", title: "Climate science and policy tradeoffs" },
        ],
      },
      {
        id: "social",
        name: "Social Studies",
        topics: [
          { id: "globalization", title: "Globalization: economics, culture, and policy" },
          { id: "gov-civics", title: "Comparative government and civic participation" },
          { id: "human-rights", title: "Human rights, international law, and NGOs" },
          { id: "economics-macro", title: "Macroeconomics: GDP, inflation, and fiscal policy" },
        ],
      },
      {
        id: "cs",
        name: "Computer Science",
        topics: [
          { id: "graphs-algos", title: "Graphs, shortest path, and traversal" },
          { id: "ml-supervised", title: "Machine learning: training data and classification" },
          { id: "systems", title: "Operating systems, memory, and concurrency basics" },
        ],
      },
    ],
  },
].sort((a, b) => a.order - b.order);

/** Build demo URL with topic and grade (both `grade` and `gradeLevel` for consumers). */
export function demoHrefForTopic(gradeLabel: string, topicTitle: string): string {
  const params = new URLSearchParams();
  params.set("topic", topicTitle);
  params.set("grade", gradeLabel);
  params.set("gradeLevel", gradeLabel);
  return `/learn/topic?${params.toString()}`;
}
