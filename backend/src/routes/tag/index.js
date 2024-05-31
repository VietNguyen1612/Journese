"use strict";

"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const TagController = require("../../controllers/tag.controller");
const { isAdmin } = require("../../auth");

const router = express.Router();

router.post("/places", asyncHandler(TagController.searchPlaceByTags));
router.get("/", asyncHandler(TagController.getAllTags));
router.post("/", isAdmin, asyncHandler(TagController.addNewTag));
router.post("/place/:placeId", asyncHandler(TagController.addTagListToPlace));
module.exports = router