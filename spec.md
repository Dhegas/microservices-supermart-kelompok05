SPESIFIKASI ARSITEKTUR MONOLITIK & KAMUS DATA (120 TABEL)

Sistem Informasi Terpadu: PT Nusantara SuperMart Indonesia

1. METADATA SISTEM & KONTEKS OPERASIONAL

Nama Entitas: PT Nusantara SuperMart Indonesia

Domain Industri: Omnichannel Retail & Supply Chain Enterprise

Arsitektur Eksisting: Monolitik Berlapis (Layered Monolith), Skema Basis Data Relasional Tunggal (nusantara_db)

DBMS Engine: MySQL 8.0 / PostgreSQL (InnoDB / ACID Relasional Penuh)

Skala Transaksi: Rata-rata 120.000 transaksi/hari (lonjakan hingga 8x lipat saat flash sale / payday promo)

Jumlah Tabel: 120 Tabel Fisik yang terbagi ke dalam 9 Kluster Fungsional

Tujuan Dekomposisi: Pemodelan Strategic Domain-Driven Design (DDD) menuju arsitektur Database-per-Service otonom

2.  TOPOLOGI 9 KLUSTER FUNGSIONAL MONOLITIK

                                      [ NUSANTARA SUPERMART CORE ]
                                                    │

    ┌───────────────┬───────────────┬────────────┼────────────┬───────────────┬───────────────┐
    ▼ ▼ ▼ ▼ ▼ ▼ ▼
    Kluster 1 Kluster 2 Kluster 3 Kluster 4 Kluster 5 Kluster 6 Kluster 7
    Identitas Katalog Inventaris Order & Pembayaran Promosi & Logistik &
    & Akun Produk & Gudang Checkout & Finansial Loyalitas Kurir
    (12 Tabel) (16 Tabel) (15 Tabel) (18 Tabel) (12 Tabel) (14 Tabel) (13 Tabel)
    │ │
    ├─────────────────────┬───────────────────────┘
    ▼ ▼
    Kluster 8 Kluster 9
    Pengadaan Layanan
    (10 Tabel) (10 Tabel)

3.  RINCIAN FUNGSIONALITAS & KAMUS DATA 120 TABEL

📦 KLUSTER 1: IDENTITAS, AKUN, & AKSES PENGGUNA (12 TABEL)

Fungsi Bisnis Utama:

Mengelola siklus hidup akun pengguna multi-peran (pelanggan, staf gudang, kasir, kurir, dan administrator), autentikasi terpusat, pengamanan ganda (Two-Factor Authentication / 2FA), sesi login, verifikasi identitas resmi (Know Your Customer / KYC), serta kontrol otorisasi berbasis peran (Role-Based Access Control / RBAC).

|

| No | Nama Tabel | Deskripsi & Fungsi Teknis Tabel | Entitas Kunci / Kolom Utama | Ketergantungan Relasional Monolitik |
| 1 | users | Entitas induk akun pengguna sistem; menyimpan identitas login dasar dan status akun. | id, email, password_hash, phone_number, is_active, created_at | Menjadi referensi foreign key bagi hampir seluruh kluster transaksi. |
| 2 | user_profiles | Biodata demografis dan informasi personal pelengkap akun pengguna. | id, user_id, gender, birth_date, avatar_url, bio | user_id $\rightarrow$ users(id) |
| 3 | user_addresses | Buku alamat pengiriman dan penagihan pelanggan lengkap dengan koordinat geolokasi. | id, user_id, recipient_name, street_address, city, postal_code, latitude, longitude | user_id $\rightarrow$ users(id) |
| 4 | user_kyc_documents | Arsip berkas verifikasi identitas legal resmi (KTP/SIM/Paspor) untuk kepatuhan regulasi finansial. | id, user_id, id_card_number, id_card_image_url, verification_status | user_id $\rightarrow$ users(id) |
| 5 | roles | Master daftar peran hak akses organisasi (misal: SUPER_ADMIN, WAREHOUSE_STAFF, COURIER, CUSTOMER). | id, role_name, description | - |
| 6 | permissions | Master izin hak akses granular pada level fungsional fitur sistem. | id, permission_key, description | - |
| 7 | role_permissions | Relasi many-to-many antara peran akses (roles) dan izin fitur (permissions). | role_id, permission_id | $\rightarrow$ roles(id), permissions(id) |
| 8 | user_roles | Relasi many-to-many penetapan satu atau lebih peran akses kepada pengguna tertentu. | user_id, role_id | $\rightarrow$ users(id), roles(id) |
| 9 | auth_tokens | Penyimpanan token sesi autentikasi pengguna (access token dan refresh token). | id, user_id, token_value, token_type, expires_at | user_id $\rightarrow$ users(id) |
| 10 | login_histories | Rekam jejak audit keamanan setiap aktivitas login pengguna (deteksi anomali login). | id, user_id, ip_address, user_agent, login_time | user_id $\rightarrow$ users(id) |
| 11 | password_resets | Token unik sementara untuk alur verifikasi permintaan setel ulang kata sandi pengguna. | id, user_id, reset_token, is_used, expires_at | user_id $\rightarrow$ users(id) |
| 12 | two_factor_auths | Konfigurasi otentikasi dua faktor berbasis TOTP (Time-based One-Time Password) dan kunci rahasia. | id, user_id, secret_key, is_enabled | user_id $\rightarrow$ users(id) |

