import { fail } from "./errors.js";
export const object = (v) => {
  if (!v || typeof v !== "object" || Array.isArray(v))
    throw fail(400, "Envía un objeto JSON válido.");
  return v;
};
export const text = (v, label, min = 1, max = 500) => {
  if (typeof v !== "string" || v.trim().length < min || v.trim().length > max)
    throw fail(400, `${label} debe tener entre ${min} y ${max} caracteres.`);
  return v.trim();
};
export const integer = (v, label, min, max) => {
  if (!Number.isSafeInteger(v) || v < min || v > max)
    throw fail(400, `${label} inválido.`);
  return v;
};
export const emailOrPhone = (email, phone) => {
  if (email) {
    const s = text(email, "Correo", 3, 150).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s))
      throw fail(400, "Correo inválido.");
    return { email: s, phone: null };
  }
  if (phone) {
    const s = text(phone, "Teléfono", 10, 16).replace(/[\s()-]/g, "");
    if (!/^\+?\d{10,15}$/.test(s)) throw fail(400, "Teléfono inválido.");
    return { email: null, phone: s };
  }
  throw fail(400, "Se requiere correo o teléfono.");
};
