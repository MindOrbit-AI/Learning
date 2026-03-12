/**
 * Algebra - Subject Graph
 */

import type { RelationshipType } from "@mindorbit/types";

export const algebraClusters = [
  {
    slug: "foundations",
    title: "Foundations",
    description: "Core algebraic concepts and operations",
    orderIndex: 0,
  },
  {
    slug: "equations",
    title: "Equations & Inequalities",
    description: "Solving linear and quadratic equations",
    orderIndex: 1,
  },
  {
    slug: "functions",
    title: "Functions",
    description: "Understanding functions and their graphs",
    orderIndex: 2,
  },
  {
    slug: "polynomials",
    title: "Polynomials",
    description: "Polynomial operations and factoring",
    orderIndex: 3,
  },
];

export const algebraNodes = [
  { slug: "variables", title: "Variables & Expressions", clusterSlug: "foundations", orderIndex: 0 },
  { slug: "order-of-operations", title: "Order of Operations", clusterSlug: "foundations", orderIndex: 1 },
  { slug: "properties", title: "Algebraic Properties", clusterSlug: "foundations", orderIndex: 2 },
  { slug: "linear-equations", title: "Linear Equations", clusterSlug: "equations", orderIndex: 0 },
  { slug: "inequalities", title: "Inequalities", clusterSlug: "equations", orderIndex: 1 },
  { slug: "quadratic-equations", title: "Quadratic Equations", clusterSlug: "equations", orderIndex: 2 },
  { slug: "function-basics", title: "Function Basics", clusterSlug: "functions", orderIndex: 0 },
  { slug: "linear-functions", title: "Linear Functions", clusterSlug: "functions", orderIndex: 1 },
  { slug: "exponential-functions", title: "Exponential Functions", clusterSlug: "functions", orderIndex: 2 },
  { slug: "polynomial-operations", title: "Polynomial Operations", clusterSlug: "polynomials", orderIndex: 0 },
  { slug: "factoring", title: "Factoring", clusterSlug: "polynomials", orderIndex: 1 },
];

export const algebraEdges: Array<{ source: string; target: string; type: RelationshipType }> = [
  { source: "variables", target: "order-of-operations", type: "prerequisite" },
  { source: "order-of-operations", target: "properties", type: "prerequisite" },
  { source: "properties", target: "linear-equations", type: "prerequisite" },
  { source: "linear-equations", target: "inequalities", type: "prerequisite" },
  { source: "linear-equations", target: "quadratic-equations", type: "prerequisite" },
  { source: "variables", target: "function-basics", type: "prerequisite" },
  { source: "function-basics", target: "linear-functions", type: "prerequisite" },
  { source: "linear-functions", target: "exponential-functions", type: "prerequisite" },
  { source: "properties", target: "polynomial-operations", type: "prerequisite" },
  { source: "polynomial-operations", target: "factoring", type: "prerequisite" },
  { source: "factoring", target: "quadratic-equations", type: "related" },
];