🏷️ KLUSTER 2: KATALOG PRODUK, KATEGORI, & BRAND (16 TABEL)

Fungsi Bisnis Utama:

Mengelola data master produk retail, struktur hierarki taksonomi kategori barang, merek dagang (brand), spesifikasi atribut teknis dinamis, variasi turunan SKU produk, translasi multi-bahasa, serta ulasan dan penilaian kepuasan pembeli.

| No | Nama Tabel | Deskripsi & Fungsi Teknis Tabel | Entitas Kunci / Kolom Utama | Ketergantungan Relasional Monolitik |
| 13 | brands | Data master produsen dan pemilik merek dagang produk. | id, brand_name, logo_url, website_url | - |
| 14 | categories | Data master kategori produk (parent & leaf categories). | id, category_name, slug, icon_url | - |
| 15 | category_hierarchies | Pemetaan struktur pohon hierarki kategori multi-tingkat (parent-child relationship). | parent_category_id, child_category_id, depth_level | $\rightarrow$ categories(id) |
| 16 | products | Entitas induk katalog barang; menyimpan nama, deskripsi, berat, dan harga dasar. | id, sku, title, description, base_price, brand_id, weight_gram, is_published | brand_id $\rightarrow$ brands(id) |
| 17 | product_translations | Lokalisasi penamaan dan deskripsi produk dalam berbagai bahasa (misal: ID dan EN). | id, product_id, language_code, translated_title, translated_description | product_id $\rightarrow$ products(id) |
| 18 | product_categories | Relasi many-to-many antara produk dan kategori (produk dapat tampil di beberapa kategori). | product_id, category_id | $\rightarrow$ products(id), categories(id) |
| 19 | product_attributes | Master spesifikasi nama atribut dinamis produk (misal: Warna, Dimensi, Garansi). | id, attribute_name | - |
| 20 | attribute_values | Nilai-nilai spesifik dari masing-masing atribut (misal: "Merah", "128 GB", "Dingin"). | id, attribute_id, value_name | attribute_id $\rightarrow$ product_attributes(id) |
| 21 | product_attribute_values | Penetapan nilai atribut spesifik ke dalam entitas produk tertentu. | product_id, attribute_value_id | $\rightarrow$ products(id), attribute_values(id) |
| 22 | product_images | Galeri berkas gambar produk, penanda gambar sampul utama, dan urutan tayang. | id, product_id, image_url, is_primary, display_order | product_id $\rightarrow$ products(id) |
| 23 | product_variants | Turunan variasi produk dengan kode SKU fisik tersendiri dan selisih harga khusus. | id, product_id, variant_sku, additional_price | product_id $\rightarrow$ products(id) |
| 24 | product_variant_options | Menghubungkan kombinasi nilai atribut tertentu ke dalam sebuah entitas varian. | variant_id, attribute_value_id | $\rightarrow$ product_variants(id), attribute_values(id) |
| 25 | tags | Master kata kunci penanda pencarian untuk kebutuhan mesin pencari dan penelusuran katalog. | id, tag_name | - |
| 26 | product_tags | Relasi many-to-many pemetaan tag pencarian ke produk terkait. | product_id, tag_id | $\rightarrow$ products(id), tags(id) |
| 27 | product_barcodes | Registrasi nomor barcode standar industri (EAN-13, UPC) untuk operasional kasir dan gudang. | id, product_id, barcode_number, barcode_type | product_id $\rightarrow$ products(id) |
| 28 | product_reviews | Ulasan testimoni pembeli, skor penilaian bintang (1–5), dan masukan kualitas barang. | id, product_id, user_id, rating, review_text | $\rightarrow$ products(id), users(id) (Kopling Silang Kluster 1) |

🏭 KLUSTER 3: INVENTARIS, GUDANG, & MANAJEMEN STOK (15 TABEL)

Fungsi Bisnis Utama:

