DROP TABLE IF EXISTS transaksi;
DROP TABLE IF EXISTS pelanggan;
DROP TABLE IF EXISTS kendaraan;

CREATE TABLE kendaraan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    jenis ENUM('mobil', 'motor') NOT NULL,
    plat_nomor VARCHAR(20) NOT NULL,
    tarif_per_hari INT NOT NULL,
    status ENUM('tersedia', 'disewa', 'diservis') DEFAULT 'tersedia',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_kendaraan_plat (plat_nomor) -- Aturan 1: Plat nomor unik
);

CREATE TABLE pelanggan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    no_ktp VARCHAR(50) NOT NULL,
    no_hp VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_pelanggan_ktp (no_ktp) -- Aturan 2: KTP unik
);

CREATE TABLE transaksi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kendaraan_id INT NOT NULL,
    pelanggan_id INT NOT NULL,
    tgl_sewa DATE NOT NULL,
    tgl_rencana_kembali DATE NOT NULL,
    tgl_aktual_kembali DATE NULL,
    total_biaya INT DEFAULT 0,
    denda INT DEFAULT 0,
    status ENUM('berjalan', 'selesai', 'batal') DEFAULT 'berjalan',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kendaraan_id) REFERENCES kendaraan(id) ON DELETE RESTRICT, -- Aturan 8
    FOREIGN KEY (pelanggan_id) REFERENCES pelanggan(id) ON DELETE RESTRICT  -- Aturan 9
);