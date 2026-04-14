/** Shared copy for pricing surfaces (in-app + marketing). */

export const FREE_FEATURES = [
  "3 diagnostics per month",
  "Limited missions (10/month)",
  "Limited mastery map",
  "2 clusters per subject",
  "Up to 3 subjects",
];

export const PRO_FEATURES = [
  "Unlimited diagnostics",
  "Full mastery map",
  "Unlimited missions",
  "All clusters per subject",
  "Advanced insights",
  "Unlimited subject creation",
];

export const PRICING_COMPARISON_ROWS: {
  feature: string;
  free: string;
  pro: string;
}[] = [
  { feature: "Diagnostics", free: "3/month", pro: "Unlimited" },
  { feature: "Missions", free: "10/month", pro: "Unlimited" },
  { feature: "Clusters per subject", free: "2", pro: "All" },
  { feature: "Mastery map", free: "Limited", pro: "Full" },
  { feature: "Subject creation", free: "3 total", pro: "Unlimited" },
  { feature: "Advanced insights", free: "—", pro: "✓" },
];