Mengelola jaringan fasilitas gudang fisik (fulfillment center), zonasi suhu penyimpanan, hierarki kompartemen rak, nomor batch kedaluwarsa, saldo kuantitas stok fisik versus reservasi pesanan, mutasi antar-cabang, audit opname fisik, serta ambang batas pemesanan ulang (reorder point).

| No | Nama Tabel | Deskripsi & Fungsi Teknis Tabel | Entitas Kunci / Kolom Utama | Ketergantungan Relasional Monolitik |
| 29 | warehouses | Data master gedung fasilitas gudang, kode cabang operasional, dan lokasi geografis. | id, warehouse_code, warehouse_name, address, city | - |
| 30 | warehouse_zones | Pembagian zonasi spesifik di dalam gudang (suhu ruang, cold storage, area barang rapuh). | id, warehouse_id, zone_code, zone_type | warehouse_id $\rightarrow$ warehouses(id) |
| 31 | warehouse_shelves | Kode kompartemen rak fisik penyimpanan barang beserta kapasitas volume kubik. | id, zone_id, shelf_code, capacity_cubic_meter | zone_id $\rightarrow$ warehouse_zones(id) |
| 32 | inventory_items | Pelacakan nomor seri individual (serial number) barang bernilai tinggi pada lokasi rak tertentu. | id, product_id, shelf_id, serial_number | $\rightarrow$ products(id), warehouse_shelves(id) |
| 33 | inventory_batches | Pencatatan nomor batch pabrikasi, tanggal produksi, dan tanggal kedaluwarsa barang masuk. | id, batch_number, production_date, expiration_date | - |
| 34 | inventory_stocks | Tabel inti saldo stok; mencatat kuantitas stok fisik (on hand) dan stok terpesan (reserved). | id, product_id, warehouse_id, batch_id, quantity_on_hand, quantity_reserved | $\rightarrow$ products(id), warehouses(id), inventory_batches(id) |
| 35 | stock_mutations | Riwayat transaksi pemindahan fisik stok barang antar-fasilitas gudang cabang. | id, product_id, source_warehouse_id, destination_warehouse_id, quantity | $\rightarrow$ products(id), warehouses(id) |
| 36 | stock_reservations | Penguncian sementara kuantitas stok saat pembeli berada pada alur checkout agar tidak terjadi overselling. | id, product_id, reference_order_id, reserved_quantity, status | $\rightarrow$ products(id) (Kopling Logis ke Order) |
| 37 | stock_opnames | Dokumen pelaksanaan audit fisik penghitungan stok secara berkala oleh staf auditor gudang. | id, warehouse_id, opname_number, opname_date, conducted_by_user_id | $\rightarrow$ warehouses(id), users(id) (Kopling Silang Kluster 1) |
| 38 | stock_opname_items | Rincian selisih kuantitas antara saldo buku sistem dengan hasil hitung fisik di lapangan. | id, stock_opname_id, product_id, system_qty, physical_qty, discrepancy_qty | $\rightarrow$ stock_opnames(id), products(id) |
| 39 | supplier_returns | Dokumen retur barang rusak atau barang mendekati masa kedaluwarsa kembali ke pihak pemasok. | id, return_number, warehouse_id, return_date, reason | warehouse_id $\rightarrow$ warehouses(id) |
| 40 | supplier_return_items | Rincian daftar barang dan kuantitas unit yang dikembalikan kepada pihak pemasok. | id, supplier_return_id, product_id, quantity | $\rightarrow$ supplier_returns(id), products(id) |
| 41 | damaged_goods | Pencatatan barang yang mengalami kerusakan di dalam gudang untuk penghapusan buku (write-off). | id, product_id, warehouse_id, quantity, damage_description | $\rightarrow$ products(id), warehouses(id) |
| 42 | reorder_rules | Aturan batas kuantitas minimum stok untuk memicu rekomendasi purchase order otomatis. | id, product_id, minimum_threshold, recommended_reorder_qty | product_id $\rightarrow$ products(id) |
| 43 | low_stock_alerts | Log peringatan dini ketika saldo stok di suatu cabang gudang telah menyentuh batas kritis. | id, product_id, warehouse_id, current_stock, threshold, is_resolved | $\rightarrow$ products(id), warehouses(id) |

🛒 KLUSTER 4: TRANSAKSI PENJUALAN, ORDER, & KERANJANG (18 TABEL)

Fungsi Bisnis Utama:

Mengelola alur transaksi belanja daring: penampungan keranjang (cart), sesi checkout sementara, penerbitan pesanan (sales order), rincian garis barang pembelian, riwayat perubahan status siklus transaksi, pembatalan pesanan (cancellation), pembagian pesanan antar-gudang (split order), penawaran harga korporat (B2B sales quotes), serta audit log transaksi.

