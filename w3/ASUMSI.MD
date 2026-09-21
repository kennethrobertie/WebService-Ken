# Asumsi Bisnis & Spesifikasi Sistem - CV Wira Jaya Rental

Dokumen ini berisi catatan asumsi bisnis dan aturan teknis yang diterapkan pada Web Service Wira Jaya Rental untuk pemenuhan tugas.

## 1. Aturan Bisnis & Perhitungan
* **Perhitungan Denda**: Denda keterlambatan ditetapkan sebesar 100% dari tarif sewa per hari untuk setiap hari keterlambatan. Jika telat 2 hari, maka denda dihitung $2 \times \text{tarif harian}$.
* **Total Biaya Sewa**: Dihitung dari selisih hari antara `tgl_sewa` dan `tgl_rencana_kembali` dikali tarif harian. Jika kendaraan dikembalikan di hari yang sama, minimal tetap dihitung 1 hari.
* **Status Kendaraan**: Menggunakan 3 nilai *enum*: `tersedia`, `disewa`, dan `diservis`.
* **Status Transaksi**: Menggunakan 3 nilai *enum*: `berjalan` (sedang disewa), `selesai` (sudah dikembalikan), dan `batal` (dibatalkan sebelum dieksekusi).

## 2. Validasi & Keamanan Data (Mass-Assignment Protection)
* **Pencegahan Mass-Assignment**: Field sensitif seperti `status` kendaraan, `total_biaya`, dan `denda` sepenuhnya dikendalikan dan dihitung oleh server. Client tidak diizinkan memanipulasi nilai-nilai tersebut melalui *body request*.
* **Keunikan Data**: 
  * Plat nomor kendaraan bersifat unik (validasi duplikat mengembalikan kode `409 Conflict`).
  * Nomor KTP pelanggan bersifat unik, dengan validasi format nomor HP minimal 10 karakter.
* **Integritas Relasi (Foreign Key)**: Penghapusan data kendaraan atau pelanggan yang memiliki riwayat transaksi akan ditolak secara otomatis oleh sistem untuk menjaga integritas database.

## 3. Penanganan Error & Respon API
* **Format Respon Error**: Setiap kegagalan validasi atau konflik bisnis akan mengembalikan objek JSON dengan struktur standar berisi pesan (`msg`) dan detail *error* (`errors`) jika diperlukan.
* **HTTP Status Code**:
  * `200 OK`: Berhasil mengambil data atau sukses melakukan aksi (pengembalian/pembatalan).
  * `201 Created`: Berhasil menambahkan data baru (kendaraan, pelanggan, transaksi).
  * `400 Bad Request`: Format data salah, tanggal tidak masuk akal, atau gagal validasi input.
  * `409 Conflict`: Terjadi pelanggaran aturan bisnis (seperti duplikasi data atau kendaraan sedang disewa/diservis).
  * `500 Internal Server Error`: Kendala teknis pada server atau koneksi database.