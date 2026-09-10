// ============================================================
// Catalog Service – MongoDB Initialization & Seeding Script
// Domain : Product Catalog Management
// DBMS   : MongoDB 6.0
// Database: catalog_service_db
// ============================================================

const dbName = 'catalog_service_db';
const user = 'catalog_admin';
const pass = 'catalog_secret_pass';

// Pindah ke database katalog
const catalogDb = db.getSiblingDB(dbName);

// Buat koleksi categories
catalogDb.createCollection('categories');
catalogDb.categories.createIndex({ slug: 1 }, { unique: true });

// Seed data categories
const categoriesResult = catalogDb.categories.insertMany([
  {
    _id: ObjectId("650000000000000000000001"),
    name: "Makanan",
    slug: "makanan",
    description: "Produk makanan segar dan kemasan",
    created_at: new Date()
  },
  {
    _id: ObjectId("650000000000000000000002"),
    name: "Minuman",
    slug: "minuman",
    description: "Minuman segar dan kemasan",
    created_at: new Date()
  },
  {
    _id: ObjectId("650000000000000000000003"),
    name: "Elektronik",
    slug: "elektronik",
    description: "Perangkat elektronik rumah tangga",
    created_at: new Date()
  },
  {
    _id: ObjectId("650000000000000000000004"),
    name: "Perawatan",
    slug: "perawatan",
    description: "Produk perawatan diri",
    created_at: new Date()
  }
]);

// Buat koleksi products
catalogDb.createCollection('products');
catalogDb.products.createIndex({ sku: 1 }, { unique: true });
catalogDb.products.createIndex({ category_id: 1 });

// Seed data products
catalogDb.products.insertMany([
  {
    name: "Beras Premium 5kg",
    sku: "BRS-001",
    category_id: ObjectId("650000000000000000000001"),
    category_name: "Makanan",
    description: "Beras kualitas super pulen 5kg",
    price: 75000,
    attributes: {
      weight: "5kg",
      brand: "SuperRaya"
    },
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: "Air Mineral 600ml",
    sku: "MNM-001",
    category_id: ObjectId("650000000000000000000002"),
    category_name: "Minuman",
    description: "Air mineral pegunungan 600ml",
    price: 3500,
    attributes: {
      volume: "600ml",
      packaging: "Botol"
    },
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: "Lampu LED 10W",
    sku: "ELK-001",
    category_id: ObjectId("650000000000000000000003"),
    category_name: "Elektronik",
    description: "Lampu LED hemat energi 10 Watt",
    price: 45000,
    attributes: {
      wattage: "10W",
      color: "Cool Daylight",
      warranty: "1 Tahun"
    },
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  }
]);

print("✅ [init-mongo.js] catalog_service_db initialized and seeded successfully!");
