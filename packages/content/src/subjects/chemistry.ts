/**
 * Chemistry - Subject Graph
 */

import type { RelationshipType } from "@mindorbit/types";

export const chemistryClusters = [
  {
    slug: "atomic-foundations",
    title: "Atomic Foundations",
    description: "Structure of matter at the atomic level",
    orderIndex: 0,
  },
  {
    slug: "reactions",
    title: "Reactions",
    description: "Chemical reactions and equations",
    orderIndex: 1,
  },
  {
    slug: "stoichiometry",
    title: "Stoichiometry",
    description: "Quantitative relationships in chemistry",
    orderIndex: 2,
  },
  {
    slug: "energy",
    title: "Energy",
    description: "Thermochemistry and energy in reactions",
    orderIndex: 3,
  },
];

export const chemistryNodes = [
  { slug: "atomic-structure", title: "Atomic Structure", clusterSlug: "atomic-foundations", orderIndex: 0 },
  { slug: "periodic-trends", title: "Periodic Trends", clusterSlug: "atomic-foundations", orderIndex: 1 },
  { slug: "chemical-bonding", title: "Chemical Bonding", clusterSlug: "atomic-foundations", orderIndex: 2 },
  { slug: "balancing-equations", title: "Balancing Equations", clusterSlug: "reactions", orderIndex: 0 },
  { slug: "reaction-types", title: "Reaction Types", clusterSlug: "reactions", orderIndex: 1 },
  { slug: "mole-concept", title: "Mole Concept", clusterSlug: "stoichiometry", orderIndex: 0 },
  { slug: "stoichiometry-calc", title: "Stoichiometry Calculations", clusterSlug: "stoichiometry", orderIndex: 1 },
  { slug: "limiting-reagents", title: "Limiting Reagents", clusterSlug: "stoichiometry", orderIndex: 2 },
  { slug: "thermochemistry", title: "Thermochemistry", clusterSlug: "energy", orderIndex: 0 },
  { slug: "enthalpy", title: "Enthalpy & Hess's Law", clusterSlug: "energy", orderIndex: 1 },
];

export const chemistryEdges: Array<{ source: string; target: string; type: RelationshipType }> = [
  { source: "atomic-structure", target: "periodic-trends", type: "prerequisite" },
  { source: "atomic-structure", target: "chemical-bonding", type: "prerequisite" },
  { source: "chemical-bonding", target: "balancing-equations", type: "prerequisite" },
  { source: "balancing-equations", target: "reaction-types", type: "prerequisite" },
  { source: "balancing-equations", target: "mole-concept", type: "prerequisite" },
  { source: "mole-concept", target: "stoichiometry-calc", type: "prerequisite" },
  { source: "stoichiometry-calc", target: "limiting-reagents", type: "prerequisite" },
  { source: "reaction-types", target: "thermochemistry", type: "prerequisite" },
  { source: "thermochemistry", target: "enthalpy", type: "prerequisite" },
];
