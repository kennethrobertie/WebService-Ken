const { pool } = require("../config/database");
const cariSemua = async (status, jenis) => {
    let sql = "SELECT * FROM kendaraan WHERE 1=1";
    const params = [];

    if (status) {
        sql += " AND status = ?";
        params.push(status);
    }
    if (jenis) {
        sql += " AND jenis = ?";
        params.push(jenis);
    }

    const [rows] = await pool.query(sql, params);
    return rows;
};

const cariId = async (id) => {
    const [rows] = await pool.query("SELECT * FROM kendaraan WHERE id = ?", [id]);
    return rows[0] || null;
};

const cariPlatNomor = async (plat_nomor) => {
    const [rows] = await pool.query("SELECT * FROM kendaraan WHERE plat_nomor = ?", [plat_nomor]);
    return rows[0] || null;
};

const tambah = async (data) => {
    const sql = "INSERT INTO kendaraan (nama, jenis, plat_nomor, tarif_per_hari) VALUES (?, ?, ?, ?)";
    const params = [data.nama, data.jenis, data.plat_nomor, data.tarif_per_hari];
    const [result] = await pool.query(sql, params);
    return result.insertId;
};

const ubah = async (id, data) => {
    const sql = "UPDATE kendaraan SET nama = ?, jenis = ?, plat_nomor = ?, tarif_per_hari = ? WHERE id = ?";
    const params = [data.nama, data.jenis, data.plat_nomor, data.tarif_per_hari, id];
    const [result] = await pool.query(sql, params);
    return result.affectedRows;
};

const hapus = async (id) => {
    const [result] = await pool.query("DELETE FROM kendaraan WHERE id = ?", [id]);
    return result.affectedRows;
};

module.exports = {
    cariSemua,
    cariId,
    cariPlatNomor,
    tambah,
    ubah,
    hapus
};