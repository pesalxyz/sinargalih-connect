const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

function normalizeHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter((item) => item && typeof item.text === "string")
    .slice(-10)
    .map((item) => ({
      role: item.role === "user" ? "user" : "model",
      parts: [{ text: item.text.slice(0, 1200) }]
    }));
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    response.status(500).json({ error: "GEMINI_API_KEY belum diatur." });
    return;
  }

  const { message, history } = request.body || {};
  const userMessage = String(message || "").trim();
  if (!userMessage) {
    response.status(400).json({ error: "Pesan tidak boleh kosong." });
    return;
  }

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text:
                  "Anda adalah Kang Galih, chatbot customer service untuk Website Resmi Desa Sinargalih, Kecamatan Maniis, Kabupaten Purwakarta. Perkenalkan diri sebagai Kang Galih jika pengguna bertanya siapa Anda. Jawab dalam bahasa Indonesia yang ramah, singkat, dan membantu. Bantu pengunjung memahami profil desa, berita, UMKM, kontak, dan peta desa. Jika pertanyaan membutuhkan keputusan resmi, dokumen pribadi, atau informasi yang belum tersedia di website, arahkan pengguna untuk menghubungi perangkat desa melalui halaman Kontak. Jangan mengarang nomor layanan baru."
              }
            ]
          },
          contents: [
            ...normalizeHistory(history),
            {
              role: "user",
              parts: [{ text: userMessage.slice(0, 2000) }]
            }
          ],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 700
          }
        })
      }
    );

    const data = await geminiResponse.json();
    if (!geminiResponse.ok) {
      response.status(geminiResponse.status).json({
        error: data.error?.message || "Gemini API gagal merespons."
      });
      return;
    }

    const reply =
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("")
        .trim() || "Maaf, saya belum bisa menjawab pertanyaan itu.";

    response.status(200).json({ reply });
  } catch (error) {
    response.status(500).json({ error: "Chatbot gagal memproses pesan." });
  }
};
