const MINIMAX_MODEL = process.env.MINIMAX_MODEL || "MiniMax-M2.7";
const MINIMAX_API_URL =
  process.env.MINIMAX_API_URL || "https://api.minimax.io/v1/chat/completions";
const SEARCH_TIMEOUT_MS = 6500;
const PAGE_FETCH_TIMEOUT_MS = 4500;
const MAX_SEARCH_RESULTS = 6;
const MAX_CONTEXT_SOURCES = 4;
const SOURCE_STOPWORDS = new Set([
  "yang",
  "dari",
  "untuk",
  "dengan",
  "dimana",
  "mana",
  "lokasi",
  "alamat",
  "terdekat",
  "kecamatan",
  "kabupaten",
  "tolong",
  "saya",
  "ingin",
  "coba",
  "berapa",
  "apakah",
  "adalah",
  "atau",
  "dan",
  "ini",
  "itu"
]);

const SYSTEM_PROMPT =
  "Anda adalah Kang Galih, chatbot customer service untuk Website Sinargalih Connect, Kecamatan Maniis, Kabupaten Purwakarta. Perkenalkan diri sebagai Kang Galih jika pengguna bertanya siapa Anda. Wajib jawab seluruhnya dalam bahasa Indonesia yang ramah, singkat, dan membantu. Jangan memakai bahasa Rusia, Jepang, China, Korea, atau aksara non-Latin kecuali pengguna secara eksplisit meminta terjemahan bahasa tersebut. Jangan gunakan format tabel markdown. Untuk pertanyaan faktual, lokasi, fasilitas umum, data terbaru, jam layanan, kontak, regulasi, atau pertanyaan yang butuh validasi, gunakan konteks sumber live yang diberikan sistem. Jangan mengaku sudah mengecek internet jika konteks sumber live kosong. Jika sumber live tidak cukup kuat, katakan bahwa datanya belum bisa dipastikan dan beri cara cek resmi. Untuk data spesifik Desa Sinargalih, jangan menambah klaim yang tidak ada di rujukan atau sumber live. Data rujukan dasar: Desa Sinargalih berada di Kecamatan Maniis, Kabupaten Purwakarta, Jawa Barat; kode Kemendagri Desa Sinargalih adalah 32.14.07.2003; kode pos wilayah Maniis/Sinargalih adalah 41166. Bantu pengunjung memahami profil desa, berita, UMKM, kontak, peta desa, layanan publik penting di sekitar Kecamatan Maniis, dan pertanyaan umum lain. Untuk pertanyaan keamanan, kehilangan kendaraan/barang, atau laporan kepolisian di wilayah Maniis, bantu arahkan pengguna ke Polsek Maniis bila didukung sumber atau rujukan dasar; sarankan membawa identitas, bukti kepemilikan, kronologi kejadian, dan segera melapor langsung. Jika informasi bersifat darurat, sarankan menghubungi layanan darurat/datang ke kantor terdekat. Jangan mengarang nomor layanan baru.";
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

