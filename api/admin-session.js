const { requireAdmin, sendError } = require("../lib/server");

module.exports = async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    sendError(response, 405, "Method not allowed");
    return;
  }

  try {
    const user = await requireAdmin(request);
    if (!user) {
      sendError(response, 401, "Silakan login dulu.");
      return;
    }

    response.status(200).json({ user });
  } catch (error) {
    sendError(response, 500, error.message || "Sesi belum dapat diperiksa.");
  }
};
