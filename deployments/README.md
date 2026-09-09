# Deployments & Container Orchestration – SuperMart Microservices

Folder ini berisi seluruh konfigurasi orkestrasi kontainer basis data untuk setiap domain microservice pada proyek **SuperMart (Kelompok 05)**.

---

## 📁 Struktur Folder Deployments

```
deployments/
├── docker/
│   ├── docker-compose.yml          ← Berkas utama orkestrasi kontainer database
│   └── init-scripts/               ← Skrip DDL & Seeding per domain
│       ├── identity/
│       │   └── 01-init.sql         (MySQL DDL & Seed)
│       ├── catalog/
│       │   └── 01-init.sql         (MySQL DDL & Seed)
│       ├── inventory/
│       │   └── 01-init.sql         (PostgreSQL DDL & Seed)
│       └── order/
│           └── 01-init.sql         (MySQL DDL & Seed)
└── README.md                       ← Dokumentasi deployment ini
```

---

## 📊 Tabel Konfigurasi Database Domain

Setiap domain microservice memiliki basis data terisolasi (*Database-per-Service*) yang dijalankan via Docker Compose:

| Domain | Service Name | Container Name | DBMS | Port Host | Database Name | User | Password |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Identity** | `identity-db` | `supermart-identity-db` | MySQL 8.0 | `3307` | `identity_db` | `identity_user` | `identity_secret` |
| **Catalog** | `catalog-db` | `supermart-catalog-db` | MySQL 8.0 | `3308` | `catalog_db` | `catalog_user` | `catalog_secret` |
| **Inventory** | `inventory-db` | `supermart-inventory-db` | PostgreSQL 15 | `5433` | `inventory_service_db` | `inventory_admin` | `inventory_secret_pass` |
| **Order** | `order-db` | `supermart-order-db` | MySQL 8.0 | `3310` | `order_db` | `order_user` | `order_secret` |

---

## 🚀 Langkah Menyalakan Lingkungan Kontainer

### 1. Masuk ke Folder Docker Configuration
```bash
cd deployments/docker
```

### 2. Menyalakan Seluruh Kontainer Database
```bash
docker compose up -d
```

### 3. Memeriksa Status & Health Check
Seluruh kontainer dilengkapi dengan fitur `healthcheck` otomatis.
```bash
# Memeriksa status kontainer
docker compose ps

# Memeriksa log aktivitas
docker compose logs -f
```

---

## 🔴 Perintah Mematikan & Reset Kontainer

```bash
# Mematikan kontainer (data tetap tersimpan di Docker Volume)
docker compose down

# Mematikan kontainer dan menghapus semua volume data (reset total ke kondisi awal)
docker compose down -v
```

---

## 🌐 Network & Persistent Volume

* **Network**: Seluruh kontainer database terhubung dalam jaringan bridge yang sama (`supermart-network` / `supermart-isolated-net`).
* **Volumes**: Data tersimpan secara terisolasi pada masing-masing Docker Named Volume:
  - `identity_db_data`
  - `catalog_db_data`
  - `inventory_db_data`
  - `order_db_data`
