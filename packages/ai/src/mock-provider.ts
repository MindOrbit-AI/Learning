/**
 * Mock AI Provider - Deterministic fallback for MVP
 * Replace with OpenAI/Anthropic provider later
 */

import type {
  AIProvider,
  MissionContent,
  MissionSceneContent,
  ExtractedConcept,
  ContentDiagnosticQuestion,
  ContentSummaryJson,
  GeneratedSubjectStructure,
} from "./interfaces";
import type { QuestionType } from "@mindorbit/types";

const REFLECTION_PROMPTS: Record<string, string> = {
  default: "What was the key insight you gained from this concept? How might you apply it?",
  stoichiometry: "Explain in your own words: why does the mole ratio matter when converting between substances?",
  "mole-concept": "Describe a real-world scenario where understanding moles would be useful.",
  "quadratic-equations": "When would you choose factoring vs the quadratic formula? Explain your reasoning.",
  "chemical-bonding": "How does electronegativity difference determine bond type?",
};

const MISSION_TEMPLATES: Record<string, Partial<MissionContent>> = {
  "mole-concept": {
    title: "Master the Mole Concept",
    explanation:
      "The mole is a fundamental unit in chemistry representing 6.022 × 10²³ particles. One mole of any substance has the same number of particles as one mole of any other substance. This allows us to convert between mass, particles, and volume.",
    example:
      "How many moles are in 36g of water (H₂O)? Molar mass = 18 g/mol. Moles = mass/molar mass = 36/18 = 2 moles.",
    reflectionPrompt: REFLECTION_PROMPTS["mole-concept"],
    variationPrompt: "What if you had 54g of water? How many water molecules would that be?",
    estimatedMinutes: 15,
  },
  stoichiometry: {
    title: "Stoichiometry Calculations",
    explanation:
      "Stoichiometry uses balanced chemical equations to calculate quantities of reactants and products. The coefficients give you mole ratios for conversions.",
    example:
      "2H₂ + O₂ → 2H₂O. If you have 4 moles of H₂, you need 2 moles of O₂ to react completely, producing 4 moles of H₂O.",
    reflectionPrompt: REFLECTION_PROMPTS.stoichiometry,
    variationPrompt: "If you start with 10g of H₂, how many grams of H₂O can you produce?",
    estimatedMinutes: 20,
  },
  "limiting-reagents": {
    title: "Limiting Reagents",
    explanation:
      "The limiting reagent is the reactant that gets used up first and limits the amount of product. To find it, calculate how much product each reactant could produce—the one that produces less is limiting.",
    example:
      "A + 2B → C. With 3 mol A and 4 mol B: A could make 3 mol C, B could make 2 mol C. B is limiting; max product = 2 mol C.",
    reflectionPrompt: "Why is it important to identify the limiting reagent in industrial chemistry?",
    variationPrompt: "What would happen to the excess reactant?",
    estimatedMinutes: 18,
  },
  "atomic-structure": {
    title: "Atomic Structure",
    explanation:
      "Atoms consist of protons (positive), neutrons (neutral), and electrons (negative). The atomic number = number of protons. Mass number = protons + neutrons. Isotopes have same atomic number but different mass numbers.",
    example:
      "Carbon-12 has 6 protons, 6 neutrons. Carbon-14 has 6 protons, 8 neutrons. Both are carbon because they have 6 protons.",
    reflectionPrompt: "How do isotopes affect chemical behavior?",
    variationPrompt: "What determines an atom's identity—protons or neutrons?",
    estimatedMinutes: 12,
  },
  default: {
    title: "Concept Mastery",
    explanation: "This concept builds on foundational knowledge. Work through the examples and practice to solidify your understanding.",
    example: "Work through the provided examples step by step.",
    reflectionPrompt: REFLECTION_PROMPTS.default,
    variationPrompt: "Try a variation of the example with different numbers.",
    estimatedMinutes: 15,
  },
};

function getMissionTemplate(nodeSlug: string): Partial<MissionContent> {
  return MISSION_TEMPLATES[nodeSlug] ?? MISSION_TEMPLATES.default;
}

