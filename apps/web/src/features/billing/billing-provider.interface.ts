/**
 * Billing provider abstraction - implement for Stripe, etc.
 */

export interface CreateCustomerParams {
  email: string;
  name?: string | null;
}

export interface CreateCheckoutSessionParams {
  userId: string;
  customerId?: string | null;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CreatePortalSessionParams {
  userId: string;
  customerId: string;
  returnUrl: string;
}

export interface CheckoutSessionResult {
  url: string;
  sessionId: string;
}

export interface SubscriptionStatusResult {
  status: "active" | "canceled" | "past_due" | "trialing" | "expired" | "inactive";
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
}

export interface WebhookEvent {
  type: string;
  id: string;
  data: Record<string, unknown>;
}

export interface BillingProvider {
  createCustomer(params: CreateCustomerParams): Promise<string>;

  createCheckoutSession(params: CreateCheckoutSessionParams): Promise<CheckoutSessionResult>;

  createPortalSession(params: CreatePortalSessionParams): Promise<string>;

  handleWebhook(payload: unknown, signature: string | null): Promise<WebhookEvent | null>;

  cancelSubscription(subscriptionId: string): Promise<void>;

  getSubscriptionStatus(subscriptionId: string): Promise<SubscriptionStatusResult | null>;

  retrieveCheckoutSession?(sessionId: string): Promise<CheckoutSessionDetails | null>;
}

export interface CheckoutSessionDetails {
  subscriptionId: string | null;
  customerId: string | null;
  userId: string | null;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
}
