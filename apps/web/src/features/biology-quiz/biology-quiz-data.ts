export type BiologyTopic = "cells" | "photosynthesis" | "classification";

export type DifficultyId = "easy" | "medium" | "hard";

export type QuizQuestion = {
  id: string;
  topic: BiologyTopic;
  prompt: string;
  choices: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
};

const TOPIC_EMOJI: Record<BiologyTopic, string> = {
  cells: "🦠",
  photosynthesis: "🌱",
  classification: "🧫",
};

export function topicEmoji(topic: BiologyTopic): string {
  return TOPIC_EMOJI[topic];
}

export const DIFFICULTY_META: Record<
  DifficultyId,
  { label: string; subtitle: string; ages: string }
> = {
  easy: {
    label: "Sprout",
    subtitle: "Foundations — great for first explorers",
    ages: "Ages ~10–11",
  },
  medium: {
    label: "Canopy",
    subtitle: "Connections — how ideas link together",
    ages: "Ages ~12–13",
  },
  hard: {
    label: "Forest",
    subtitle: "Challenge — patterns scientists use",
    ages: "Ages ~13–14",
  },
};

export const QUESTIONS: Record<DifficultyId, QuizQuestion[]> = {
  easy: [
    {
      id: "e-cell-1",
      topic: "cells",
      prompt: "Which part of the cell is often described as the “control center” that holds DNA?",
      choices: ["Cell membrane", "Nucleus", "Vacuole", "Cell wall"],
      correctIndex: 1,
    },
    {
      id: "e-photo-1",
      topic: "photosynthesis",
      prompt: "What do plants mainly take in from the air to help them build sugar during photosynthesis?",
      choices: ["Oxygen", "Nitrogen", "Carbon dioxide", "Helium"],
      correctIndex: 2,
    },
    {
      id: "e-class-1",
      topic: "classification",
      prompt: "Which group do frogs, snakes, and lizards belong to?",
      choices: ["Mammals", "Birds", "Reptiles", "Fish"],
      correctIndex: 2,
    },
    {
      id: "e-cell-2",
      topic: "cells",
      prompt: "Tiny structures inside cells that build proteins are called…",
      choices: ["Mitochondria", "Ribosomes", "Chloroplasts", "Lysosomes"],
      correctIndex: 1,
    },
    {
      id: "e-photo-2",
      topic: "photosynthesis",
      prompt: "Besides water and carbon dioxide, what else do plants usually need for photosynthesis?",
      choices: ["Moonlight", "Sunlight", "Darkness", "Salt only"],
      correctIndex: 1,
    },
    {
      id: "e-class-2",
      topic: "classification",
      prompt: "Animals with feathers, beaks, and eggs with hard shells are most often…",
      choices: ["Insects", "Amphibians", "Birds", "Crustaceans"],
      correctIndex: 2,
    },
    {
      id: "e-cell-3",
      topic: "cells",
      prompt: "Plant cells often have a rigid outer layer that animal cells usually lack. It is the…",
      choices: ["Nucleus", "Cell wall", "Cytoplasm", "Chromosome"],
      correctIndex: 1,
    },
    {
      id: "e-photo-3",
      topic: "photosynthesis",
      prompt: "The green pigment in leaves that captures light energy is called…",
      choices: ["Insulin", "Chlorophyll", "Keratin", "Melanin"],
      correctIndex: 1,
    },
  ],
  medium: [
    {
      id: "m-cell-1",
      topic: "cells",
      prompt: "Which organelle is best known as the “powerhouse” that releases usable energy for the cell?",
      choices: ["Golgi apparatus", "Mitochondrion", "Ribosome", "Nucleolus"],
      correctIndex: 1,
    },
    {
      id: "m-photo-1",
      topic: "photosynthesis",
      prompt: "Which gas do plants release into the air as a by-product of photosynthesis?",
      choices: ["Carbon dioxide", "Methane", "Oxygen", "Hydrogen sulfide"],
      correctIndex: 2,
    },
    {
      id: "m-class-1",
      topic: "classification",
      prompt: "A butterfly is an insect. Which trait best supports that classification?",
      choices: [
        "It has feathers and a beak",
        "It has six legs and three main body regions",
        "It nurses its young with milk",
        "It has scales and fins",
      ],
      correctIndex: 1,
    },
    {
      id: "m-cell-2",
      topic: "cells",
      prompt: "Chloroplasts are most closely associated with which process?",
      choices: ["Cellular respiration", "Photosynthesis", "Binary fission only", "Protein folding only"],
      correctIndex: 1,
    },
    {
      id: "m-photo-2",
      topic: "photosynthesis",
      prompt: "An organism that makes its own food from simple substances and energy is called…",
      choices: ["A parasite", "A decomposer", "An autotroph", "A scavenger"],
      correctIndex: 2,
    },
    {
      id: "m-class-2",
      topic: "classification",
      prompt: "Which level comes directly after “kingdom” in the usual classification ladder?",
      choices: ["Species", "Genus", "Phylum", "Order"],
      correctIndex: 2,
    },
    {
      id: "m-cell-3",
      topic: "cells",
      prompt: "Compared with prokaryotic cells, eukaryotic cells are most notable for…",
      choices: [
        "Always being smaller",
        "Lacking a membrane around DNA",
        "Having a nucleus and other membrane-bound organelles",
        "Never using oxygen",
      ],
      correctIndex: 2,
    },
    {
      id: "m-photo-3",
      topic: "photosynthesis",
      prompt: "Water absorbed by roots is important in photosynthesis mainly because it provides…",
      choices: ["Carbon atoms only", "Hydrogen (and oxygen) used to build sugars", "Nitrogen for DNA", "Iron for chlorophyll"],
      correctIndex: 1,
    },
  ],
  hard: [
    {
      id: "h-cell-1",
      topic: "cells",
      prompt: "In a plant cell, the large central vacuole primarily helps with…",
      choices: [
        "Digesting invading viruses only",
        "Storing water and maintaining turgor pressure",
        "Copying RNA into DNA",
        "Synthesizing chlorophyll from sunlight directly",
      ],
      correctIndex: 1,
    },
    {
      id: "h-photo-1",
      topic: "photosynthesis",
      prompt: "The light-dependent reactions of photosynthesis mainly occur in the…",
      choices: ["Mitochondrial matrix", "Stroma of the chloroplast", "Thylakoid membranes", "Nuclear envelope"],
      correctIndex: 2,
    },
    {
      id: "h-class-1",
      topic: "classification",
      prompt: "In binomial nomenclature, the second part of a scientific name (the specific epithet) refers to the…",
      choices: ["Kingdom", "Genus", "Species within the genus", "Family"],
      correctIndex: 2,
    },
    {
      id: "h-cell-2",
      topic: "cells",
      prompt: "Rough endoplasmic reticulum is “rough” because it is studded with…",
      choices: ["Lysosomes", "Peroxisomes", "Ribosomes", "Microtubules only"],
      correctIndex: 2,
    },
    {
      id: "h-photo-2",
      topic: "photosynthesis",
      prompt: "The Calvin cycle (light-independent reactions) is most directly associated with…",
      choices: [
        "Splitting water to release O₂",
        "Capturing photons in photosystem II only",
        "Fixing carbon dioxide into sugar in the stroma",
        "Producing ATP only in the thylakoid lumen",
      ],
      correctIndex: 2,
    },
    {
      id: "h-class-2",
      topic: "classification",
      prompt: "Which pair is ordered correctly from broader to more specific?",
      choices: [
        "Species → Genus → Family",
        "Order → Class → Phylum",
        "Phylum → Class → Order",
        "Genus → Kingdom → Phylum",
      ],
      correctIndex: 2,
    },
    {
      id: "h-cell-3",
      topic: "cells",
      prompt: "Which statement best contrasts plant and animal cells?",
      choices: [
        "Only animal cells have mitochondria",
        "Only plant cells typically have chloroplasts and a large central vacuole",
        "Only animal cells have a nucleus",
        "Only plant cells have ribosomes",
      ],
      correctIndex: 1,
    },
    {
      id: "h-photo-3",
      topic: "photosynthesis",
      prompt: "Chemosynthetic bacteria differ from plants because they…",
      choices: [
        "Never use carbon",
        "Obtain energy from inorganic chemicals instead of light",
        "Lack cell membranes",
        "Cannot make ATP",
      ],
      correctIndex: 1,
    },
  ],
};

export function getPlantStage(
  correctCount: number,
  totalQuestions: number,
): "🌱" | "🌿" | "🌳" {
  if (totalQuestions <= 0) return "🌱";
  const first = Math.max(1, Math.ceil(totalQuestions / 3));
  const second = Math.max(first + 1, Math.ceil((2 * totalQuestions) / 3));
  if (correctCount < first) return "🌱";
  if (correctCount < second) return "🌿";
  return "🌳";
}
