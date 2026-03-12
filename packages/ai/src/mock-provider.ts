/**
 * Mock AI Provider - Deterministic fallback for MVP
 * Replace with OpenAI/Anthropic provider later
 */

import type { AIProvider, MissionContent } from "./interfaces";
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
};