function normalizeMessage(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getLocalReferenceAnswer(message) {
  const normalized = normalizeMessage(message);
  const asksPuskesmas =
    normalized.includes("puskesmas") &&
    (normalized.includes("sinargalih") || normalized.includes("maniis") || normalized.includes("terdekat"));

  if (!asksPuskesmas) {
    return "";
  }

  return [
    "Puskesmas terdekat dari Desa Sinargalih adalah Puskesmas Maniis.",
    "",
    "Detail lokasi:",
    "- Nama: Puskesmas Maniis",
    "- Alamat: Jl. Raya Palumbon No. 5, Maniis, Purwakarta, Jawa Barat 41166",
    "- Patokan: berada di wilayah Kecamatan Maniis, sehingga menjadi fasilitas kesehatan utama yang melayani warga Desa Sinargalih dan desa sekitar",
    "- Telepon yang tercatat: (0264) 203212",
    "- Perkiraan dari pusat Desa Sinargalih: sekitar 2-4 km atau 5-10 menit berkendara, tergantung titik awal",
    "",
    "Untuk rute, buka Google Maps lalu cari Puskesmas Maniis. Untuk jam layanan terbaru, sebaiknya konfirmasi langsung ke puskesmas atau Dinas Kesehatan Kabupaten Purwakarta karena jadwal bisa berubah pada hari libur atau kondisi tertentu.",
    "",
    "Sumber:",
    "1. Dinas Kesehatan Kabupaten Purwakarta: https://dinkes.purwakartakab.go.id/puskesmas",
    "2. Google Maps: https://www.google.com/maps/search/?api=1&query=Puskesmas%20Maniis"
  ].join("\n");
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

function fetchWithTimeout(url, options = {}, timeoutMs = SEARCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, {
    ...options,
    signal: controller.signal,
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; KangGalihBot/1.0; +https://sinargalihconnect.com)",
      Accept: "text/html,application/json,text/plain;q=0.8,*/*;q=0.5",
      ...(options.headers || {})
    }
  }).finally(() => clearTimeout(timeoutId));
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

function stripHtml(value) {
  return decodeHtml(
    String(value || "")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function normalizeDuckDuckGoUrl(value) {
  try {
    const url = new URL(decodeHtml(value));
    if (url.hostname.includes("duckduckgo.com") && url.searchParams.get("uddg")) {
      return url.searchParams.get("uddg");
    }
    return url.href;
  } catch (error) {
    return "";
  }
}

function decodeBase64Url(value) {
  try {
    const normalized = String(value || "")
      .replace(/^a1/i, "")
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
    return Buffer.from(`${normalized}${padding}`, "base64").toString("utf8");
  } catch (error) {
    return "";
  }
}

function normalizeBingUrl(value) {
  try {
    const url = new URL(decodeHtml(value));
    const encodedTarget = url.searchParams.get("u");
    const decodedTarget = decodeBase64Url(encodedTarget);
    if (url.hostname.includes("bing.com") && decodedTarget && /^https?:\/\//i.test(decodedTarget)) {
      return decodedTarget;
    }
    return url.href;
  } catch (error) {
    return "";
  }
}

function isUsefulSource(url) {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol) &&
      !/(bing\.com\/search|google\.[^/]+\/search|youtube\.com|youtu\.be|facebook\.com|instagram\.com\/(reel|p\/)|tiktok\.com|x\.com|twitter\.com)/i.test(parsed.href);
  } catch (error) {
    return false;
  }
}

function sourceRank(source) {
  const url = source.url.toLowerCase();
  const text = normalizeMessage(`${source.title || ""} ${source.snippet || ""} ${source.content || ""}`);
  let score = 0;
  if (source.type === "place") score += 45;
  if (url.includes(".go.id")) score += 40;
  if (url.includes("purwakartakab.go.id")) score += 30;
  if (url.includes("google.com/maps")) score += 28;
  if (url.includes("dinkes")) score += 20;
  if (url.includes("puskesmas")) score += 18;
  if (url.includes("sinargalih") || url.includes("maniis")) score += 12;
  if (text.includes("puskesmas maniis")) score += 30;
  if (text.includes("desa sinargalih")) score += 24;
  if (url.includes("wikipedia.org")) score -= 8;
  if (url.includes("scribd.com")) score -= 18;
  return score;
}

function uniqueSources(sources) {
  const seen = new Set();
  return sources.filter((source) => {
    if (!source.url || seen.has(source.url) || !isUsefulSource(source.url)) {
      return false;
    }
    seen.add(source.url);
    return true;
  });
}

function buildSearchQuery(message) {
  const normalized = normalizeMessage(message);
  if (normalized.includes("puskesmas") && normalized.includes("maniis")) {
    return `${message} Dinas Kesehatan Purwakarta Puskesmas Maniis`;
  }
  if (normalized.includes("sinargalih") || normalized.includes("maniis") || normalized.includes("purwakarta")) {
    return message;
  }
  return `${message} Sinargalih Maniis Purwakarta`;
}

function getImportantTerms(message) {
  return normalizeMessage(message)
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 3 && !SOURCE_STOPWORDS.has(term));
}

