const SINARGALIH_STORAGE_KEY = "sinargalih-connect-admin-data-v1";

const sinargalihDefaultData = {
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
    article.className = "preview-card";
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
