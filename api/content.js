const { getContentData, sendError } = require("../lib/server");

module.exports = async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    sendError(response, 405, "Method not allowed");
    return;
  }

  try {
    response.status(200).json(await getContentData());
  } catch (error) {
    sendError(response, 500, error.message || "Data konten belum dapat dimuat.");
  }
};
