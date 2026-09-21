const express = require("express");
const router = express.Router();
const kendaraanController = require("../controllers/kendaraan");
const asyncHandler = require("../utils/asyncHandler");
const methodNotAllowed = require("../middlewares/methodNotAllowed");

router.route("/")
    .get(asyncHandler(kendaraanController.getSemua))
    .post(asyncHandler(kendaraanController.tambah))
    .all(methodNotAllowed("GET", "POST"));

router.route("/:id")
    .get(asyncHandler(kendaraanController.getSatu))
    .put(asyncHandler(kendaraanController.ubah))
    .delete(asyncHandler(kendaraanController.hapus))
    .all(methodNotAllowed("GET", "PUT", "DELETE"));

module.exports = router;