function generatePracticeQuestions(
  nodeSlug: string,
  nodeTitle: string,
  count: number
): MissionContent["practiceQuestions"] {
  const baseQuestions: Record<string, MissionContent["practiceQuestions"]> = {
    "mole-concept": [
      {
        prompt: "How many moles are in 90g of water (H₂O, molar mass 18 g/mol)?",
        type: "multiple_choice",
        options: ["3 moles", "5 moles", "6 moles", "90 moles"],
        correctAnswer: "5 moles",
        explanation: "90g ÷ 18 g/mol = 5 moles",
        orderIndex: 0,
      },
      {
        prompt: "One mole of oxygen gas (O₂) contains approximately how many molecules?",
        type: "multiple_choice",
        options: ["6.022 × 10²³", "3.011 × 10²³", "12.044 × 10²³", "1"],
        correctAnswer: "6.022 × 10²³",
        explanation: "Avogadro's number: 1 mole = 6.022 × 10²³ particles",
        orderIndex: 1,
      },
      {
        prompt: "The mole is a counting unit like a dozen.",
        type: "true_false",
        options: null,
        correctAnswer: "true",
        explanation: "Yes—a dozen = 12, a mole ≈ 6.022 × 10²³",
        orderIndex: 2,
      },
    ],
    stoichiometry: [
      {
        prompt: "In 2H₂ + O₂ → 2H₂O, how many moles of O₂ are needed to react with 6 moles of H₂?",
        type: "multiple_choice",
        options: ["2 moles", "3 moles", "6 moles", "12 moles"],
        correctAnswer: "3 moles",
        explanation: "Ratio is 2:1, so 6 mol H₂ requires 3 mol O₂",
        orderIndex: 0,
      },
      {
        prompt: "If 4 moles of H₂ produce 4 moles of H₂O, the mole ratio of H₂ to H₂O is 1:1.",
        type: "true_false",
        options: null,
        correctAnswer: "true",
        explanation: "2H₂ → 2H₂O, so 1:1 for H₂ to H₂O",
        orderIndex: 1,
      },
    ],
    "limiting-reagents": [
      {
        prompt: "If reactant A can produce 5 mol product and reactant B can produce 3 mol product, which is limiting?",
        type: "multiple_choice",
        options: ["A", "B", "Neither", "Both"],
        correctAnswer: "B",
        explanation: "B produces less product, so it limits the reaction",
        orderIndex: 0,
      },
    ],
  };

  const questions = baseQuestions[nodeSlug] ?? [
    {
      prompt: `Which best describes ${nodeTitle}?`,
      type: "multiple_choice" as QuestionType,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: "Option A",
      explanation: "This is the correct understanding of the concept.",
      orderIndex: 0,
    },
  ];

  return questions.slice(0, count);
}

