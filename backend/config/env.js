import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
dotenv.config({
  path: fileURLToPath(new URL("../.env", import.meta.url)),
  quiet: true,
});

const secret = process.env.JWT_SECRET || "";
export const config = {
  port: Number(process.env.PORT || 3000),
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:4200",
  jwt: { secret, expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  sqliteFile:
    process.env.SQLITE_FILE ||
    fileURLToPath(new URL("../data/memoires.sqlite", import.meta.url)),
  paypal: {
    environment: process.env.PAYPAL_ENV || "sandbox",
    clientId: process.env.PAYPAL_CLIENT_ID || "",
    secret: process.env.PAYPAL_CLIENT_SECRET || "",
    currency: process.env.PAYPAL_CURRENCY || "MXN",
    frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:4200",
    amounts: {
      grand: Number(process.env.PAYPAL_GRAND_AMOUNT || 92.5),
      lucidite: Number(process.env.PAYPAL_LUCIDITE_AMOUNT || 185),
    },
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
    priceIds: {
      grand: process.env.STRIPE_GRAND_PRICE_ID || "",
      lucidite: process.env.STRIPE_LUCIDITE_PRICE_ID || "",
    },
    automaticTax: process.env.STRIPE_AUTOMATIC_TAX === "true",
    taxRegistrationConfirmed:
      process.env.STRIPE_TAX_REGISTRATION_CONFIRMED === "true",
  },
};
export function validateConfig() {
  if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535)
    throw new Error("PORT inválido.");
  if (
    config.jwt.secret.length < 32 ||
    config.jwt.secret.toLowerCase().includes("pon-aqui")
  )
    throw new Error(
      "JWT_SECRET debe ser un secreto privado de al menos 32 caracteres en backend/.env.",
    );
  if (!["sandbox", "live"].includes(config.paypal.environment))
    throw new Error("PAYPAL_ENV debe ser sandbox o live.");
  if (!/^[A-Z]{3}$/.test(config.paypal.currency))
    throw new Error(
      "PAYPAL_CURRENCY debe ser un código ISO de 3 letras en mayúsculas.",
    );
  if (
    Object.values(config.paypal.amounts).some(
      (n) => !Number.isFinite(n) || n <= 0,
    )
  )
    throw new Error("Configura montos PayPal válidos.");
  if (config.stripe.automaticTax && !config.stripe.taxRegistrationConfirmed)
    throw new Error(
      "No actives Stripe Tax hasta confirmar un registro fiscal activo en la jurisdicción de cobro.",
    );
}