| No | Nama Tabel | Deskripsi & Fungsi Teknis Tabel | Entitas Kunci / Kolom Utama | Ketergantungan Relasional Monolitik |
| 44 | carts | Entitas induk keranjang belanja aktif milik masing-masing pelanggan. | id, user_id, created_at | user_id $\rightarrow$ users(id) (Kopling Silang Kluster 1) |
| 45 | cart_items | Rincian daftar barang dan kuantitas unit yang disimpan di dalam keranjang pelanggan. | id, cart_id, product_id, quantity | $\rightarrow$ carts(id), products(id) (Kopling Silang Kluster 2) |
| 46 | order_statuses | Master tahapan siklus status pesanan (Awaiting Payment, Processing, Shipped, Completed, Cancelled). | id, status_code, status_name | - |
| 47 | orders | Entitas transaksi penjualan induk; mencatat nomor pesanan, total tagihan, potongan, dan status. | id, order_number, customer_id, shipping_address_id, order_status_id, warehouse_id, total_net_amount | $\rightarrow$ users(id), user_addresses(id), order_statuses(id), warehouses(id) |
| 48 | order_items | Baris rincian barang yang dibeli (ID produk, harga satuan saat dibeli, kuantitas, subtotal). | id, order_id, product_id, quantity, unit_price, subtotal | $\rightarrow$ orders(id), products(id) (Kopling Silang Kluster 2) |
| 49 | order_status_histories | Buku catatan kronologis perubahan status pesanan beserta catatan audit dari staf atau sistem. | id, order_id, order_status_id, notes, changed_at | $\rightarrow$ orders(id), order_statuses(id) |
| 50 | order_cancellations | Dokumentasi pembatalan transaksi, alasan pembatalan, dan pihak yang membatalkan. | id, order_id, cancelled_by_user_id, cancel_reason, cancelled_at | $\rightarrow$ orders(id), users(id) |
| 51 | order_discounts | Rincian komponen nilai potongan harga atau promosi yang diaplikasikan pada transaksi pesanan. | id, order_id, discount_type, discount_value | order_id $\rightarrow$ orders(id) |
| 52 | order_tax_details | Rincian kalkulasi pengenaan nilai pajak pertambahan nilai (PPN) pada invoice pesanan. | id, order_id, tax_name, tax_rate_percent, tax_calculated_amount | order_id $\rightarrow$ orders(id) |
| 53 | order_shipping_details | Rincian ekspedisi terpilih, estimasi tarif kirim, dan nomor resi kurir yang terpasang pada order. | id, order_id, courier_name, tracking_number, shipping_cost | order_id $\rightarrow$ orders(id) |
| 54 | checkout_sessions | Penyimpanan status payload sementara pengguna saat berada di tahapan layar checkout. | id, user_id, session_payload, expires_at | user_id $\rightarrow$ users(id) |
| 55 | sales_quotes | Dokumen penawaran harga resmi (quotation) untuk transaksi pesanan korporat (B2B). | id, quote_number, customer_id, total_amount, valid_until | customer_id $\rightarrow$ users(id) |
| 56 | sales_quote_items | Rincian daftar barang dan penawaran harga khusus negosiasi pada dokumen penawaran harga B2B. | id, quote_id, product_id, quantity, quoted_price | $\rightarrow$ sales_quotes(id), products(id) |
| 57 | split_orders | Pemecahan pesanan induk pembeli menjadi beberapa sub-order karena barang dikirim dari gudang terpisah. | id, parent_order_id, child_order_id, split_reason | $\rightarrow$ orders(id) |
| 58 | preorders | Manajemen pesanan indent untuk produk yang belum tersedia di gudang beserta estimasi ketersediaan. | id, order_id, expected_availability_date | order_id $\rightarrow$ orders(id) |
| 59 | order_notes | Catatan komunikasi khusus antara pembeli dan tim operasional (misal: instruksi pengemasan). | id, order_id, author_user_id, note_content, created_at | $\rightarrow$ orders(id), users(id) |
| 60 | order_audit_logs | Rekam jejak audit teknis mutasi data pesanan untuk kepatuhan regulasi internal perusahaan. | id, order_id, action_taken, raw_changes, timestamp | order_id $\rightarrow$ orders(id) |
| 61 | order_item_fulfillments | Pelacakan status pemenuhan pengambilan fisik barang di rak gudang untuk setiap baris pesanan. | id, order_item_id, fulfilled_quantity, fulfilled_at | order_item_id $\rightarrow$ order_items(id) |

