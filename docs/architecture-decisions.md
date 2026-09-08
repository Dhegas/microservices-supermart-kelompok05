# Architecture Decisions – SuperMart Microservices

**Kelompok 05** | Mata Kuliah: Microservices | Semester 7

---

## ADR-001: Pemilihan DBMS per Domain

| Domain          | DBMS      | Versi | Port  | Justifikasi |
|-----------------|-----------|-------|-------|-------------|
| Identity        | MySQL 8.0 | 8.0   | 3307  | Data pengguna bersifat relasional dan memerlukan ACID penuh untuk keamanan autentikasi |
| Catalog         | MySQL 8.0 | 8.0   | 3308  | Produk dan kategori memiliki relasi FK yang kuat; query JOIN intensif cocok untuk RDBMS |
| Inventory       | MySQL 8.0 | 8.0   | 3309  | Mutasi stok memerlukan transaksi atomik untuk mencegah race condition (overselling) |
| Order           | MySQL 8.0 | 8.0   | 3310  | Order dan order_items memerlukan konsistensi ACID dan relasi FK yang ketat |

---

## ADR-002: Pola Database-per-Service

### Konteks
Setiap microservice memiliki database independen untuk mencapai *loose coupling* antar domain.

### Keputusan
Menggunakan pola **Database-per-Service**: setiap service hanya dapat mengakses database miliknya sendiri. Referensi lintas domain dilakukan melalui **Logical Foreign Key** (ID disimpan, tanpa FK constraint di level database).

### Konsekuensi
- ✅ Setiap service dapat di-scale dan di-deploy secara independen
- ✅ Perubahan skema satu domain tidak berdampak ke domain lain
- ⚠️  Join lintas domain harus dilakukan di application layer (API Composition atau CQRS)

---

## ADR-003: Orkestrasi Container

### Keputusan
Menggunakan **Docker Compose v3.9** untuk orkestrasi database lokal selama fase development.

### Alasan
- Mudah di-reproduce di semua mesin anggota tim
- Health check bawaan untuk memastikan database siap sebelum service terhubung
- Volume terpisah per database untuk isolasi data

---

## ADR-004: Strategi Inisialisasi Database

Setiap database diinisialisasi melalui skrip SQL di folder `init-scripts/<domain>/` yang dipasang sebagai volume ke `/docker-entrypoint-initdb.d/` MySQL. Urutan eksekusi dikontrol oleh prefix numerik (01-, 02-, dst.).

---

*Dokumen ini akan diperbarui seiring perkembangan praktikum.*
