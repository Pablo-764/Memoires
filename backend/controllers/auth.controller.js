import { asyncRoute } from "../middleware/errors.js";
export const authController = (s) => ({
  register: asyncRoute(async (req, res) =>
    res.status(201).json(await s.register(req.body)),
  ),
  login: asyncRoute(async (req, res) => res.json(await s.login(req.body))),
  me: asyncRoute(async (req, res) => res.json(s.me(req.user.id))),
  logout: asyncRoute(async (req, res) => res.json(s.logout(req.user.id))),
  profile: asyncRoute(async (req, res) =>
    res.json({ perfil: s.updateProfile(req.user.id, req.body) }),
  ),
  settings: asyncRoute(async (req, res) =>
    res.json({ ajustes: s.settings(req.user.id, req.body) }),
  ),
  remove: asyncRoute(async (req, res) =>
    res.json(s.deleteAccount(req.user.id)),
  ),
});
