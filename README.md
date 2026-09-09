# SuperMart Microservices – Identity Domain (Kelompok 05)

> Monorepo proyek *microservices* SuperMart untuk mata kuliah Microservices. Berkas ini berfokus pada petunjuk setup dan pengelolaan basis data untuk **Domain Identity Service**.

---

## 📁 Struktur Monorepo (Identity Domain Focus)

```
microservices-supermart-kelompok05/
├── deployments/
│   └── docker/
│       ├── docker-compose.yml          ← Orchestration database Identity Service (PostgreSQL 15)
│       └── init-scripts/
│           └── identity/
│               └── 01-init.sql          ← Skrip DDL & DML inisialisasi basis data Identity
├── services/
│   └── identity-service/               ← Source code Identity Microservice
├── docs/
│   └── architecture-decisions.md       ← Dokumentasi keputusan arsitektur (ADR)
└── README.md                           ← Dokumentasi petunjuk instalasi & running
```

---

## ⚙️ Petunjuk Instalasi & Menjalankan Kontainer

### Prasyarat System
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v24+)
- [Git](https://git-scm.com/)

---

### 1. Mengkloning Repositori

Buka terminal / Command Prompt / PowerShell, lalu jalankan perintah:

```bash
git clone https://github.com/Dhegas/microservices-supermart-kelompok05.git
cd microservices-supermart-kelompok05
```

---

### 2. Informasi DBMS & Kredensial Basis Data (Identity Domain)

Berikut adalah spesifikasi konfigurasi basis data untuk **Identity Service**:

| Parameter | Spesifikasi / Kredensial |
| :--- | :--- |
| **Domain Service** | Identity Service |
| **Teknologi DBMS** | PostgreSQL 15 (`postgres:15-alpine`) |
| **Container Name** | `supermart-identity-db` |
| **Host Port** | `5431` |
| **Container Port** | `5432` |
| **Database Name** | `identity_service_db` |
| **Username** | `identity_admin` |
| **Password** | `identity_secret_pass` |
| **Docker Network** | `supermart-network` |
| **Volume Data** | `identity_db_data` |

---

### 3. Perintah Menyalakan & Mematikan Lingkungan Kontainer

#### 🟢 Menyalakan Kontainer Database Identity
Navigasi ke direktori `deployments/docker` dan jalankan Docker Compose:

```bash
cd deployments/docker
docker compose up -d
```

> **Catatan**: Jika ingin menyalakan spesifik kontainer `identity-db` saja:
> ```bash
> docker compose up -d identity-db
> ```

#### 🔍 Memeriksa Status Kontainer & Logs
```bash
# Mengecek status kontainer yang berjalan
docker compose ps

# Melihat log aktivitas kontainer identity-db
docker compose logs -f identity-db
```

#### 🔴 Mematikan Kontainer Database
```bash
# Menghentikan kontainer tanpa menghapus data volume
docker compose down

# Menghentikan kontainer sekaligus menghapus data volume (Reset Data)
docker compose down -v
```

---

## 🔗 Koneksi Basis Data (GUI Tools)

Anda dapat terhubung ke database menggunakan client GUI seperti **TablePlus**, **DBeaver**, **pgAdmin**, atau **DataGrip**:

```
DBMS Driver : PostgreSQL
Host        : localhost
Port        : 5431
Database    : identity_service_db
User        : identity_admin
Password    : identity_secret_pass
```

---

## 📄 Dokumentasi Tambahan

- [Architecture Decisions (ADR)](docs/architecture-decisions.md) – Justifikasi pemilihan DBMS untuk Identity Service
