import { config, validateConfig } from "./config/env.js";
import { createDatabase } from "./config/database.js";
import { createApp } from "./app.js";
import { authService } from "./services/auth.service.js";
import { socialService } from "./services/social.service.js";
import { billingService } from "./services/billing.service.js";
import { paypalGateway } from "./config/paypal.js";
import { stripeGateway } from "./config/stripe.js";
import { initializeDatabase } from "./database/initialize.js";

validateConfig();
const db = createDatabase();
await initializeDatabase(db);
const gateway = paypalGateway(config.paypal);
const stripe = stripeGateway(config.stripe);
const services = {
  auth: authService(db, config.jwt),
  social: socialService(db),
  billing: billingService(db, gateway, config.paypal, stripe, config.origin),
  stripe,
};
const app = createApp(services, db, config);
const server = app.listen(config.port, () =>
  console.log(`mémoires API: http://localhost:${config.port}`),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () =>
    server.close(() => {
      db.close();
      process.exit(0);
    }),
  );
