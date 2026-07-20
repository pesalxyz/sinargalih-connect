const {
  ensureSchema,
  getPool,
  normalizeUsername,
  hashPassword,
  randomId,
  sendError
} = require("../lib/server");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    sendError(response, 405, "Method not allowed");
    return;
  }

  const name = String(request.body?.name || "").trim();
  const username = normalizeUsername(request.body?.username);
  const password = String(request.body?.password || "");

  if (!name || username.length < 4 || password.length < 6) {
    sendError(response, 400, "Nama, username, atau password belum valid.");
    return;
  }

  try {
    await ensureSchema();
    const db = getPool();
    const existing = await db.query(
      `SELECT username FROM admin_users WHERE username = $1
       UNION
       SELECT username FROM admin_requests WHERE username = $1`,
      [username]
    );
    if (existing.rows.length) {
      sendError(response, 409, "Username sudah dipakai atau sedang menunggu ACC.");
      return;
    }

    const { salt, hash } = hashPassword(password);
    await db.query(
      `INSERT INTO admin_requests (id, name, username, password_hash, password_salt)
       VALUES ($1, $2, $3, $4, $5)`,
      [randomId("admin-request"), name, username, hash, salt]
    );

    response.status(201).json({ ok: true });
  } catch (error) {
    sendError(response, 500, error.message || "Request akun belum dapat dikirim.");
  }
};
