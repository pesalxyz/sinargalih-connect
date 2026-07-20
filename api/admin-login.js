const {
  ensureSchema,
  getPool,
  normalizeUsername,
  verifyPassword,
  signToken,
  sendError
} = require("../lib/server");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    sendError(response, 405, "Method not allowed");
    return;
  }

  const username = normalizeUsername(request.body?.username);
  const password = String(request.body?.password || "");

  try {
    await ensureSchema();
    const db = getPool();
    const { rows } = await db.query(
      "SELECT id, name, username, password_hash, password_salt FROM admin_users WHERE username = $1",
      [username]
    );
    const user = rows[0];

    if (!user || !verifyPassword(password, user.password_salt, user.password_hash)) {
      sendError(response, 401, "Username atau password salah.");
      return;
    }

    const token = signToken({
      sub: user.id,
      username: user.username,
      exp: Date.now() + 1000 * 60 * 60 * 8
    });

    response.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username
      }
    });
  } catch (error) {
    sendError(response, 500, error.message || "Login belum dapat diproses.");
  }
};
