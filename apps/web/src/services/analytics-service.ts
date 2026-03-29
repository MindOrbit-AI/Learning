/**
 * Analytics Service - Track events in UserEvent table
 */

import { prisma } from "@mindorbit/db";

export const EVENT_TYPES = {
  diagnostic_started: "diagnostic_started",
  diagnostic_completed: "diagnostic_completed",
  mission_started: "mission_started",
  mission_completed: "mission_completed",
  resource_uploaded: "resource_uploaded",
  node_mastered: "node_mastered",
  review_completed: "review_completed",
  pricing_viewed: "pricing_viewed",
  upgrade_clicked: "upgrade_clicked",
  checkout_started: "checkout_started",
  checkout_completed: "checkout_completed",
  subscription_activated: "subscription_activated",
  subscription_canceled: "subscription_canceled",
  feature_limit_hit: "feature_limit_hit",
  paywall_viewed: "paywall_viewed",
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

export class AnalyticsService {
  static async track(
    userId: string,
    eventType: EventType,
    payload?: Record<string, unknown>
  ): Promise<void> {
    await prisma.userEvent.create({
      data: {
        userId,
        eventType,
        payload: payload ? JSON.stringify(payload) : null,
      },
    });
  }
}