💳 KLUSTER 5: PEMBAYARAN, FAKTUR, & PENGEMBALIAN DANA (12 TABEL)

Fungsi Bisnis Utama:

Mengintegrasikan gerbang pembayaran (payment gateway), penerbitan faktur tagihan (invoice), pencatatan transaksi masuk, penanganan notifikasi webhook callback, pengelolaan saldo dompet kredit toko (store credit), pengembalian dana (refund), rekening perantara (escrow), dan pencairan dana keluar (disbursement).

| No | Nama Tabel | Deskripsi & Fungsi Teknis Tabel | Entitas Kunci / Kolom Utama | Ketergantungan Relasional Monolitik |
| 62 | payment_methods | Master kanal metode pembayaran (QRIS Dinamis, Virtual Account BCA/Mandiri, Kartu Kredit, Paylater). | id, method_code, method_name | - |
| 63 | payment_gateways | Konfigurasi teknis koneksi API ke vendor pihak ketiga penyedia pembayaran (Midtrans, Xendit). | id, gateway_name, api_endpoint, is_active | - |
| 64 | payment_invoices | Dokumen tagihan pembayaran resmi yang diterbitkan untuk setiap pesanan beserta tenggat waktu bayar. | id, invoice_number, order_id, customer_id, amount, payment_status, due_date | $\rightarrow$ orders(id), users(id) (Kopling Silang Kluster 4 & 1) |
| 65 | payment_transactions | Catatan eksekusi transaksi riil pembayaran, nomor referensi unik bank, dan waktu pelunasan. | id, invoice_id, payment_method_id, gateway_id, transaction_reference, amount_paid, status | $\rightarrow$ payment_invoices(id), payment_methods(id), payment_gateways(id) |
| 66 | payment_callbacks | Log penerimaan notifikasi webhook dari payment gateway pihak ketiga untuk audit dan rekonsiliasi. | id, gateway_id, payload, received_at | gateway_id $\rightarrow$ payment_gateways(id) |
| 67 | refunds | Dokumen pengajuan klaim pengembalian dana akibat pembatalan pesanan atau klaim retur disetujui. | id, refund_number, order_id, requested_by_user_id, total_refund_amount, refund_status | $\rightarrow$ orders(id), users(id) |
| 68 | refund_items | Rincian baris barang pesanan spesifik yang disetujui pengembalian uangnya beserta nominal subtotal. | id, refund_id, order_item_id, quantity, refund_subtotal | $\rightarrow$ refunds(id), order_items(id) |
| 69 | refund_transactions | Bukti eksekusi transfer balik dana pengembalian ke rekening bank atau saldo dompet pelanggan. | id, refund_id, transaction_reference, disbursed_amount, disbursed_at | refund_id $\rightarrow$ refunds(id) |
| 70 | escrow_accounts | Rekening penampungan internal yang menahan dana transaksi sebelum pesanan dikonfirmasi selesai. | id, order_id, held_amount, is_released | order_id $\rightarrow$ orders(id) |
| 71 | store_credits | Saldo dompet digital internal pelanggan yang dapat digunakan sebagai alat pembayaran transaksi belanja. | id, user_id, balance | user_id $\rightarrow$ users(id) |
| 72 | credit_transactions | Buku besar transaksi mutasi debit dan kredit pada saldo store credit milik masing-masing pelanggan. | id, store_credit_id, amount, transaction_type, description | store_credit_id $\rightarrow$ store_credits(id) |
| 73 | disbursement_ledgers | Buku besar pengeluaran transfer dana dari sistem ke rekening bank mitra vendor atau pelanggan. | id, disbursement_reference, amount, recipient_bank_code, recipient_account_number, status | - |

🎉 KLUSTER 6: PROMOSI, DISKON, VOUCHER, & LOYALITAS (14 TABEL)

Fungsi Bisnis Utama:

Mengelola strategi promosi ritel: pembuatan kode kupon promo, konfigurasi diskon bertingkat (tiered discounts), pembatasan kuota dan kelayakan voucher pelanggan, bundling paket barang hemat, program saldo poin loyalitas, program cashback, serta ajang obral kilat (flash sale).

