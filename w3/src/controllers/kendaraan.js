const repoKendaraan = require("../data/kendaraan");
const validate = require("../utils/validate");
const aturanKendaraan = {
    nama: { type: "string", required: true, minLength: 3 },
    jenis: { type: "enum", required: true, values: ["mobil", "motor"] },
    plat_nomor: { type: "string", required: true, minLength: 3 },
    tarif_per_hari: { type: "number", required: true, min: 0 }
};

const getSemua = async (req, res) => {
    const { status, jenis } = req.query;
    const data = await repoKendaraan.cariSemua(status, jenis);
    return res.status(200).json({ total: data.length, data });
};

const getSatu = async (req, res) => {
    const id = Number(req.params.id);
    const data = await repoKendaraan.cariId(id);
    if (!data) return res.status(404).json({ msg: "Kendaraan tidak ditemukan" });
    return res.status(200).json(data);
};

const tambah = async (req, res) => {
    const { valid, errors, value } = validate(req.body, aturanKendaraan);
    if (!valid) return res.status(400).json({ msg: "Validasi gagal", errors });

    const cekPlat = await repoKendaraan.cariPlatNomor(value.plat_nomor);
    if (cekPlat) return res.status(409).json({ msg: "Plat nomor sudah terdaftar" });

    const id = await repoKendaraan.tambah(value);
    return res.status(201).json({ msg: "Kendaraan berhasil ditambahkan", id });
};

const ubah = async (req, res) => {
    const id = Number(req.params.id);
    const { valid, errors, value } = validate(req.body, aturanKendaraan);
    if (!valid) return res.status(400).json({ msg: "Validasi gagal", errors });

    const ada = await repoKendaraan.cariId(id);
    if (!ada) return res.status(404).json({ msg: "Kendaraan tidak ditemukan" });

    if (value.plat_nomor !== ada.plat_nomor) {
        const cekPlat = await repoKendaraan.cariPlatNomor(value.plat_nomor);
        if (cekPlat) return res.status(409).json({ msg: "Plat nomor sudah dipakai kendaraan lain" });
    }

    await repoKendaraan.ubah(id, value);
    return res.status(200).json({ msg: "Kendaraan berhasil diubah" });
};

const hapus = async (req, res) => {
    const id = Number(req.params.id);
    const ada = await repoKendaraan.cariId(id);
    if (!ada) return res.status(404).json({ msg: "Kendaraan tidak ditemukan" });

    if (ada.status === 'disewa') {
        return res.status(409).json({ msg: "Kendaraan masih disewa, tidak bisa dihapus" });
    }

    try {
        await repoKendaraan.hapus(id);
        return res.status(200).json({ msg: "Kendaraan berhasil dihapus" });
    } catch (err) {
        // Tangkap error Foreign Key Constraint (RESTRICT) dari MySQL
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ msg: "Kendaraan memiliki riwayat transaksi, tidak bisa dihapus" });
        }
        throw err;
    }
};

module.exports = { getSemua, getSatu, tambah, ubah, hapus };