-- ============================================================
-- Order Service – DDL & Seed Script
-- Domain  : Order & transaction management
-- DBMS    : MySQL 8.0
-- ============================================================

CREATE DATABASE IF NOT EXISTS order_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE order_db;

-- Tabel orders
CREATE TABLE IF NOT EXISTS orders (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT UNSIGNED NOT NULL,  -- FK logis ke identity_db.users
    status       ENUM('pending','confirmed','processing','shipped','delivered','cancelled')
                 NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    note         TEXT,
    created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel order_items
CREATE TABLE IF NOT EXISTS order_items (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id    BIGINT UNSIGNED NOT NULL,
    product_id  BIGINT UNSIGNED NOT NULL,  -- FK logis ke catalog_db.products
    qty         INT UNSIGNED    NOT NULL,
    unit_price  DECIMAL(15,2)   NOT NULL,
    subtotal    DECIMAL(15,2)   GENERATED ALWAYS AS (qty * unit_price) STORED,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
