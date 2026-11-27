import { asyncRoute } from "../middleware/errors.js";
export const billingController = (s) => ({
  config: asyncRoute(async (_req, res) => res.json(s.config())),
  current: asyncRoute(async (req, res) => res.json(s.current(req.user.id))),
  cancel: asyncRoute(async (req, res) => res.json(s.cancel(req.user.id))),
  create: asyncRoute(async (req, res) =>
    res
      .status(201)
      .json(
        await s.createOrder(
          req.user.id,
          req.body?.tier,
          req.get("Idempotency-Key"),
        ),
      ),
  ),
  capture: asyncRoute(async (req, res) =>
    res.json(await s.capture(req.user.id, req.params.id)),
  ),
  stripeCheckout: asyncRoute(async (req, res) =>
    res.status(201).json(await s.createStripeCheckout(
      req.user.id, req.body?.tier, req.get("Idempotency-Key"),
    )),
  ),
  stripeConfirm: asyncRoute(async (req, res) =>
    res.json(await s.confirmStripeCheckout(req.user.id, req.params.id)),
  ),
  stripePortal: asyncRoute(async (req, res) =>
    res.json(await s.createStripePortal(req.user.id)),
  ),
});