| No | Nama Tabel | Deskripsi & Fungsi Teknis Tabel | Entitas Kunci / Kolom Utama | Ketergantungan Relasional Monolitik |
| 74 | promotions | Entitas induk kampanye pemasaran, rentang tanggal periode berlaku, dan status keaktifan promo. | id, promo_code, promo_name, start_date, end_date, is_active | - |
| 75 | promotion_rules | Konfigurasi syarat ketentuan promo (minimal nominal belanja, persentase diskon, batas plafon). | id, promotion_id, min_purchase_amount, discount_percentage, max_discount_cap | promotion_id $\rightarrow$ promotions(id) |
| 76 | discount_tiers | Konfigurasi potongan harga bertingkat berdasarkan volume barang yang dibeli (misal: beli $\ge 5$ diskon 10%). | id, promotion_id, tier_level, tier_discount_percent | promotion_id $\rightarrow$ promotions(id) |
| 77 | vouchers | Master kode kupon voucher unik, nilai nominal pemotongan, batas total kuota, dan masa berlaku. | id, voucher_code, voucher_value, quota_limit, quota_used, expires_at | - |
| 78 | voucher_usages | Catatan pemakaian kode voucher oleh pengguna tertentu pada order tertentu agar tidak dapat dipakai ulang. | id, voucher_id, user_id, order_id, used_at | $\rightarrow$ vouchers(id), users(id), orders(id) (Kopling Silang Kluster 1 & 4) |
| 79 | voucher_customer_eligibilities | Penetapan kriteria pengguna khusus yang berhak mengklaim voucher tertentu (misal: voucher pengguna baru). | voucher_id, user_id | $\rightarrow$ vouchers(id), users(id) |
| 80 | coupons | Nomor seri kupon fisik unik cetak yang dapat ditukarkan di gerai toko offline maupun aplikasi. | id, coupon_serial, is_redeemed | - |
| 81 | bundle_packages | Definisi paket gabungan beberapa produk dengan harga jual khusus yang lebih ekonomis. | id, package_name, package_price | - |
| 82 | bundle_items | Daftar rincian barang-barang yang menjadi bagian dari suatu paket bundling tertentu. | bundle_id, product_id, quantity | $\rightarrow$ bundle_packages(id), products(id) (Kopling Silang Kluster 2) |
| 83 | loyalty_points | Saldo poin keanggotaan loyalitas yang dimiliki oleh masing-masing pelanggan. | id, user_id, current_points | user_id $\rightarrow$ users(id) |
| 84 | point_transactions | Mutasi perolehan poin belanja (earned) dan penggunaan poin belanja (redeemed). | id, loyalty_point_id, points, point_type, reference_order_id | loyalty_point_id $\rightarrow$ loyalty_points(id) |
| 85 | point_redemptions | Katalog penukaran saldo poin reward dengan voucher belanja, cinderamata, atau barang khusus. | id, user_id, reward_name, points_deducted, redeemed_at | user_id $\rightarrow$ users(id) |
| 86 | cashback_programs | Konfigurasi program insentif pengembalian dana dalam bentuk poin belanja atau saldo store credit. | id, program_name, cashback_percentage, max_cashback_amount | - |
| 87 | flash_sales | Event obral kilat produk tertentu dengan diskon ekstrem dan alokasi stok terbatas dalam jendela waktu sempit. | id, product_id, flash_price, allocated_stock, starts_at, ends_at | product_id $\rightarrow$ products(id) (Kopling Silang Kluster 2) |

🚚 KLUSTER 7: LOGISTIK, PENGIRIMAN, & MANAJEMEN KURIR (13 TABEL)

Fungsi Bisnis Utama:

Mengatur operasional pengiriman fisik: integrasi mitra ekspedisi pihak ketiga (JNE, GoSend), penentuan zona wilayah dan tabel tarif kirim per kilogram, armada kendaraan operasional internal, penjadwalan rute kurir harian (delivery run), pelacakan nomor resi pengiriman (tracking log), bukti serah terima paket (Proof of Delivery / POD), dan dokumen kepabeanan antar-pulau.

