const crypto = require("crypto");
const { Pool } = require("pg");

const defaultData = {
  umkm: [
      {
          "id": "umkm-toko-ridwan",
          "name": "Toko Ridwan",
          "category": "Perdagangan",
          "address": "Dusun 1, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Toko Ridwan merupakan usaha di bidang perdagangan yang menjual toko sembako, makanan, minuman, snack, dll. Buka setiap hari pukul 06.00 - 22.00.",
          "phone": "6281290817144",
          "hours": "Buka setiap hari pukul 06.00 - 22.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-es-teh-sunda-istimewa",
          "name": "Es Teh Sunda Istimewa",
          "category": "Makanan & Minuman",
          "address": "Dusun 1, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Es Teh Sunda Istimewa merupakan usaha di bidang makanan & minuman yang menjual es teh. Usaha ini sudah berjalan selama 7 bulan, sejak 2026. Buka setiap hari pukul 08.00 - 01.00.",
          "phone": "6283876065100",
          "hours": "Buka setiap hari pukul 08.00 - 01.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-rmd-sablon",
          "name": "RMD Sablon",
          "category": "Jasa",
          "address": "Dusun 1, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "RMD Sablon merupakan usaha di bidang jasa yang menjual sablon baju. Usaha ini sudah berjalan selama 4 tahun, sejak 2022. Buka setiap hari pukul 09.00-20.00.",
          "phone": "6283139896269",
          "hours": "Buka setiap hari pukul 09.00-20.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-toko-sembako",
          "name": "Toko Sembako",
          "category": "Perdagangan",
          "address": "Dusun 1, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Toko Sembako merupakan usaha di bidang perdagangan. Usaha ini sudah berjalan selama 5 tahun, sejak 2021. Buka setiap hari pukul 06.00 - 22.00.",
          "phone": "6283162472553",
          "hours": "Buka setiap hari pukul 06.00 - 22.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-toko-src-bu-ihat",
          "name": "Toko SRC Bu Ihat",
          "category": "Perdagangan",
          "address": "Dusun 1, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Toko SRC Bu Ihat merupakan usaha di bidang perdagangan yang menjual warung sembako. Usaha ini sudah berjalan selama 6 tahun, sejak 2020. Buka setiap hari pukul 05.00-21.00.",
          "phone": "6283161155066",
          "hours": "Buka setiap hari pukul 05.00-21.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-bengkel-motor-bapak-adi",
          "name": "Bengkel Motor bapak Adi",
          "category": "Jasa",
          "address": "Dusun 1, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Bengkel Motor bapak Adi merupakan usaha di bidang jasa. Usaha ini sudah berjalan selama 2-3 tahun, sejak 2023. Buka setiap hari pukul 09.00-18.00.",
          "phone": "6283169230600",
          "hours": "Buka setiap hari pukul 09.00-18.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-toko-jahit-pak-wahyu",
          "name": "Toko Jahit Pak Wahyu",
          "category": "Jasa",
          "address": "Dusun 1, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Toko Jahit Pak Wahyu merupakan usaha di bidang jasa. Usaha ini sudah berjalan selama 20 tahun, sejak 2006. Buka setiap hari pukul 07.00 - 20.00.",
          "phone": "6283861340213",
          "hours": "Buka setiap hari pukul 07.00 - 20.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-warung-mie-ayam-baso-solo-cabang-palumbon",
          "name": "Warung Mie Ayam Baso Solo Cabang Palumbon",
          "category": "Makanan & Minuman",
          "address": "Dusun 1, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Warung Mie Ayam Baso Solo Cabang Palumbon merupakan usaha di bidang makanan & minuman. Usaha ini sudah berjalan selama 4-5 tahun, sejak 2021. Buka pada hari Senin, Selasa, Kamis, Jumat, Sabtu, Minggu pukul 09.00 - 21.00.",
          "phone": "6285875894809",
          "hours": "Buka pada hari Senin, Selasa, Kamis, Jumat, Sabtu, Minggu pukul 09.00 - 21.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-warung-nasi-dan-bubur-ayam-nilan-cahaya",
          "name": "Warung nasi dan Bubur ayam nilan cahaya",
          "category": "Makanan & Minuman",
          "address": "Dusun 1, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Warung nasi dan Bubur ayam nilan cahaya merupakan usaha di bidang makanan & minuman yang menjual bubur ayam & lauk pauk. Usaha ini sudah berjalan selama 6 tahun, sejak 2020. Buka setiap hari pukul 05.00-20.00.",
          "phone": "6283861165777",
          "hours": "Buka setiap hari pukul 05.00-20.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-toko-buah-mmh-fitri",
          "name": "Toko Buah Mmh Fitri",
          "category": "Perdagangan",
          "address": "Dusun 1, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Toko Buah Mmh Fitri merupakan usaha di bidang perdagangan. Usaha ini sudah berjalan selama 3 tahun, sejak 2023. Buka setiap hari pukul 06.00 - 21.00.",
          "phone": "6283899576667",
          "hours": "Buka setiap hari pukul 06.00 - 21.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-mayla-printing",
          "name": "Mayla Printing",
          "category": "Jasa",
          "address": "Dusun 1, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Mayla Printing merupakan usaha di bidang jasa. Usaha ini sudah berjalan selama 3 tahun, sejak 2023. Buka setiap hari pukul 06.00 - 18.00.",
          "phone": "6283878586461",
          "hours": "Buka setiap hari pukul 06.00 - 18.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-toko-basreng-haidar",
          "name": "Toko Basreng Haidar",
          "category": "Perdagangan",
          "address": "Dusun 2, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Toko Basreng Haidar merupakan usaha di bidang perdagangan. Usaha ini sudah berjalan selama 6-7 tahun. Buka setiap hari pukul 06.30-18.00.",
          "phone": "6283186773502",
          "hours": "Buka setiap hari pukul 06.30-18.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-toko-algina-plastik",
          "name": "Toko Algina Plastik",
          "category": "Perdagangan",
          "address": "Dusun 2, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Toko Algina Plastik merupakan usaha di bidang perdagangan. Usaha ini sudah berjalan selama 5 tahun, sejak 2021. Buka setiap hari pukul 07.00 - 17.00.",
          "phone": "6281909618140",
          "hours": "Buka setiap hari pukul 07.00 - 17.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-ternak-lele-pak-dindin",
          "name": "Ternak Lele Pak Dindin",
          "category": "Perikanan",
          "address": "Dusun 2, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Ternak Lele Pak Dindin merupakan usaha di bidang perikanan. Usaha ini sudah berjalan selama 15 tahun, sejak 2011. Buka setiap hari.",
          "phone": "6285213307512",
          "hours": "Buka setiap hari",
          "imageUrl": ""
      },
      {
          "id": "umkm-peternakan-ayam-petelur",
          "name": "Peternakan Ayam Petelur",
          "category": "Pertanian & Perkebunan",
          "address": "Dusun 2, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Peternakan Ayam Petelur merupakan usaha di bidang pertanian & perkebunan. Usaha ini sudah berjalan selama kira-kira 10 tahun, sejak 2016. Buka setiap hari pukul 08.00 - 17.00.",
          "phone": "",
          "hours": "Buka setiap hari pukul 08.00 - 17.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-rizky-tailor",
          "name": "Rizky Tailor",
          "category": "Jasa",
          "address": "Dusun 2, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Rizky Tailor merupakan usaha di bidang jasa yang menjual jahit baju. Usaha ini sudah berjalan selama 4 tahun, sejak 2021. Buka setiap hari pukul 08.00 - 17.00.",
          "phone": "6283180612659",
          "hours": "Buka setiap hari pukul 08.00 - 17.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-toko-berkah-rezeki",
          "name": "Toko Berkah Rezeki",
          "category": "Perdagangan",
          "address": "Dusun 2, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Toko Berkah Rezeki merupakan usaha di bidang perdagangan. Usaha ini sudah berdiri sejak 2021. Buka pada hari Senin, Selasa, Rabu, Kamis, Jumat, Sabtu pukul 13.00 - 20.00.",
          "phone": "6285861739461",
          "hours": "Buka pada hari Senin, Selasa, Rabu, Kamis, Jumat, Sabtu pukul 13.00 - 20.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-wrung-bu-yayah",
          "name": "Wrung Bu Yayah",
          "category": "Perdagangan",
          "address": "Dusun 2, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Wrung Bu Yayah merupakan usaha di bidang perdagangan. Usaha ini sudah berdiri sejak 1985. Buka setiap hari pukul 06.00 - 23.59.",
          "phone": "6285794429475",
          "hours": "Buka setiap hari pukul 06.00 - 23.59",
          "imageUrl": ""
      },
      {
          "id": "umkm-rm-putra-jambak",
          "name": "RM Putra Jambak",
          "category": "Makanan & Minuman",
          "address": "Dusun 2, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "RM Putra Jambak merupakan usaha di bidang makanan & minuman yang menjual masakan Padang. Usaha ini sudah berdiri sejak Oktober 2025. Buka setiap hari pukul 08.00 - 22.00.",
          "phone": "6282258539939",
          "hours": "Buka setiap hari pukul 08.00 - 22.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-teras-seblak-sakahoyong",
          "name": "Teras Seblak sakahoyong",
          "category": "Makanan & Minuman",
          "address": "Dusun 3, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Teras Seblak Sakahoyong merupakan usaha di bidang makanan & minuman yang menjual seblak, es, basreng, dan juga menyediakan mini ATM. Usaha ini sudah berjalan selama 1 tahun, sejak 2025. Buka pada hari Senin, Selasa, Rabu, Kamis, Sabtu, Minggu pukul 09.00-15.00.",
          "phone": "6287770478886",
          "hours": "Buka pada hari Senin, Selasa, Rabu, Kamis, Sabtu, Minggu pukul 09.00-15.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-pabrik-penggiling-padi",
          "name": "pabrik penggiling padi",
          "category": "Jasa",
          "address": "Dusun 4, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Pabrik penggiling padi merupakan usaha di bidang jasa yang melayani jasa giling padi. Usaha ini sudah berjalan selama 10 tahun. Buka setiap hari pukul 07.00-16.00.",
          "phone": "6283892761581",
          "hours": "Buka setiap hari pukul 07.00-16.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-toko-ikan-asin-dan-beras-pa-wowo",
          "name": "toko ikan asin dan beras  pa wowo",
          "category": "Perdagangan",
          "address": "Dusun 4, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Toko ikan asin dan beras Pa Wowo merupakan usaha di bidang perdagangan yang menjual beras dan ikan asin. Usaha ini sudah berjalan selama 2 tahun, sejak 2024. Buka setiap hari pukul 07.00-17.00.",
          "phone": "6287848524362",
          "hours": "Buka setiap hari pukul 07.00-17.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-sinar-berkah",
          "name": "sinar berkah",
          "category": "Perdagangan",
          "address": "Dusun 4, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Sinar Berkah merupakan usaha di bidang perdagangan yang menjual pakan burung dan ikan. Usaha ini sudah berjalan selama 4 tahun. Buka setiap hari pukul 07.00-17.00.",
          "phone": "6281912286343",
          "hours": "Buka setiap hari pukul 07.00-17.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-sidomuncul",
          "name": "sidomuncul",
          "category": "Makanan & Minuman",
          "address": "Dusun 4, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Sidomuncul merupakan usaha di bidang makanan & minuman yang menjual jamu. Buka setiap hari.",
          "phone": "",
          "hours": "Buka setiap hari",
          "imageUrl": ""
      },
      {
          "id": "umkm-bapak-ejang",
          "name": "bapak ejang",
          "category": "Perdagangan",
          "address": "Dusun 4, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Toko Bapak Ejang merupakan usaha di bidang perdagangan yang menjual berbagai kebutuhan dan es kelapa. Usaha ini sudah berjalan selama 6 tahun. Buka setiap hari pukul 06.00-21.00.",
          "phone": "6285559699562",
          "hours": "Buka setiap hari pukul 06.00-21.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-sate-maranggi-boga-rasa-kang-acoy-tea",
          "name": "sate maranggi boga rasa kang acoy tea",
          "category": "Makanan & Minuman",
          "address": "Dusun 4, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Sate Maranggi Boga Rasa Kang Acoy Tea merupakan usaha di bidang makanan & minuman yang menjual sate. Usaha ini sudah berjalan selama 8 tahun. Buka setiap hari pukul 13.00-22.00.",
          "phone": "6283823912032",
          "hours": "Buka setiap hari pukul 13.00-22.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-toko-mekar-berkah",
          "name": "toko mekar berkah",
          "category": "Perdagangan",
          "address": "Dusun 4, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Toko Mekar Berkah merupakan usaha di bidang perdagangan yang menjual seblak, sembako, dan perabot. Usaha ini sudah berjalan selama 1 tahun. Buka setiap hari pukul 06.00 - 01.00.",
          "phone": "6283816167376",
          "hours": "Buka setiap hari pukul 06.00 - 01.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-konter-gips-cell",
          "name": "konter gips cell",
          "category": "Perdagangan",
          "address": "Dusun 4, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Konter Gips Cell merupakan usaha di bidang perdagangan yang menjual voucher, case, kartu perdana, dan charger. Usaha ini sudah berjalan selama 8 tahun. Buka setiap hari pukul 07.00 - 21.00.",
          "phone": "6283126268181",
          "hours": "Buka setiap hari pukul 07.00 - 21.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-pangkas-rambut-mas-didi",
          "name": "pangkas rambut mas didi",
          "category": "UMKM",
          "address": "Dusun 4, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Pangkas Rambut Mas Didi merupakan usaha jasa pangkas rambut. Usaha ini sudah berjalan selama 26 tahun. Buka setiap hari pukul 08.00-21.00.",
          "phone": "6283193255039",
          "hours": "Buka setiap hari pukul 08.00-21.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-depot-isi-ulang",
          "name": "depot isi ulang",
          "category": "Makanan & Minuman",
          "address": "Dusun 4, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Depot Isi Ulang merupakan usaha di bidang makanan & minuman yang menyediakan isi ulang air minum. Usaha ini sudah berjalan selama 13 tahun. Buka setiap hari pukul 06.00 - 17.00.",
          "phone": "6287848524362",
          "hours": "Buka setiap hari pukul 06.00 - 17.00",
          "imageUrl": ""
      },
      {
          "id": "umkm-ujang-jaya-motor",
          "name": "ujang jaya motor",
          "category": "UMKM",
          "address": "Dusun 4, Desa Sinargalih, Kec. Maniis, Kab. Purwakarta",
          "description": "Ujang Jaya Motor merupakan usaha jasa bengkel motor. Usaha ini sudah berjalan selama 4 tahun. Buka pada hari Senin, Selasa, Rabu, Kamis, Sabtu, Minggu pukul 08.00-17.00.",
          "phone": "6283878857427",
          "hours": "Buka pada hari Senin, Selasa, Rabu, Kamis, Sabtu, Minggu pukul 08.00-17.00",
          "imageUrl": ""
      }
  ],
  berita: [
    {
      id: "berita-1",
      title: "Pengumuman Resmi Desa",
      category: "Pengumuman",
      date: "2026-07-20",
      summary: "Ruang untuk pengumuman layanan, jadwal kegiatan, atau informasi administratif.",
      imageUrl: ""
    },
    {
      id: "berita-2",
      title: "Kegiatan Warga",
      category: "Kegiatan",
      date: "2026-07-20",
      summary: "Dokumentasi musyawarah, kerja bakti, acara keagamaan, dan kegiatan sosial.",
      imageUrl: ""
    }
  ],
  kontak: [
    {
      id: "kontak-1",
      label: "Alamat",
      title: "Kantor Desa",
      value: "Desa Sinargalih, Kecamatan Maniis, Kabupaten Purwakarta.",
      actionLabel: "Lihat Alamat",
      actionUrl: "https://maps.app.goo.gl/sC13RgQjZgBpFPxH7"
    },
    {
      id: "kontak-2",
      label: "Telepon",
      title: "Kontak Layanan",
      value: "0812-1956-4598",
      actionLabel: "Hubungi WhatsApp",
      actionUrl: "https://wa.me/6281219564598"
    },
    {
      id: "kontak-3",
      label: "Media Sosial",
      title: "Channel Informasi",
      value: "",
      actionLabel: "",
      actionUrl: "",
      links: [
        {
          label: "Facebook Desa Sinargalih",
          url: "https://web.facebook.com/profile.php?id=61566587272739"
        },
        {
          label: "YouTube Desa Sinargalih",
          url: "https://www.youtube.com/@mulyanaarvani4582"
        }
      ]
    }
  ]
};

