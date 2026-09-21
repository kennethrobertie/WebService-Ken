-- Kosongkan tabel sebelum diisi ulang (urutan penting karena foreign key)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE transaksi;
TRUNCATE TABLE pelanggan;
TRUNCATE TABLE kendaraan;
SET FOREIGN_KEY_CHECKS = 1;

-- Seed Kendaraan
INSERT INTO kendaraan (nama, jenis, plat_nomor, tarif_per_hari, status) VALUES
('Honda Vario 160', 'motor', 'L 1234 AB', 100000, 'tersedia'),
('Yamaha NMAX', 'motor', 'L 5678 CD', 150000, 'disewa'),
('Toyota Avanza', 'mobil', 'W 1111 XX', 350000, 'tersedia'),
('Honda Brio', 'mobil', 'W 2222 YY', 300000, 'diservis');

-- Seed Pelanggan
INSERT INTO pelanggan (nama, no_ktp, no_hp) VALUES
('Budi Santoso', '3578012345670001', '081234567890'),
('Siti Aminah', '3578012345670002', '081987654321'),
('Agus Pratama', '3578012345670003', '081555555555');

-- Seed Transaksi
-- Transaksi 1: Selesai (Budi sewa Avanza, tidak telat)
INSERT INTO transaksi (kendaraan_id, pelanggan_id, tgl_sewa, tgl_rencana_kembali, tgl_aktual_kembali, total_biaya, denda, status) VALUES
(3, 1, '2026-09-01', '2026-09-03', '2026-09-03', 1050000, 0, 'selesai');

-- Transaksi 2: Berjalan (Siti sewa NMAX)
INSERT INTO transaksi (kendaraan_id, pelanggan_id, tgl_sewa, tgl_rencana_kembali, tgl_aktual_kembali, total_biaya, denda, status) VALUES
(2, 2, '2026-09-20', '2026-09-25', NULL, 0, 0, 'berjalan');