| No | Nama Tabel | Deskripsi & Fungsi Teknis Tabel | Entitas Kunci / Kolom Utama | Ketergantungan Relasional Monolitik |
| 88 | courier_partners | Master data perusahaan rekanan penyedia layanan logistik eksternal pihak ketiga. | id, partner_code, partner_name | - |
| 89 | courier_services | Jenis kategori layanan pengiriman spesifik (Layanan Reguler, Next Day 1 Hari, Kargo, Instan 3 Jam). | id, partner_id, service_name, estimated_days | partner_id $\rightarrow$ courier_partners(id) |
| 90 | shipping_zones | Pengelompokan wilayah pengiriman berbasis kesamaan kode pos atau cakupan geografis. | id, zone_name, postal_code_prefix | - |
| 91 | shipping_rates | Tabel acuan matriks tarif ongkos kirim per kilogram dari zona asal gudang ke zona alamat tujuan. | id, courier_service_id, origin_zone_id, destination_zone_id, rate_per_kg | $\rightarrow$ courier_services(id), shipping_zones(id) |
| 92 | vehicle_fleets | Data inventaris armada kendaraan operasional milik internal perusahaan (sepeda motor, blind van, truk). | id, vehicle_plate_number, vehicle_type, capacity_kg | - |
| 93 | courier_drivers | Data kurir internal perusahaan beserta kelengkapan nomor surat izin mengemudi (SIM). | id, driver_name, license_number, phone_number, assigned_vehicle_id | assigned_vehicle_id $\rightarrow$ vehicle_fleets(id) |
| 94 | shipping_orders | Dokumen instruksi resmi pengiriman paket pesanan, nomor resi pengiriman, dan berat timbangan. | id, order_id, courier_service_id, tracking_number, weight_kg, current_status | $\rightarrow$ orders(id), courier_services(id) (Kopling Silang Kluster 4) |
| 95 | shipping_manifests | Dokumen manifest daftar serah terima serah kirim paket pesanan dari pihak staf gudang ke mitra ekspedisi. | id, manifest_code, warehouse_id, created_at | warehouse_id $\rightarrow$ warehouses(id) (Kopling Silang Kluster 3) |
| 96 | delivery_runs | Jadwal penugasan daftar rute perjalanan pengiriman harian yang dibebankan kepada kurir tertentu. | id, run_number, driver_id, run_date, status | driver_id $\rightarrow$ courier_drivers(id) |
| 97 | delivery_run_orders | Relasi daftar paket pesanan yang wajib diserahkan dalam satu rute perjalanan delivery run. | delivery_run_id, shipping_order_id | $\rightarrow$ delivery_runs(id), shipping_orders(id) |
| 98 | proof_of_deliveries | Arsip bukti serah terima paket yang telah sampai ke tangan penerima (foto paket dan tanda tangan digital). | id, shipping_order_id, recipient_name, signature_image_url, photo_proof_url, delivered_time | shipping_order_id $\rightarrow$ shipping_orders(id) |
| 99 | shipping_tracking_logs | Catatan kronologis mutasi titik lokasi paket (drop point, sortir hub transit, kurir jalan, terkirim). | id, shipping_order_id, status_description, location, log_time | shipping_order_id $\rightarrow$ shipping_orders(id) |
| 100 | customs_declarations | Dokumen pelaporan pabean bea cukai untuk paket pengiriman lintas kepulauan khusus atau ekspor-impor. | id, shipping_order_id, declared_value, hs_code | shipping_order_id $\rightarrow$ shipping_orders(id) |

🤝 KLUSTER 8: PENGADAAN (PROCUREMENT) & PEMASOK (10 TABEL)

Fungsi Bisnis Utama:

Mengelola rantai pasok hulu (upstream supply chain): direktori data pemasok (supplier), kontak agen vendor, permohonan penawaran harga barang (Request for Quotation / RFQ), perjanjian kontrak harga grosir resmi, penerbitan Surat Pesanan Pembelian (Purchase Order / PO), Berita Acara Penerimaan Barang (Goods Receipt Note / GRN), dan faktur hutang dagang.

| No | Nama Tabel | Deskripsi & Fungsi Teknis Tabel | Entitas Kunci / Kolom Utama | Ketergantungan Relasional Monolitik |
| 101 | suppliers | Direktori perusahaan pemasok bahan baku atau produk dagang lengkap dengan nomor NPWP. | id, supplier_code, company_name, tax_identification_number, address | - |
| 102 | supplier_contacts | Daftar kontak perwakilan pihak pemasok (sales key-account, staf penagihan/keuangan vendor). | id, supplier_id, contact_name, email, phone | supplier_id $\rightarrow$ suppliers(id) |
| 103 | rfq_requests | Dokumen permohonan resmi pengajuan penawaran harga barang yang dikirim ke beberapa pemasok. | id, rfq_number, request_date, status | - |
| 104 | rfq_items | Daftar rincian barang dan estimasi kuantitas yang diminta penawarannya dalam dokumen RFQ. | id, rfq_id, product_id, target_quantity | $\rightarrow$ rfq_requests(id), products(id) (Kopling Silang Kluster 2) |
| 105 | supplier_price_agreements | Kontrak kesepakatan harga beli resmi antara perusahaan dan pihak pemasok untuk masa berlaku tertentu. | id, supplier_id, product_id, contract_unit_price, effective_until | $\rightarrow$ suppliers(id), products(id) (Kopling Silang Kluster 2) |
| 106 | purchase_orders | Dokumen Surat Pesanan Pembelian resmi (PO) yang diterbitkan ke pemasok untuk memasok stok gudang. | id, po_number, supplier_id, warehouse_id, po_date, total_po_amount, status | $\rightarrow$ suppliers(id), warehouses(id) (Kopling Silang Kluster 3) |
| 107 | purchase_order_items | Rincian barang dagang, kuantitas order, dan harga modal beli (unit cost) pada lembar pesanan PO. | id, purchase_order_id, product_id, ordered_qty, unit_cost | $\rightarrow$ purchase_orders(id), products(id) (Kopling Silang Kluster 2) |
| 108 | goods_receipt_notes | Berita Acara Penerimaan Barang (GRN) saat truk pasokan dari pemasok tiba dan dibongkar di gudang. | id, grn_number, purchase_order_id, received_date | purchase_order_id $\rightarrow$ purchase_orders(id) |
| 109 | goods_receipt_items | Rincian kuantitas fisik barang yang lolos inspeksi kendali mutu saat verifikasi dokumen GRN fisik. | id, grn_id, product_id, received_qty | $\rightarrow$ goods_receipt_notes(id), products(id) (Kopling Silang Kluster 2) |
| 110 | purchase_invoices | Faktur tagihan hutang dagang dari pihak pemasok yang wajib dibayarkan berdasarkan PO dan GRN yang sah. | id, invoice_number, purchase_order_id, invoice_amount, due_date | purchase_order_id $\rightarrow$ purchase_orders(id) |

