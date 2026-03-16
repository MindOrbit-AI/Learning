/**
 * Computer Science - Subject Graph
 */

import type { RelationshipType } from "@mindorbit/types";

export const computerScienceClusters = [
  {
    slug: "programming-basics",
    title: "Programming Basics",
    description: "Variables, control flow, and functions",
    orderIndex: 0,
  },
  {
    slug: "data-structures",
    title: "Data Structures",
    description: "Arrays, lists, and organizing data",
    orderIndex: 1,
  },
  {
    slug: "algorithms",
    title: "Algorithms",
    description: "Problem solving and efficiency",
    orderIndex: 2,
  },
  {
    slug: "systems",
    title: "Systems & Design",
    description: "Software design and development practices",
    orderIndex: 3,
  },
];

export const computerScienceNodes = [
  { slug: "variables-types", title: "Variables & Data Types", clusterSlug: "programming-basics", orderIndex: 0 },
  { slug: "control-flow", title: "Control Flow", clusterSlug: "programming-basics", orderIndex: 1 },
  { slug: "functions", title: "Functions & Procedures", clusterSlug: "programming-basics", orderIndex: 2 },
  { slug: "arrays", title: "Arrays", clusterSlug: "data-structures", orderIndex: 0 },
  { slug: "lists-linked", title: "Lists & Linked Structures", clusterSlug: "data-structures", orderIndex: 1 },
  { slug: "dictionaries", title: "Dictionaries & Hash Tables", clusterSlug: "data-structures", orderIndex: 2 },
  { slug: "search-algorithms", title: "Search Algorithms", clusterSlug: "algorithms", orderIndex: 0 },
  { slug: "sort-algorithms", title: "Sorting Algorithms", clusterSlug: "algorithms", orderIndex: 1 },
  { slug: "big-o", title: "Time & Space Complexity", clusterSlug: "algorithms", orderIndex: 2 },
  { slug: "design-patterns", title: "Design Patterns", clusterSlug: "systems", orderIndex: 0 },
  { slug: "testing-debugging", title: "Testing & Debugging", clusterSlug: "systems", orderIndex: 1 },
];

export const computerScienceEdges: Array<{ source: string; target: string; type: RelationshipType }> = [
  { source: "variables-types", target: "control-flow", type: "prerequisite" },
  { source: "control-flow", target: "functions", type: "prerequisite" },
  { source: "functions", target: "arrays", type: "prerequisite" },
  { source: "arrays", target: "lists-linked", type: "prerequisite" },
  { source: "arrays", target: "dictionaries", type: "prerequisite" },
  { source: "arrays", target: "search-algorithms", type: "prerequisite" },
  { source: "search-algorithms", target: "sort-algorithms", type: "prerequisite" },
  { source: "search-algorithms", target: "big-o", type: "prerequisite" },
  { source: "functions", target: "design-patterns", type: "prerequisite" },
  { source: "control-flow", target: "testing-debugging", type: "related" },
];
