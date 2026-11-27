import express from "express";
import cors from "cors";
import helmet from "helmet";
import { authRoutes } from "./router/auth.routes.js";
import { socialRoutes } from "./router/social.routes.js";
import { billingRoutes } from "./router/billing.routes.js";
import { errorHandler } from "./middleware/errors.js";

export function createApp(services, db, config) {
  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: config.origin,
      allowedHeaders: ["Content-Type", "Authorization", "Idempotency-Key"],
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    }),
  );
  app.post(
    "/api/billing/stripe/webhook",
    express.raw({ type: "application/json", limit: "256kb" }),
    async (req, res, next) => {
      try {
        const event = services.stripe.verifyWebhook(req.body, req.get("stripe-signature"));
        await services.billing.processStripeWebhook(event);
        res.json({ received: true });
      } catch (error) {
        next(error);
      }
    },
  );
  app.use(express.json({ limit: "2mb" }));
  app.get("/api/health", (req, res, next) => {
    try {
      db.get("SELECT 1 AS ok");
      res.json({ status: "ok", db: db.dialect });
    } catch (error) {
      error.status = 503;
      next(error);
    }
  });
  app.use("/api", authRoutes(services.auth));
  app.use("/api", billingRoutes(services.auth, services.billing));
  app.use("/api", socialRoutes(services.auth, services.social));
  app.use("/api", (_req, res) =>
    res.status(404).json({ error: "Ruta no encontrada." }),
  );
  app.use(errorHandler);
  return app;
}
