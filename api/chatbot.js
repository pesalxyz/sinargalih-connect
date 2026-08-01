const MINIMAX_MODEL = process.env.MINIMAX_MODEL || "MiniMax-M2.7";
const MINIMAX_API_URL =
  process.env.MINIMAX_API_URL || "https://api.minimax.io/v1/chat/completions";

const SYSTEM_PROMPT =
  "Anda adalah Kang Galih, chatbot customer service untuk Website Sinargalih Connect, Kecamatan Maniis, Kabupaten Purwakarta. Perkenalkan diri sebagai Kang Galih jika pengguna bertanya siapa Anda. Wajib jawab seluruhnya dalam bahasa Indonesia yang ramah, singkat, dan membantu. Jangan memakai bahasa Rusia, Jepang, China, Korea, atau aksara non-Latin kecuali pengguna secara eksplisit meminta terjemahan bahasa tersebut. Jangan gunakan format tabel markdown. Anda boleh menjawab pertanyaan umum/universal di luar data website desa memakai pengetahuan umum model, selama tetap sopan, aman, dan tidak mengaku sudah mengecek internet secara real-time. Jika pertanyaan meminta data terbaru, data resmi, atau informasi yang perlu verifikasi browser, jelaskan bahwa jawaban perlu dicek ulang ke sumber resmi, lalu berikan arahan praktis untuk mengeceknya. Jangan menolak hanya karena informasi tidak ada di website, kecuali pertanyaan meminta keputusan resmi, data pribadi, atau hal yang berisiko. Untuk data spesifik Desa Sinargalih, jangan menambah klaim yang tidak ada di rujukan berikut. Data rujukan dasar: Desa Sinargalih berada di Kecamatan Maniis, Kabupaten Purwakarta, Jawa Barat; kode Kemendagri Desa Sinargalih adalah 32.14.07.2003; kode pos wilayah Maniis/Sinargalih adalah 41166. Bantu pengunjung memahami profil desa, berita, UMKM, kontak, peta desa, layanan publik penting di sekitar Kecamatan Maniis, dan pertanyaan umum lain. Untuk pertanyaan keamanan, kehilangan kendaraan/barang, atau laporan kepolisian di wilayah Maniis, bantu arahkan pengguna ke Polsek Maniis. Informasi rujukan: Polsek Maniis berada di Jl. Raya Palumbon, Maniis, Purwakarta; nomor telepon publik yang tercatat: (0264) 231686. Sarankan pengguna membawa identitas, bukti kepemilikan, kronologi kejadian, dan segera melapor langsung untuk kasus kehilangan. Jika informasi bersifat darurat, sarankan menghubungi layanan kepolisian/datang ke kantor terdekat. Jangan mengarang nomor layanan baru.";
const LANGUAGE_FIX_PROMPT =
  "Tulis ulang jawaban terakhir menjadi bahasa Indonesia natural saja. Hapus semua teks bahasa Rusia, Jepang, China, Korea, aksara non-Latin, tag reasoning, dan karakter aneh. Pertahankan maksud jawaban, tetap singkat, ramah, dan jelas.";

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

function hasUnwantedForeignScript(value) {
  const text = String(value || "");
  const matches = text.match(/[\u0400-\u04ff\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af]/g);
  return Boolean(matches && matches.length >= 2);
}

async function requestMinimax(apiKey, messages) {
  const minimaxResponse = await fetch(MINIMAX_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MINIMAX_MODEL,
      messages,
      stream: false,
      temperature: 0.25,
      max_tokens: 700
    })
  });

  const data = await minimaxResponse.json();
  if (!minimaxResponse.ok) {
    const error = new Error(data.error?.message || data.message || "MiniMax API gagal merespons.");
    error.statusCode = minimaxResponse.status;
    throw error;
  }

  return (
    cleanAssistantReply(data.choices?.[0]?.message?.content) ||
    cleanAssistantReply(data.reply) ||
    ""
  );
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
    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT
      },
      ...normalizeHistory(history),
      {
        role: "user",
        content: userMessage.slice(0, 2000)
      }
    ];
    let reply = await requestMinimax(apiKey, messages);

    if (hasUnwantedForeignScript(reply)) {
      reply = await requestMinimax(apiKey, [
        {
          role: "system",
          content: `${SYSTEM_PROMPT} ${LANGUAGE_FIX_PROMPT}`
        },
        {
          role: "user",
          content: `Pertanyaan pengguna: ${userMessage.slice(0, 2000)}\n\nJawaban yang harus diperbaiki:\n${reply.slice(0, 2400)}`
        }
      ]);
    }

    if (!reply || hasUnwantedForeignScript(reply)) {
      reply = "Maaf, Kang Galih belum bisa menyusun jawaban yang rapi. Silakan ulangi pertanyaannya dengan lebih singkat, nanti saya bantu jawab dalam bahasa Indonesia.";
    }

    response.status(200).json({ reply });
  } catch (error) {
    response.status(error.statusCode || 500).json({ error: error.message || "Chatbot gagal memproses pesan." });
  }
};
