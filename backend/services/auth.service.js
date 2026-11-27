import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { emailOrPhone, text, object } from "../middleware/validate.js";
import { fail } from "../middleware/errors.js";
import { now, publicUser } from "../models/base.model.js";
import { userModel } from "../models/user.model.js";
import { makeToken } from "../middleware/auth.js";
const options = {
  algorithms: ["HS256"],
  issuer: "memoires-api",
  audience: "memoires-app",
};
const validImage = (value) =>
  typeof value === "string" &&
  /^data:image\/(?:jpeg|png|webp|svg\+xml)(?:;base64)?,/i.test(value) &&
  value.length <= 180_000;
const defaultProfile = (p = {}) => ({
  name: p.name || "",
  age: p.age || 18,
  city: p.city || "",
  bio: p.bio || "",
  intents: p.intents || [],
  interests: p.interests || [],
  decoration: "none",
  frame: "none",
  effect: "none",
  nameStyle: "none",
  occupation: "",
  education: "",
  languages: ["Español"],
  availability: "Cualquier día",
  prompts: [],
  favorites: { music: "", movie: "", food: "" },
  gallery: [],
  gender: "unsaid",
  intentPrefs: {},
  ...p,
});
export const authService = (db, config) => {
  const users = userModel(db);
  return {
    async register(body) {
      object(body);
      const p = defaultProfile(object(body.profile || {}));
      const rawContact =
        body.email || body.phone || p.email || p.phone || body.contact;
      const contact = emailOrPhone(
        body.email ||
          (typeof rawContact === "string" && rawContact.includes("@")
            ? rawContact
            : null),
        body.phone ||
          (typeof rawContact === "string" && !rawContact.includes("@")
            ? rawContact
            : null),
      );
      const password = body.password;
      if (
        typeof password !== "string" ||
        password.length < 8 ||
        Buffer.byteLength(password) > 72
      )
        throw fail(
          400,
          "La contraseña debe tener al menos 8 caracteres y no exceder 72 bytes.",
        );
      for (const k of [
        "email",
        "phone",
        "verified",
        "idVerified",
        "password",
        "role",
        "tier",
      ])
        delete p[k];
      if (!Number.isInteger(p.age) || p.age < 18 || p.age > 120)
        throw fail(400, "La cuenta es solo para mayores de 18 años.");
      text(p.name, "Nombre", 2, 100);
      if (
        !Array.isArray(p.intents) ||
        !p.intents.length ||
        !Array.isArray(p.interests) ||
        p.interests.length < 5
      )
        throw fail(400, "Completa intenciones y al menos cinco intereses.");
      if (
        typeof p.zone !== "string" ||
        !p.zone.trim() ||
        !Array.isArray(p.prompts) ||
        p.prompts.length !== 3 ||
        p.prompts.some(
          (x) => typeof x.a !== "string" || x.a.trim().length < 2,
        ) ||
        !Array.isArray(p.openers) ||
        p.openers.length !== 3 ||
        p.rulesAccepted !== true ||
        !validImage(p.photo) ||
        !Array.isArray(p.gallery) ||
        p.gallery.some((image) => !validImage(image))
      )
        throw fail(
          400,
          "Completa las fotos, respuestas, primeros pasos, zona y reglas de comunidad.",
        );
      const hash = await bcrypt.hash(password, 12);
      try {
        const id = users.create({
          email: contact.email,
          phone: contact.phone,
          passwordHash: hash,
          profile: p,
          settings: {
            quienVe: "todos",
            mostrarEdad: true,
            mostrarZona: true,
            leido: true,
            avisosConexion: true,
            avisosPlanes: true,
            resumenSemanal: false,
          },
        });
        const user = users.byId(id);
        return {
          token: makeToken(user, config),
          usuario: publicUser(user),
          perfil: p,
        };
      } catch (e) {
        if (String(e.code).includes("CONSTRAINT"))
          throw fail(409, "Ese correo o teléfono ya tiene cuenta.");
        throw e;
      }
    },
    async login(body) {
      object(body);
      const password = body.password;
      if (
        typeof password !== "string" ||
        !password ||
        Buffer.byteLength(password) > 72
      )
        throw fail(400, "Contraseña inválida.");
      const contact = emailOrPhone(
        body.email ||
          (String(body.contact || "").includes("@") ? body.contact : null),
        body.phone ||
          (body.contact && !String(body.contact).includes("@")
            ? body.contact
            : null),
      );
      const user = users.byContact(contact);
      if (
        !user ||
        user.status !== "active" ||
        !(await bcrypt.compare(password, user.password_hash))
      )
        throw fail(401, "Correo/teléfono o contraseña incorrectos.");
      return {
        token: makeToken(user, config),
        usuario: publicUser(user),
        perfil: JSON.parse(users.profile(user.id)?.data || "{}"),
      };
    },
    async authenticate(header) {
      const m = /^Bearer ([^ ]+)$/.exec(header || "");
      if (!m) throw fail(401, "Inicia sesión para continuar.");
      let payload;
      try {
        payload = jwt.verify(m[1], config.secret, options);
      } catch {
        throw fail(401, "La sesión venció o el token no es válido.");
      }
      const user = users.byId(Number(payload.sub));
      if (
        !user ||
        user.status !== "active" ||
        user.session_version !== payload.version
      )
        throw fail(401, "La sesión fue revocada.");
      const sub = users.tierSubscription(user.id);
      if (sub && Date.parse(sub.expires_at) <= Date.now()) {
        users.expireTier(user.id, now());
        user.tier = "free";
      }
      return { ...publicUser(user), id: user.id };
    },
    me: (id) => {
      const user = users.byId(id);
      return {
        usuario: publicUser(user),
        perfil: JSON.parse(users.profile(id)?.data || "{}"),
        ajustes: JSON.parse(users.settings(id)?.data || "{}"),
      };
    },
    logout(id) {
      users.revoke(id);
      return { mensaje: "Sesiones cerradas." };
    },
    updateProfile(id, patch) {
      object(patch);
      const row = users.profile(id);
      if (!row) throw fail(404, "Perfil no encontrado.");
      const old = JSON.parse(row.data);
      const allowed = Object.fromEntries(
        Object.entries(patch).filter(
          ([k]) =>
            ![
              "verified",
              "idVerified",
              "email",
              "phone",
              "role",
              "tier",
            ].includes(k),
        ),
      );
      const next = { ...old, ...allowed };
      if (!Number.isInteger(next.age) || next.age < 18 || next.age > 120)
        throw fail(400, "La cuenta es solo para mayores de 18 años.");
      if (
        typeof next.name !== "string" ||
        next.name.trim().length < 2 ||
        next.name.length > 100
      )
        throw fail(400, "Nombre inválido.");
      if (
        !Array.isArray(next.intents) ||
        !Array.isArray(next.interests) ||
        next.interests.some((x) => typeof x !== "string" || x.length > 60)
      )
        throw fail(400, "Intenciones o intereses inválidos.");
      if (next.photo !== undefined && !validImage(next.photo))
        throw fail(400, "Foto inválida o demasiado grande.");
      if (
        !Array.isArray(next.gallery) ||
        next.gallery.length > 5 ||
        next.gallery.some((x) => !validImage(x))
      )
        throw fail(400, "Galería inválida o demasiado grande.");
      users.saveProfile(id, next);
      return next;
    },
    settings(id, patch) {
      object(patch);
      const allowed = [
        "quienVe",
        "mostrarEdad",
        "mostrarZona",
        "leido",
        "avisosConexion",
        "avisosPlanes",
        "resumenSemanal",
      ];
      if (Object.keys(patch).some((k) => !allowed.includes(k)))
        throw fail(400, "Hay una preferencia no reconocida.");
      if (
        patch.quienVe !== undefined &&
        !["todos", "intereses", "nadie"].includes(patch.quienVe)
      )
        throw fail(400, "Preferencia de privacidad inválida.");
      for (const k of allowed.filter((k) => k !== "quienVe"))
        if (patch[k] !== undefined && typeof patch[k] !== "boolean")
          throw fail(400, `La preferencia ${k} debe ser booleana.`);
      const row = users.settings(id);
      const old = JSON.parse(row?.data || "{}");
      const next = { ...old, ...patch };
      if (!["todos", "intereses", "nadie"].includes(next.quienVe))
        throw fail(400, "Preferencia de privacidad inválida.");
      users.saveSettings(id, next);
      return next;
    },
    deleteAccount(id) {
      users.delete(id);
      return { mensaje: "Cuenta y datos personales eliminados." };
    },
  };
};
