import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { config } from "./env.js";

export function createDatabase(file = config.sqliteFile) {
  if (file !== ":memory:") mkdirSync(dirname(file), { recursive: true });
  const sqlite = new DatabaseSync(file);
  sqlite.exec(
    "PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;",
  );
  const api = {
    dialect: "sqlite",
    all(sql, args = []) {
      return sqlite.prepare(sql).all(...args);
    },
    get(sql, args = []) {
      return sqlite.prepare(sql).get(...args);
    },
    run(sql, args = []) {
      const r = sqlite.prepare(sql).run(...args);
      return { id: Number(r.lastInsertRowid), changes: Number(r.changes) };
    },
    exec(sql) {
      sqlite.exec(sql);
    },
    transaction(work) {
      sqlite.exec("BEGIN IMMEDIATE");
      try {
        const value = work(api);
        sqlite.exec("COMMIT");
        return value;
      } catch (e) {
        sqlite.exec("ROLLBACK");
        throw e;
      }
    },
    close() {
      sqlite.close();
    },
  };
  return api;
}
