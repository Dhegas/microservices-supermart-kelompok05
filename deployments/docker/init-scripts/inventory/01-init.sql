-- ============================================================
-- Inventory Service – DDL & Seed Script
-- Domain  : Stock & warehouse management
-- DBMS    : MySQL 8.0
-- ============================================================

CREATE DATABASE IF NOT EXISTS inventory_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE inventory_db;

-- Tabel stock
CREATE TABLE IF NOT EXISTS stock (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id  BIGINT UNSIGNED NOT NULL UNIQUE,  -- FK logis ke catalog_db.products
    quantity    INT UNSIGNED    NOT NULL DEFAULT 0,
    reserved    INT UNSIGNED    NOT NULL DEFAULT 0,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel stock_movements (riwayat mutasi stok)
CREATE TABLE IF NOT EXISTS stock_movements (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id  BIGINT UNSIGNED NOT NULL,
    type        ENUM('in','out','reserve','release') NOT NULL,
    qty         INT             NOT NULL,
    note        VARCHAR(255),
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed initial stock
INSERT IGNORE INTO stock (product_id, quantity) VALUES
(1, 500),
(2, 1200),
(3, 80);
