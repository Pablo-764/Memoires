export const fail = (status, message) =>
  Object.assign(new Error(message), { status });
export const asyncRoute = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  if (status >= 500) console.error("API:", err.code || err.message);
  let message =
    status >= 500 ? "No se pudo completar la operación." : err.message;
  if (err.type === "entity.parse.failed") {
    message = "El cuerpo no contiene JSON válido.";
  } else if (
    ["SQLITE_CONSTRAINT_UNIQUE", "SQLITE_CONSTRAINT_PRIMARYKEY"].includes(
      err.code,
    ) ||
    /UNIQUE constraint failed/.test(err.message || "")
  ) {
    res.status(409).json({ error: "El registro ya existe." });
    return;
  }
  res.status(status).json({ error: message });
}
