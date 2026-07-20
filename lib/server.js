const crypto = require("crypto");
const { Pool } = require("pg");

const defaultData = {
  umkm: [
    {
      id: "umkm-1",
      name: "Warung Sembako Warga",
      category: "Sembako",
      address: "Desa Sinargalih, Maniis",
      description: "Menyediakan kebutuhan harian warga, jajanan, dan bahan pokok.",
      phone: "081219564598",
      hours: "Setiap hari, 07.00-20.00",
      imageUrl: ""
    },
    {
      id: "umkm-2",
      name: "Produk Olahan Rumahan",
      category: "Kuliner",
      address: "Kampung sekitar Desa Sinargalih",
      description: "Aneka makanan rumahan dan produk olahan untuk pesanan acara warga.",
      phone: "",
      hours: "Pesanan sesuai kebutuhan",
      imageUrl: ""
    },
    {
      id: "umkm-3",
      name: "Jasa Ternak dan Pakan",
      category: "Peternakan",
      address: "Wilayah Desa Sinargalih",
      description: "Layanan kebutuhan peternakan lokal dan informasi pakan warga.",
      phone: "",
      hours: "Hubungi pemilik usaha",
      imageUrl: ""
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

  const db = getPool();
  await db.query(`
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
