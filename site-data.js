const SINARGALIH_STORAGE_KEY = "sinargalih-connect-admin-data-v1";

const sinargalihDefaultData = {
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

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

async function getSinargalihData() {
  try {
    const response = await fetch("/api/content");
    if (response.ok) {
      return {
        ...cloneData(sinargalihDefaultData),
        ...(await response.json())
      };
    }
  } catch (error) {
    console.warn("Data server belum dapat dibaca, mencoba fallback browser.", error);
  }

  try {
    const stored = localStorage.getItem(SINARGALIH_STORAGE_KEY);
    if (!stored) {
      return cloneData(sinargalihDefaultData);
    }

    return {
      ...cloneData(sinargalihDefaultData),
      ...JSON.parse(stored)
    };
  } catch (error) {
    console.warn("Data admin tidak dapat dibaca, memakai data default.", error);
    return cloneData(sinargalihDefaultData);
  }
}

function saveSinargalihData(data) {
  localStorage.setItem(SINARGALIH_STORAGE_KEY, JSON.stringify(data));
}

function formatDateId(dateValue) {
  if (!dateValue) {
    return "Tanggal belum diisi";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(`${dateValue}T00:00:00`));
}

function createWhatsAppUrl(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) {
    return "";
  }

  return `https://wa.me/${digits.startsWith("0") ? `62${digits.slice(1)}` : digits}`;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeUrl(value) {
  const url = String(value || "").trim();
  if (!url) {
    return "";
  }

  if (/^(https?:|data:image\/)/i.test(url)) {
    return escapeHtml(url);
  }

  return "";
}

async function renderUmkmList() {
  const container = document.querySelector("[data-render='umkm']");
  if (!container) {
    return;
  }

  const { umkm } = await getSinargalihData();
  container.innerHTML = "";

  if (!umkm.length) {
    container.innerHTML = '<p class="empty-state">Belum ada data UMKM.</p>';
    return;
  }

  umkm.forEach((item) => {
    const article = document.createElement("article");
    const waUrl = createWhatsAppUrl(item.phone);
    const imageUrl = safeUrl(item.imageUrl);
    article.className = "preview-card data-card";
    article.innerHTML = `
      <div class="data-card-media">
        ${
          imageUrl
            ? `<button class="data-card-image-button" type="button" data-full-image="${imageUrl}" data-full-title="${escapeHtml(item.name)}" aria-label="Lihat foto ${escapeHtml(item.name)} fullscreen"><img src="${imageUrl}" alt="Foto ${escapeHtml(item.name)}" /></button>`
            : "<span>UMKM</span>"
        }
      </div>
      <div class="data-card-body">
        <span class="pill">${escapeHtml(item.category || "UMKM")}</span>
        <h2>${escapeHtml(item.name)}</h2>
        <p>${escapeHtml(item.description || "Deskripsi usaha belum diisi.")}</p>
        <dl class="compact-detail-list">
          <div><dt>Alamat</dt><dd>${escapeHtml(item.address || "-")}</dd></div>
          <div><dt>Jam</dt><dd>${escapeHtml(item.hours || "-")}</dd></div>
          <div><dt>Kontak</dt><dd>${escapeHtml(item.phone || "-")}</dd></div>
        </dl>
        <div class="data-card-action">
          ${
            waUrl
              ? `<a class="primary-button" href="${waUrl}" target="_blank" rel="noopener">Hubungi WhatsApp</a>`
              : '<span class="primary-button data-card-action-placeholder" aria-hidden="true">Hubungi WhatsApp</span>'
          }
        </div>
      </div>
    `;
    container.appendChild(article);
  });

  if (!container.dataset.lightboxReady) {
    container.addEventListener("click", handleUmkmImageClick);
    container.dataset.lightboxReady = "true";
  }
}

function handleUmkmImageClick(event) {
  const button = event.target.closest("[data-full-image]");
  if (!button) {
    return;
  }

  openImageLightbox(button.dataset.fullImage, button.dataset.fullTitle || "Foto UMKM");
}

function openImageLightbox(imageUrl, title) {
  let lightbox = document.querySelector(".image-lightbox");
  if (!lightbox) {
    lightbox = document.createElement("section");
    lightbox.className = "image-lightbox";
    lightbox.innerHTML = `
      <button class="image-lightbox-backdrop" type="button" aria-label="Tutup foto"></button>
      <figure class="image-lightbox-frame">
        <button class="image-lightbox-close" type="button" aria-label="Tutup foto">x</button>
        <img alt="" />
        <figcaption></figcaption>
      </figure>
    `;
    document.body.appendChild(lightbox);

    lightbox.querySelector(".image-lightbox-backdrop").addEventListener("click", closeImageLightbox);
    lightbox.querySelector(".image-lightbox-close").addEventListener("click", closeImageLightbox);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !lightbox.hidden) {
        closeImageLightbox();
      }
    });
  }

  const image = lightbox.querySelector("img");
  const caption = lightbox.querySelector("figcaption");
  image.src = imageUrl;
  image.alt = `Foto ${title}`;
  caption.textContent = title;
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
}

