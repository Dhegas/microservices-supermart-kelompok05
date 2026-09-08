-- ============================================================
-- Catalog Service – DDL & Seed Script
-- Domain  : Product catalog management
-- DBMS    : MySQL 8.0
-- ============================================================

CREATE DATABASE IF NOT EXISTS catalog_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE catalog_db;

-- Tabel categories
CREATE TABLE IF NOT EXISTS categories (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel products
CREATE TABLE IF NOT EXISTS products (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id INT UNSIGNED,
    name        VARCHAR(255)   NOT NULL,
    description TEXT,
    price       DECIMAL(15,2)  NOT NULL,
    sku         VARCHAR(100)   NOT NULL UNIQUE,
    image_url   VARCHAR(500),
    is_active   TINYINT(1)     NOT NULL DEFAULT 1,
    created_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed categories
INSERT IGNORE INTO categories (name, description) VALUES
('Makanan',    'Produk makanan segar dan kemasan'),
('Minuman',    'Minuman segar dan kemasan'),
('Elektronik', 'Perangkat elektronik rumah tangga'),
('Perawatan',  'Produk perawatan diri');

-- Seed products
INSERT IGNORE INTO products (category_id, name, price, sku) VALUES
(1, 'Beras Premium 5kg',  75000.00, 'BRS-001'),
(2, 'Air Mineral 600ml',   3500.00, 'MNM-001'),
(3, 'Lampu LED 10W',      45000.00, 'ELK-001');
