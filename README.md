# Peta Desa Sinargalih

Prototype website peta desa berbasis `Google Maps JS API` untuk tampilan peta interaktif, dengan workflow QGIS untuk batas desa.

## Isi Workspace

- `index.html`: halaman Home berisi preview semua menu
- `profil-desa.html`, `pemerintahan.html`, `berita.html`, `katalog-umkm.html`, `kontak.html`: halaman detail per menu
- `admin.html`: dashboard admin untuk mengelola data UMKM, berita, dan kontak
- `styles.css`: styling responsif
- `app.js`: logika peta Google, marker, filter, dan daftar lokasi
- `site-data.js`: data awal UMKM, berita, kontak, serta render data dari API ke halaman publik
- `admin.js`: logika dashboard admin yang terhubung ke API Vercel Postgres
- `api/`: endpoint Vercel untuk chatbot, konten publik, login admin, request akun, dan pengelolaan data
- `lib/server.js`: koneksi database, schema, seed data, hashing password, dan token admin
- `data/locations.json`: data titik lokasi desa
- `data/village-boundary.geojson`: placeholder batas wilayah desa

## Cara Menjalankan

Karena project ini berbasis file statis, jalankan server lokal sederhana:

```bash
python3 -m http.server 8000
```

Lalu buka:

```text
http://localhost:8000
```

## Cara Mengelola UMKM, Berita, dan Kontak

1. Buka `admin.html` langsung dari alamat browser.
2. Halaman akan menampilkan form login dan request akun terlebih dahulu.
3. Login dengan akun admin yang sudah disetujui.
4. Setelah login berhasil, dashboard kelola data baru akan muncul.
5. Pilih `Tabel UMKM`, `Tabel Berita`, atau `Tabel Kontak`.
6. Isi form untuk menambahkan data baru.
7. Gunakan tombol `Edit` atau `Hapus` pada tabel data tersimpan.
8. Buka halaman `katalog-umkm.html`, `berita.html`, atau `kontak.html` untuk melihat hasilnya.

Akun admin awal dibuat dari environment variable `DEFAULT_ADMIN_USERNAME` dan `DEFAULT_ADMIN_PASSWORD`.

Calon admin baru bisa mengirim request akun dari halaman `admin.html`. Admin yang sudah login bisa memilih `ACC` atau `Tolak` pada bagian request akun.

Untuk UMKM dan Berita, gambar bisa dipilih langsung dari file komputer melalui field upload. Gambar akan dikompresi di browser lalu disimpan bersama data konten di database.

Perubahan admin, request akun, dan konten website disimpan di Vercel Postgres melalui endpoint API. Sesi login disimpan sementara di browser sebagai token. Gunakan tombol `Ekspor Data` untuk membuat backup JSON konten website.

Environment variable yang dibutuhkan untuk admin produksi:

```text
POSTGRES_URL
ADMIN_JWT_SECRET
DEFAULT_ADMIN_USERNAME
DEFAULT_ADMIN_PASSWORD
GOOGLE_MAPS_API_KEY
```

`POSTGRES_URL` biasanya otomatis dibuat oleh integrasi Vercel Postgres. `DEFAULT_ADMIN_USERNAME` dan `DEFAULT_ADMIN_PASSWORD` harus diisi sebelum deploy pertama agar akun admin awal bisa dibuat.

## Chatbot Website

Website publik memakai widget chatbot `Kang Galih` di kanan bawah melalui `chatbot.js`. Tombol chatbot memakai file:

```text
assets/images/maskot-chatbot.png
```

Jika file maskot belum ada, tombol otomatis memakai logo Desa Sinargalih sebagai fallback.

Saat deploy ke Vercel, simpan Gemini API key sebagai environment variable:

```text
GEMINI_API_KEY
```

Endpoint chatbot tersedia di `api/chatbot.js` dan memakai model default `gemini-2.5-flash`. Jika ingin mengganti model, tambahkan environment variable:

```text
GEMINI_MODEL
```

