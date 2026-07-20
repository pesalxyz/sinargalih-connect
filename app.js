const villageCenter = { lat: -6.707541, lng: 107.3034003 };
const defaultZoom = 15;
const defaultLocationPhoto =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="420" viewBox="0 0 800 420" fill="none">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#dcead8"/>
          <stop offset="55%" stop-color="#a8c89f"/>
          <stop offset="100%" stop-color="#6f9f74"/>
        </linearGradient>
      </defs>
      <rect width="800" height="420" rx="28" fill="url(#g)"/>
      <circle cx="620" cy="92" r="38" fill="#f4cf73" opacity="0.9"/>
      <path d="M0 320C120 285 195 260 300 264C405 268 470 338 575 330C660 323 720 290 800 250V420H0V320Z" fill="#50775d" opacity="0.88"/>
      <path d="M0 340C95 318 178 300 272 302C362 304 440 350 529 346C614 342 704 304 800 270V420H0V340Z" fill="#3f6048" opacity="0.88"/>
      <text x="50%" y="50%" text-anchor="middle" fill="#25412d" font-family="Arial, sans-serif" font-size="42" font-weight="700">Preview Foto Lokasi</text>
      <text x="50%" y="60%" text-anchor="middle" fill="#355840" font-family="Arial, sans-serif" font-size="20">Tambahkan field photo di data/locations.json</text>
    </svg>
  `);

const categoryStyles = {
  UMKM: { color: "#b8572f", icon: "U" },
  Ibadah: { color: "#2f6c46", icon: "I" },
  Pendidikan: { color: "#2563a6", icon: "P" },
  Pemerintahan: { color: "#6b4fa1", icon: "K" },
  Kesehatan: { color: "#b42848", icon: "H" },
  "Usaha Peternakan": { color: "#7a5c3d", icon: "T" },
  Lainnya: { color: "#80674f", icon: "L" }
};

const state = {
  locations: [],
  boundary: null,
  activeCategory: "Semua",
  focusedLocationId: null,
  googleReady: false,
  map: null,
  markers: [],
  boundaryPolygon: null,
  infoWindow: null
};

let googleMapsApiKeyPromise = null;

const categoryFilters = document.getElementById("categoryFilters");
const locationList = document.getElementById("locationList");
const locationCount = document.getElementById("locationCount");
const fitBoundsButton = document.getElementById("fitBoundsButton");
const resetFilterButton = document.getElementById("resetFilterButton");
const mapLoadingOverlay = document.getElementById("mapLoadingOverlay");

initialize().catch((error) => {
  console.error("Gagal memuat data peta:", error);
  locationList.innerHTML =
    '<p class="empty-state">Data belum dapat dimuat. Periksa file JSON Anda.</p>';
  setOverlay("Peta tidak dapat dimuat.");
});

fitBoundsButton.addEventListener("click", () => {
  state.focusedLocationId = null;
  renderMarkers();
  focusMap();
});

resetFilterButton.addEventListener("click", () => {
  state.activeCategory = "Semua";
  state.focusedLocationId = null;
  renderCategoryFilters();
  renderLocations();
  renderMarkers();
  focusMap();
});

async function initialize() {
  const [locations, boundary] = await Promise.all([
    fetch("./data/locations.json?v=3").then((response) => response.json()),
    fetch("./data/village-boundary.geojson?v=4").then((response) => response.json())
  ]);

  state.locations = locations;
  state.boundary = boundary;

  renderCategoryFilters();
  renderLocations();

  await loadGoogleMaps();
  initializeMap();
  renderBoundary();
  renderMarkers();
  focusMap();
  state.googleReady = true;
  hideOverlay();
}

function loadGoogleMaps() {
  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  return getGoogleMapsApiKey().then((apiKey) => new Promise((resolve, reject) => {
    const existing = document.getElementById("googleMapsScript");

    window.__sinargalihGoogleMapsReady = () => {
      delete window.__sinargalihGoogleMapsReady;
      resolve(window.google.maps);
    };

    if (existing) {
      existing.remove();
    }

    const script = document.createElement("script");
    script.id = "googleMapsScript";
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=" +
      encodeURIComponent(apiKey) +
      "&callback=__sinargalihGoogleMapsReady&v=weekly";
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      delete window.__sinargalihGoogleMapsReady;
      setOverlay("Google Maps gagal dimuat. Periksa key atau billing.");
      reject(new Error("Google Maps script gagal dimuat"));
    };
    document.head.appendChild(script);
  }));
}

async function getGoogleMapsApiKey() {
  if (!googleMapsApiKeyPromise) {
    googleMapsApiKeyPromise = fetch("/api/maps-config")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Google Maps API key belum tersedia.");
        }
        return response.json();
      })
      .then((data) => data.apiKey);
  }

  return googleMapsApiKeyPromise;
}

function initializeMap() {
  if (state.map) {
    return;
  }

  state.map = new google.maps.Map(document.getElementById("map"), {
    center: villageCenter,
    zoom: defaultZoom,
    mapTypeId: "roadmap",
    streetViewControl: false,
    fullscreenControl: true,
    clickableIcons: false,
    mapTypeControl: true,
    zoomControl: true,
    gestureHandling: "greedy"
  });

  state.infoWindow = new google.maps.InfoWindow();
}

function renderCategoryFilters() {
  const categories = ["Semua", ...new Set(state.locations.map((item) => item.category))];

  categoryFilters.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-chip${state.activeCategory === category ? " active" : ""}`;
    button.textContent = category;
    button.addEventListener("click", () => {
      state.activeCategory = category;
      state.focusedLocationId = null;
      renderCategoryFilters();
      renderLocations();
      renderMarkers();
      focusMap();
    });
    categoryFilters.appendChild(button);
  });
}

