# Workflow QGIS Batas Desa Sinargalih

Sumber awal:

- `/Users/pesal/Downloads/untitled_map.geojson`

Isi file sumber:

- `FeatureCollection`
- 4 feature bertipe `LineString`

Hasil yang dipakai di website:

- `/Users/pesal/Documents/sinargalih connect/data/village-boundary.geojson`

Catatan:

- File sumber masih berupa garis batas yang digambar dari map referensi.
- Untuk QGIS, file garis ini bisa dipakai sebagai dasar tracing atau polygonize.
- Untuk Leaflet, gunakan file `data/village-boundary.geojson` karena sudah berupa `Polygon`.

Langkah singkat di QGIS:

1. Import `untitled_map.geojson`.
2. Jika ingin area tertutup otomatis, gunakan `Polygonize` atau digitasi ulang berdasarkan garis.
3. Simpan hasilnya sebagai `GeoJSON`.
4. Ganti `data/village-boundary.geojson` di project web jika ada revisi baru.