export const mockAIProvider: AIProvider = {
  async summarizeNodeConcept(nodeTitle: string, nodeDescription: string): Promise<string> {
    return `**${nodeTitle}**: ${nodeDescription.slice(0, 150)}...`;
  },

  async generateMissionContent(params: {
    nodeId: string;
    nodeSlug: string;
    nodeTitle: string;
  }): Promise<MissionContent> {
    const template = getMissionTemplate(params.nodeSlug);
    const questions = generatePracticeQuestions(params.nodeSlug, params.nodeTitle, 3);

    return {
      title: template.title ?? `Master ${params.nodeTitle}`,
      explanation: template.explanation ?? `Learn the core concepts of ${params.nodeTitle}.`,
      example: template.example ?? "Work through the examples in your materials.",
      reflectionPrompt: template.reflectionPrompt ?? REFLECTION_PROMPTS.default,
      variationPrompt: template.variationPrompt ?? "Try a variation of the main example.",
      estimatedMinutes: template.estimatedMinutes ?? 15,
      practiceQuestions: questions,
    };
  },

  async generateSceneMissionContent(params: {
    nodeSlug: string;
    nodeTitle: string;
  }): Promise<MissionSceneContent> {
    const slug = params.nodeSlug;
    const title = params.nodeTitle;

    const sceneTemplates: Record<string, MissionSceneContent["scenes"]> = {
      "mole-concept": [
        {
          sceneType: "observe",
          title: "The mole as a counting unit",
          prompt: "Observe: the mole is like a dozen, but for atoms.",
          contentJson: { visual: "🧪", description: "1 mole = 6.022 × 10²³ particles" },
          orderIndex: 0,
        },
        {
          sceneType: "micro_quiz",
          title: "How many moles?",
          prompt: "How many moles are in 90g of water (H₂O, 18 g/mol)?",
          contentJson: {
            options: [
              { id: "a", label: "3 moles" },
              { id: "b", label: "5 moles" },
              { id: "c", label: "6 moles" },
              { id: "d", label: "90 moles" },
            ],
          },
          correctAnswerJson: '"b"',
          explanation: "90 ÷ 18 = 5 moles",
          hintLevel1: "Divide mass by molar mass",
          orderIndex: 1,
        },
        {
          sceneType: "reflect",
          title: "Reflect",
          prompt: "When would you use the mole in real life?",
          contentJson: {},
          orderIndex: 2,
        },
      ],
      "linear-equations": [
        {
          sceneType: "observe",
          title: "Solving linear equations",
          prompt: "Isolate the variable step by step.",
          contentJson: { description: "For 2x + 3 = 11, we subtract first, then divide." },
          orderIndex: 0,
        },
        {
          sceneType: "sort_sequence",
          title: "Steps to solve",
          prompt: "Sort the steps to solve 2x + 3 = 11",
          contentJson: {
            items: [
              { id: "1", label: "Subtract 3 from both sides", correctOrder: 0 },
              { id: "2", label: "Divide both sides by 2", correctOrder: 1 },
              { id: "3", label: "Simplify to find x = 4", correctOrder: 2 },
            ],
          },
          correctAnswerJson: '["1","2","3"]',
          explanation: "First subtract 3 to get 2x = 8, then divide by 2 to get x = 4.",
          orderIndex: 1,
        },
      ],
      "function-basics": [
        {
          sceneType: "observe",
          title: "Introduction to Functions",
          prompt: "Look at the definition and visual representation of a function.",
          contentJson: {
            visual: "📐",
            description: "A function maps each input to exactly one output. The domain is the set of inputs; the range is the set of outputs.",
          },
          orderIndex: 0,
        },
        {
          sceneType: "micro_quiz",
          title: "Properties of Functions",
          prompt: "Which of the following is a property of functions?",
          contentJson: {
            options: [
              { id: "a", label: "A function must have exactly one output for each input" },
              { id: "b", label: "A function can have multiple outputs for one input" },
              { id: "c", label: "A function must have the same number of inputs and outputs" },
              { id: "d", label: "A function can have no outputs" },
            ],
          },
          correctAnswerJson: '"a"',
          explanation: "A function must have exactly one output for each input, which defines its basic property.",
          orderIndex: 1,
        },
      ],
      inequalities: [
        {
          sceneType: "observe",
          title: "Understanding Inequalities",
          prompt: "Look at the graphed inequalities on the number line. What do you notice about the solutions to these inequalities?",
          contentJson: {
            description: "The shaded regions show where x satisfies the inequality. Open circles mean the endpoint is not included; closed circles mean it is.",
            numberLine: {
              min: 0,
              max: 8,
              segments: [
                { start: 0, end: 3, startFilled: false, endFilled: false },
                { start: 5, end: 8, startFilled: false, endFilled: false },
              ],
            },
          },
          orderIndex: 0,
        },
        {
          sceneType: "micro_quiz",
          title: "Choose the Correct Inequality",
          prompt: "Which inequality describes the graph you just observed?",
          contentJson: {
            options: [
              { id: "a", label: "x < 3 or x > 5" },
              { id: "b", label: "x ≤ 3 and x ≥ 5" },
              { id: "c", label: "x < 3 and x ≥ 5" },
            ],
          },
          correctAnswerJson: '"a"',
          explanation: "The graph shows two rays: values less than 3 (open circle) and values greater than 5 (open circle).",
          orderIndex: 1,
        },
      ],
      stoichiometry: [
        {
          sceneType: "observe",
          title: "Balanced equations",
          prompt: "Coefficients give mole ratios.",
          contentJson: { visual: "⚖️", description: "2H₂ + O₂ → 2H₂O means 2:1:2 ratio" },
          orderIndex: 0,
        },
        {
          sceneType: "sort_sequence",
          title: "Order the steps",
          prompt: "Arrange the stoichiometry steps in order",
          contentJson: {
            items: [
              { id: "1", label: "Balance the equation", correctOrder: 0 },
              { id: "2", label: "Identify the given and unknown", correctOrder: 1 },
              { id: "3", label: "Convert using mole ratio", correctOrder: 2 },
              { id: "4", label: "Convert to desired unit", correctOrder: 3 },
            ],
          },
          correctAnswerJson: '["1","2","3","4"]',
          explanation: "Balance first, then use ratios to convert.",
          orderIndex: 1,
        },
      ],
      default: [
        {
          sceneType: "observe",
          title: "Introduction",
          prompt: "Explore this concept step by step.",
          contentJson: { description: `Learn about ${title}` },
          orderIndex: 0,
        },
        {
          sceneType: "micro_quiz",
          title: "Check your understanding",
          prompt: `Which best describes ${title}?`,
          contentJson: {
            options: [
              { id: "a", label: "Option A" },
              { id: "b", label: "Option B" },
              { id: "c", label: "Option C" },
            ],
          },
          correctAnswerJson: '"a"',
          orderIndex: 1,
        },
      ],
    };

    const scenes = sceneTemplates[slug] ?? sceneTemplates.default;
    const missionTitle = MISSION_TEMPLATES[slug]?.title ?? `Master ${title}`;

    return {
      title: missionTitle,
      missionType: "discover",
      estimatedMinutes: 15,
      scenes,
    };
  },

  async generatePracticeQuestions(nodeSlug: string, count: number) {
    return generatePracticeQuestions(nodeSlug, "concept", count);
  },

  async generateReflectionPrompt(nodeTitle: string): Promise<string> {
    const slug = nodeTitle.toLowerCase().replace(/\s+/g, "-");
    return REFLECTION_PROMPTS[slug] ?? REFLECTION_PROMPTS.default;
  },

  async generateDiagnosticExplanation(questionPrompt: string, correctAnswer: string): Promise<string> {
    return `The correct answer is ${correctAnswer}. Review the concept to deepen your understanding.`;
  },

  async recommendResources(nodeId: string, _userId: string): Promise<string[]> {
    return [];
  },

  async extractConceptsFromContent(text: string): Promise<ExtractedConcept[]> {
    // Heuristic: split by headers/sections, extract key phrases as concept titles
    const sections = text
      .split(/\n#{1,4}\s+|\n\n(?=[A-Z][a-z]+:)|(?:\*\*[^*]+\*\*)/)
      .map((s) => s.trim())
      .filter((s) => s.length > 50);
    const concepts: ExtractedConcept[] = [];
    const seen = new Set<string>();

    for (const section of sections.slice(0, 15)) {
      const firstLine = section.split("\n")[0] ?? section;
      const title = firstLine.slice(0, 60).replace(/[:#*]/g, "").trim();
      if (!title || title.length < 3) continue;
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      if (seen.has(slug)) continue;
      seen.add(slug);
      concepts.push({
        title,
        description: section.slice(0, 300),
        slug,
        confidence: 0.7 + Math.random() * 0.25,
      });
    }

    if (concepts.length === 0 && text.length > 100) {
      const fallback = text.slice(0, 100).replace(/\n/g, " ");
      concepts.push({
        title: fallback + (fallback.length >= 100 ? "..." : ""),
        description: text.slice(0, 400),
        slug: "main-concept",
        confidence: 0.6,
      });
    }
    return concepts;
  },

  async generateDiagnosticQuestionsFromContent(
    conceptText: string,
    conceptTitle: string,
    count = 3
  ): Promise<ContentDiagnosticQuestion[]> {
    const excerpt = conceptText.slice(0, 500);
    const questions: ContentDiagnosticQuestion[] = [
      {
        prompt: `According to the material, which best describes ${conceptTitle}?`,
        type: "multiple_choice",
        options: [
          excerpt.slice(0, 80) + "...",
          "An alternative interpretation",
          "A related but distinct concept",
          "None of the above",
        ],
        correctAnswer: excerpt.slice(0, 80) + "...",
        explanation: `This aligns with the key points about ${conceptTitle} in the source material.`,
      },
      {
        prompt: `The concept of ${conceptTitle} is fundamental to understanding this material.`,
        type: "true_false",
        options: null,
        correctAnswer: "true",
        explanation: `${conceptTitle} is a core concept covered in the content.`,
      },
      {
        prompt: `In your own words, summarize the main idea about ${conceptTitle} from the material.`,
        type: "short_answer",
        options: null,
        correctAnswer: excerpt.slice(0, 100),
        explanation: `Review the section on ${conceptTitle} to verify your understanding.`,
      },
    ];
    return questions.slice(0, count);
  },

  async extractTextFromImage(_buffer: Buffer, _mimeType: string): Promise<string> {
    return "Image uploaded. Set OPENAI_API_KEY to extract text and concepts from images (e.g., diagrams, handwritten notes, textbook screenshots).";
  },

  async generateSubjectStructure(
    title: string,
    description: string
  ): Promise<GeneratedSubjectStructure> {
    const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const clusters = [
      { slug: `${base}-foundations`, title: "Foundations", description: "Core concepts", orderIndex: 0 },
      { slug: `${base}-core`, title: "Core Concepts", description: "Main learning area", orderIndex: 1 },
      { slug: `${base}-advanced`, title: "Advanced", description: "Extended topics", orderIndex: 2 },
    ];
    const concepts = [
      { slug: `${base}-intro`, title: "Introduction", description, clusterSlug: clusters[0].slug, orderIndex: 0, difficulty: "easy" },
      { slug: `${base}-basics`, title: "Basics", description: "Essential building blocks", clusterSlug: clusters[0].slug, orderIndex: 1, difficulty: "easy" },
      { slug: `${base}-key-concept-1`, title: "Key Concept 1", description: "First main concept", clusterSlug: clusters[1].slug, orderIndex: 0, difficulty: "medium" },
      { slug: `${base}-key-concept-2`, title: "Key Concept 2", description: "Second main concept", clusterSlug: clusters[1].slug, orderIndex: 1, difficulty: "medium" },
      { slug: `${base}-advanced-1`, title: "Advanced Topic", description: "Advanced material", clusterSlug: clusters[2].slug, orderIndex: 0, difficulty: "hard" },
    ];
    const edges = [
      { sourceSlug: concepts[0].slug, targetSlug: concepts[1].slug, relationshipType: "prerequisite" as const },
      { sourceSlug: concepts[1].slug, targetSlug: concepts[2].slug, relationshipType: "prerequisite" as const },
      { sourceSlug: concepts[2].slug, targetSlug: concepts[3].slug, relationshipType: "prerequisite" as const },
      { sourceSlug: concepts[3].slug, targetSlug: concepts[4].slug, relationshipType: "prerequisite" as const },
    ];
    return { clusters, concepts, edges };
  },

  async summarizeContentToJson(content: string): Promise<ContentSummaryJson> {
    const excerpt = content.slice(0, 300).replace(/\n/g, " ");
    const title = excerpt.slice(0, 50).trim() + (excerpt.length > 50 ? "…" : "");
    const flashcards = [
      { front: "Key concept from content", back: excerpt.slice(0, 100) + "..." },
      { front: "Main idea", back: excerpt.slice(50, 150) + "..." },
    ];
    return {
      title,
      flashcards,
      shortSummary: excerpt + "...",
      deepSummary: content.slice(0, 800).replace(/\n{3,}/g, "\n\n") + (content.length > 800 ? "\n\n..." : ""),
      quizzes: [
        {
          prompt: "Which best summarizes the main idea of this content?",
          type: "multiple_choice" as const,
          options: [excerpt.slice(0, 80) + "...", "Alternative A", "Alternative B", "Alternative C"],
          correctAnswer: excerpt.slice(0, 80) + "...",
          explanation: "This aligns with the key points in the source material.",
        },
      ],
    };
  },
};
