import Stripe from "stripe";
import { fail } from "../middleware/errors.js";

export function stripeGateway(settings) {
  const client = settings.secretKey
    ? new Stripe(settings.secretKey, { apiVersion: "2026-07-29.dahlia" })
    : null;
  const enabled = () => !!client;
  return {
    enabled,
    priceIds: settings.priceIds,
    automaticTax: settings.automaticTax,
    async createSubscription({ userId, email, customerId, tier, key, successUrl, cancelUrl }) {
      if (!client) throw fail(503, "Configura STRIPE_SECRET_KEY en backend/.env.");
      const price = settings.priceIds[tier];
      if (!price) throw fail(503, `Configura STRIPE_${tier.toUpperCase()}_PRICE_ID en backend/.env.`);
      return client.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price, quantity: 1 }],
        ...(customerId ? { customer: customerId } : email ? { customer_email: email } : {}),
        client_reference_id: String(userId),
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: { user_id: String(userId), tier, request_key: key },
        subscription_data: {
          metadata: { user_id: String(userId), tier, request_key: key },
          ...(settings.automaticTax ? { automatic_tax: { enabled: true } } : {}),
        },
        ...(settings.automaticTax
          ? { automatic_tax: { enabled: true }, billing_address_collection: "required" }
          : {}),
      }, { idempotencyKey: key });
    },
    retrieveSession: (id) => {
      if (!client) throw fail(503, "Configura STRIPE_SECRET_KEY en backend/.env.");
      return client.checkout.sessions.retrieve(id, { expand: ["subscription", "customer"] });
    },
    retrieveSubscription: (id) => {
      if (!client) throw fail(503, "Configura STRIPE_SECRET_KEY en backend/.env.");
      return client.subscriptions.retrieve(id);
    },
    createPortal: (customerId, returnUrl) => {
      if (!client) throw fail(503, "Configura STRIPE_SECRET_KEY en backend/.env.");
      return client.billingPortal.sessions.create({ customer: customerId, return_url: returnUrl });
    },
    verifyWebhook: (raw, signature) => {
      if (!client || !settings.webhookSecret)
        throw fail(503, "Configura STRIPE_SECRET_KEY y STRIPE_WEBHOOK_SECRET en backend/.env.");
      try {
        return client.webhooks.constructEvent(raw, signature, settings.webhookSecret);
      } catch {
        throw fail(400, "Firma del webhook de Stripe inválida.");
      }
    },
  };
}
