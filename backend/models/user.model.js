import { now } from "./base.model.js";

export const userModel = (db) => ({
  byId: (id) => db.get("SELECT * FROM users WHERE id=?", [id]),
  byContact: ({ email, phone }) =>
    db.get("SELECT * FROM users WHERE email=? OR phone=?", [email, phone]),
  profile: (id) => db.get("SELECT data FROM profiles WHERE user_id=?", [id]),
  settings: (id) =>
    db.get("SELECT data FROM user_settings WHERE user_id=?", [id]),
  create: ({ email, phone, passwordHash, profile, settings }) =>
    db.transaction(() => {
      const result = db.run(
        "INSERT INTO users(email,phone,password_hash,created_at) VALUES (?,?,?,?)",
        [email, phone, passwordHash, now()],
      );
      db.run("INSERT INTO profiles(user_id,data,updated_at) VALUES (?,?,?)", [
        result.id,
        JSON.stringify(profile),
        now(),
      ]);
      db.run("INSERT INTO user_settings(user_id,data) VALUES (?,?)", [
        result.id,
        JSON.stringify(settings),
      ]);
      return result.id;
    }),
  saveProfile: (id, profile) =>
    db.run("UPDATE profiles SET data=?,updated_at=? WHERE user_id=?", [
      JSON.stringify(profile),
      now(),
      id,
    ]),
  saveSettings: (id, settings) =>
    db.run(
      "INSERT INTO user_settings(user_id,data) VALUES (?,?) ON CONFLICT(user_id) DO UPDATE SET data=excluded.data",
      [id, JSON.stringify(settings)],
    ),
  revoke: (id) =>
    db.run("UPDATE users SET session_version=session_version+1 WHERE id=?", [
      id,
    ]),
  delete: (id) => db.run("DELETE FROM users WHERE id=?", [id]),
  tierSubscription: (id) =>
    db.get(
      "SELECT expires_at FROM subscriptions WHERE user_id=? AND status IN ('active','cancel_at_period_end') ORDER BY id DESC LIMIT 1",
      [id],
    ),
  expireTier: (id, at) =>
    db.transaction(() => {
      db.run(
        "UPDATE subscriptions SET status='expired' WHERE user_id=? AND status IN ('active','cancel_at_period_end') AND expires_at<=?",
        [id, at],
      );
      db.run("UPDATE users SET tier='free' WHERE id=?", [id]);
    }),
});
