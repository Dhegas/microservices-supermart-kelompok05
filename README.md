# SuperMart Microservices – Kelompok 05

> Monorepo proyek microservices SuperMart untuk mata kuliah Microservices, Semester 7.

---

## 📁 Struktur Monorepo

```
microservices-supermart-kelompok05/
├── deployments/
│   └── docker/
│       ├── docker-compose.yml          ← Orkestrasi seluruh database domain
│       └── init-scripts/               ← Skrip DDL & seeding per domain
│           ├── identity/
│           │   └── 01-init.sql
│           ├── catalog/
│           │   └── 01-init.sql
│           ├── inventory/
│           │   └── 01-init.sql
│           └── order/
│               └── 01-init.sql
├── services/                           ← Source code microservices (praktikum lanjutan)
│   ├── identity-service/
│   ├── catalog-service/
│   ├── inventory-service/
│   └── order-service/
├── docs/
│   └── architecture-decisions.md       ← Justifikasi pemilihan DBMS
└── README.md
```

---

## 🚀 Setup & Menjalankan Database

### Prasyarat
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v24+)
- Git

### 1. Clone Repositori

```bash
git clone https://github.com/Dhegas/microservices-supermart-kelompok05.git
cd microservices-supermart-kelompok05
```

### 2. Jalankan Seluruh Database

```bash
cd deployments/docker
docker compose up -d
```

Perintah ini akan menjalankan 4 kontainer MySQL:

| Container              | Database      | Port Host |
|------------------------|---------------|-----------|
| supermart-db-identity  | identity_db   | 3307      |
| supermart-db-catalog   | catalog_db    | 3308      |
| supermart-db-inventory | inventory_db  | 3309      |
| supermart-db-order     | order_db      | 3310      |

### 3. Verifikasi Status

```bash
docker compose ps
docker compose logs -f
```

### 4. Menghentikan Database

```bash
docker compose down          # hentikan tanpa hapus volume
docker compose down -v       # hentikan + hapus semua volume (reset data)
```

---

## 🔗 Koneksi Database (Development)

Gunakan tools seperti TablePlus / DBeaver / MySQL Workbench:

```
Host     : localhost
User     : <domain>_user   (contoh: identity_user)
Password : <domain>_secret (contoh: identity_secret)
Port     : lihat tabel di atas
```

---

## 📋 Anggota Kelompok 05

| Nama | NIM | Domain |
|------|-----|--------|
| (Isi sesuai anggota kelompok) | | |

---

## 📄 Dokumentasi

- [Architecture Decisions](docs/architecture-decisions.md) – Justifikasi pemilihan DBMS per domain
