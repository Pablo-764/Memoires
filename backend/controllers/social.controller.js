import { asyncRoute } from "../middleware/errors.js";
export const socialController = (s) => ({
  userProfile: asyncRoute(async (req, res) =>
    res.json(s.userProfile(req.user.id, req.params.id)),
  ),
  discover: asyncRoute(async (req, res) =>
    res.json(await s.discover(req.user.id, req.query)),
  ),
  decide: asyncRoute(async (req, res) =>
    res.json(s.decide(req.user.id, req.params.id, req.body)),
  ),
  incomingLikes: asyncRoute(async (req, res) =>
    res.json(s.incomingLikes(req.user.id)),
  ),
  connections: asyncRoute(async (req, res) =>
    res.json(s.connections(req.user.id)),
  ),
  removeConnection: asyncRoute(async (req, res) =>
    res.json(s.removeConnection(req.user.id, req.params.id)),
  ),
  messages: asyncRoute(async (req, res) =>
    res.json(s.messages(req.user.id, req.params.id)),
  ),
  sendMessage: asyncRoute(async (req, res) =>
    res.status(201).json(s.sendMessage(req.user.id, req.params.id, req.body)),
  ),
  respondPlan: asyncRoute(async (req, res) =>
    res.json(
      s.respondPlan(req.user.id, req.params.id, req.params.messageId, req.body),
    ),
  ),
  clearChat: asyncRoute(async (req, res) =>
    res.json(s.clearChat(req.user.id, req.params.id)),
  ),
  block: asyncRoute(async (req, res) =>
    res.json(s.block(req.user.id, req.params.id)),
  ),
  report: asyncRoute(async (req, res) =>
    res.status(201).json(s.report(req.user.id, req.params.id, req.body)),
  ),
  settings: asyncRoute(async (req, res) =>
    res.json({ ajustes: s.settings(req.user.id, req.body) }),
  ),
  plans: asyncRoute(async (req, res) =>
    res.json(s.plans(req.user.id, req.query)),
  ),
  createPlan: asyncRoute(async (req, res) =>
    res.status(201).json(s.createPlan(req.user.id, req.body)),
  ),
  joinPlan: asyncRoute(async (req, res) =>
    res.json(s.joinPlan(req.user.id, req.params.id)),
  ),
  reports: asyncRoute(async (req, res) => res.json(s.adminReports())),
  moderate: asyncRoute(async (req, res) =>
    res.json(s.moderate(req.user.id, req.params.id, req.body?.status)),
  ),
  verify: asyncRoute(async (req, res) => res.json(s.devVerify(req.user.id))),
});
