# Stripe Billing Integration

## Setup

### 1. Create a Stripe account and get keys

- Sign up at [stripe.com](https://stripe.com)
- Get your **Secret key** (starts with `sk_`) from Dashboard → Developers → API keys
- Create a **Price** for the Pro plan ($15.99/month recurring):
  - Products → Add product → "MindOrbit Pro"
  - Add price: $15.99/month, recurring
  - Copy the **Price ID** (starts with `price_`)

### 2. Configure the Customer Portal

- Go to Settings → Billing → Customer portal
- Enable subscription cancellation and payment method management
- Save configuration

### 3. Set up the webhook

- Go to Developers → Webhooks → Add endpoint
- URL: `https://your-domain.com/api/billing/webhook`
- Events to listen for:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- Copy the **Signing secret** (starts with `whsec_`)

### 4. Environment variables

```env
BILLING_PROVIDER="stripe"
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID="price_..."
```

### 5. Local webhook testing

Use the Stripe CLI to forward webhooks:

```bash
stripe listen --forward-to localhost:3000/api/billing/webhook
```

Use the webhook signing secret from the CLI output for `STRIPE_WEBHOOK_SECRET` when testing locally.

## Flow

1. **Upgrade**: User clicks Upgrade → Checkout session created → Redirect to Stripe Checkout
2. **Success**: After payment, Stripe redirects to `/api/billing/success` → User activated
3. **Webhook**: Stripe sends `checkout.session.completed` → Backup activation (idempotent)
4. **Portal**: User manages subscription via Stripe Customer Portal
5. **Updates**: `customer.subscription.updated` and `customer.subscription.deleted` keep user plan in sync

## Fallback

When Stripe env vars are missing, the app uses the **mock** billing provider for development.
