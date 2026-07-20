const { getPool, requireAdmin, randomId, sendError } = require("../lib/server");

module.exports = async function handler(request, response) {
  const admin = await requireAdmin(request).catch((error) => {
    response.status(500).json({ error: error.message || "Database belum siap." });
    return null;
  });
  if (!admin) {
    if (!response.headersSent) {
      sendError(response, 401, "Silakan login dulu.");
    }
    return;
  }

  const db = getPool();

  if (request.method === "GET") {
    const [users, requests] = await Promise.all([
      db.query("SELECT id, name, username, created_at FROM admin_users ORDER BY created_at"),
      db.query("SELECT id, name, username, requested_at FROM admin_requests ORDER BY requested_at DESC")
    ]);
    response.status(200).json({ users: users.rows, requests: requests.rows });
    return;
  }

  if (request.method === "POST") {
    const { action, requestId } = request.body || {};
    const { rows } = await db.query("SELECT * FROM admin_requests WHERE id = $1", [requestId]);
    const pending = rows[0];
    if (!pending) {
      sendError(response, 404, "Request akun tidak ditemukan.");
      return;
    }

    if (action === "approve") {
      await db.query(
        `INSERT INTO admin_users (id, name, username, password_hash, password_salt)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (username) DO NOTHING`,
        [randomId("admin"), pending.name, pending.username, pending.password_hash, pending.password_salt]
      );
    } else if (action !== "reject") {
      sendError(response, 400, "Aksi tidak valid.");
      return;
    }

    await db.query("DELETE FROM admin_requests WHERE id = $1", [requestId]);
    response.status(200).json({ ok: true });
    return;
  }

  response.setHeader("Allow", "GET, POST");
  sendError(response, 405, "Method not allowed");
};