Jangan menaruh API key langsung di `chatbot.js` atau file HTML, karena file frontend dapat dilihat publik oleh pengunjung.

## Checklist Deploy Vercel

1. Pastikan project sudah terhubung ke Vercel dan Vercel Postgres.
2. Pull atau isi environment variable berikut di Vercel:

```text
POSTGRES_URL
ADMIN_JWT_SECRET
DEFAULT_ADMIN_USERNAME
DEFAULT_ADMIN_PASSWORD
GEMINI_API_KEY
GEMINI_MODEL
GOOGLE_MAPS_API_KEY
```

`ADMIN_JWT_SECRET` harus berupa string panjang acak. Contoh membuat nilainya:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. Deploy ke Vercel.
4. Buka `/admin.html`, login memakai akun seed, lalu cek tabel UMKM/Berita/Kontak.
5. Test chatbot Kang Galih di halaman publik.

## Restrict Google Maps API Key

Google Maps key disimpan sebagai environment variable `GOOGLE_MAPS_API_KEY` dan dikirim ke browser lewat endpoint `/api/maps-config` saat halaman peta dibuka. Karena Maps JavaScript API tetap berjalan di browser, key masih harus dibatasi di Google Cloud Console:

1. Buka Google Cloud Console.
2. Masuk ke `APIs & Services` > `Credentials`.
3. Pilih API key yang dipakai di `app.js`.
4. Pada `Application restrictions`, pilih `Websites`.
5. Tambahkan domain production, misalnya:

```text
https://nama-project.vercel.app/*
https://domain-desa-anda.id/*
```

6. Pada `API restrictions`, batasi hanya untuk `Maps JavaScript API`.
7. Simpan perubahan.

## Cara Menjalankan Peta Google

1. Buka `peta-desa.html`.
2. Pastikan API key Google Maps sudah tersimpan di `app.js`.
3. Jalankan server lokal seperti biasa.
4. Peta akan tampil sebagai map interaktif dengan zoom, drag, dan marker.

## Cara Mengganti Data Lokasi

Edit file `data/locations.json` dengan format seperti berikut:

```json
{
  "id": "kantor-desa",
  "name": "Kantor Desa Sinargalih",
  "category": "Pemerintahan",
  "lat": -6.7066034,
  "lng": 107.3056748,
  "address": "Alamat singkat",
  "description": "Deskripsi lokasi",
  "photo": "https://example.com/foto-lokasi.jpg",
  "whatsapp": "081234567890"
}
```

Field `photo` bersifat opsional. Kalau diisi, popup marker akan menampilkan preview foto lokasi.
Field `whatsapp` juga opsional. Kalau diisi, popup marker akan menampilkan tombol langsung ke WhatsApp.

Kategori awal yang disiapkan:

- `UMKM`
- `Ibadah`
- `Pendidikan`
- `Pemerintahan`
- `Kesehatan`
- `Lainnya`

## Cara Menambahkan Batas Desa

Isi file `data/village-boundary.geojson` dengan polygon `GeoJSON` jika batas wilayah sudah tersedia.

## Sumber Titik Lokasi

Titik yang tampil di peta saat ini berasal dari `data/locations.json`, bukan otomatis dari Google Maps.

Kalau Anda ingin memakai data dari Google Maps, alurnya biasanya:

1. Buat daftar titik di Google My Maps atau export data lokasi dari sumber lain.
2. Simpan hasilnya sebagai `KML`, `KML/KMZ`, `CSV`, atau `GeoJSON`.
3. Konversi ke format `data/locations.json` agar bisa dibaca halaman peta.

Kalau ingin benar-benar memakai Google Maps sebagai basemap di web, kita perlu Google Maps Platform API key.

## Workflow QGIS

Lihat [qgis-workflow.md](/Users/pesal/Documents/sinargalih connect/qgis-workflow.md) untuk alur singkat mengubah `untitled_map.geojson` menjadi batas desa yang siap dipakai di halaman peta.
