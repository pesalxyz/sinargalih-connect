const { sendError } = require("../lib/server");

module.exports = function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    sendError(response, 405, "Method not allowed");
    return;
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    sendError(response, 500, "GOOGLE_MAPS_API_KEY belum diatur.");
    return;
  }

  response.status(200).json({ apiKey });
};
