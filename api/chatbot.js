const MINIMAX_MODEL = process.env.MINIMAX_MODEL || "MiniMax-M2.7";
const MINIMAX_API_URL =
  process.env.MINIMAX_API_URL || "https://api.minimax.io/v1/chat/completions";

const SYSTEM_PROMPT =
  "Anda adalah Kang Galih, chatbot customer service untuk Website Resmi Desa Sinargalih, Kecamatan Maniis, Kabupaten Purwakarta. Perkenalkan diri sebagai Kang Galih jika pengguna bertanya siapa Anda. Jawab dalam bahasa Indonesia yang ramah, singkat, dan membantu. Bantu pengunjung memahami profil desa, berita, UMKM, kontak, peta desa, dan layanan publik penting di sekitar Kecamatan Maniis. Untuk pertanyaan keamanan, kehilangan kendaraan/barang, atau laporan kepolisian di wilayah Maniis, bantu arahkan pengguna ke Polsek Maniis. Informasi rujukan: Polsek Maniis berada di Jl. Raya Palumbon, Maniis, Purwakarta; nomor telepon publik yang tercatat: (0264) 231686. Sarankan pengguna membawa identitas, bukti kepemilikan, kronologi kejadian, dan segera melapor langsung untuk kasus kehilangan. Jika informasi bersifat darurat, sarankan menghubungi layanan kepolisian/datang ke kantor terdekat. Jika pertanyaan membutuhkan keputusan resmi, dokumen pribadi, atau informasi yang belum tersedia, arahkan pengguna untuk menghubungi perangkat desa melalui halaman Kontak atau instansi terkait. Jangan mengarang nomor layanan baru.";

function normalizeHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter((item) => item && typeof item.text === "string")
    .slice(-10)
    .map((item) => ({
      role: item.role === "user" ? "user" : "assistant",
      content: item.text.slice(0, 1200)
    }));
}

function cleanAssistantReply(value) {
  return String(value || "")
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .trim();
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    response.status(500).json({ error: "MINIMAX_API_KEY belum diatur." });
    return;
  }

  const { message, history } = request.body || {};
  const userMessage = String(message || "").trim();
  if (!userMessage) {
    response.status(400).json({ error: "Pesan tidak boleh kosong." });
    return;
  }

  try {
    const minimaxResponse = await fetch(MINIMAX_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MINIMAX_MODEL,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT
          },
          ...normalizeHistory(history),
          {
            role: "user",
            content: userMessage.slice(0, 2000)
          }
        ],
        stream: false,
        temperature: 0.5,
        max_tokens: 700
      })
    });

    const data = await minimaxResponse.json();
    if (!minimaxResponse.ok) {
      response.status(minimaxResponse.status).json({
        error: data.error?.message || data.message || "MiniMax API gagal merespons."
      });
      return;
    }

    const reply =
      cleanAssistantReply(data.choices?.[0]?.message?.content) ||
      cleanAssistantReply(data.reply) ||
      "Maaf, saya belum bisa menjawab pertanyaan itu.";

    response.status(200).json({ reply });
  } catch (error) {
    response.status(500).json({ error: "Chatbot gagal memproses pesan." });
  }
};
