export const now = () => new Date().toISOString();
export const publicUser = (row) => ({
  id: row.id,
  email: row.email,
  phone: row.phone,
  role: row.role,
  status: row.status,
  tier: row.tier,
  verified: !!row.verified,
  createdAt: row.created_at,
});
export const profileModel = (db) => ({
  user: (id) => db.get("SELECT * FROM users WHERE id=?", [id]),
  profile: (id) => db.get("SELECT data FROM profiles WHERE user_id=?", [id]),
  publicProfile(id) {
    const u = this.user(id),
      p = this.profile(id);
    return u && p
      ? {
          id: String(id),
          ...JSON.parse(p.data),
          verified: !!u.verified,
          tier: u.tier,
        }
      : null;
  },
});
