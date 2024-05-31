"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const AdvertisementController = require("../../controllers/ads.controller");
const { authentication } = require("../../auth");

const router = express.Router();

router.post("/create", authentication, asyncHandler(AdvertisementController.createAdvertisement));
router.patch("/validate", asyncHandler(AdvertisementController.validateAdvertisement));
router.post("/payment", asyncHandler(AdvertisementController.handlePaymentRequest));
router.get("/response", asyncHandler(AdvertisementController.handlePaymentResponse));
router.post("/", authentication, asyncHandler(AdvertisementController.getAllAdvertisementsByUserId));
router.get("/", asyncHandler(AdvertisementController.getAllAdvertisements))
module.exports = router;
