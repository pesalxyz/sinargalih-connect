const letterTemplates = {
  domisili: {
    title: "Surat Keterangan Domisili",
    purposeLabel: "Keperluan Surat",
    fields: [
      ["Nama Lengkap", "nama"],
      ["NIK", "nik"],
      ["Tempat, Tanggal Lahir", "ttl"],
      ["Jenis Kelamin", "jenisKelamin"],
      ["Agama", "agama"],
      ["Pekerjaan", "pekerjaan"],
      ["Alamat Domisili", "alamat"],
      ["RT/RW", "rtRw"],
      ["Keperluan Surat", "keperluan"]
    ],
    body: (data) => [
      `Yang bertanda tangan di bawah ini menerangkan bahwa nama ${data.nama}, NIK ${data.nik}, tempat/tanggal lahir ${data.ttl}, jenis kelamin ${data.jenisKelamin}, agama ${data.agama}, pekerjaan ${data.pekerjaan}, benar berdomisili di ${data.alamat}, RT/RW ${data.rtRw}, Desa Sinargalih, Kecamatan Maniis, Kabupaten Purwakarta.`,
      `Surat keterangan ini dibuat untuk keperluan ${data.keperluan}.`
    ]
  },
  usaha: {
    title: "Surat Keterangan Usaha",
    fields: [
      ["Nama Lengkap", "nama"],
      ["NIK", "nik"],
      ["Tempat, Tanggal Lahir", "ttl"],
      ["Alamat", "alamat"],
      ["Nama Usaha", "namaUsaha"],
      ["Jenis Usaha", "jenisUsaha"],
      ["Lokasi Usaha", "lokasiUsaha"],
      ["Keperluan Surat", "keperluan"]
    ],
    body: (data) => [
      `Yang bertanda tangan di bawah ini menerangkan bahwa nama ${data.nama}, NIK ${data.nik}, tempat/tanggal lahir ${data.ttl}, beralamat di ${data.alamat}, benar memiliki usaha dengan nama ${data.namaUsaha}.`,
      `Usaha tersebut bergerak di bidang ${data.jenisUsaha} dan berlokasi di ${data.lokasiUsaha}. Surat ini dibuat untuk keperluan ${data.keperluan}.`
    ]
  },
  tidakMampu: {
    title: "Surat Keterangan Tidak Mampu",
    fields: [
      ["Nama Lengkap", "nama"],
      ["NIK", "nik"],
      ["Tempat, Tanggal Lahir", "ttl"],
      ["Pekerjaan", "pekerjaan"],
      ["Alamat", "alamat"],
      ["Keperluan Surat", "keperluan"]
    ],
    body: (data) => [
      `Yang bertanda tangan di bawah ini menerangkan bahwa nama ${data.nama}, NIK ${data.nik}, tempat/tanggal lahir ${data.ttl}, pekerjaan ${data.pekerjaan}, beralamat di ${data.alamat}, berdasarkan keterangan yang ada termasuk warga yang membutuhkan keterangan tidak mampu.`,
      `Surat keterangan ini dibuat untuk keperluan ${data.keperluan}.`
    ]
  },
  skck: {
    title: "Surat Pengantar SKCK",
    fields: [
      ["Nama Lengkap", "nama"],
      ["NIK", "nik"],
      ["Tempat, Tanggal Lahir", "ttl"],
      ["Jenis Kelamin", "jenisKelamin"],
      ["Agama", "agama"],
      ["Pekerjaan", "pekerjaan"],
      ["Alamat", "alamat"],
      ["Keperluan SKCK", "keperluan"]
    ],
    body: (data) => [
      `Yang bertanda tangan di bawah ini menerangkan bahwa nama ${data.nama}, NIK ${data.nik}, tempat/tanggal lahir ${data.ttl}, jenis kelamin ${data.jenisKelamin}, agama ${data.agama}, pekerjaan ${data.pekerjaan}, beralamat di ${data.alamat}, adalah benar warga Desa Sinargalih.`,
      `Surat pengantar ini dibuat sebagai kelengkapan pengurusan SKCK untuk keperluan ${data.keperluan}.`
    ]
  },
  kelahiran: {
    title: "Surat Keterangan Kelahiran",
    fields: [
      ["Nama Anak", "namaAnak"],
      ["Tempat, Tanggal Lahir Anak", "ttlAnak"],
      ["Jenis Kelamin Anak", "jenisKelaminAnak"],
      ["Nama Ayah", "namaAyah"],
      ["NIK Ayah", "nikAyah"],
      ["Nama Ibu", "namaIbu"],
      ["NIK Ibu", "nikIbu"],
      ["Alamat Orang Tua", "alamat"]
    ],
    body: (data) => [
      `Yang bertanda tangan di bawah ini menerangkan bahwa telah lahir seorang anak bernama ${data.namaAnak}, ${data.jenisKelaminAnak}, pada ${data.ttlAnak}.`,
      `Anak tersebut merupakan putra/putri dari Ayah ${data.namaAyah} dengan NIK ${data.nikAyah} dan Ibu ${data.namaIbu} dengan NIK ${data.nikIbu}, yang beralamat di ${data.alamat}.`
    ]
  },
  kematian: {
    title: "Surat Keterangan Kematian",
    fields: [
      ["Nama Almarhum/Almarhumah", "nama"],
      ["NIK", "nik"],
      ["Tempat, Tanggal Lahir", "ttl"],
      ["Alamat", "alamat"],
      ["Hari/Tanggal Meninggal", "tanggalMeninggal"],
      ["Tempat Meninggal", "tempatMeninggal"],
      ["Penyebab/Keterangan", "keterangan"]
    ],
    body: (data) => [
      `Yang bertanda tangan di bawah ini menerangkan bahwa nama ${data.nama}, NIK ${data.nik}, tempat/tanggal lahir ${data.ttl}, beralamat di ${data.alamat}, benar telah meninggal dunia pada ${data.tanggalMeninggal}.`,
      `Tempat meninggal: ${data.tempatMeninggal}. Keterangan: ${data.keterangan}.`
    ]
  },
  nikah: {
    title: "Surat Pengantar Nikah",
    fields: [
      ["Nama Lengkap", "nama"],
      ["NIK", "nik"],
      ["Tempat, Tanggal Lahir", "ttl"],
      ["Jenis Kelamin", "jenisKelamin"],
      ["Agama", "agama"],
      ["Pekerjaan", "pekerjaan"],
      ["Alamat", "alamat"],
      ["Nama Calon Pasangan", "namaPasangan"],
      ["Keperluan Surat", "keperluan"]
    ],
    body: (data) => [
      `Yang bertanda tangan di bawah ini menerangkan bahwa nama ${data.nama}, NIK ${data.nik}, tempat/tanggal lahir ${data.ttl}, jenis kelamin ${data.jenisKelamin}, agama ${data.agama}, pekerjaan ${data.pekerjaan}, beralamat di ${data.alamat}, adalah benar warga Desa Sinargalih.`,
      `Surat pengantar ini dibuat untuk keperluan administrasi pernikahan dengan calon pasangan ${data.namaPasangan}. Keperluan: ${data.keperluan}.`
    ]
  },
  umum: {
    title: "Surat Permohonan Umum",
    fields: [
      ["Nama Lengkap", "nama"],
      ["NIK", "nik"],
      ["Tempat, Tanggal Lahir", "ttl"],
      ["Alamat", "alamat"],
      ["Tujuan Surat", "tujuan"],
      ["Isi Permohonan", "permohonan"]
    ],
    body: (data) => [
      `Saya yang bertanda tangan di bawah ini, nama ${data.nama}, NIK ${data.nik}, tempat/tanggal lahir ${data.ttl}, beralamat di ${data.alamat}, mengajukan permohonan kepada ${data.tujuan}.`,
      `Adapun permohonan yang diajukan adalah sebagai berikut: ${data.permohonan}.`
    ]
  }
};

