import { config, validateConfig } from "../config/env.js";
import { createDatabase } from "../config/database.js";
import { initializeDatabase } from "../database/initialize.js";
import bcrypt from "bcryptjs";
import { now } from "../models/base.model.js";
validateConfig();
const db = createDatabase();
try {
  await initializeDatabase(db);
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase(),
    password = process.env.SEED_ADMIN_PASSWORD;
  if (email || password) {
    if (!email || !password || password.length < 12)
      throw new Error(
        "Define SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD (mínimo 12 caracteres) para crear al moderador.",
      );
    const hash = await bcrypt.hash(password, 12);
    db.transaction(() => {
      let u = db.get("SELECT id FROM users WHERE email=?", [email]);
      if (!u) {
        const r = db.run(
          "INSERT INTO users(email,password_hash,role,status,created_at) VALUES (?,?, 'admin','active',?)",
          [email, hash, now()],
        );
        u = { id: r.id };
        db.run("INSERT INTO profiles(user_id,data,updated_at) VALUES (?,?,?)", [
          u.id,
          JSON.stringify({
            name: "Moderación",
            age: 18,
            city: "",
            bio: "",
            intents: [],
            interests: [],
          }),
          now(),
        ]);
        db.run("INSERT INTO user_settings(user_id,data) VALUES (?,?)", [
          u.id,
          "{}",
        ]);
      } else db.run("UPDATE users SET role='admin' WHERE id=?", [u.id]);
    });
  }
  console.log("Base de datos lista.");
} finally {
  db.close();
}
