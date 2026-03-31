import type { MissionType } from "@mindorbit/types";

const LABELS: Record<MissionType, string> = {
  discover: "Discover",
  repair: "Repair",
  simulation: "Simulation",
  challenge: "Challenge",
  review: "Review",
};

export function missionTypeLabel(missionType: string): string {
  return LABELS[missionType as MissionType] ?? missionType;
}
