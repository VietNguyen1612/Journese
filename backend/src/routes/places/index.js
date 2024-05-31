"use strict";
const express = require("express");
const PlaceController = require("../../controllers/place.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth");
const router = express.Router();

router.post("/page", asyncHandler(PlaceController.getPlaces));
router.get("/admin/page", asyncHandler(PlaceController.getPlacesPage));
router.post("", asyncHandler(PlaceController.addPlace));
router.get("/get-place/:place_id", asyncHandler(PlaceController.getPlace));
router.get("/search/:keySearch", asyncHandler(PlaceController.searchPlace));
router.get(
  "/provinces/:province",
  asyncHandler(PlaceController.getPlacesByProvince)
);
router.patch("", asyncHandler(PlaceController.updatePlace))

router.post("/add-to-trips", authentication, asyncHandler(PlaceController.addPlaceToTrips));

module.exports = router;