function closeImageLightbox() {
  const lightbox = document.querySelector(".image-lightbox");
  if (!lightbox) {
    return;
  }

  lightbox.hidden = true;
  document.body.classList.remove("lightbox-open");
}

async function renderBeritaList() {
  const container = document.querySelector("[data-render='berita']");
  if (!container) {
    return;
  }

  const { berita } = await getSinargalihData();
  container.innerHTML = "";

  if (!berita.length) {
    container.innerHTML = '<p class="empty-state">Belum ada berita desa.</p>';
    return;
  }

  berita.forEach((item, index) => {
    const article = document.createElement("article");
    const fallbackClass = index % 2 === 0 ? "news-card-image-announcement" : "news-card-image-community";
    const imageUrl = safeUrl(item.imageUrl);
    article.className = "preview-card news-card";
    article.innerHTML = `
      <span class="pill">${escapeHtml(item.category || "Berita")}</span>
      <h2>${escapeHtml(item.title)}</h2>
      <time class="news-date" datetime="${escapeHtml(item.date || "")}">${formatDateId(item.date)}</time>
      ${
        imageUrl
          ? `<button class="news-card-image news-card-image-button" type="button" data-full-image="${imageUrl}" data-full-title="${escapeHtml(item.title)}" aria-label="Lihat gambar ${escapeHtml(item.title)} fullscreen"><img src="${imageUrl}" alt="Gambar ${escapeHtml(item.title)}" /></button>`
          : `<div class="news-card-image ${fallbackClass}" role="img" aria-label="Ilustrasi ${escapeHtml(item.title)}"></div>`
      }
      <p>${escapeHtml(item.summary || "Ringkasan berita belum diisi.")}</p>
    `;
    container.appendChild(article);
  });

  if (!container.dataset.lightboxReady) {
    container.addEventListener("click", handleUmkmImageClick);
    container.dataset.lightboxReady = "true";
  }
}

async function renderKontakList() {
  const container = document.querySelector("[data-render='kontak']");
  if (!container) {
    return;
  }

  const { kontak } = await getSinargalihData();
  container.innerHTML = "";

  if (!kontak.length) {
    container.innerHTML = '<p class="empty-state">Belum ada data kontak.</p>';
    return;
  }

  kontak.forEach((item) => {
    const article = document.createElement("article");
    const actionUrl = safeUrl(item.actionUrl);
    const links = Array.isArray(item.links) ? item.links : [];
    const isSocialContact =
      links.length > 0 ||
      normalizeText(item.label) === "media sosial" ||
      normalizeText(item.title) === "channel informasi";
    article.className = "contact-card";
    article.innerHTML = `
      <span class="pill">${escapeHtml(item.label || "Kontak")}</span>
      <h3>${escapeHtml(item.title)}</h3>
      ${
        isSocialContact
          ? renderSocialLinks(links)
          : `<p class="contact-value">${escapeHtml(item.value || "-")}</p>`
      }
      ${
        actionUrl && !isSocialContact
          ? `<a class="primary-button contact-action" href="${actionUrl}" target="_blank" rel="noopener">${escapeHtml(item.actionLabel || "Buka Tautan")}</a>`
          : ""
      }
    `;
    container.appendChild(article);
  });
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function renderSocialLinks(links) {
  const socialLinks = links.length
    ? links
    : [
        {
          label: "Facebook Desa Sinargalih",
          url: "https://web.facebook.com/profile.php?id=61566587272739"
        },
        {
          label: "YouTube Desa Sinargalih",
          url: "https://www.youtube.com/@mulyanaarvani4582"
        }
      ];

  return `
    <div class="contact-link-list">
      ${socialLinks
        .map((link) => {
          const url = safeUrl(link.url);
          if (!url) {
            return "";
          }

          return `<a class="social-text-link" href="${url}" target="_blank" rel="noopener">${escapeHtml(link.label)}</a>`;
        })
        .join("")}
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  renderUmkmList();
  renderBeritaList();
  renderKontakList();
});
