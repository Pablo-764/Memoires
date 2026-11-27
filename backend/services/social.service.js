import { randomUUID } from "node:crypto";
import { fail } from "../middleware/errors.js";
import { integer, object, text } from "../middleware/validate.js";
import { now } from "../models/base.model.js";

const TIERS = {
  free: { likes: 20, golden: 1 },
  grand: { likes: 50, golden: 3 },
  lucidite: { likes: 100, golden: 7 },
};
const pair = (a, b) => (a < b ? [a, b] : [b, a]);
const week = () => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
};
const cleanProfile = (data) => {
  const p = JSON.parse(data);
  for (const k of ["email", "phone", "password", "verified", "idVerified"])
    delete p[k];
  return p;
};
const publicProfile = (db, id, viewer) => {
  const u = db.get("SELECT id,tier,verified,status FROM users WHERE id=?", [
      id,
    ]),
    row = db.get("SELECT data FROM profiles WHERE user_id=?", [id]);
  if (!u || !row || u.status !== "active") return null;
  const p = cleanProfile(row.data),
    settings = JSON.parse(
      db.get("SELECT data FROM user_settings WHERE user_id=?", [id])?.data ||
        "{}",
    );
  if (id !== viewer && settings.quienVe === "nadie") return null;
  if (
    id !== viewer &&
    settings.quienVe === "intereses" &&
    !connected(db, id, viewer)
  ) {
    const viewerProfile = JSON.parse(
      db.get("SELECT data FROM profiles WHERE user_id=?", [viewer])?.data ||
        "{}",
    );
    if (
      !(p.interests || []).some((interest) =>
        (viewerProfile.interests || []).includes(interest),
      )
    )
      return null;
  }
  if (id !== viewer) {
    if (settings.mostrarEdad === false) delete p.age;
    if (settings.mostrarZona === false) delete p.zone;
  }
  return { id: String(id), ...p, verified: !!u.verified, tier: u.tier };
};
const requireVerified = (db, id) => {
  if (!db.get("SELECT id FROM users WHERE id=? AND verified=1", [id]))
    throw fail(
      403,
      "Completa la verificación de perfil para usar esta función.",
    );
};
const connected = (db, a, b) => {
  const [lo, hi] = pair(a, b);
  return !!db.get(
    "SELECT 1 FROM connections WHERE user_low=? AND user_high=?",
    [lo, hi],
  );
};