let pool;
let schemaReady;
let schemaReadyPromise;

function getConnectionString() {
  return process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;
}

function getPool() {
  const connectionString = getConnectionString();
  if (!connectionString) {
    throw new Error("POSTGRES_URL atau DATABASE_URL belum tersedia.");
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false }
    });
  }

  return pool;
}

function randomId(prefix) {
  return `${prefix}-${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;
}

function normalizeUsername(username) {
  return String(username || "").trim().toLowerCase();
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto
    .pbkdf2Sync(String(password || ""), salt, 120000, 32, "sha256")
    .toString("hex");
  return { salt, hash };
}

function verifyPassword(password, salt, expectedHash) {
  const { hash } = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(expectedHash, "hex"));
}

function getJwtSecret() {
  if (process.env.ADMIN_JWT_SECRET) {
    return process.env.ADMIN_JWT_SECRET;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_JWT_SECRET belum diatur.");
  }

  return "sinargalih-connect-dev-secret-change-on-vercel";
}

function signToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", getJwtSecret()).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function verifyToken(token) {
  if (!token || !token.includes(".")) {
    return null;
  }

  const [body, signature] = token.split(".");
  const expected = crypto.createHmac("sha256", getJwtSecret()).update(body).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  if (!payload.exp || Date.now() > payload.exp) {
    return null;
  }

  return payload;
}

function getBearerToken(request) {
  const header = request.headers.authorization || request.headers.Authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

async function ensureSchema() {
  if (schemaReady) {
    return;
  }

  if (!schemaReadyPromise) {
    schemaReadyPromise = initializeSchema();
  }

  await schemaReadyPromise;
}

async function initializeSchema() {
  const db = getPool();
  const client = await db.connect();

  try {
    await client.query("SELECT pg_advisory_lock($1)", [20260720]);
    await client.query(`
      CREATE TABLE IF NOT EXISTS content_items (
        table_name TEXT NOT NULL,
        item_id TEXT NOT NULL,
        data JSONB NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (table_name, item_id)
      );

      CREATE TABLE IF NOT EXISTS admin_users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        password_salt TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS admin_requests (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        password_salt TEXT NOT NULL,
        requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await seedDefaultContent();
    await seedDefaultAdmin();
    schemaReady = true;
  } catch (error) {
    schemaReadyPromise = null;
    throw error;
  } finally {
    await client.query("SELECT pg_advisory_unlock($1)", [20260720]).catch(() => {});
    client.release();
  }
}

