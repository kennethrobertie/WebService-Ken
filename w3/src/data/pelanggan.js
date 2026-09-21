const { pool } = require("../config/database");

const cariSemua = async () => {
    const [rows] = await pool.query("SELECT * FROM pelanggan");
    return rows;
};

const cariId = async (id) => {
    const [rows] = await pool.query("SELECT * FROM pelanggan WHERE id = ?", [id]);
    return rows[0] || null;
};

const cariKtp = async (no_ktp) => {
    const [rows] = await pool.query("SELECT * FROM pelanggan WHERE no_ktp = ?", [no_ktp]);
    return rows[0] || null;
};

const tambah = async (data) => {
    const sql = "INSERT INTO pelanggan (nama, no_ktp, no_hp) VALUES (?, ?, ?)";
    const params = [data.nama, data.no_ktp, data.no_hp];
    const [result] = await pool.query(sql, params);
    return result.insertId;
};

const hapus = async (id) => {
    const [result] = await pool.query("DELETE FROM pelanggan WHERE id = ?", [id]);
    return result.affectedRows;
};

module.exports = {
    cariSemua,
    cariId,
    cariKtp,
    tambah,
    hapus
};