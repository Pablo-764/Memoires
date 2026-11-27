import Stripe from "stripe";
import { readFile, writeFile } from "node:fs/promises";
import { config } from "../config/env.js";

if (!config.stripe.secretKey.startsWith("sk_test_")) {
  throw new Error("Este asistente solo crea productos en modo de prueba; usa STRIPE_SECRET_KEY sk_test_.");
}

const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: "2026-07-29.dahlia",
});
const catalog = [
  { tier: "grand", name: "mémoires Grand", amount: 9250 },
  { tier: "lucidite", name: "mémoires Lucidité", amount: 18500 },
];
const prices = {};
const products = await stripe.products.list({ limit: 100, active: true });

for (const item of catalog) {
  let product = products.data.find((p) => p.metadata?.memoires_tier === item.tier);
  if (!product) {
    product = await stripe.products.create({
      name: item.name,
      description: "Suscripción mensual de mémoires",
      metadata: { memoires_tier: item.tier },
    });
  }
  const listedPrices = await stripe.prices.list({ product: product.id, active: true, limit: 100 });
  let price = listedPrices.data.find((p) =>
    p.currency === "mxn" &&
    p.unit_amount === item.amount &&
    p.recurring?.interval === "month" &&
    p.recurring?.interval_count === 1
  );
  if (!price) {
    price = await stripe.prices.create({
      product: product.id,
      currency: "mxn",
      unit_amount: item.amount,
      recurring: { interval: "month" },
      metadata: { memoires_tier: item.tier },
    });
  }
  prices[item.tier] = price.id;
}

const envPath = new URL("../.env", import.meta.url);
let env = await readFile(envPath, "utf8");
for (const [tier, priceId] of Object.entries(prices)) {
  const key = tier === "grand" ? "STRIPE_GRAND_PRICE_ID" : "STRIPE_LUCIDITE_PRICE_ID";
  const line = new RegExp(`^${key}=.*$`, "m");
  if (line.test(env)) env = env.replace(line, `${key}=${priceId}`);
  else env += `\n${key}=${priceId}\n`;
}
await writeFile(envPath, env, "utf8");
console.log("Productos y precios mensuales de Stripe creados/verificados en modo de prueba.");
console.log(`Grand: ${prices.grand}`);
console.log(`Lucidité: ${prices.lucidite}`);
