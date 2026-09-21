const express = require("express");
const router = express.Router();
const pelangganController = require("../controllers/pelanggan");
const asyncHandler = require("../utils/asyncHandler");
const methodNotAllowed = require("../middlewares/methodNotAllowed");

router.route("/")
    .get(asyncHandler(pelangganController.getSemua))
    .post(asyncHandler(pelangganController.tambah))
    .all(methodNotAllowed("GET", "POST"));

router.route("/:id")
    .get(asyncHandler(pelangganController.getSatu))
    .delete(asyncHandler(pelangganController.hapus))
    .all(methodNotAllowed("GET", "DELETE"));

module.exports = router;