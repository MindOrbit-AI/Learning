/**
 * World History - Subject Graph
 */

import type { RelationshipType } from "@mindorbit/types";

export const worldHistoryClusters = [
  {
    slug: "ancient-world",
    title: "Ancient Civilizations",
    description: "Early states, empires, and cultural foundations",
    orderIndex: 0,
  },
  {
    slug: "classical-medieval",
    title: "Classical & Medieval Worlds",
    description: "Greece, Rome, and post-classical societies",
    orderIndex: 1,
  },
  {
    slug: "early-modern",
    title: "Early Modern",
    description: "Exploration, empires, and revolutions",
    orderIndex: 2,
  },
  {
    slug: "modern-global",
    title: "Modern Global History",
    description: "Industrialization, world wars, and the contemporary era",
    orderIndex: 3,
  },
];

export const worldHistoryNodes = [
  { slug: "early-river-valleys", title: "River Valley Civilizations", clusterSlug: "ancient-world", orderIndex: 0 },
  { slug: "persian-greek-roots", title: "Persia & Classical Greece", clusterSlug: "ancient-world", orderIndex: 1 },
  { slug: "roman-world", title: "Roman Republic & Empire", clusterSlug: "classical-medieval", orderIndex: 0 },
  { slug: "medieval-societies", title: "Medieval Europe & Beyond", clusterSlug: "classical-medieval", orderIndex: 1 },
  { slug: "islamic-world-trade", title: "Islamic World & Afro-Eurasian Trade", clusterSlug: "classical-medieval", orderIndex: 2 },
  { slug: "renaissance-reformation", title: "Renaissance & Reformation", clusterSlug: "early-modern", orderIndex: 0 },
  { slug: "exploration-empires", title: "Age of Exploration & Colonial Empires", clusterSlug: "early-modern", orderIndex: 1 },
  { slug: "enlightenment-revolutions", title: "Enlightenment & Atlantic Revolutions", clusterSlug: "early-modern", orderIndex: 2 },
  { slug: "industrial-imperialism", title: "Industrialization & Imperialism", clusterSlug: "modern-global", orderIndex: 0 },
  { slug: "world-wars", title: "World Wars & Interwar Period", clusterSlug: "modern-global", orderIndex: 1 },
  { slug: "cold-war-globalization", title: "Cold War & Contemporary Globalization", clusterSlug: "modern-global", orderIndex: 2 },
];

export const worldHistoryEdges: Array<{ source: string; target: string; type: RelationshipType }> = [
  { source: "early-river-valleys", target: "persian-greek-roots", type: "prerequisite" },
  { source: "persian-greek-roots", target: "roman-world", type: "prerequisite" },
  { source: "roman-world", target: "medieval-societies", type: "prerequisite" },
  { source: "medieval-societies", target: "islamic-world-trade", type: "related" },
  { source: "medieval-societies", target: "renaissance-reformation", type: "prerequisite" },
  { source: "renaissance-reformation", target: "exploration-empires", type: "prerequisite" },
  { source: "exploration-empires", target: "enlightenment-revolutions", type: "prerequisite" },
  { source: "enlightenment-revolutions", target: "industrial-imperialism", type: "prerequisite" },
  { source: "industrial-imperialism", target: "world-wars", type: "prerequisite" },
  { source: "world-wars", target: "cold-war-globalization", type: "prerequisite" },
  { source: "islamic-world-trade", target: "exploration-empires", type: "related" },
];
