const ADMIN_SESSION_STORAGE_KEY = "sinargalih-connect-admin-session-v2";

const adminState = {
  table: "umkm",
  editingId: null,
  data: cloneData(sinargalihDefaultData),
  session: getAdminSession(),
  activeUser: null,
  users: [],
  requests: []
};

const tableConfig = {
  umkm: {
    label: "UMKM",
    fields: [
      ["name", "Nama usaha", "text"],
      ["category", "Kategori", "text"],
      ["address", "Alamat", "text"],
      ["description", "Deskripsi", "textarea"],
      ["phone", "Nomor WhatsApp", "tel"],
      ["hours", "Jam operasional", "text"],
      ["imageUrl", "Upload foto", "image"]
    ],
    columns: ["name", "category", "phone"]
  },
  berita: {
    label: "Berita",
    fields: [
      ["title", "Judul berita", "text"],
      ["category", "Kategori", "text"],
      ["date", "Tanggal", "date"],
      ["summary", "Ringkasan", "textarea"],
      ["imageUrl", "Upload gambar", "image"]
    ],
    columns: ["title", "category", "date"]
  },
  kontak: {
    label: "Kontak",
    fields: [
      ["label", "Label", "text"],
      ["title", "Judul", "text"],
      ["value", "Isi kontak", "textarea"],
      ["actionLabel", "Teks tombol", "text"],
      ["actionUrl", "URL tombol", "url"]
    ],
    columns: ["label", "title", "value"]
  }
};

const tabs = document.querySelectorAll("[data-admin-tab]");
const authPanel = document.getElementById("authPanel");
const dashboardPanel = document.getElementById("dashboardPanel");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginStatus = document.getElementById("loginStatus");
const registerStatus = document.getElementById("registerStatus");
const form = document.getElementById("adminForm");
const formTitle = document.getElementById("adminFormTitle");
const formFields = document.getElementById("adminFormFields");
const tableBody = document.getElementById("adminTableBody");
const tableHead = document.getElementById("adminTableHead");
const cancelButton = document.getElementById("cancelEditButton");
const resetButton = document.getElementById("resetDataButton");
const exportButton = document.getElementById("exportDataButton");
const importInput = document.getElementById("importDataInput");
const statusText = document.getElementById("adminStatus");
const logoutButton = document.getElementById("logoutButton");
const activeAdminName = document.getElementById("activeAdminName");
const adminRequestList = document.getElementById("adminRequestList");
const adminUserList = document.getElementById("adminUserList");
const requestCount = document.getElementById("requestCount");
const adminCount = document.getElementById("adminCount");

function getAdminSession() {
  try {
    return JSON.parse(sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY)) || null;
  } catch (error) {
    return null;
  }
}

function saveAdminSession(session) {
  adminState.session = session;
  sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(session));
}

function clearAdminSession() {
  adminState.session = null;
  adminState.activeUser = null;
  sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
}

function getAuthHeaders() {
  return adminState.session?.token
    ? {
        Authorization: `Bearer ${adminState.session.token}`
      }
    : {};
}

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Request gagal diproses.");
  }
  return data;
}

function setStatus(message) {
  statusText.textContent = message;
}

function setLoginStatus(message) {
  loginStatus.textContent = message;
}

function setRegisterStatus(message) {
  registerStatus.textContent = message;
}

function getActiveConfig() {
  return tableConfig[adminState.table];
}

function getFieldLabel(fieldName) {
  const field = getActiveConfig().fields.find(([name]) => name === fieldName);
  return field ? field[1] : fieldName;
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function requireAdmin() {
  if (adminState.activeUser && adminState.session?.token) {
    return true;
  }

  clearAdminSession();
  renderAuthState();
  setLoginStatus("Silakan login dulu untuk mengelola dashboard.");
  return false;
}

async function readImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    if (file.type === "image/svg+xml") {
      const svgReader = new FileReader();
      svgReader.addEventListener("load", () => resolve(svgReader.result));
      svgReader.addEventListener("error", () => reject(svgReader.error));
      svgReader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const image = new Image();
      image.addEventListener("load", () => {
        const maxSize = 900;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));

        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.76));
      });
      image.addEventListener("error", () => reject(new Error("Gambar tidak dapat dibaca.")));
      image.src = reader.result;
    });
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

async function loadDashboardData() {
  const [data, accounts] = await Promise.all([
    apiRequest("/api/admin-data"),
    apiRequest("/api/admin-accounts")
  ]);
  adminState.data = {
    ...cloneData(sinargalihDefaultData),
    ...data
  };
  adminState.users = accounts.users || [];
  adminState.requests = accounts.requests || [];
}

async function saveActiveTable(message) {
  const data = await apiRequest("/api/admin-data", {
    method: "PUT",
    body: JSON.stringify({
      table: adminState.table,
      items: adminState.data[adminState.table]
    })
  });
  adminState.data = {
    ...cloneData(sinargalihDefaultData),
    ...data
  };
  renderAdmin();
  setStatus(message);
}