async function seedDefaultContent() {
  const db = getPool();
  const { rows } = await db.query("SELECT COUNT(*)::int AS count FROM content_items");
  if (rows[0].count > 0) {
    return;
  }

  for (const [tableName, items] of Object.entries(defaultData)) {
    for (const [index, item] of items.entries()) {
      await db.query(
        `INSERT INTO content_items (table_name, item_id, data, sort_order)
         VALUES ($1, $2, $3::jsonb, $4)
         ON CONFLICT (table_name, item_id) DO NOTHING`,
        [tableName, item.id, JSON.stringify(item), index]
      );
    }
  }
}

async function seedDefaultAdmin() {
  const db = getPool();
  const username = normalizeUsername(process.env.DEFAULT_ADMIN_USERNAME);
  const password = process.env.DEFAULT_ADMIN_PASSWORD;
  if (!username || !password) {
    return;
  }

  const { rows } = await db.query("SELECT id FROM admin_users WHERE username = $1", [username]);
  if (rows.length) {
    return;
  }

  const { salt, hash } = hashPassword(password);
  await db.query(
    `INSERT INTO admin_users (id, name, username, password_hash, password_salt)
     VALUES ($1, $2, $3, $4, $5)`,
    ["admin-default", "Admin Sinargalih", username, hash, salt]
  );
}