function isRelevantSource(source, message) {
  const terms = getImportantTerms(message);
  if (!terms.length) {
    return true;
  }

  const sourceText = normalizeMessage(`${source.title || ""} ${source.url || ""} ${source.snippet || ""} ${source.content || ""}`);
  if (terms.includes("puskesmas") && !sourceText.includes("puskesmas")) {
    return false;
  }
  if (terms.includes("maniis") && !sourceText.includes("maniis")) {
    return false;
  }
  if (terms.includes("sinargalih") && !sourceText.includes("sinargalih") && !sourceText.includes("maniis") && !sourceText.includes("purwakarta")) {
    return false;
  }

  return terms.some((term) => sourceText.includes(term)) || sourceRank(source) >= 70;
}

function getOfficialSourceSeeds(message) {
  const normalized = normalizeMessage(message);
  const sources = [];

  if (/\b(puskesmas|faskes|fasilitas kesehatan|kesehatan|klinik)\b/.test(normalized) &&
    /\b(maniis|sinargalih|purwakarta)\b/.test(normalized)) {
    sources.push({
      title: "Puskesmas - Dinas Kesehatan Kabupaten Purwakarta",
      url: "https://dinkes.purwakartakab.go.id/puskesmas",
      snippet: "Daftar puskesmas Kabupaten Purwakarta dari Dinas Kesehatan Kabupaten Purwakarta."
    });
  }

  return sources;
}

function shouldUsePlaceSearch(message) {
  const normalized = normalizeMessage(message);
  return /\b(lokasi|alamat|terdekat|dimana|di mana|maps|rute|puskesmas|polsek|kantor|sekolah|klinik|rumah sakit|fasilitas)\b/.test(normalized);
}

function buildPlaceQuery(message) {
  const normalized = normalizeMessage(message);
  if (normalized.includes("sinargalih") || normalized.includes("maniis") || normalized.includes("purwakarta")) {
    return message;
  }
  return `${message} Maniis Purwakarta Jawa Barat`;
}

async function searchWithGooglePlaces(message) {
  if (!process.env.GOOGLE_MAPS_API_KEY || !shouldUsePlaceSearch(message)) {
    return [];
  }

  try {
    const result = await fetchWithTimeout("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": [
          "places.displayName",
          "places.formattedAddress",
          "places.location",
          "places.googleMapsUri",
          "places.nationalPhoneNumber",
          "places.currentOpeningHours"
        ].join(",")
      },
      body: JSON.stringify({
        textQuery: buildPlaceQuery(message),
        languageCode: "id",
        regionCode: "ID"
      })
    }, SEARCH_TIMEOUT_MS);

    const data = await result.json();
    if (!result.ok || !Array.isArray(data.places)) {
      return [];
    }

    return data.places.slice(0, 3).map((place) => {
      const name = place.displayName?.text || "Lokasi Google Maps";
      const details = [
        `Nama: ${name}`,
        place.formattedAddress ? `Alamat: ${place.formattedAddress}` : "",
        place.nationalPhoneNumber ? `Telepon: ${place.nationalPhoneNumber}` : "",
        place.currentOpeningHours?.weekdayDescriptions?.length
          ? `Jam buka: ${place.currentOpeningHours.weekdayDescriptions.join("; ")}`
          : "",
        place.location
          ? `Koordinat: ${place.location.latitude}, ${place.location.longitude}`
          : "",
        place.googleMapsUri ? `Google Maps: ${place.googleMapsUri}` : ""
      ].filter(Boolean);

      return {
        type: "place",
        title: `${name} - Google Maps`,
        url: place.googleMapsUri || "https://www.google.com/maps",
        snippet: place.formattedAddress || "",
        content: details.join("\n")
      };
    });
  } catch (error) {
    console.warn("Google Places gagal:", error.message);
    return [];
  }
}

