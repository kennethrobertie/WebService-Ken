const express = require("express");
const router = express.Router();

const kendaraanRouter = require("./kendaraan");
const pelangganRouter = require("./pelanggan");
const transaksiRouter = require("./transaksi");

router.use("/kendaraan", kendaraanRouter);
router.use("/pelanggan", pelangganRouter);
router.use("/transaksi", transaksiRouter);

module.exports = router;