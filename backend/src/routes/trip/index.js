"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const TripController = require("../../controllers/trip.controller");
const { authentication } = require("../../auth");

const router = express.Router();

router.post("/status", asyncHandler(TripController.getTripByStatus));
router.get("/:tripId", asyncHandler(TripController.getTripDetail));
router.use(authentication);

router.post("/user", asyncHandler(TripController.getAllTripByUserId));
router.post("", asyncHandler(TripController.addTrip));
router.patch("/:tripId", asyncHandler(TripController.updateTrip));
router.patch("/start/:tripId", asyncHandler(TripController.startTrip));
router.post("/schedule/:tripId", asyncHandler(TripController.scheduleTrip));
router.post("/request/:tripId", asyncHandler(TripController.requestJoinTrip));
router.post("/cancel-request/:tripId", asyncHandler(TripController.rejectParticipateToTrip));
router.get("/request/:tripId", asyncHandler(TripController.getRequestJoinTrip));
router.post("/request-sended", asyncHandler(TripController.getAllRequestJoinTripSended));
router.post("/request/reject/:tripId", asyncHandler(TripController.rejectParticipateToTrip));
router.post("/request/accept/:tripId", asyncHandler(TripController.acceptParticipateToTrip));
router.post("/leave/:tripId", asyncHandler(TripController.leaveTrip));



module.exports = router;
