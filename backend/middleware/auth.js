import jwt from "jsonwebtoken";
import { fail } from "./errors.js";
export const authenticate = (service) => async (req, _res, next) => {
  try {
    req.user = await service.authenticate(req.get("authorization"));
    next();
  } catch (e) {
    next(e);
  }
};
export const authorize =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role))
      return next(fail(403, "No tienes permiso para esta acción."));
    next();
  };
export const makeToken = (user, config) =>
  jwt.sign(
    { sub: String(user.id), version: user.session_version, role: user.role },
    config.secret,
    {
      algorithm: "HS256",
      issuer: "memoires-api",
      audience: "memoires-app",
      expiresIn: config.expiresIn,
    },
  );
