const repoTransaksi = require("../data/transaksi");
const repoKendaraan = require("../data/kendaraan");
const repoPelanggan = require("../data/pelanggan");
const validate = require("../utils/validate");

const aturanTransaksi = {
    kendaraan_id: { type: "number", required: true },
    pelanggan_id: { type: "number", required: true },
    tgl_sewa: { type: "string", required: true },
    tgl_rencana_kembali: { type: "string", required: true }
};

const getSemua = async (req, res) => {
    const { status, kendaraan_id, pelanggan_id } = req.query;
    const data = await repoTransaksi.cariSemua(status, kendaraan_id, pelanggan_id);
    return res.status(200).json({ total: data.length, data });
};

const getSatu = async (req, res) => {
    const id = Number(req.params.id);
    const data = await repoTransaksi.cariId(id);
    if (!data) return res.status(404).json({ msg: "Transaksi tidak ditemukan" });
    return res.status(200).json(data);
};

const tambah = async (req, res) => {
    const { valid, errors, value } = validate(req.body, aturanTransaksi);
    if (!valid) return res.status(400).json({ msg: "Validasi gagal", errors });

    const kendaraan = await repoKendaraan.cariId(value.kendaraan_id);
    if (!kendaraan) return res.status(404).json({ msg: "Kendaraan tidak ditemukan" });

    const pelanggan = await repoPelanggan.cariId(value.pelanggan_id);
    if (!pelanggan) return res.status(404).json({ msg: "Pelanggan tidak ditemukan" });

    if (kendaraan.status !== 'tersedia') {
        return res.status(409).json({ msg: "Kendaraan tidak tersedia untuk disewa" });
    }

    const tglSewa = new Date(value.tgl_sewa);
    const tglRencana = new Date(value.tgl_rencana_kembali);
    if (tglRencana <= tglSewa) {
        return res.status(400).json({ msg: "Tanggal rencana kembali harus sesudah tanggal sewa" });
    }

    const id = await repoTransaksi.tambah(value);
    await repoTransaksi.ubahStatusKendaraan(value.kendaraan_id, 'disewa');

    return res.status(201).json({ msg: "Sewa berhasil dicatat", id });
};

const selesaikan = async (req, res) => {
    const id = Number(req.params.id);
    const tgl_aktual_kembali = req.body.tgl_aktual_kembali || new Date().toISOString().split('T')[0];

    const transaksi = await repoTransaksi.cariId(id);
    if (!transaksi) return res.status(404).json({ msg: "Transaksi tidak ditemukan" });

    if (transaksi.status !== 'berjalan') {
        return res.status(409).json({ msg: "Hanya transaksi berjalan yang bisa diselesaikan" });
    }

    const tglSewa = new Date(transaksi.tgl_sewa);
    const tglRencana = new Date(transaksi.tgl_rencana_kembali);
    const tglAktual = new Date(tgl_aktual_kembali);

    const satuHariMS = 1000 * 60 * 60 * 24;
    const durasiSewa = Math.max(1, Math.ceil((tglRencana - tglSewa) / satuHariMS));
    const durasiAktual = Math.ceil((tglAktual - tglRencana) / satuHariMS);

    const kendaraan = await repoKendaraan.cariId(transaksi.kendaraan_id);
    const tarif = kendaraan.tarif_per_hari;

    const total_biaya = durasiSewa * tarif;
    const denda = durasiAktual > 0 ? (durasiAktual * tarif) : 0; 

    await repoTransaksi.selesaikan(id, tgl_aktual_kembali, total_biaya, denda);
    await repoTransaksi.ubahStatusKendaraan(transaksi.kendaraan_id, 'tersedia');

    return res.status(200).json({ msg: "Kendaraan berhasil dikembalikan", total_biaya, denda });
};

const batalkan = async (req, res) => {
    const id = Number(req.params.id);
    const transaksi = await repoTransaksi.cariId(id);
    if (!transaksi) return res.status(404).json({ msg: "Transaksi tidak ditemukan" });

    if (transaksi.status !== 'berjalan') {
        return res.status(409).json({ msg: "Hanya transaksi berjalan yang bisa dibatalkan" });
    }

    await repoTransaksi.batalkan(id);
    await repoTransaksi.ubahStatusKendaraan(transaksi.kendaraan_id, 'tersedia');

    return res.status(200).json({ msg: "Transaksi berhasil dibatalkan" });
};

const getStatistik = async (req, res) => {
    const stats = await repoTransaksi.getStatistik();
    
    return res.status(200).json({
        total_berjalan: Number(stats.total_berjalan),
        total_selesai: Number(stats.total_selesai),
        total_batal: Number(stats.total_batal),
        pendapatan_kotor: Number(stats.pendapatan_kotor)
    });
};

module.exports = { getSemua, getSatu, tambah, selesaikan, batalkan, getStatistik };