const signerLabels = {
  none: "",
  kepala: "Kepala Desa Sinargalih",
  sekretaris: "Sekretaris Desa Sinargalih"
};

const form = document.querySelector("#letterForm");
const typeSelect = document.querySelector("#letterType");
const fieldContainer = document.querySelector("#letterFields");
const signerSelect = document.querySelector("#letterSigner");
const notesInput = document.querySelector("#letterNotes");
const preview = document.querySelector("#letterPreview");
const printButton = document.querySelector("#printLetterButton");
const resetButton = document.querySelector("#resetLetterButton");

const escapeHtml = (value) => String(value || "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}[character]));

const todayLabel = () => new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric"
}).format(new Date());

const normalizeValue = (value) => value.trim() || "................................";
const genderFieldNames = new Set(["jenisKelamin", "jenisKelaminAnak"]);
const placeDateFieldNames = new Set(["ttl", "ttlAnak"]);
const dateFieldNames = new Set(["tanggalMeninggal"]);
const nikFieldNames = new Set(["nik", "nikAyah", "nikIbu"]);
const longFieldNames = new Set(["alamat", "lokasiUsaha", "tempatMeninggal", "keterangan", "permohonan"]);
const selectOptions = {
  agama: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Khonghucu"],
  pekerjaan: ["Belum/Tidak Bekerja", "Pelajar/Mahasiswa", "Mengurus Rumah Tangga", "Petani/Pekebun", "Buruh Harian Lepas", "Karyawan Swasta", "Wiraswasta", "Pedagang", "Guru", "PNS", "Perangkat Desa", "Pensiunan"],
  keperluan: ["Administrasi kependudukan", "Pengajuan bantuan", "Persyaratan sekolah/kuliah", "Persyaratan pekerjaan", "Persyaratan perbankan", "Pengurusan dokumen", "Kelengkapan administrasi"],
  jenisUsaha: ["Kuliner", "Sembako", "Pertanian", "Peternakan", "Jasa", "Kerajinan", "Perdagangan", "Produksi rumahan", "Warung/kios"],
  tujuan: ["Pemerintah Desa Sinargalih", "Kecamatan Maniis", "Instansi terkait", "Sekolah/perguruan tinggi", "Perusahaan/tempat kerja", "Bank/lembaga keuangan"],
  keterangan: ["Sakit", "Kecelakaan", "Usia lanjut", "Keterangan keluarga"],
  tempatMeninggal: ["Desa Sinargalih", "Kecamatan Maniis", "Kabupaten Purwakarta", "Rumah sakit", "Tempat lainnya"]
};
const otherEnabledFields = new Set(["pekerjaan", "keperluan", "jenisUsaha", "tujuan", "keterangan", "tempatMeninggal"]);
const birthPlaceOptions = [
  "Kabupaten Purwakarta",
  "Kabupaten Bandung",
  "Kabupaten Bandung Barat",
  "Kabupaten Bekasi",
  "Kabupaten Bogor",
  "Kabupaten Cianjur",
  "Kabupaten Cirebon",
  "Kabupaten Garut",
  "Kabupaten Indramayu",
  "Kabupaten Karawang",
  "Kabupaten Kuningan",
  "Kabupaten Majalengka",
  "Kabupaten Pangandaran",
  "Kabupaten Subang",
  "Kabupaten Sukabumi",
  "Kabupaten Sumedang",
  "Kabupaten Tasikmalaya",
  "Kota Bandung",
  "Kota Banjar",
  "Kota Bekasi",
  "Kota Bogor",
  "Kota Cimahi",
  "Kota Cirebon",
  "Kota Depok",
  "Kota Sukabumi",
  "Kota Tasikmalaya"
];

