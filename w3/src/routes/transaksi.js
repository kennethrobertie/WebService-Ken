const express = require("express");
const router = express.Router();
const transaksiController = require("../controllers/transaksi");
const asyncHandler = require("../utils/asyncHandler");
const methodNotAllowed = require("../middlewares/methodNotAllowed");

router.route("/statistik")
    .get(asyncHandler(transaksiController.getStatistik))
    .all(methodNotAllowed("GET"));

router.route("/")
    .get(asyncHandler(transaksiController.getSemua))
    .post(asyncHandler(transaksiController.tambah))
    .all(methodNotAllowed("GET", "POST"));

router.route("/:id")
    .get(asyncHandler(transaksiController.getSatu))
    .all(methodNotAllowed("GET"));

router.route("/:id/kembali")
    .post(asyncHandler(transaksiController.selesaikan))
    .all(methodNotAllowed("POST"));

router.route("/:id/batal")
    .post(asyncHandler(transaksiController.batalkan))
    .all(methodNotAllowed("POST"));

module.exports = router;