async function renderAuthState() {
  const isLoggedIn = Boolean(adminState.activeUser && adminState.session?.token);

  authPanel.hidden = isLoggedIn;
  dashboardPanel.hidden = !isLoggedIn;
  authPanel.style.display = isLoggedIn ? "none" : "grid";
  dashboardPanel.style.display = isLoggedIn ? "grid" : "none";

  if (!isLoggedIn) {
    adminState.editingId = null;
    return;
  }

  activeAdminName.textContent = adminState.activeUser.name || adminState.activeUser.username;
  renderAdminAccounts();
  renderAdmin();
}

function renderAdminAccounts() {
  requestCount.textContent = `${adminState.requests.length} request`;
  adminCount.textContent = `${adminState.users.length} akun`;

  adminRequestList.innerHTML = "";
  if (!adminState.requests.length) {
    adminRequestList.innerHTML = '<p class="empty-state">Belum ada request akun admin.</p>';
  } else {
    adminState.requests.forEach((request) => {
      const item = document.createElement("article");
      item.className = "admin-account-item";
      item.innerHTML = `
        <div>
          <strong>${escapeHtml(request.name)}</strong>
          <span>${escapeHtml(request.username)}</span>
        </div>
        <div class="admin-row-actions">
          <button type="button" class="primary-button" data-approve-admin="${request.id}">ACC</button>
          <button type="button" class="danger-button" data-reject-admin="${request.id}">Tolak</button>
        </div>
      `;
      adminRequestList.appendChild(item);
    });
  }

  adminUserList.innerHTML = "";
  adminState.users.forEach((user) => {
    const item = document.createElement("article");
    item.className = "admin-account-item";
    item.innerHTML = `
      <div>
        <strong>${escapeHtml(user.name)}</strong>
        <span>${escapeHtml(user.username)}</span>
      </div>
      <span class="pill">Aktif</span>
    `;
    adminUserList.appendChild(item);
  });
}

function renderAdmin() {
  const config = getActiveConfig();

  tabs.forEach((tab) => {
    const isActive = tab.dataset.adminTab === adminState.table;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  formTitle.textContent = adminState.editingId
    ? `Edit data ${config.label}`
    : `Tambah data ${config.label}`;

  formFields.innerHTML = "";
  const currentItem =
    adminState.data[adminState.table].find((item) => item.id === adminState.editingId) || {};

  config.fields.forEach(([name, label, type]) => {
    const field = document.createElement("label");
    field.className = "admin-field";
    field.innerHTML = `<span>${label}</span>`;

    if (type === "image") {
      field.classList.add("admin-image-field");
      field.innerHTML = `
        <span>${label}</span>
        <input name="${name}" type="file" accept="image/*" />
        <input name="${name}Existing" type="hidden" value="${escapeHtml(currentItem[name] || "")}" />
        <div class="admin-image-preview">
          ${
            currentItem[name]
              ? `<img src="${safeUrl(currentItem[name])}" alt="Preview gambar tersimpan" />`
              : "<span>Belum ada gambar</span>"
          }
        </div>
        ${
          currentItem[name]
            ? `<label class="admin-check"><input name="${name}Remove" type="checkbox" value="1" /> Hapus gambar tersimpan</label>`
            : ""
        }
      `;
      formFields.appendChild(field);
      return;
    }

    const input =
      type === "textarea" ? document.createElement("textarea") : document.createElement("input");

    input.name = name;
    input.value = currentItem[name] || "";
    input.required = ["name", "title", "label"].includes(name);

    if (type !== "textarea") {
      input.type = type;
    }

    field.appendChild(input);
    formFields.appendChild(field);
  });

  tableHead.innerHTML = `
    <tr>
      ${config.columns.map((column) => `<th>${getFieldLabel(column)}</th>`).join("")}
      <th>Aksi</th>
    </tr>
  `;

  tableBody.innerHTML = "";
  adminState.data[adminState.table].forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      ${config.columns.map((column) => `<td>${escapeHtml(item[column] || "-")}</td>`).join("")}
      <td>
        <div class="admin-row-actions">
          <button type="button" class="ghost-button" data-edit="${item.id}">Edit</button>
          <button type="button" class="danger-button" data-delete="${item.id}">Hapus</button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });

  cancelButton.hidden = !adminState.editingId;
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    if (!requireAdmin()) {
      return;
    }

    adminState.table = tab.dataset.adminTab;
    adminState.editingId = null;
    renderAdmin();
  });
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setLoginStatus("Memproses login...");
  const formData = new FormData(loginForm);

  try {
    const result = await apiRequest("/api/admin-login", {
      method: "POST",
      body: JSON.stringify({
        username: formData.get("username"),
        password: formData.get("password")
      })
    });
    saveAdminSession({ token: result.token });
    adminState.activeUser = result.user;
    await loadDashboardData();
    loginForm.reset();
    setLoginStatus("Login berhasil.");
    renderAuthState();
  } catch (error) {
    clearAdminSession();
    setLoginStatus(error.message);
  }
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setRegisterStatus("Mengirim request...");
  const formData = new FormData(registerForm);

  try {
    await apiRequest("/api/admin-register", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        username: formData.get("username"),
        password: formData.get("password")
      })
    });
    registerForm.reset();
    setRegisterStatus("Request akun terkirim. Tunggu ACC dari admin lain.");
  } catch (error) {
    setRegisterStatus(error.message);
  }
});