function fillTypeOptions() {
  Object.entries(letterTemplates).forEach(([value, template]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = template.title;
    typeSelect.append(option);
  });
}

function renderOptions(options, placeholder) {
  return [
    `<option value="">${escapeHtml(placeholder)}</option>`,
    ...options.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`)
  ].join("");
}

function renderSelectWithOther(name, options, placeholder) {
  const hasOther = otherEnabledFields.has(name);
  return `
    <select name="${name}" ${hasOther ? `data-other-toggle="${name}"` : ""} required>
      ${renderOptions(options, placeholder)}
      ${hasOther ? '<option value="__other">Lainnya</option>' : ""}
    </select>
    ${hasOther ? `<input class="letter-other-input" name="${name}Other" type="text" placeholder="Ketik pilihan lainnya" hidden />` : ""}
  `;
}

function renderPlaceDateInput(name) {
  return `
    <div class="letter-composite-field">
      <select name="${name}Place" data-other-toggle="${name}Place" required>
        ${renderOptions(birthPlaceOptions, "Pilih kabupaten/kota")}
        <option value="__other">Kabupaten/Kota lainnya</option>
      </select>
      <input name="${name}Date" type="date" required />
    </div>
    <input class="letter-other-input" name="${name}PlaceOther" type="text" placeholder="Ketik kabupaten/kota lainnya" hidden />
  `;
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  const [year, month, day] = value.split("-");
  if (!year || !month || !day) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(Number(year), Number(month) - 1, Number(day)));
}

function renderFields() {
  const template = letterTemplates[typeSelect.value];
  fieldContainer.innerHTML = "";

  template.fields.forEach(([label, name]) => {
    const field = document.createElement("label");
    field.className = "letter-field";
    field.innerHTML = `
      <span>${escapeHtml(label)}</span>
      ${placeDateFieldNames.has(name)
        ? renderPlaceDateInput(name)
        : genderFieldNames.has(name)
        ? renderSelectWithOther(name, ["Laki-laki", "Perempuan"], "Pilih jenis kelamin")
        : selectOptions[name]
        ? renderSelectWithOther(name, selectOptions[name], `Pilih ${label.toLowerCase()}`)
        : dateFieldNames.has(name)
        ? `<input name="${name}" type="date" required />`
        : nikFieldNames.has(name)
        ? `<input name="${name}" type="text" inputmode="numeric" maxlength="16" pattern="[0-9]{16}" placeholder="16 digit NIK" required />`
        : longFieldNames.has(name)
        ? `<textarea name="${name}" rows="3" required></textarea>`
        : `<input name="${name}" type="text" required />`}
    `;
    fieldContainer.append(field);
  });
}

function resolveFieldValue(name) {
  if (placeDateFieldNames.has(name)) {
    const placeInput = form.elements[`${name}Place`];
    const place = placeInput.value === "__other"
      ? normalizeValue(form.elements[`${name}PlaceOther`].value)
      : normalizeValue(placeInput.value);
    const date = normalizeValue(formatDate(form.elements[`${name}Date`].value));
    return `${place}, ${date}`;
  }

  if (dateFieldNames.has(name)) {
    return normalizeValue(formatDate(form.elements[name].value));
  }

  const input = form.elements[name];
  if (input?.value === "__other") {
    return normalizeValue(form.elements[`${name}Other`].value);
  }

  return normalizeValue(input.value);
}

function collectData(template) {
  return Object.fromEntries(template.fields.map(([, name]) => {
    return [name, resolveFieldValue(name)];
  }));
}

function updateOtherInput(select) {
  const fieldName = select.dataset.otherToggle;
  if (!fieldName) {
    return;
  }

  const otherInput = form.elements[`${fieldName}Other`];
  const needsOtherValue = select.value === "__other";
  otherInput.hidden = !needsOtherValue;
  otherInput.required = needsOtherValue;
  if (!needsOtherValue) {
    otherInput.value = "";
  }
}

function renderLetter(event) {
  event.preventDefault();
  const template = letterTemplates[typeSelect.value];
  const data = collectData(template);
  const paragraphs = template.body(data);
  const notes = notesInput.value.trim();
  const signer = signerSelect.value;
  const signerLabel = signerLabels[signer];

  preview.innerHTML = `
    <header class="letter-head">
      <img src="./assets/images/logo-sinargalih-transparent.png" alt="Logo Desa Sinargalih" />
      <div>
        <strong>Pemerintah Desa Sinargalih</strong>
        <span>Kecamatan Maniis, Kabupaten Purwakarta</span>
      </div>
    </header>
    <section class="letter-title">
      <h2>${escapeHtml(template.title)}</h2>
      <p>Nomor: ...... / ...... / Desa-Sinargalih</p>
    </section>
    <section class="letter-body">
      ${paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
      ${notes ? `<p>Catatan tambahan: ${escapeHtml(notes)}</p>` : ""}
      <p>Demikian surat ini dibuat dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
    </section>
    <footer class="letter-signature">
      <div>
        <span>Sinargalih, ${todayLabel()}</span>
        ${signerLabel
          ? `<strong>${escapeHtml(signerLabel)}</strong><em>................................</em>`
          : `<strong>Pemohon</strong><em>................................</em>`}
      </div>
    </footer>
    ${signerLabel
      ? `<aside class="letter-validation-note">Draft ini membutuhkan verifikasi dan tanda tangan ${escapeHtml(signerLabel)}. Silakan hubungi kontak desa atau datang ke kantor desa dengan membawa dokumen pendukung.</aside>`
      : `<aside class="letter-validation-note">Draft ini belum menjadi dokumen resmi sebelum diverifikasi oleh pihak desa apabila diperlukan.</aside>`}
  `;
}

function resetLetter() {
  form.reset();
  renderFields();
  preview.innerHTML = '<div class="letter-empty-state">Isi form dan klik Generate Surat untuk melihat draft di sini.</div>';
}

fillTypeOptions();
renderFields();

typeSelect.addEventListener("change", renderFields);
fieldContainer.addEventListener("change", (event) => {
  if (event.target.matches("[data-other-toggle]")) {
    updateOtherInput(event.target);
  }
});
form.addEventListener("submit", renderLetter);
resetButton.addEventListener("click", resetLetter);
printButton.addEventListener("click", () => window.print());
