/**
 * Biology - Subject Graph
 */

import type { RelationshipType } from "@mindorbit/types";

export const biologyClusters = [
  {
    slug: "cell-biology",
    title: "Cell Biology",
    description: "Cell structure, function, and processes",
    orderIndex: 0,
  },
  {
    slug: "genetics",
    title: "Genetics",
    description: "Heredity, DNA, and genetic variation",
    orderIndex: 1,
  },
  {
    slug: "evolution",
    title: "Evolution & Ecology",
    description: "Natural selection and ecosystems",
    orderIndex: 2,
  },
  {
    slug: "human-biology",
    title: "Human Biology",
    description: "Body systems and physiology",
    orderIndex: 3,
  },
];

export const biologyNodes = [
  { slug: "cell-structure", title: "Cell Structure", clusterSlug: "cell-biology", orderIndex: 0 },
  { slug: "cell-division", title: "Cell Division", clusterSlug: "cell-biology", orderIndex: 1 },
  { slug: "cellular-respiration", title: "Cellular Respiration", clusterSlug: "cell-biology", orderIndex: 2 },
  { slug: "photosynthesis", title: "Photosynthesis", clusterSlug: "cell-biology", orderIndex: 3 },
  { slug: "dna-structure", title: "DNA Structure & Replication", clusterSlug: "genetics", orderIndex: 0 },
  { slug: "protein-synthesis", title: "Protein Synthesis", clusterSlug: "genetics", orderIndex: 1 },
  { slug: "genetics-inheritance", title: "Mendelian Genetics", clusterSlug: "genetics", orderIndex: 2 },
  { slug: "evolution-natural-selection", title: "Natural Selection", clusterSlug: "evolution", orderIndex: 0 },
  { slug: "ecology-ecosystems", title: "Ecosystems", clusterSlug: "evolution", orderIndex: 1 },
  { slug: "digestive-system", title: "Digestive System", clusterSlug: "human-biology", orderIndex: 0 },
  { slug: "circulatory-system", title: "Circulatory System", clusterSlug: "human-biology", orderIndex: 1 },
  { slug: "nervous-system", title: "Nervous System", clusterSlug: "human-biology", orderIndex: 2 },
];

export const biologyEdges: Array<{ source: string; target: string; type: RelationshipType }> = [
  { source: "cell-structure", target: "cell-division", type: "prerequisite" },
  { source: "cell-structure", target: "cellular-respiration", type: "prerequisite" },
  { source: "cell-structure", target: "photosynthesis", type: "prerequisite" },
  { source: "dna-structure", target: "protein-synthesis", type: "prerequisite" },
  { source: "protein-synthesis", target: "genetics-inheritance", type: "prerequisite" },
  { source: "genetics-inheritance", target: "evolution-natural-selection", type: "prerequisite" },
  { source: "evolution-natural-selection", target: "ecology-ecosystems", type: "prerequisite" },
  { source: "cellular-respiration", target: "circulatory-system", type: "related" },
  { source: "digestive-system", target: "circulatory-system", type: "related" },
  { source: "circulatory-system", target: "nervous-system", type: "related" },
];