async function getContentData() {
  await ensureSchema();
  const db = getPool();
  const { rows } = await db.query(
    "SELECT table_name, data FROM content_items ORDER BY table_name, sort_order, created_at"
  );

  const data = { umkm: [], berita: [], kontak: [] };
  rows.forEach((row) => {
    if (data[row.table_name]) {
      data[row.table_name].push(row.data);
    }
  });
  return data;
}

async function replaceContentTable(tableName, items) {
  await ensureSchema();
  if (!["umkm", "berita", "kontak"].includes(tableName)) {
    throw new Error("Tabel tidak valid.");
  }

  const db = getPool();
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM content_items WHERE table_name = $1", [tableName]);
    for (const [index, item] of items.entries()) {
      const itemId = item.id || randomId(tableName);
      const payload = { ...item, id: itemId };
      await client.query(
        `INSERT INTO content_items (table_name, item_id, data, sort_order)
         VALUES ($1, $2, $3::jsonb, $4)`,
        [tableName, itemId, JSON.stringify(payload), index]
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function requireAdmin(request) {
  await ensureSchema();
  const payload = verifyToken(getBearerToken(request));
  if (!payload) {
    return null;
  }

  const db = getPool();
  const { rows } = await db.query("SELECT id, name, username FROM admin_users WHERE id = $1", [
    payload.sub
  ]);
  return rows[0] || null;
}

function sendError(response, status, message) {
  response.status(status).json({ error: message });
}

module.exports = {
  defaultData,
  ensureSchema,
  getPool,
  getContentData,
  replaceContentTable,
  requireAdmin,
  sendError,
  randomId,
  normalizeUsername,
  hashPassword,
  verifyPassword,
  signToken
};
