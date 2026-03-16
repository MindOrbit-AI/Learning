/**
 * Physics - Subject Graph
 */

import type { RelationshipType } from "@mindorbit/types";

export const physicsClusters = [
  {
    slug: "mechanics",
    title: "Mechanics",
    description: "Motion, forces, and energy",
    orderIndex: 0,
  },
  {
    slug: "waves-energy",
    title: "Waves & Energy",
    description: "Wave motion, sound, and light",
    orderIndex: 1,
  },
  {
    slug: "electricity",
    title: "Electricity & Magnetism",
    description: "Electric circuits and magnetic fields",
    orderIndex: 2,
  },
  {
    slug: "modern-physics",
    title: "Modern Physics",
    description: "Atomic structure and quantum concepts",
    orderIndex: 3,
  },
];

export const physicsNodes = [
  { slug: "kinematics", title: "Kinematics", clusterSlug: "mechanics", orderIndex: 0 },
  { slug: "forces-newton", title: "Forces & Newton's Laws", clusterSlug: "mechanics", orderIndex: 1 },
  { slug: "work-energy", title: "Work & Energy", clusterSlug: "mechanics", orderIndex: 2 },
  { slug: "momentum", title: "Momentum", clusterSlug: "mechanics", orderIndex: 3 },
  { slug: "wave-basics", title: "Wave Basics", clusterSlug: "waves-energy", orderIndex: 0 },
  { slug: "sound", title: "Sound", clusterSlug: "waves-energy", orderIndex: 1 },
  { slug: "light-optics", title: "Light & Optics", clusterSlug: "waves-energy", orderIndex: 2 },
  { slug: "electric-circuits", title: "Electric Circuits", clusterSlug: "electricity", orderIndex: 0 },
  { slug: "electromagnetism", title: "Electromagnetism", clusterSlug: "electricity", orderIndex: 1 },
  { slug: "atomic-physics", title: "Atomic Physics", clusterSlug: "modern-physics", orderIndex: 0 },
  { slug: "nuclear-physics", title: "Nuclear Physics", clusterSlug: "modern-physics", orderIndex: 1 },
];

export const physicsEdges: Array<{ source: string; target: string; type: RelationshipType }> = [
  { source: "kinematics", target: "forces-newton", type: "prerequisite" },
  { source: "forces-newton", target: "work-energy", type: "prerequisite" },
  { source: "work-energy", target: "momentum", type: "prerequisite" },
  { source: "wave-basics", target: "sound", type: "prerequisite" },
  { source: "wave-basics", target: "light-optics", type: "prerequisite" },
  { source: "electric-circuits", target: "electromagnetism", type: "prerequisite" },
  { source: "atomic-physics", target: "nuclear-physics", type: "prerequisite" },
];
