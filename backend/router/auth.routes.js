import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { authController } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";
export const authRoutes = (s) => {
  const r = Router(),
    c = authController(s);
  r.post(
    "/auth/register",
    rateLimit({ windowMs: 900000, limit: 10 }),
    c.register,
  );
  r.post(
    "/auth/login",
    rateLimit({ windowMs: 900000, limit: 20, skipSuccessfulRequests: true }),
    c.login,
  );
  r.get("/auth/me", authenticate(s), c.me);
  r.post("/auth/logout", authenticate(s), c.logout);
  r.patch("/profile", authenticate(s), c.profile);
  r.patch("/settings", authenticate(s), c.settings);
  r.delete("/account", authenticate(s), c.remove);
  return r;
};
