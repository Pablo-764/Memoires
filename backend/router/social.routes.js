import { Router } from "express";
import { socialController } from "../controllers/social.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
export const socialRoutes = (auth, s) => {
  const r = Router(),
    c = socialController(s);
  r.use(authenticate(auth));
  r.get("/discover", c.discover);
  r.get("/likes/received", c.incomingLikes);
  r.post("/discover/:id/decision", c.decide);
  r.get("/users/:id", c.userProfile);
  r.post("/users/:id/block", c.block);
  r.post("/users/:id/reports", c.report);
  r.get("/connections", c.connections);
  r.delete("/connections/:id", c.removeConnection);
  r.get("/connections/:id/messages", c.messages);
  r.post("/connections/:id/messages", c.sendMessage);
  r.patch("/connections/:id/messages/:messageId/plan", c.respondPlan);
  r.delete("/connections/:id/messages", c.clearChat);
  r.get("/plans", c.plans);
  r.post("/plans", c.createPlan);
  r.post("/plans/:id/join", c.joinPlan);
  r.post("/verification/demo", c.verify);
  r.get("/admin/reports", authorize("admin"), c.reports);
  r.patch("/admin/reports/:id", authorize("admin"), c.moderate);
  return r;
};