function renderLocations() {
  const filteredLocations = getFilteredLocations();
  locationCount.textContent = `${filteredLocations.length} lokasi`;
  locationList.innerHTML = "";

  if (filteredLocations.length === 0) {
    locationList.innerHTML =
      '<p class="empty-state">Tidak ada lokasi dalam kategori ini.</p>';
    return;
  }

  filteredLocations.forEach((location) => {
    const card = document.createElement("article");
    card.className = "location-card";
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="card-topline">
        <span class="pill">${location.category}</span>
        <span>${location.address}</span>
      </div>
      <h3>${location.name}</h3>
      <p>${location.description}</p>
    `;

    const openLocation = () => {
      state.focusedLocationId = location.id;
      renderMarkers();
      focusLocation(location.id);
    };

    card.addEventListener("click", openLocation);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLocation();
      }
    });

    locationList.appendChild(card);
  });
}

function renderMarkers() {
  clearMarkers();

  getFilteredLocations().forEach((location) => {
    const marker = new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: state.map,
      title: location.name,
      icon: createCategoryIcon(location.category)
    });

    marker.addListener("click", () => {
      state.focusedLocationId = location.id;
      state.infoWindow.setContent(createPopupMarkup(location));
      state.infoWindow.open({
        anchor: marker,
        map: state.map
      });
    });

    state.markers.push({ id: location.id, marker });
  });
}

function renderBoundary() {
  if (!state.map || !state.boundary?.features?.length) {
    return;
  }

  if (state.boundaryPolygon) {
    state.boundaryPolygon.setMap(null);
  }

  const coordinates = getPrimaryBoundaryCoordinates(state.boundary);

  if (!coordinates.length) {
    return;
  }

  state.boundaryPolygon = new google.maps.Polygon({
    paths: coordinates.map(([lng, lat]) => ({ lat, lng })),
    strokeColor: "#e14c3e",
    strokeOpacity: 0.95,
    strokeWeight: 3,
    fillColor: "#80b48a",
    fillOpacity: 0.18,
    map: state.map
  });
}

function focusMap() {
  if (!state.map) {
    return;
  }

  const bounds = new google.maps.LatLngBounds();
  let hasBounds = false;

  if (state.boundaryPolygon) {
    state.boundaryPolygon.getPath().forEach((point) => {
      bounds.extend(point);
      hasBounds = true;
    });
  }

  getFilteredLocations().forEach((item) => {
    bounds.extend({ lat: item.lat, lng: item.lng });
    hasBounds = true;
  });

  if (hasBounds) {
    state.map.fitBounds(bounds, 56);
    return;
  }

  state.map.setCenter(villageCenter);
  state.map.setZoom(defaultZoom);
}

function focusLocation(locationId) {
  const target = state.markers.find((item) => item.id === locationId);
  const location = state.locations.find((item) => item.id === locationId);

  if (!target || !location || !state.map) {
    return;
  }

  state.map.panTo({ lat: location.lat, lng: location.lng });
  state.map.setZoom(17);
  google.maps.event.trigger(target.marker, "click");
}

function getFilteredLocations() {
  if (state.activeCategory === "Semua") {
    return state.locations;
  }

  return state.locations.filter((item) => item.category === state.activeCategory);
}

function getPrimaryBoundaryCoordinates(boundary) {
  if (!boundary?.features?.length) {
    return [];
  }

  const feature = boundary.features[0];

  if (!feature || !feature.geometry) {
    return [];
  }

  if (feature.geometry.type === "Polygon") {
    return feature.geometry.coordinates[0];
  }

  if (feature.geometry.type === "MultiPolygon") {
    return feature.geometry.coordinates[0][0];
  }

  return [];
}

function clearMarkers() {
  state.markers.forEach(({ marker }) => {
    marker.setMap(null);
  });

  state.markers = [];
}

function createCategoryIcon(category) {
  const style = categoryStyles[category] || categoryStyles.Lainnya;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46" fill="none">
      <path d="M18 45C18 45 35 26.9 35 17.4C35 8.2 27.4 1 18 1C8.6 1 1 8.2 1 17.4C1 26.9 18 45 18 45Z" fill="${style.color}" stroke="white" stroke-width="2"/>
      <text x="18" y="24" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="white">${style.icon}</text>
    </svg>
  `;

  return {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
    scaledSize: new google.maps.Size(36, 46),
    anchor: new google.maps.Point(18, 46)
  };
}

function createPopupMarkup(location) {
  const routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
  const previewPhoto = location.photo || defaultLocationPhoto;
  const whatsappUrl = buildWhatsAppUrl(location.whatsapp);

  return `
    <article class="popup-card">
      <div class="popup-media">
        <img src="${previewPhoto}" alt="Preview foto ${location.name}" />
      </div>
      <span class="pill">${location.category}</span>
      <h3 class="popup-title">${location.name}</h3>
      <p class="popup-copy">${location.address}</p>
      <p class="popup-copy">${location.description}</p>
      ${
        whatsappUrl
          ? `
            <a class="wa-link" href="${whatsappUrl}" target="_blank" rel="noreferrer">
              <span class="wa-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 2a9.9 9.9 0 0 0-8.58 14.88L2 22l5.3-1.39A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.18-1.14l-.3-.17-3.14.82.84-3.06-.2-.32A8.2 8.2 0 1 1 12 20.2zm4.53-5.67c-.25-.12-1.49-.73-1.72-.81s-.4-.12-.57.12-.66.82-.8.99-.29.18-.54.06a6.7 6.7 0 0 1-1.97-1.22 7.4 7.4 0 0 1-1.36-1.69c-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.24-.4.08-.17.04-.32-.02-.44-.06-.12-.57-1.38-.78-1.89-.2-.49-.4-.42-.57-.43h-.49c-.17 0-.43.06-.66.29s-.89.87-.89 2.12.91 2.46 1.04 2.63c.12.17 1.78 2.72 4.31 3.81.6.26 1.08.42 1.45.54.61.2 1.16.18 1.6.11.49-.07 1.49-.61 1.7-1.2.21-.6.21-1.12.15-1.2-.06-.08-.23-.13-.48-.25z"/>
                </svg>
              </span>
              WhatsApp
            </a>
          `
          : ""
      }
      <a class="route-link" href="${routeUrl}" target="_blank" rel="noreferrer">
        Lihat Rute
      </a>
    </article>
  `;
}

function buildWhatsAppUrl(whatsapp) {
  if (!whatsapp) {
    return "";
  }

  const digits = String(whatsapp).replace(/[^\d]/g, "");
  if (!digits) {
    return "";
  }

  const normalized = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}`;
}

function setOverlay(message) {
  mapLoadingOverlay.textContent = message;
  mapLoadingOverlay.style.display = "grid";
}

function hideOverlay() {
  mapLoadingOverlay.style.display = "none";
}
