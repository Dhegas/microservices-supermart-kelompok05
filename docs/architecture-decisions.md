# Architecture Decisions – SuperMart Microservices

**Kelompok 05** | Mata Kuliah: Microservices | Semester 7

---

## ADR-001: Pemilihan DBMS per Domain (Polyglot Persistence)

| Domain    | DBMS          | Versi | Port Host | Justifikasi |
|-----------|---------------|-------|-----------|-------------|
| Identity  | PostgreSQL    | 16    | 5431      | Data pengguna bersifat relasional dan memerlukan ACID penuh untuk keamanan autentikasi & otorisasi. |
| Catalog   | MongoDB       | 6.0   | 27017     | Karakteristik data produk dan kategori e-commerce bersifat fleksibel (*schemaless* document), mendukung atribut dinamis, dan dioptimalkan untuk query baca (*read-heavy*). |
| Inventory | PostgreSQL    | 16    | 5433      | Mutasi stok barang memerlukan transaksi atomik (ACID) untuk mencegah kondisi *race condition* atau *overselling*. |
| Order     | PostgreSQL    | 16    | 5434      | Order dan order items memerlukan konsistensi transaksi kuat, integritas data keuangan, dan audit trail yang presisi. |

---

## ADR-002: Pola Database-per-Service & Polyglot Persistence

### Konteks
Setiap microservice memiliki basis data independen untuk mencapai *loose coupling* dan otonomi penuh antar domain layanan.

### Keputusan
1. Menggunakan pola **Database-per-Service**: setiap service hanya memiliki hak akses langsung ke database miliknya sendiri.
2. Menggunakan prinsip **Polyglot Persistence**: memilih tipe database (Relasional SQL vs Dokumen NoSQL) yang paling cocok dengan model data dan pola akses spesifik domainnya.
3. Referensi lintas domain dilakukan menggunakan **Logical Foreign Key** (menyimpan ID dari service lain tanpa foreign key constraint di level database fisik).

### Konsekuensi
- ✅ Skalabilitas dan performa masing-masing domain dapat dioptimalkan secara independen.
- ✅ Perubahan skema pada satu service (misal menambah atribut produk di MongoDB) tidak mempengaruhi service lain.
- ⚠️ Join data lintas domain harus dilakukan melalui komunikasi antar service (API Composition / Event-driven).

---

## ADR-003: Orkestrasi Container & Network Isolation

### Keputusan
Menggunakan **Docker Compose v3.9** dengan custom bridge network `supermart-isolated-net` (`supermart-network`).

### Alasan
- Mengisolasi jaringan antar container database agar berada dalam satu subnet terkelola.
- Menggunakan persistent named volumes terpisah (`catalog_db_data`, `identity_db_data`, dll.) untuk mencegah kehilangan data saat container di-restart.
- Healthcheck otomatis untuk memastikan container siap menerima koneksi aplikasi.

---

## ADR-004: Strategi Inisialisasi Database

- **MongoDB (Catalog)**: Diinisialisasi melalui skrip JavaScript `init-mongo.js` yang dimounting ke `/docker-entrypoint-initdb.d/init-mongo.js` untuk membuat koleksi `categories` & `products`, mengonfigurasi indeks unik, dan memasukkan data seed awal.
- **PostgreSQL**: Diinisialisasi melalui skrip SQL DDL & Seed di folder `init-scripts/<domain>/`.

---

*Dokumen ini akan terus diperbarui seiring perkembangan praktikum.*
