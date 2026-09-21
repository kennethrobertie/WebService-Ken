const repoPelanggan = require("../data/pelanggan");
const validate = require("../utils/validate");
const aturanPelanggan = {
    nama: { type: "string", required: true, minLength: 3 },
    no_ktp: { type: "string", required: true, minLength: 16, maxLength: 16 },
    no_hp: { type: "string", required: true, minLength: 10 }
};

const getSemua = async (req, res) => {
    const data = await repoPelanggan.cariSemua();
    return res.status(200).json({ total: data.length, data });
};

const getSatu = async (req, res) => {
    const id = Number(req.params.id);
    const data = await repoPelanggan.cariId(id);
    if (!data) return res.status(404).json({ msg: "Pelanggan tidak ditemukan" });
    return res.status(200).json(data);
};

const tambah = async (req, res) => {
    const { valid, errors, value } = validate(req.body, aturanPelanggan);
    if (!valid) return res.status(400).json({ msg: "Validasi gagal", errors });

    const cekKtp = await repoPelanggan.cariKtp(value.no_ktp);
    if (cekKtp) return res.status(409).json({ msg: "Nomor KTP sudah terdaftar" });

    const id = await repoPelanggan.tambah(value);
    return res.status(201).json({ msg: "Pelanggan berhasil ditambahkan", id });
};

const hapus = async (req, res) => {
    const id = Number(req.params.id);
    const ada = await repoPelanggan.cariId(id);
    if (!ada) return res.status(404).json({ msg: "Pelanggan tidak ditemukan" });

    try {
        await repoPelanggan.hapus(id);
        return res.status(200).json({ msg: "Pelanggan berhasil dihapus" });
    } catch (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ msg: "Pelanggan memiliki transaksi, tidak bisa dihapus" });
        }
        throw err; 
    }
};

module.exports = { getSemua, getSatu, tambah, hapus };