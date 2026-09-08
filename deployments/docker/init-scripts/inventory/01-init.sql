-- ============================================================
-- Inventory Service – DDL & Seed Script
-- Domain  : Stock & warehouse management
-- DBMS    : PostgreSQL 15 (Alpine)
-- ============================================================

-- Tipe ENUM untuk movement type jika belum ada
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stock_movement_type') THEN
        CREATE TYPE stock_movement_type AS ENUM ('in', 'out', 'reserve', 'release');
    END IF;
END $$;

-- Tabel stock
CREATE TABLE IF NOT EXISTS stock (
    id          BIGSERIAL PRIMARY KEY,
    product_id  BIGINT NOT NULL UNIQUE,  -- FK logis ke catalog_db.products
    quantity    INT NOT NULL DEFAULT 0,
    reserved    INT NOT NULL DEFAULT 0,
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabel stock_movements (riwayat mutasi stok)
CREATE TABLE IF NOT EXISTS stock_movements (
    id          BIGSERIAL PRIMARY KEY,
    product_id  BIGINT NOT NULL,
    type        stock_movement_type NOT NULL,
    qty         INT NOT NULL,
    note        VARCHAR(255),
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial stock
INSERT INTO stock (product_id, quantity) VALUES
(1, 500),
(2, 1200),
(3, 80)
ON CONFLICT (product_id) DO NOTHING;