async function searchWithBrave(query) {
  if (!process.env.BRAVE_SEARCH_API_KEY) {
    return [];
  }

  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${MAX_SEARCH_RESULTS}&country=id&search_lang=id`;
  const result = await fetchWithTimeout(url, {
    headers: {
      Accept: "application/json",
      "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY
    }
  });
  const data = await result.json();
  return (data.web?.results || []).map((item) => ({
    title: item.title || item.url,
    url: item.url,
    snippet: stripHtml(item.description || "")
  }));
}

async function searchWithTavily(query) {
  if (!process.env.TAVILY_API_KEY) {
    return [];
  }

  const result = await fetchWithTimeout("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query,
      search_depth: "basic",
      include_answer: false,
      max_results: MAX_SEARCH_RESULTS
    })
  });
  const data = await result.json();
  return (data.results || []).map((item) => ({
    title: item.title || item.url,
    url: item.url,
    snippet: stripHtml(item.content || "")
  }));
}

async function searchWithGoogle(query) {
  if (!process.env.GOOGLE_SEARCH_API_KEY || !process.env.GOOGLE_SEARCH_ENGINE_ID) {
    return [];
  }

  const params = new URLSearchParams({
    key: process.env.GOOGLE_SEARCH_API_KEY,
    cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
    q: query,
    num: String(MAX_SEARCH_RESULTS),
    hl: "id"
  });
  const result = await fetchWithTimeout(`https://www.googleapis.com/customsearch/v1?${params}`);
  const data = await result.json();
  return (data.items || []).map((item) => ({
    title: item.title || item.link,
    url: item.link,
    snippet: stripHtml(item.snippet || "")
  }));
}

async function searchWithBing(query) {
  const params = new URLSearchParams({
    q: query,
    cc: "ID",
    setlang: "id-ID",
    count: String(MAX_SEARCH_RESULTS)
  });
  const result = await fetchWithTimeout(`https://www.bing.com/search?${params}`);
  const html = await result.text();
  const sources = [];
  const resultPattern = /<li[^>]+class="b_algo"[\s\S]*?<\/li>/gi;
  let match;
  while ((match = resultPattern.exec(html)) && sources.length < MAX_SEARCH_RESULTS) {
    const block = match[0];
    const titleMatch = block.match(/<h2[^>]*>\s*<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>\s*<\/h2>/i);
    if (!titleMatch) {
      continue;
    }

    sources.push({
      title: stripHtml(titleMatch[2]),
      url: normalizeBingUrl(titleMatch[1]),
      snippet: stripHtml(block.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] || "")
    });
  }
  return sources;
}

