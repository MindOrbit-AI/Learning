/**
 * SAT Math - Subject Graph
 */

import type { RelationshipType } from "@mindorbit/types";

export const satMathClusters = [
  {
    slug: "algebra-core",
    title: "Algebra Core",
    description: "Essential algebra for the SAT",
    orderIndex: 0,
  },
  {
    slug: "problem-solving",
    title: "Problem Solving",
    description: "Word problems and data interpretation",
    orderIndex: 1,
  },
  {
    slug: "advanced-math",
    title: "Advanced Math",
    description: "Quadratic, exponential, and polynomial functions",
    orderIndex: 2,
  },
  {
    slug: "geometry",
    title: "Geometry & Trig",
    description: "Area, volume, angles, and basic trig",
    orderIndex: 3,
  },
];

export const satMathNodes = [
  { slug: "linear-equations-sat", title: "Linear Equations", clusterSlug: "algebra-core", orderIndex: 0 },
  { slug: "systems-of-equations", title: "Systems of Equations", clusterSlug: "algebra-core", orderIndex: 1 },
  { slug: "linear-inequalities-sat", title: "Linear Inequalities", clusterSlug: "algebra-core", orderIndex: 2 },
  { slug: "rates-ratios", title: "Rates & Ratios", clusterSlug: "problem-solving", orderIndex: 0 },
  { slug: "percentages", title: "Percentages", clusterSlug: "problem-solving", orderIndex: 1 },
  { slug: "data-interpretation", title: "Data Interpretation", clusterSlug: "problem-solving", orderIndex: 2 },
  { slug: "quadratic-functions-sat", title: "Quadratic Functions", clusterSlug: "advanced-math", orderIndex: 0 },
  { slug: "exponential-growth", title: "Exponential Growth", clusterSlug: "advanced-math", orderIndex: 1 },
  { slug: "polynomials-sat", title: "Polynomials", clusterSlug: "advanced-math", orderIndex: 2 },
  { slug: "area-volume", title: "Area & Volume", clusterSlug: "geometry", orderIndex: 0 },
  { slug: "angles-triangles", title: "Angles & Triangles", clusterSlug: "geometry", orderIndex: 1 },
  { slug: "basic-trig", title: "Basic Trigonometry", clusterSlug: "geometry", orderIndex: 2 },
];

export const satMathEdges: Array<{ source: string; target: string; type: RelationshipType }> = [
  { source: "linear-equations-sat", target: "systems-of-equations", type: "prerequisite" },
  { source: "linear-equations-sat", target: "linear-inequalities-sat", type: "prerequisite" },
  { source: "rates-ratios", target: "percentages", type: "prerequisite" },
  { source: "percentages", target: "data-interpretation", type: "related" },
  { source: "linear-equations-sat", target: "quadratic-functions-sat", type: "prerequisite" },
  { source: "quadratic-functions-sat", target: "exponential-growth", type: "related" },
  { source: "quadratic-functions-sat", target: "polynomials-sat", type: "prerequisite" },
  { source: "area-volume", target: "angles-triangles", type: "related" },
  { source: "angles-triangles", target: "basic-trig", type: "prerequisite" },
];
