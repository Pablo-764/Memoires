import { Router } from "express";
import { billingController } from "../controllers/billing.controller.js";
import { authenticate } from "../middleware/auth.js";
export const billingRoutes = (auth, s) => {
  const r = Router(),
    c = billingController(s);
  r.get("/billing/config", c.config);
  r.use(authenticate(auth));
  r.get("/billing/current", c.current);
  r.post("/billing/current/cancel", c.cancel);
  r.post("/billing/paypal/orders", c.create);
  r.post("/billing/paypal/orders/:id/capture", c.capture);
  r.post("/billing/stripe/checkout", c.stripeCheckout);
  r.get("/billing/stripe/checkout/:id", c.stripeConfirm);
  r.post("/billing/stripe/portal", c.stripePortal);
  return r;
};