async function searchWithDuckDuckGo(query) {
  const result = await fetchWithTimeout(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`);
  const html = await result.text();
  const sources = [];
  const resultPattern = /<div[^>]+class="result[\s\S]*?<\/div>\s*<\/div>/gi;
  let match;
  while ((match = resultPattern.exec(html)) && sources.length < MAX_SEARCH_RESULTS) {
    const block = match[0];
    const titleMatch = block.match(/<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
    if (!titleMatch) {
      continue;
    }

    sources.push({
      title: stripHtml(titleMatch[2]),
      url: normalizeDuckDuckGoUrl(titleMatch[1]),
      snippet: stripHtml(block.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i)?.[1] || "")
    });
  }
  return sources;
}

async function searchWeb(query) {
  const searchers = [searchWithBrave, searchWithTavily, searchWithGoogle, searchWithBing, searchWithDuckDuckGo];
  for (const searcher of searchers) {
    try {
      const sources = uniqueSources(await searcher(query));
      if (sources.length) {
        return sources.sort((a, b) => sourceRank(b) - sourceRank(a)).slice(0, MAX_SEARCH_RESULTS);
      }
    } catch (error) {
      console.warn("Live search gagal:", error.message);
    }
  }
  return [];
}

async function fetchSourceContent(source) {
  try {
    const result = await fetchWithTimeout(source.url, {}, PAGE_FETCH_TIMEOUT_MS);
    const contentType = result.headers.get("content-type") || "";
    if (!result.ok || !contentType.includes("text/html")) {
      return source;
    }
    const html = await result.text();
    const title = stripHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || source.title);
    const text = stripHtml(html).slice(0, 1800);
    return {
      ...source,
      title: title || source.title,
      content: text
    };
  } catch (error) {
    return source;
  }
}

async function getLiveSources(message) {
  const query = buildSearchQuery(message);
  const sourceSeeds = getOfficialSourceSeeds(message);
  const [placeResults, searchResults] = await Promise.all([
    searchWithGooglePlaces(message),
    searchWeb(query)
  ]);
  const candidates = uniqueSources([...placeResults, ...sourceSeeds, ...searchResults])
    .sort((a, b) => sourceRank(b) - sourceRank(a))
    .slice(0, MAX_CONTEXT_SOURCES + 3);
  const fetchedSources = await Promise.all(candidates.map(fetchSourceContent));
  return fetchedSources
    .filter((source) => isRelevantSource(source, message))
    .sort((a, b) => sourceRank(b) - sourceRank(a))
    .slice(0, MAX_CONTEXT_SOURCES);
}

function buildLiveContext(sources) {
  if (!sources.length) {
    return "Tidak ada sumber live yang berhasil ditemukan atau dibaca.";
  }

  return sources
    .map((source, index) => [
      `Sumber ${index + 1}`,
      `Judul: ${source.title}`,
      `URL: ${source.url}`,
      `Cuplikan: ${source.snippet || "-"}`,
      `Isi terbaca: ${(source.content || "").slice(0, 1600) || "-"}`
    ].join("\n"))
    .join("\n\n");
}

function appendSourceList(reply, sources) {
  if (!sources.length || /sumber\s*:/i.test(reply)) {
    return reply;
  }

  const sourceList = sources
    .slice(0, 3)
    .map((source, index) => `${index + 1}. ${source.title}: ${source.url}`)
    .join("\n");
  return `${reply.trim()}\n\nSumber:\n${sourceList}`;
}

function shouldUseLiveSources(message) {
  const normalized = normalizeMessage(message);
  if (/^(halo|hai|hi|assalamualaikum|terima kasih|makasih|thanks)\b/.test(normalized)) {
    return false;
  }

  return (
    normalized.length > 16 ||
    /\b(apa|apakah|berapa|dimana|di mana|kapan|siapa|kenapa|mengapa|bagaimana|lokasi|alamat|jam|kontak|nomor|kode|id|terdekat|terbaru|harga|berita)\b/.test(normalized)
  );
}

function getTodayInIndonesia() {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "full"
  }).format(new Date());
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

  const localReferenceAnswer = getLocalReferenceAnswer(userMessage);
  if (localReferenceAnswer) {
    response.status(200).json({ reply: localReferenceAnswer });
    return;
  }

  try {
    const liveSources = shouldUseLiveSources(userMessage)
      ? await getLiveSources(userMessage)
      : [];
    const liveContext = buildLiveContext(liveSources);
    const messages = [
      {
        role: "system",
        content: `${SYSTEM_PROMPT}\n\nTanggal sistem: ${getTodayInIndonesia()}.\n\nKonteks sumber live:\n${liveContext}\n\nInstruksi penggunaan sumber: Jika konteks sumber live berisi sumber relevan, jawab berdasarkan sumber tersebut dan sebutkan sumber dengan bahasa ringkas. Utamakan sumber resmi seperti domain pemerintah, fasilitas publik resmi, atau situs lembaga terkait. Jika sumber live kosong atau tidak relevan, jangan menebak detail spesifik; jelaskan batasannya dan beri langkah pengecekan resmi.`
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
          content: `${SYSTEM_PROMPT} ${LANGUAGE_FIX_PROMPT}\n\nKonteks sumber live:\n${liveContext}`
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

    reply = appendSourceList(reply, liveSources);
    response.status(200).json({ reply });
  } catch (error) {
    response.status(error.statusCode || 500).json({ error: error.message || "Chatbot gagal memproses pesan." });
  }
};
