const { pool } = require("../config/database");

const cariSemua = async (status, kendaraan_id, pelanggan_id) => {
    let sql = "SELECT * FROM transaksi WHERE 1=1";
    const params = [];

    if (status) { sql += " AND status = ?"; params.push(status); }
    if (kendaraan_id) { sql += " AND kendaraan_id = ?"; params.push(kendaraan_id); }
    if (pelanggan_id) { sql += " AND pelanggan_id = ?"; params.push(pelanggan_id); }

    const [rows] = await pool.query(sql, params);
    return rows;
};

const cariId = async (id) => {
    const [rows] = await pool.query("SELECT * FROM transaksi WHERE id = ?", [id]);
    return rows[0] || null;
};

const tambah = async (data) => {
    const sql = "INSERT INTO transaksi (kendaraan_id, pelanggan_id, tgl_sewa, tgl_rencana_kembali, status) VALUES (?, ?, ?, ?, 'berjalan')";
    const params = [data.kendaraan_id, data.pelanggan_id, data.tgl_sewa, data.tgl_rencana_kembali];
    const [result] = await pool.query(sql, params);
    return result.insertId;
};

const selesaikan = async (id, tgl_aktual_kembali, total_biaya, denda) => {
    const sql = "UPDATE transaksi SET tgl_aktual_kembali = ?, total_biaya = ?, denda = ?, status = 'selesai' WHERE id = ?";
    const params = [tgl_aktual_kembali, total_biaya, denda, id];
    const [result] = await pool.query(sql, params);
    return result.affectedRows;
};

const batalkan = async (id) => {
    const [result] = await pool.query("UPDATE transaksi SET status = 'batal' WHERE id = ?", [id]);
    return result.affectedRows;
};

const ubahStatusKendaraan = async (kendaraan_id, status) => {
    const [result] = await pool.query("UPDATE kendaraan SET status = ? WHERE id = ?", [status, kendaraan_id]);
    return result.affectedRows;
};

// Ini tambahan finalnya
const getStatistik = async () => {
    const sql = `
        SELECT 
            COUNT(CASE WHEN status = 'berjalan' THEN 1 END) AS total_berjalan,
            COUNT(CASE WHEN status = 'selesai' THEN 1 END) AS total_selesai,
            COUNT(CASE WHEN status = 'batal' THEN 1 END) AS total_batal,
            COALESCE(SUM(CASE WHEN status = 'selesai' THEN total_biaya + denda ELSE 0 END), 0) AS pendapatan_kotor
        FROM transaksi
    `;
    const [rows] = await pool.query(sql);
    return rows[0];
};

module.exports = {
    cariSemua,
    cariId,
    tambah,
    selesaikan,
    batalkan,
    ubahStatusKendaraan,
    getStatistik // Jangan lupa diexport di sini
};