🎧 KLUSTER 9: LAYANAN PELANGGAN & PENANGANAN KELUHAN (10 TABEL)

Fungsi Bisnis Utama:

Mengelola layanan bantuan purnajual (customer support): pembukaan tiket keluhan masalah, penugasan tiket ke agen representatif, rekaman percakapan dua arah, lampiran foto/video bukti kerusakan barang, pemenuhan standar SLA (Service Level Agreement), survei kepuasan pelanggan, eskalasi sengketa transaksi finansial (dispute), dan pangkalan artikel swalayan (FAQ Knowledge Base).

| No | Nama Tabel | Deskripsi & Fungsi Teknis Tabel | Entitas Kunci / Kolom Utama | Ketergantungan Relasional Monolitik |
| 111 | ticket_categories | Master klasifikasi topik kendala bantuan (Kendala Pembayaran, Keterlambatan Pengiriman, Barang Cacat). | id, category_name | - |
| 112 | ticket_sla_configs | Konfigurasi batas target durasi penanganan respon dan penyelesaian tiket berdasarkan kategori. | id, category_id, max_response_hours, max_resolution_hours | category_id $\rightarrow$ ticket_categories(id) |
| 113 | customer_tickets | Entitas induk tiket aduan; mencatat nomor tiket, subjek kendala, skala prioritas, dan status penanganan. | id, ticket_code, customer_id, order_id, category_id, subject, priority, status | $\rightarrow$ users(id), orders(id), ticket_categories(id) (Kopling Silang Kluster 1 & 4) |
| 114 | ticket_messages | Buku catatan percakapan interaktif dua arah antara pelanggan dan agen customer care di dalam tiket. | id, ticket_id, sender_user_id, message_body, sent_at | $\rightarrow$ customer_tickets(id), users(id) |
| 115 | ticket_attachments | Berkas foto kondisi barang rusak atau rekaman video unboxing yang dilampirkan dalam pesan keluhan. | id, ticket_message_id, attachment_url | ticket_message_id $\rightarrow$ ticket_messages(id) |
| 116 | ticket_assignments | Riwayat rekam jejak disposisi penugasan eskalasi penanganan tiket kepada agen representatif tertentu. | id, ticket_id, assigned_agent_id, assigned_at | $\rightarrow$ customer_tickets(id), users(id) |
| 117 | ticket_ratings | Nilai skor kepuasan pelanggan (skala 1–5 bintang) dan ulasan kualitatif atas penyelesaian keluhan oleh agen. | id, ticket_id, satisfaction_score, feedback | ticket_id $\rightarrow$ customer_tickets(id) |
| 118 | disputes | Kasus eskalasi sengketa klaim transaksi finansial resmi yang memerlukan mediasi investigasi khusus. | id, dispute_number, order_id, claim_amount, status | order_id $\rightarrow$ orders(id) (Kopling Silang Kluster 4) |
| 119 | dispute_evidences | Berkas bukti hukum pendukung sengketa dari pihak penjual, pembeli, maupun mitra ekspedisi kurir. | id, dispute_id, evidence_type, evidence_url | dispute_id $\rightarrow$ disputes(id) |
| 120 | faq_articles | Pangkalan data artikel panduan mandiri dan jawaban pertanyaan umum yang dapat diakses publik. | id, category_id, question, answer, is_published | category_id $\rightarrow$ ticket_categories(id) |
