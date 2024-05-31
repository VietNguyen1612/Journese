"use strict";

"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const RatingController = require("../../controllers/rating.controller");
const { authentication } = require("../../auth");

const router = express.Router();

router.post("/", authentication, asyncHandler(RatingController.addRatings));
router.get("/:placeId", asyncHandler(RatingController.getRatingByPlaceId));
module.exports = router