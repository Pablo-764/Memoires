import { readFile } from "node:fs/promises";
import { now } from "../models/base.model.js";

/** Creates missing tables and applies safe, repeatable upgrades for existing SQLite files. */
export async function initializeDatabase(db) {
  const schema = await readFile(
    new URL("./schema.sqlite.sql", import.meta.url),
    "utf8",
  );
  for (const statement of schema
    .split(";")
    .map((sql) => sql.trim())
    .filter(Boolean))
    db.exec(statement);

  db.exec(
    "CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL)",
  );
  const applied = db.get(
    "SELECT version FROM schema_migrations WHERE version=1",
  );
  if (!applied) {
    const columns = new Set(
      db.all("PRAGMA table_info(paypal_orders)").map((column) => column.name),
    );
    if (!columns.has("request_key")) {
      db.exec("ALTER TABLE paypal_orders ADD COLUMN request_key TEXT");
      db.exec(
        "UPDATE paypal_orders SET request_key='legacy:' || id WHERE request_key IS NULL",
      );
    }
    if (!columns.has("approve_url"))
      db.exec("ALTER TABLE paypal_orders ADD COLUMN approve_url TEXT");
    db.exec(
      "CREATE UNIQUE INDEX IF NOT EXISTS paypal_orders_request_key ON paypal_orders(request_key)",
    );
    db.run("INSERT INTO schema_migrations(version,applied_at) VALUES (1,?)", [
      now(),
    ]);
  }
  const columns = new Set(
    db.all("PRAGMA table_info(users)").map((column) => column.name),
  );
  if (!columns.has("stripe_customer_id"))
    db.exec("ALTER TABLE users ADD COLUMN stripe_customer_id TEXT");
  db.run(
    "INSERT OR IGNORE INTO schema_migrations(version,applied_at) VALUES (2,?)",
    [now()],
  );
}
