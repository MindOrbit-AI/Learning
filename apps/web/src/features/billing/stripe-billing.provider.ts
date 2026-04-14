/**
 * Stripe billing provider - full integration
 */

import Stripe from "stripe";
import type {
  BillingProvider,
  CreateCustomerParams,
  CreateCheckoutSessionParams,
  CreatePortalSessionParams,
  CheckoutSessionResult,
  SubscriptionStatusResult,
  WebhookEvent,
  CheckoutSessionDetails,
} from "./billing-provider.interface";

const STATUS_MAP: Record<string, SubscriptionStatusResult["status"]> = {
  active: "active",
  canceled: "canceled",
  past_due: "past_due",
  trialing: "trialing",
  unpaid: "expired",
  incomplete: "inactive",
  incomplete_expired: "expired",
  paused: "inactive",
};

export class StripeBillingProvider implements BillingProvider {
  private stripe: Stripe;
  private webhookSecret: string;
  private priceId: string;

  constructor(secretKey: string, webhookSecret: string, priceId: string) {
    this.stripe = new Stripe(secretKey);
    this.webhookSecret = webhookSecret;
    this.priceId = priceId;
  }

  async createCustomer(params: CreateCustomerParams): Promise<string> {
    const customer = await this.stripe.customers.create({
      email: params.email,
      name: params.name ?? undefined,
    });
    return customer.id;
  }

  async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<CheckoutSessionResult> {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      customer: params.customerId ?? undefined,
      client_reference_id: params.userId,
      line_items: [
        {
          price: this.priceId,
          quantity: 1,
        },
      ],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: {
        userId: params.userId,
        ...params.metadata,
      },
      subscription_data: {
        metadata: {
          userId: params.userId,
        },
      },
    };

    const session = await this.stripe.checkout.sessions.create(sessionParams);

    if (!session.url) {
      throw new Error("Failed to create checkout session URL");
    }

    return {
      url: session.url,
      sessionId: session.id,
    };
  }

  async createPortalSession(params: CreatePortalSessionParams): Promise<string> {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: params.customerId,
      return_url: params.returnUrl,
    });
    if (!session.url) {
      throw new Error("Failed to create portal session URL");
    }
    return session.url;
  }

  async handleWebhook(payload: string | Buffer, signature: string | null): Promise<WebhookEvent | null> {
    if (!signature || !this.webhookSecret) {
      return null;
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret
      );
    } catch {
      return null;
    }

    return {
      type: event.type,
      id: event.id,
      data: event.data as unknown as Record<string, unknown>,
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await this.stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  }

  async getSubscriptionStatus(subscriptionId: string): Promise<SubscriptionStatusResult | null> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      const status = STATUS_MAP[subscription.status] ?? "inactive";
      return {
        status,
        currentPeriodEnd: subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000)
          : undefined,
        cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
      };
    } catch {
      return null;
    }
  }

  async retrieveCheckoutSession(sessionId: string): Promise<CheckoutSessionDetails | null> {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    const subscription =
      typeof session.subscription === "object" && session.subscription
        ? session.subscription
        : null;

    const subId =
      typeof session.subscription === "string"
        ? session.subscription
        : subscription?.id ?? null;

    const sub = subscription as { current_period_start?: number; current_period_end?: number } | null;
    const periodStart = sub?.current_period_start
      ? new Date(sub.current_period_start * 1000)
      : undefined;
    const periodEnd = sub?.current_period_end
      ? new Date(sub.current_period_end * 1000)
      : undefined;

    return {
      subscriptionId: subId,
      customerId: session.customer as string | null,
      userId: (session.metadata?.userId as string) ?? null,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
    };
  }
}