adminRequestList.addEventListener("click", async (event) => {
  if (!requireAdmin()) {
    return;
  }

  const approveId = event.target.dataset.approveAdmin;
  const rejectId = event.target.dataset.rejectAdmin;
  if (!approveId && !rejectId) {
    return;
  }

  try {
    await apiRequest("/api/admin-accounts", {
      method: "POST",
      body: JSON.stringify({
        action: approveId ? "approve" : "reject",
        requestId: approveId || rejectId
      })
    });
    const accounts = await apiRequest("/api/admin-accounts");
    adminState.users = accounts.users || [];
    adminState.requests = accounts.requests || [];
    renderAdminAccounts();
    setStatus(approveId ? "Request akun admin berhasil di-ACC." : "Request akun admin ditolak.");
  } catch (error) {
    setStatus(error.message);
  }
});

logoutButton.addEventListener("click", () => {
  clearAdminSession();
  renderAuthState();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!requireAdmin()) {
    return;
  }

  setStatus("Menyimpan data...");
  const formData = new FormData(form);
  const item = Object.fromEntries(formData.entries());
  const config = getActiveConfig();
  const collection = adminState.data[adminState.table];

  for (const [name, , type] of config.fields) {
    if (type !== "image") {
      continue;
    }

    const file = formData.get(name);
    const existingValue = formData.get(`${name}Existing`) || "";
    const shouldRemove = formData.get(`${name}Remove`) === "1";

    delete item[`${name}Existing`];
    delete item[`${name}Remove`];
    item[name] = shouldRemove ? "" : existingValue;

    if (file?.size) {
      item[name] = await readImageFile(file);
    }
  }

  if (adminState.editingId) {
    const index = collection.findIndex((entry) => entry.id === adminState.editingId);
    collection[index] = { ...collection[index], ...item };
    adminState.editingId = null;
    await saveActiveTable("Data berhasil diperbarui.");
    return;
  }

  collection.unshift({
    id: createId(adminState.table),
    ...item
  });
  form.reset();
  await saveActiveTable("Data baru berhasil ditambahkan.");
});

tableBody.addEventListener("click", async (event) => {
  if (!requireAdmin()) {
    return;
  }

  const editId = event.target.dataset.edit;
  const deleteId = event.target.dataset.delete;

  if (editId) {
    adminState.editingId = editId;
    renderAdmin();
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (deleteId) {
    const item = adminState.data[adminState.table].find((entry) => entry.id === deleteId);
    const confirmed = confirm(`Hapus "${item?.name || item?.title || item?.label || "data ini"}"?`);
    if (!confirmed) {
      return;
    }

    adminState.data[adminState.table] = adminState.data[adminState.table].filter(
      (entry) => entry.id !== deleteId
    );
    adminState.editingId = null;
    await saveActiveTable("Data berhasil dihapus.");
  }
});

cancelButton.addEventListener("click", () => {
  if (!requireAdmin()) {
    return;
  }

  adminState.editingId = null;
  renderAdmin();
});

resetButton.addEventListener("click", async () => {
  if (!requireAdmin()) {
    return;
  }

  const confirmed = confirm("Kembalikan tabel aktif ke contoh awal?");
  if (!confirmed) {
    return;
  }

  adminState.data[adminState.table] = cloneData(sinargalihDefaultData[adminState.table]);
  adminState.editingId = null;
  await saveActiveTable("Tabel aktif dikembalikan ke contoh awal.");
});

exportButton.addEventListener("click", () => {
  if (!requireAdmin()) {
    return;
  }

  const blob = new Blob([JSON.stringify(adminState.data, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "data-sinargalih-connect.json";
  link.click();
  URL.revokeObjectURL(url);
  setStatus("Data berhasil diekspor.");
});

importInput.addEventListener("change", async () => {
  if (!requireAdmin()) {
    importInput.value = "";
    return;
  }

  const [file] = importInput.files;
  if (!file) {
    return;
  }

  try {
    const imported = JSON.parse(await file.text());
    const tableData = imported[adminState.table];
    if (!Array.isArray(tableData)) {
      throw new Error("File impor tidak memiliki tabel aktif.");
    }

    adminState.data[adminState.table] = tableData;
    adminState.editingId = null;
    await saveActiveTable("Data tabel aktif berhasil diimpor.");
  } catch (error) {
    setStatus(error.message || "File impor tidak valid.");
  } finally {
    importInput.value = "";
  }
});

async function initializeAdmin() {
  if (!adminState.session?.token) {
    renderAuthState();
    return;
  }

  try {
    const result = await apiRequest("/api/admin-session");
    adminState.activeUser = result.user;
    await loadDashboardData();
  } catch (error) {
    clearAdminSession();
    setLoginStatus("Sesi berakhir. Silakan login lagi.");
  }
  renderAuthState();
}

initializeAdmin();
