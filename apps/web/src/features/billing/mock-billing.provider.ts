/**
 * Mock billing provider for development - simulates checkout without real payment
 */

import type {
  BillingProvider,
  CreateCustomerParams,
  CreateCheckoutSessionParams,
  CreatePortalSessionParams,
  SubscriptionStatusResult,
  WebhookEvent,
} from "./billing-provider.interface";

const MOCK_CHECKOUT_PREFIX = "mock_checkout_";
const MOCK_CUSTOMER_PREFIX = "mock_cus_";
const MOCK_SUB_PREFIX = "mock_sub_";

export class MockBillingProvider implements BillingProvider {
  async createCustomer(params: CreateCustomerParams): Promise<string> {
    return `${MOCK_CUSTOMER_PREFIX}${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<{ url: string; sessionId: string }> {
    const sessionId = `${MOCK_CHECKOUT_PREFIX}${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const successUrl = new URL(params.successUrl);
    successUrl.searchParams.set("session_id", sessionId);
    successUrl.searchParams.set("mock", "1");
    return {
      url: successUrl.toString(),
      sessionId,
    };
  }

  async createPortalSession(params: CreatePortalSessionParams): Promise<string> {
    return `${params.returnUrl}?mock_portal=1`;
  }

  async handleWebhook(): Promise<WebhookEvent | null> {
    return null;
  }

  async cancelSubscription(): Promise<void> {
    return;
  }

  async getSubscriptionStatus(subscriptionId: string): Promise<SubscriptionStatusResult | null> {
    if (subscriptionId.startsWith(MOCK_SUB_PREFIX)) {
      return {
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false,
      };
    }
    return null;
  }
}

export function isMockCheckoutSession(sessionId: string): boolean {
  return sessionId.startsWith(MOCK_CHECKOUT_PREFIX);
}
