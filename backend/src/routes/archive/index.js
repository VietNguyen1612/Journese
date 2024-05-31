"use strict";
const express = require("express");
const ArchiveController = require("../../controllers/archive.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth");
const router = express.Router();

router.use(authentication);
router.post("", asyncHandler(ArchiveController.createArchive));
router.patch("/:archiveId", asyncHandler(ArchiveController.updateArchive));
router.get("/:archiveId", asyncHandler(ArchiveController.getArchiveDetail));

module.exports = router;
