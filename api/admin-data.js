const {
  getContentData,
  replaceContentTable,
  requireAdmin,
  sendError
} = require("../lib/server");

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

  if (request.method === "GET") {
    response.status(200).json(await getContentData());
    return;
  }

  if (request.method === "PUT") {
    const table = String(request.body?.table || "");
    const items = request.body?.items;
    if (!Array.isArray(items)) {
      sendError(response, 400, "Data tabel tidak valid.");
      return;
    }

    try {
      await replaceContentTable(table, items);
      response.status(200).json(await getContentData());
    } catch (error) {
      sendError(response, 400, error.message || "Data belum dapat disimpan.");
    }
    return;
  }

  response.setHeader("Allow", "GET, PUT");
  sendError(response, 405, "Method not allowed");
};
