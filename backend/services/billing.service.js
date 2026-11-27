import { createHash } from "node:crypto";
import { fail } from "../middleware/errors.js";
import { text } from "../middleware/validate.js";
import { now } from "../models/base.model.js";

const tiers = { grand: "grand", lucidite: "lucidite" };
export const billingService = (db, gateway, settings, stripe, frontendOrigin) => ({
  config: () => ({
    ...gateway.publicConfig(),
    plans: {
      grand: {
        amount: settings.amounts.grand,
        currency: settings.currency,
        periodDays: 30,
      },
      lucidite: {
        amount: settings.amounts.lucidite,
        currency: settings.currency,
        periodDays: 30,
      },
    },
    stripe: {
      enabled: stripe.enabled(),
      configured: Object.values(stripe.priceIds).every(Boolean),
      automaticTax: stripe.automaticTax,
    },
  }),
  async createStripeCheckout(userId, tier, idempotencyKey) {
    if (!tiers[tier]) throw fail(400, "Selecciona Grand o Lucidité.");
    if (!stripe.enabled()) throw fail(503, "Configura Stripe en el backend.");
    const clientKey = text(idempotencyKey, "Idempotency-Key", 8, 100);
    const key = createHash("sha256").update(`${userId}:stripe:${clientKey}`).digest("hex").slice(0, 32);
    if (!stripe.priceIds[tier])
      throw fail(503, `Configura STRIPE_${tier.toUpperCase()}_PRICE_ID en backend/.env.`);
    const previous = db.get("SELECT id,status FROM stripe_billing_sessions WHERE request_key=?", [key]);
    if (previous) {
      const existing = await stripe.retrieveSession(previous.id);
      if (existing.url) return { id: existing.id, url: existing.url };
      throw fail(409, "La sesión de pago ya se usó; inicia una nueva.");
    }
    const user = db.get("SELECT email,stripe_customer_id FROM users WHERE id=?", [userId]);
    if (!user) throw fail(404, "Cuenta no encontrada.");
    const session = await stripe.createSubscription({
      userId,
      email: user.email,
      customerId: user.stripe_customer_id,
      tier,
      key,
      successUrl: `${frontendOrigin}/app/suscripcion?stripe_session={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${frontendOrigin}/app/suscripcion?stripe_cancel=1`,
    });
    if (!session.id || !session.url) throw fail(502, "Stripe no devolvió una sesión de suscripción válida.");
    db.run(
      "INSERT INTO stripe_billing_sessions(id,user_id,tier,status,request_key,created_at) VALUES (?,?,?,?,?,?)",
      [session.id, userId, tier, "CREATED", key, now()],
    );
    return { id: session.id, url: session.url };
  },
  async confirmStripeCheckout(userId, sessionId) {
    const row = db.get("SELECT * FROM stripe_billing_sessions WHERE id=? AND user_id=?", [sessionId, userId]);
    if (!row) throw fail(404, "Sesión de pago no encontrada.");
    const session = await stripe.retrieveSession(sessionId);
    if (
      session.id !== row.id || session.mode !== "subscription" ||
      session.client_reference_id !== String(userId) ||
      session.metadata?.request_key !== row.request_key ||
      session.metadata?.tier !== row.tier ||
      !session.subscription
    ) throw fail(409, "La suscripción no está pagada o sus datos no coinciden.");
    if (session.payment_status !== "paid")
      return { status: "PENDING", tier: row.tier };
    const subscription = typeof session.subscription === "string"
      ? await stripe.retrieveSubscription(session.subscription)
      : session.subscription;
    if (subscription.metadata?.user_id !== String(userId) || subscription.metadata?.tier !== row.tier)
      throw fail(409, "Stripe devolvió una suscripción distinta de la solicitada.");
    return this.syncStripeSubscription(subscription);
  },
  async syncStripeSubscription(subscription) {
    const userId = Number(subscription.metadata?.user_id);
    const tier = subscription.metadata?.tier;
    if (!Number.isSafeInteger(userId) || !tiers[tier]) return { received: true };
    const user = db.get("SELECT id FROM users WHERE id=?", [userId]);
    if (!user) return { received: true };
    const customerId = typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;
    const active = ["active", "trialing"].includes(subscription.status);
    const status = active
      ? (subscription.cancel_at_period_end ? "cancel_at_period_end" : "active")
      : subscription.status === "canceled" || subscription.status === "incomplete_expired"
        ? "expired"
        : subscription.status;
    const started = new Date((subscription.start_date || subscription.created) * 1000).toISOString();
    const periodEnd = subscription.items?.data?.[0]?.current_period_end
      || subscription.current_period_end;
    const expires = periodEnd
      ? new Date(periodEnd * 1000).toISOString()
      : null;
    db.transaction(() => {
      const existing = db.get("SELECT id FROM subscriptions WHERE provider_ref=?", [subscription.id]);
      if (active)
        db.run(
          "UPDATE subscriptions SET status='replaced' WHERE user_id=? AND status IN ('active','cancel_at_period_end') AND provider_ref<>?",
          [userId, subscription.id],
        );
      if (existing) {
        db.run(
          "UPDATE subscriptions SET tier=?,provider='stripe',status=?,started_at=?,expires_at=? WHERE id=?",
          [tier, status, started, expires, existing.id],
        );
      } else {
        db.run(
          "INSERT INTO subscriptions(user_id,tier,provider,provider_ref,status,started_at,expires_at) VALUES (?,?,?,?,?,?,?)",
          [userId, tier, "stripe", subscription.id, status, started, expires],
        );
      }
      const session = db.get(
        "SELECT id FROM stripe_billing_sessions WHERE user_id=? AND tier=? AND subscription_id IS NULL ORDER BY created_at DESC LIMIT 1",
        [userId, tier],
      );
      if (session)
        db.run(
          "UPDATE stripe_billing_sessions SET subscription_id=?,status=? WHERE id=?",
          [subscription.id, status, session.id],
        );
      if (customerId)
        db.run("UPDATE users SET stripe_customer_id=? WHERE id=?", [customerId, userId]);
      const current = db.get(
        "SELECT tier FROM subscriptions WHERE user_id=? AND status IN ('active','cancel_at_period_end') AND (expires_at IS NULL OR expires_at>?) ORDER BY id DESC LIMIT 1",
        [userId, now()],
      );
      db.run("UPDATE users SET tier=? WHERE id=?", [current?.tier || "free", userId]);
    });
    return {
      status: active ? "COMPLETED" : status.toUpperCase(),
      tier: active ? tier : "free",
      renewalAt: expires,
      subscriptionId: subscription.id,
    };
  },
  async processStripeWebhook(event) {
    if (["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type)) {
      const sessionId = event.data?.object?.id;
      const row = db.get("SELECT user_id FROM stripe_billing_sessions WHERE id=?", [sessionId]);
      if (row) return this.confirmStripeCheckout(row.user_id, sessionId);
      return { received: true };
    }
    if (["customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"].includes(event.type))
      return this.syncStripeSubscription(event.data.object);
    if (["invoice.paid", "invoice.payment_failed"].includes(event.type)) {
      const subscriptionId = event.data.object.subscription
        || event.data.object.parent?.subscription_details?.subscription;
      if (subscriptionId)
        return this.syncStripeSubscription(await stripe.retrieveSubscription(subscriptionId));
    }
    return { received: true };
  },
  async createStripePortal(userId) {
    const user = db.get("SELECT stripe_customer_id FROM users WHERE id=?", [userId]);
    if (!user?.stripe_customer_id) throw fail(404, "No hay una suscripción de Stripe para esta cuenta.");
    const portal = await stripe.createPortal(
      user.stripe_customer_id,
      `${frontendOrigin}/app/suscripcion`,
    );
    return { url: portal.url };
  },
  async createOrder(userId, tier, idempotencyKey) {
    if (!tiers[tier]) throw fail(400, "Selecciona Grand o Lucidité.");
    if (!gateway.enabled())
      throw fail(
        503,
        "Configura PAYPAL_CLIENT_ID y PAYPAL_CLIENT_SECRET en backend/.env.",
      );
    const clientKey = text(idempotencyKey, "Idempotency-Key", 8, 100);
    const key = createHash("sha256")
      .update(`${userId}:${clientKey}`)
      .digest("hex")
      .slice(0, 32);
    const previous = db.get(
      "SELECT id,tier,status,approve_url FROM paypal_orders WHERE request_key=?",
      [key],
    );
    if (previous && previous.tier !== tier)
      throw fail(409, "La clave de idempotencia ya se usó para otro plan.");
    if (previous)
      return {
        id: previous.id,
        status: previous.status,
        approveUrl: previous.approve_url,
      };
    const amount = settings.amounts[tier];
    // La llamada externa va fuera de una transacción SQLite para no bloquear otras solicitudes.
    const remote = await gateway.create(tier, amount, key);
    if (!remote.id) throw fail(502, "PayPal no devolvió una orden válida.");
    const approveUrl =
      remote.links?.find((x) => x.rel === "approve")?.href || null;
    try {
      db.run(
        "INSERT INTO paypal_orders(id,user_id,tier,amount_cents,currency,status,request_key,approve_url,created_at) VALUES (?,?,?,?,?,?,?,?,?)",
        [
          remote.id,
          userId,
          tier,
          Math.round(amount * 100),
          settings.currency,
          "CREATED",
          key,
          approveUrl,
          now(),
        ],
      );
    } catch (error) {
      const raced = db.get(
        "SELECT id,status,approve_url FROM paypal_orders WHERE request_key=?",
        [key],
      );
      if (raced)
        return {
          id: raced.id,
          status: raced.status,
          approveUrl: raced.approve_url,
        };
      throw error;
    }
    return { id: remote.id, status: remote.status, approveUrl };
  },
  async capture(userId, orderId) {
    const row = db.get("SELECT * FROM paypal_orders WHERE id=? AND user_id=?", [
      orderId,
      userId,
    ]);
    if (!row) throw fail(404, "Orden de pago no encontrada.");
    if (row.status === "COMPLETED")
      return {
        status: "COMPLETED",
        tier: row.tier,
        renewalAt: db.get(
          "SELECT expires_at FROM subscriptions WHERE provider_ref=?",
          [row.id],
        )?.expires_at,
      };
    let remote = await gateway.get(orderId);
    if (
      remote.id !== orderId ||
      !remote.purchase_units?.some((unit) => unit.custom_id === row.request_key)
    )
      throw fail(409, "PayPal devolvió una orden distinta de la solicitada.");
    if (remote.status !== "COMPLETED")
      remote = await gateway.capture(orderId, `capture-${orderId}`);
    const captures =
        remote.purchase_units?.flatMap((u) => u.payments?.captures || []) || [],
      done = captures.filter((c) => c.status === "COMPLETED");
    if (remote.status !== "COMPLETED" || !done.length)
      return { status: "PENDING" };
    const sum = done.reduce(
      (s, c) => s + Math.round(Number(c.amount?.value) * 100),
      0,
    );
    if (
      done.some((c) => c.amount?.currency_code !== row.currency) ||
      sum !== row.amount_cents
    )
      throw fail(
        409,
        "El monto o la moneda recibidos no coinciden con la orden.",
      );
    const started = new Date(),
      expires = new Date(started.getTime() + 30 * 86400000),
      captureId = done[0].id;
    const result = db.transaction(() => {
      const latest = db.get("SELECT status FROM paypal_orders WHERE id=?", [
        orderId,
      ]);
      if (latest?.status === "COMPLETED")
        return {
          status: "COMPLETED",
          tier: row.tier,
          renewalAt: db.get(
            "SELECT expires_at FROM subscriptions WHERE provider_ref=?",
            [orderId],
          )?.expires_at,
        };
      db.run(
        "UPDATE paypal_orders SET status='COMPLETED',capture_id=? WHERE id=?",
        [captureId, orderId],
      );
      db.run(
        "UPDATE subscriptions SET status='replaced' WHERE user_id=? AND status='active'",
        [userId],
      );
      db.run(
        "INSERT INTO subscriptions(user_id,tier,provider,provider_ref,status,started_at,expires_at) VALUES (?,?,?,?,?,?,?)",
        [
          userId,
          row.tier,
          "paypal",
          orderId,
          "active",
          started.toISOString(),
          expires.toISOString(),
        ],
      );
      db.run("UPDATE users SET tier=? WHERE id=?", [row.tier, userId]);
      return {
        status: "COMPLETED",
        tier: row.tier,
        renewalAt: expires.toISOString(),
        captureId,
      };
    });
    return result;
  },
  current(userId) {
    const u = db.get("SELECT tier FROM users WHERE id=?", [userId]);
    const sub = db.get(
      "SELECT tier,provider,expires_at,status FROM subscriptions WHERE user_id=? AND status IN ('active','cancel_at_period_end') ORDER BY id DESC LIMIT 1",
      [userId],
    );
    if (sub && Date.parse(sub.expires_at) <= Date.now()) {
      db.transaction(() => {
        db.run(
          "UPDATE subscriptions SET status='expired' WHERE user_id=? AND status IN ('active','cancel_at_period_end') AND expires_at<=?",
          [userId, now()],
        );
        db.run("UPDATE users SET tier='free' WHERE id=?", [userId]);
      });
      return { tier: "free", subscription: null };
    }
    return { tier: u?.tier || "free", subscription: sub || null };
  },
  cancel(userId) {
    const sub = db.get(
      "SELECT id,expires_at,status FROM subscriptions WHERE user_id=? AND status IN ('active','cancel_at_period_end') ORDER BY id DESC LIMIT 1",
      [userId],
    );
    if (!sub) return { mensaje: "No tienes una suscripción activa." };
    if (sub.status === "active")
      db.run(
        "UPDATE subscriptions SET status='cancel_at_period_end' WHERE id=?",
        [sub.id],
      );
    return {
      tier:
        db.get("SELECT tier FROM users WHERE id=?", [userId])?.tier || "free",
      expiresAt: sub.expires_at,
      mensaje:
        "La suscripción no se renovará; conservarás el plan hasta su vencimiento.",
    };
  },
});
