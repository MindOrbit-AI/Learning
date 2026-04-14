/**
 * Geometry - Subject Graph
 */

import type { RelationshipType } from "@mindorbit/types";

export const geometryClusters = [
  {
    slug: "foundations",
    title: "Foundations",
    description: "Points, lines, angles, and parallel relationships",
    orderIndex: 0,
  },
  {
    slug: "triangles",
    title: "Triangles & Polygons",
    description: "Congruence, similarity, and polygon properties",
    orderIndex: 1,
  },
  {
    slug: "circles-measurement",
    title: "Circles & Measurement",
    description: "Circles, area, surface area, and volume",
    orderIndex: 2,
  },
  {
    slug: "coordinate",
    title: "Coordinate Geometry",
    description: "The coordinate plane, distance, slope, and basic proofs",
    orderIndex: 3,
  },
];

export const geometryNodes = [
  { slug: "points-lines-rays", title: "Points, Lines, and Rays", clusterSlug: "foundations", orderIndex: 0 },
  { slug: "angles-and-pairs", title: "Angles & Angle Pairs", clusterSlug: "foundations", orderIndex: 1 },
  { slug: "parallel-perpendicular", title: "Parallel & Perpendicular Lines", clusterSlug: "foundations", orderIndex: 2 },
  { slug: "triangle-basics", title: "Triangle Basics & Classification", clusterSlug: "triangles", orderIndex: 0 },
  { slug: "triangle-congruence", title: "Triangle Congruence", clusterSlug: "triangles", orderIndex: 1 },
  { slug: "triangle-similarity", title: "Similarity & Proportions", clusterSlug: "triangles", orderIndex: 2 },
  { slug: "right-triangles-trig", title: "Right Triangles & Pythagorean Theorem", clusterSlug: "triangles", orderIndex: 3 },
  { slug: "circle-angles-arcs", title: "Circles: Angles & Arcs", clusterSlug: "circles-measurement", orderIndex: 0 },
  { slug: "area-and-volume", title: "Area, Perimeter, Surface Area, Volume", clusterSlug: "circles-measurement", orderIndex: 1 },
  { slug: "coordinate-plane", title: "The Coordinate Plane", clusterSlug: "coordinate", orderIndex: 0 },
  { slug: "distance-midpoint-slope", title: "Distance, Midpoint, & Slope", clusterSlug: "coordinate", orderIndex: 1 },
];

export const geometryEdges: Array<{ source: string; target: string; type: RelationshipType }> = [
  { source: "points-lines-rays", target: "angles-and-pairs", type: "prerequisite" },
  { source: "angles-and-pairs", target: "parallel-perpendicular", type: "prerequisite" },
  { source: "parallel-perpendicular", target: "triangle-basics", type: "prerequisite" },
  { source: "triangle-basics", target: "triangle-congruence", type: "prerequisite" },
  { source: "triangle-congruence", target: "triangle-similarity", type: "prerequisite" },
  { source: "triangle-similarity", target: "right-triangles-trig", type: "prerequisite" },
  { source: "angles-and-pairs", target: "circle-angles-arcs", type: "related" },
  { source: "triangle-similarity", target: "circle-angles-arcs", type: "related" },
  { source: "circle-angles-arcs", target: "area-and-volume", type: "prerequisite" },
  { source: "parallel-perpendicular", target: "coordinate-plane", type: "related" },
  { source: "coordinate-plane", target: "distance-midpoint-slope", type: "prerequisite" },
  { source: "right-triangles-trig", target: "distance-midpoint-slope", type: "related" },
];
