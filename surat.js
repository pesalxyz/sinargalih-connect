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

function fillTypeOptions() {
  Object.entries(letterTemplates).forEach(([value, template]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = template.title;
    typeSelect.append(option);
  });
}

function renderFields() {
  const template = letterTemplates[typeSelect.value];
  fieldContainer.innerHTML = "";

  template.fields.forEach(([label, name]) => {
    const field = document.createElement("label");
    field.className = "letter-field";
    const isLongField = ["alamat", "keperluan", "keterangan", "permohonan"].includes(name);
    const isGenderField = genderFieldNames.has(name);
    field.innerHTML = `
      <span>${escapeHtml(label)}</span>
      ${isGenderField
        ? `<select name="${name}" required>
            <option value="">Pilih jenis kelamin</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>`
        : isLongField
        ? `<textarea name="${name}" rows="3" required></textarea>`
        : `<input name="${name}" type="text" required />`}
    `;
    fieldContainer.append(field);
  });
}

function collectData(template) {
  return Object.fromEntries(template.fields.map(([, name]) => {
    const input = form.elements[name];
    return [name, normalizeValue(input.value)];
  }));
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
      <strong>Pemerintah Desa Sinargalih</strong>
      <span>Kecamatan Maniis, Kabupaten Purwakarta</span>
      <span>Draft surat dari Sinargalih Connect</span>
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
form.addEventListener("submit", renderLetter);
resetButton.addEventListener("click", resetLetter);
printButton.addEventListener("click", () => window.print());