export const socialService = (db) => ({
  userProfile(viewerId, targetId) {
    const id = integer(Number(targetId), "Perfil", 1, Number.MAX_SAFE_INTEGER);
    if (
      db.get(
        "SELECT 1 FROM blocks WHERE (blocker_id=? AND blocked_id=?) OR (blocker_id=? AND blocked_id=?)",
        [viewerId, id, id, viewerId],
      )
    )
      throw fail(404, "Perfil no encontrado.");
    const profile = publicProfile(db, id, viewerId);
    if (!profile) throw fail(404, "Perfil no encontrado.");
    return profile;
  },
  discover(userId, query = {}) {
    const tier =
      db.get("SELECT tier FROM users WHERE id=?", [userId])?.tier || "free";
    const gated = {
      age: ["grand", "lucidite"],
      ageMin: ["grand", "lucidite"],
      ageMax: ["grand", "lucidite"],
      interests: ["grand", "lucidite"],
      availability: ["lucidite"],
      languages: ["lucidite"],
      verified: ["lucidite"],
    };
    for (const [filter, tiers] of Object.entries(gated))
      if (query[filter] !== undefined && !tiers.includes(tier))
        throw fail(403, "Este filtro requiere otro plan.");
    const rows = db.all(
      "SELECT u.id,u.tier,u.verified,p.data FROM users u JOIN profiles p ON p.user_id=u.id WHERE u.status='active' AND u.id<>? AND NOT EXISTS (SELECT 1 FROM decisions d WHERE d.actor_id=? AND d.target_id=u.id) AND NOT EXISTS (SELECT 1 FROM blocks b WHERE (b.blocker_id=? AND b.blocked_id=u.id) OR (b.blocker_id=u.id AND b.blocked_id=?))",
      [userId, userId, userId, userId],
    );
    const intents = Array.isArray(query.intent)
      ? query.intent
      : query.intent
        ? [query.intent]
        : [];
    const interests = Array.isArray(query.interests)
      ? query.interests
      : query.interests
        ? [query.interests]
        : [];
    const languages = Array.isArray(query.languages)
      ? query.languages
      : query.languages
        ? [query.languages]
        : [];
    const minAge =
        query.ageMin === undefined ? undefined : Number(query.ageMin),
      maxAge = query.ageMax === undefined ? undefined : Number(query.ageMax);
    const exactAge = query.age === undefined ? undefined : Number(query.age);
    if (
      query.verified !== undefined &&
      !["true", "false"].includes(query.verified)
    )
      throw fail(400, "Filtro de verificación inválido.");
    const limit = query.limit === undefined ? 30 : Number(query.limit);
    if (!Number.isInteger(limit) || limit < 1 || limit > 100)
      throw fail(400, "Límite de resultados inválido.");
    if (
      intents.some(
        (intent) => !["friend", "plan", "hobby", "romance"].includes(intent),
      )
    )
      throw fail(400, "Intención inválida.");
    if (
      (minAge !== undefined && !Number.isInteger(minAge)) ||
      (maxAge !== undefined && !Number.isInteger(maxAge)) ||
      (exactAge !== undefined && !Number.isInteger(exactAge)) ||
      (minAge !== undefined && maxAge !== undefined && minAge > maxAge)
    )
      throw fail(400, "Rango de edad inválido.");
    return rows
      .map((r) => publicProfile(db, r.id, userId))
      .filter((p) => {
        if (!p) return false;
        if (
          (p.age !== undefined && p.age < 18) ||
          (query.city && p.city !== query.city)
        )
          return false;
        if (intents.length && !p.intents?.some((i) => intents.includes(i)))
          return false;
        if (
          (minAge !== undefined || maxAge !== undefined) &&
          p.age === undefined
        )
          return false;
        if (
          (minAge !== undefined && p.age < minAge) ||
          (maxAge !== undefined && p.age > maxAge)
        )
          return false;
        if (exactAge !== undefined && p.age !== exactAge) return false;
        if (
          interests.length &&
          !p.interests?.some((i) => interests.includes(i))
        )
          return false;
        if (query.availability && p.availability !== query.availability)
          return false;
        if (
          languages.length &&
          !p.languages?.some((i) => languages.includes(i))
        )
          return false;
        if (
          (query.verified === "true" && !p.verified) ||
          (query.verified === "false" && p.verified)
        )
          return false;
        return true;
      })
      .slice(0, limit);
  },
  decide(userId, targetId, body = {}) {
    object(body);
    const target = integer(
      Number(targetId),
      "Perfil",
      1,
      Number.MAX_SAFE_INTEGER,
    );
    const decision = body.decision;
    if (target === userId)
      throw fail(400, "No puedes elegir tu propio perfil.");
    if (!["like", "pass"].includes(decision))
      throw fail(400, "decision debe ser like o pass.");
    if (body.golden !== undefined && typeof body.golden !== "boolean")
      throw fail(400, "golden debe ser booleano.");
    if (body.golden && decision !== "like")
      throw fail(400, "Un hilo dorado solo puede enviarse como interés.");
    if (body.golden && !String(body.comment || "").trim())
      throw fail(400, "Un hilo dorado necesita un comentario.");
    if (
      !db.get("SELECT id FROM users WHERE id=? AND status='active'", [target])
    )
      throw fail(404, "Perfil no encontrado.");
    if (
      db.get(
        "SELECT 1 FROM blocks WHERE (blocker_id=? AND blocked_id=?) OR (blocker_id=? AND blocked_id=?)",
        [userId, target, target, userId],
      )
    ) {
      throw fail(403, "No puedes interactuar con esta cuenta.");
    }
    if (decision === "like") requireVerified(db, userId);
    return db.transaction(() => {
      const prior = db.get(
        "SELECT decision FROM decisions WHERE actor_id=? AND target_id=?",
        [userId, target],
      );
      if (prior?.decision === "like")
        return { status: connected(db, userId, target) ? "match" : "liked" };
      if (decision === "like") {
        const tier =
          db.get("SELECT tier FROM users WHERE id=?", [userId])?.tier || "free";
        const day = now().slice(0, 10);
        const likes =
          db.get("SELECT likes FROM daily_usage WHERE user_id=? AND day=?", [
            userId,
            day,
          ])?.likes || 0;
        if (likes >= TIERS[tier].likes)
          throw fail(429, "Llegaste al límite diario de intereses.");
        if (body.golden) {
          const used =
            db.get(
              "SELECT golden FROM weekly_usage WHERE user_id=? AND week=?",
              [userId, week()],
            )?.golden || 0;
          if (used >= TIERS[tier].golden)
            throw fail(429, "Llegaste al límite semanal de hilos dorados.");
          const about = text(body.about || "tu perfil", "Referencia", 1, 120);
          const comment = text(body.comment, "Comentario", 1, 500);
          db.run(
            "INSERT INTO golden_likes(sender_id,recipient_id,note,created_at) VALUES (?,?,?,?) ON CONFLICT(sender_id,recipient_id) DO UPDATE SET note=excluded.note,created_at=excluded.created_at",
            [userId, target, "Sobre " + about + ": " + comment, now()],
          );
          db.run(
            "INSERT INTO weekly_usage(user_id,week,golden) VALUES (?,?,1) ON CONFLICT(user_id,week) DO UPDATE SET golden=golden+1",
            [userId, week()],
          );
        }
        db.run(
          "INSERT INTO daily_usage(user_id,day,likes) VALUES (?,?,1) ON CONFLICT(user_id,day) DO UPDATE SET likes=likes+1",
          [userId, day],
        );
      }
      db.run(
        "INSERT INTO decisions(actor_id,target_id,decision,created_at) VALUES (?,?,?,?) ON CONFLICT(actor_id,target_id) DO UPDATE SET decision=excluded.decision,created_at=excluded.created_at",
        [userId, target, decision, now()],
      );
      const mutual =
        decision === "like" &&
        !!db.get(
          "SELECT 1 FROM decisions WHERE actor_id=? AND target_id=? AND decision='like'",
          [target, userId],
        );
      if (mutual) {
        const [low, high] = pair(userId, target);
        db.run(
          "INSERT OR IGNORE INTO connections(user_low,user_high,created_at) VALUES (?,?,?)",
          [low, high, now()],
        );
        const incoming = db.get(
          "SELECT * FROM golden_likes WHERE sender_id=? AND recipient_id=?",
          [target, userId],
        );
        if (incoming) {
          db.run(
            "INSERT INTO messages(id,sender_id,recipient_id,body,created_at) VALUES (?,?,?,?,?)",
            [randomUUID(), target, userId, incoming.note, incoming.created_at],
          );
          db.run(
            "DELETE FROM golden_likes WHERE sender_id=? AND recipient_id=?",
            [target, userId],
          );
        }
        if (body.golden) {
          const outgoing = db.get(
            "SELECT note,created_at FROM golden_likes WHERE sender_id=? AND recipient_id=?",
            [userId, target],
          );
          db.run(
            "INSERT INTO messages(id,sender_id,recipient_id,body,created_at) VALUES (?,?,?,?,?)",
            [randomUUID(), userId, target, outgoing.note, outgoing.created_at],
          );
          db.run(
            "DELETE FROM golden_likes WHERE sender_id=? AND recipient_id=?",
            [userId, target],
          );
        } else if (body.comment) {
          const about = text(body.about || "tu perfil", "Referencia", 1, 120);
          const comment = text(body.comment, "Comentario", 1, 500);
          db.run(
            "INSERT INTO messages(id,sender_id,recipient_id,body,created_at) VALUES (?,?,?,?,?)",
            [
              randomUUID(),
              userId,
              target,
              "Sobre " + about + ": " + comment,
              now(),
            ],
          );
        }
      }
      return {
        status: mutual ? "match" : decision === "like" ? "liked" : "passed",
      };
    });
  },
  incomingLikes(userId) {
    const tier =
      db.get("SELECT tier FROM users WHERE id=?", [userId])?.tier || "free";
    if (!["grand", "lucidite"].includes(tier))
      throw fail(403, "Ver quién te dio interés requiere Grand o Lucidité.");
    return db
      .all(
        "SELECT d.actor_id,g.note,d.created_at FROM decisions d LEFT JOIN golden_likes g ON g.sender_id=d.actor_id AND g.recipient_id=d.target_id WHERE d.target_id=? AND d.decision='like' AND NOT EXISTS (SELECT 1 FROM connections c WHERE c.user_low=MIN(d.actor_id,d.target_id) AND c.user_high=MAX(d.actor_id,d.target_id)) AND NOT EXISTS (SELECT 1 FROM blocks b WHERE (b.blocker_id=d.actor_id AND b.blocked_id=d.target_id) OR (b.blocker_id=d.target_id AND b.blocked_id=d.actor_id)) ORDER BY d.created_at DESC LIMIT 100",
        [userId],
      )
      .map((item) => ({
        profile: publicProfile(db, item.actor_id, userId),
        note: item.note || null,
        createdAt: item.created_at,
      }))
      .filter((item) => item.profile);
  },
  connections(userId) {
    const rows = db.all(
      "SELECT CASE WHEN user_low=? THEN user_high ELSE user_low END AS other_id,created_at FROM connections WHERE user_low=? OR user_high=? ORDER BY created_at DESC",
      [userId, userId, userId],
    );
    return rows
      .map((r) => ({
        profile: publicProfile(db, r.other_id, userId),
        createdAt: r.created_at,
        lastMessage: db.get(
          "SELECT body,created_at FROM messages WHERE (sender_id=? AND recipient_id=?) OR (sender_id=? AND recipient_id=?) ORDER BY created_at DESC LIMIT 1",
          [userId, r.other_id, r.other_id, userId],
        ),
      }))
      .filter((x) => x.profile);
  },
  removeConnection(userId, target) {
    if (!connected(db, userId, target))
      throw fail(404, "Conexión no encontrada.");
    const [lo, hi] = pair(userId, target);
    db.transaction(() => {
      db.run("DELETE FROM connections WHERE user_low=? AND user_high=?", [
        lo,
        hi,
      ]);
      db.run(
        "DELETE FROM messages WHERE (sender_id=? AND recipient_id=?) OR (sender_id=? AND recipient_id=?)",
        [userId, target, target, userId],
      );
    });
    return { mensaje: "Conexión eliminada." };
  },
  messages(userId, target) {
    const otherId = integer(
      Number(target),
      "Perfil",
      1,
      Number.MAX_SAFE_INTEGER,
    );
    if (!connected(db, userId, otherId))
      throw fail(403, "Solo puedes ver chats de tus conexiones.");
    db.run(
      "UPDATE messages SET read_at=? WHERE sender_id=? AND recipient_id=? AND read_at IS NULL",
      [now(), otherId, userId],
    );
    return db
      .all(
        "SELECT m.id, CASE WHEN m.sender_id=? THEN 'me' ELSE CAST(m.sender_id AS TEXT) END AS \"from\", m.body AS text, m.created_at AS at, m.plan_json AS plan FROM messages m WHERE ((m.sender_id=? AND m.recipient_id=?) OR (m.sender_id=? AND m.recipient_id=?)) AND NOT EXISTS (SELECT 1 FROM hidden_messages h WHERE h.user_id=? AND h.message_id=m.id) ORDER BY m.created_at",
        [userId, userId, otherId, otherId, userId, userId],
      )
      .map((message) => ({
        id: message.id,
        from: message.from,
        text: message.text,
        at: Date.parse(message.at),
        ...(message.plan ? { plan: JSON.parse(message.plan) } : {}),
      }));
  },
  sendMessage(userId, target, body) {
    object(body);
    const otherId = integer(
      Number(target),
      "Perfil",
      1,
      Number.MAX_SAFE_INTEGER,
    );
    requireVerified(db, userId);
    if (!connected(db, userId, otherId))
      throw fail(403, "Solo puedes escribir a tus conexiones.");
    let plan = null;
    let messageText = body.text;
    if (body.plan !== undefined) {
      object(body.plan);
      plan = {
        title: text(body.plan.title, "Nombre del plan", 3, 100),
        when: text(body.plan.when, "Fecha", 8, 80),
        place: text(body.plan.place, "Lugar", 2, 180),
        intent: text(body.plan.intent, "Intención", 2, 30),
        status: "propuesto",
      };
      messageText = messageText || "Te propongo: " + plan.title;
    }
    messageText = text(messageText, "Mensaje", 1, 2000);
    const result = {
      id: randomUUID(),
      from: "me",
      text: messageText,
      at: Date.now(),
      ...(plan ? { plan } : {}),
    };
    db.run(
      "INSERT INTO messages(id,sender_id,recipient_id,body,plan_json,created_at) VALUES (?,?,?,?,?,?)",
      [
        result.id,
        userId,
        otherId,
        messageText,
        plan ? JSON.stringify(plan) : null,
        now(),
      ],
    );
    return result;
  },
  respondPlan(userId, target, messageId, body) {
    object(body);
    const otherId = integer(
      Number(target),
      "Perfil",
      1,
      Number.MAX_SAFE_INTEGER,
    );
    if (!connected(db, userId, otherId))
      throw fail(403, "Solo puedes responder a tus conexiones.");
    const message = db.get(
      "SELECT * FROM messages WHERE id=? AND ((sender_id=? AND recipient_id=?) OR (sender_id=? AND recipient_id=?))",
      [messageId, userId, otherId, otherId, userId],
    );
    if (!message?.plan_json)
      throw fail(404, "Propuesta de plan no encontrada.");
    const proposal = JSON.parse(message.plan_json);
    if (body.action === "accept") {
      if (message.recipient_id !== userId)
        throw fail(
          403,
          "Solo la persona que recibió la propuesta puede aceptarla.",
        );
      if (!["propuesto", "movido"].includes(proposal.status))
        throw fail(409, "La propuesta ya fue respondida.");
      proposal.status = "aceptado";
    } else if (body.action === "move") {
      if (message.sender_id !== userId)
        throw fail(403, "Solo quien propuso el plan puede moverlo.");
      const startsAt = new Date(text(body.when, "Fecha", 8, 80));
      if (Number.isNaN(startsAt.getTime()) || startsAt <= new Date())
        throw fail(400, "La nueva fecha debe ser futura.");
      proposal.when = startsAt.toISOString();
      proposal.status = "movido";
    } else {
      throw fail(400, "action debe ser accept o move.");
    }
    db.run("UPDATE messages SET plan_json=? WHERE id=?", [
      JSON.stringify(proposal),
      messageId,
    ]);
    return { id: messageId, plan: proposal };
  },
  clearChat(userId, target) {
    const otherId = integer(
      Number(target),
      "Perfil",
      1,
      Number.MAX_SAFE_INTEGER,
    );
    if (!connected(db, userId, otherId))
      throw fail(404, "Conexión no encontrada.");
    db.run(
      "INSERT OR IGNORE INTO hidden_messages(user_id,message_id) SELECT ?,id FROM messages WHERE (sender_id=? AND recipient_id=?) OR (sender_id=? AND recipient_id=?)",
      [userId, userId, otherId, otherId, userId],
    );
    return { mensaje: "Tus mensajes se ocultaron de tu bandeja." };
  },
  block(userId, target) {
    const id = integer(Number(target), "Perfil", 1, Number.MAX_SAFE_INTEGER);
    if (id === userId) throw fail(400, "No puedes bloquearte.");
    if (!db.get("SELECT id FROM users WHERE id=?", [id]))
      throw fail(404, "Perfil no encontrado.");
    const [lo, hi] = pair(userId, id);
    db.transaction(() => {
      db.run(
        "INSERT OR IGNORE INTO blocks(blocker_id,blocked_id,created_at) VALUES (?,?,?)",
        [userId, id, now()],
      );
      db.run("DELETE FROM connections WHERE user_low=? AND user_high=?", [
        lo,
        hi,
      ]);
      db.run(
        "DELETE FROM messages WHERE (sender_id=? AND recipient_id=?) OR (sender_id=? AND recipient_id=?)",
        [userId, id, id, userId],
      );
    });
    return { mensaje: "Cuenta bloqueada." };
  },
  report(userId, target, body = {}) {
    object(body);
    const id = integer(Number(target), "Perfil", 1, Number.MAX_SAFE_INTEGER);
    const reason = text(body.reason, "Motivo", 2, 100),
      detail = body.detail ? text(body.detail, "Detalle", 0, 1000) : "";
    if (id === userId) throw fail(400, "No puedes reportar tu propia cuenta.");
    if (!db.get("SELECT id FROM users WHERE id=?", [id]))
      throw fail(404, "Perfil no encontrado.");
    const reportId = randomUUID();
    db.run(
      "INSERT INTO reports(id,reporter_id,reported_id,reason,detail,created_at) VALUES (?,?,?,?,?,?)",
      [reportId, userId, id, reason, detail, now()],
    );
    return { id: reportId, status: "pendiente" };
  },
  settings(userId, patch) {
    object(patch);
    const allowed = [
      "quienVe",
      "mostrarEdad",
      "mostrarZona",
      "leido",
      "avisosConexion",
      "avisosPlanes",
      "resumenSemanal",
    ];
    if (Object.keys(patch).some((k) => !allowed.includes(k)))
      throw fail(400, "Hay una preferencia no reconocida.");
    if (
      patch.quienVe !== undefined &&
      !["todos", "intereses", "nadie"].includes(patch.quienVe)
    )
      throw fail(400, "Preferencia de privacidad inválida.");
    for (const k of allowed.filter((k) => k !== "quienVe"))
      if (patch[k] !== undefined && typeof patch[k] !== "boolean")
        throw fail(400, `La preferencia ${k} debe ser booleana.`);
    const row = db.get("SELECT data FROM user_settings WHERE user_id=?", [
      userId,
    ]);
    const s = { ...JSON.parse(row?.data || "{}"), ...patch };
    db.run(
      "INSERT INTO user_settings(user_id,data) VALUES (?,?) ON CONFLICT(user_id) DO UPDATE SET data=excluded.data",
      [userId, JSON.stringify(s)],
    );
    return s;
  },
  plans(userId) {
    const own = JSON.parse(
      db.get("SELECT data FROM profiles WHERE user_id=?", [userId])?.data ||
        "{}",
    );
    const rows = db.all(
      "SELECT p.*, EXISTS(SELECT 1 FROM plan_attendees a WHERE a.plan_id=p.id AND a.user_id=?) AS joined FROM plans p JOIN users u ON u.id=p.host_id WHERE p.status='open' AND p.starts_at>=? ORDER BY p.starts_at LIMIT 100",
      [userId, now()],
    );
    return rows
      .map((r) => {
        const host =
          r.host_id === userId ? null : publicProfile(db, r.host_id, userId);
        const attendees = db
          .all("SELECT user_id FROM plan_attendees WHERE plan_id=?", [r.id])
          .map((a) => (a.user_id === userId ? "me" : String(a.user_id)));
        return {
          id: r.id,
          title: r.title,
          description: r.description,
          place: r.place,
          when: r.starts_at,
          hostId: r.host_id === userId ? "me" : String(r.host_id),
          intent: r.intent,
          capacity: r.capacity,
          audience: r.audience,
          attendees,
          joined: !!r.joined,
          host,
        };
      })
      .filter((plan) => {
        if (plan.hostId === "me") return true;
        if (!plan.host) return false;
        const hostId = Number(plan.hostId);
        if (
          db.get(
            "SELECT 1 FROM blocks WHERE (blocker_id=? AND blocked_id=?) OR (blocker_id=? AND blocked_id=?)",
            [userId, hostId, hostId, userId],
          )
        )
          return false;
        if (plan.audience === "intent" && !own.intents?.includes(plan.intent))
          return false;
        if (
          plan.audience === "interests" &&
          !plan.host.interests?.some((i) => own.interests?.includes(i))
        )
          return false;
        return true;
      });
  },
  createPlan(userId, body = {}) {
    object(body);
    requireVerified(db, userId);
    const title = text(body.title, "Nombre del plan", 3, 100);
    const description = body.description
      ? text(body.description, "Descripción", 0, 1000)
      : "";
    const place = text(body.place, "Lugar", 2, 180);
    const startsAt = new Date(text(body.when, "Fecha", 8, 80));
    const capacity = integer(Number(body.capacity), "Capacidad", 2, 50);
    const intent = text(body.intent, "Intención", 2, 30);
    const audience = body.audience || "any";
    if (
      !["friend", "plan", "hobby", "romance"].includes(intent) ||
      !["any", "intent", "interests"].includes(audience)
    ) {
      throw fail(400, "Intención o público del plan inválido.");
    }
    if (
      !/^\d{4}-\d\d-\d\dT.*(?:Z|[+-]\d\d:\d\d)$/.test(body.when) ||
      Number.isNaN(startsAt.getTime()) ||
      startsAt <= new Date()
    ) {
      throw fail(400, "La fecha debe ser futura y usar formato ISO 8601.");
    }
    const tier =
      db.get("SELECT tier FROM users WHERE id=?", [userId])?.tier || "free";
    const quota = { free: 2, grand: 6, lucidite: Infinity }[tier];
    const month = now().slice(0, 7);
    const created = db.get(
      "SELECT COUNT(*) AS n FROM plans WHERE host_id=? AND substr(created_at,1,7)=?",
      [userId, month],
    ).n;
    if (created >= quota)
      throw fail(
        403,
        "Llegaste al límite mensual de planes de tu suscripción.",
      );
    const id = randomUUID();
    db.transaction(() => {
      db.run(
        "INSERT INTO plans(id,host_id,title,description,place,starts_at,intent,capacity,audience,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
        [
          id,
          userId,
          title,
          description,
          place,
          startsAt.toISOString(),
          intent,
          capacity,
          audience,
          now(),
        ],
      );
      db.run(
        "INSERT INTO plan_attendees(plan_id,user_id,created_at) VALUES (?,?,?)",
        [id, userId, now()],
      );
    });
    return {
      id,
      title,
      description,
      place,
      when: startsAt.toISOString(),
      hostId: "me",
      intent,
      capacity,
      audience,
      attendees: ["me"],
    };
  },
  joinPlan(userId, planId) {
    requireVerified(db, userId);
    return db.transaction(() => {
      const plan = db.get("SELECT * FROM plans WHERE id=? AND status='open'", [
        planId,
      ]);
      if (!plan) throw fail(404, "Plan no encontrado.");
      if (new Date(plan.starts_at) <= new Date())
        throw fail(409, "Este plan ya empezó.");
      if (plan.host_id === userId) return { joined: true };
      if (
        db.get(
          "SELECT 1 FROM blocks WHERE (blocker_id=? AND blocked_id=?) OR (blocker_id=? AND blocked_id=?)",
          [userId, plan.host_id, plan.host_id, userId],
        )
      ) {
        throw fail(403, "No puedes unirte a este plan.");
      }
      const own = JSON.parse(
        db.get("SELECT data FROM profiles WHERE user_id=?", [userId])?.data ||
          "{}",
      );
      const host = JSON.parse(
        db.get("SELECT data FROM profiles WHERE user_id=?", [plan.host_id])
          ?.data || "{}",
      );
      if (plan.audience === "intent" && !own.intents?.includes(plan.intent))
        throw fail(403, "Este plan es para otra intención.");
      if (
        plan.audience === "interests" &&
        !host.interests?.some((i) => own.interests?.includes(i))
      )
        throw fail(403, "Comparte intereses con quien organiza para unirte.");
      const existing = db.get(
        "SELECT 1 FROM plan_attendees WHERE plan_id=? AND user_id=?",
        [planId, userId],
      );
      if (existing) {
        db.run("DELETE FROM plan_attendees WHERE plan_id=? AND user_id=?", [
          planId,
          userId,
        ]);
        return { joined: false };
      }
      const count = db.get(
        "SELECT COUNT(*) AS n FROM plan_attendees WHERE plan_id=?",
        [planId],
      ).n;
      if (count >= plan.capacity) throw fail(409, "El plan ya está completo.");
      db.run(
        "INSERT INTO plan_attendees(plan_id,user_id,created_at) VALUES (?,?,?)",
        [planId, userId, now()],
      );
      return { joined: true };
    });
  },
  adminReports() {
    return db.all(
      "SELECT r.*,a.email AS reporter_email,b.email AS reported_email FROM reports r JOIN users a ON a.id=r.reporter_id JOIN users b ON b.id=r.reported_id ORDER BY r.created_at DESC LIMIT 500",
    );
  },
  moderate(adminId, reportId, status) {
    if (!["descartado", "advertido", "suspendido"].includes(status))
      throw fail(400, "Estado de moderación inválido.");
    const r = db.get("SELECT * FROM reports WHERE id=?", [reportId]);
    if (!r) throw fail(404, "Reporte no encontrado.");
    db.transaction(() => {
      db.run(
        "UPDATE reports SET status=?,reviewed_at=?,reviewed_by=? WHERE id=?",
        [status, now(), adminId, reportId],
      );
      if (status === "suspendido")
        db.run(
          "UPDATE users SET status='suspended',session_version=session_version+1 WHERE id=?",
          [r.reported_id],
        );
    });
    return { id: reportId, status };
  },
  devVerify(userId) {
    if (process.env.NODE_ENV === "production")
      throw fail(404, "Ruta no encontrada.");
    db.run("UPDATE users SET verified=1 WHERE id=?", [userId]);
    return { verified: true };
  },
});
