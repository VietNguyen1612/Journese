"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const TripService = require("../services/trip.service");

class TripController {
  getAllTripByUserId = async (req, res) => {
    new SuccessResponse({
      message: "Get all trip by user successfully",
      metadata: await TripService.getAllTripByUserId({
        ...req.body,
      }),
    }).send(res);
  };
  getTripByStatus = async (req, res) => {
    new SuccessResponse({
      message: "Get trip successfully",
      metadata: await TripService.getTripByStatus({
        ...req.body,
        ...req.query,
      }),
    }).send(res);
  };
  addTrip = async (req, res) => {
    new CREATED({
      message: "Add trip successfully",
      metadata: await TripService.createTrip({
        userId: req.user.userId,
        ...req.body,
      }),
    }).send(res);
  };
  getTripDetail = async (req, res) => {
    new SuccessResponse({
      message: "Get trip success fully",
      metadata: await TripService.getTripDetail({
        ...req.params,
        userId: req.query.userId
      }),
    }).send(res);
  };
  updateTrip = async (req, res) => {
    new SuccessResponse({
      message: "Update trip success fully",
      metadata: await TripService.updateTrip({
        userId: req.user.userId,
        tripId: req.params.tripId,
        ...req.body,
      }),
    }).send(res);
  };
  scheduleTrip = async (req, res) => {
    new SuccessResponse({
      message: "Schedule trip successfully",
      metadata: await TripService.scheduleTrip({
        tripId: req.params.tripId,
        ...req.body,
      }),
    }).send(res);
  }
  requestJoinTrip = async (req, res) => {
    new SuccessResponse({
      message: "Request join trip successfully",
      metadata: await TripService.requestJoinTrip({
        userId: req.user.userId,
        tripId: req.params.tripId,
      }),
    }).send(res);
  };
  getRequestJoinTrip = async (req, res) => {
    new SuccessResponse({
      message: "Get request join trip successfully",
      metadata: await TripService.getRequestJoinTrip({
        userId: req.user.userId,
        tripId: req.params.tripId,
      }),
    }).send(res);
  };
  getAllRequestJoinTripSended = async (req, res) => {
    console.log("fjdaljfdlajlda");
    new SuccessResponse({
      message: "Get all request join trip sended successfully",
      metadata: await TripService.getAllRequestJoinTripSended({
        userId: req.user.userId,
      }),
    }).send(res);
  };
  rejectParticipateToTrip = async (req, res) => {
    new SuccessResponse({
      message: "Reject participate to trip successfully",
      metadata: await TripService.rejectParticipateToTrip({
        userId: req.user.userId,
        participateId: req.body.participateId,
        tripId: req.params.tripId,
      }),
    }).send(res);
  };
  acceptParticipateToTrip = async (req, res) => {
    new SuccessResponse({
      message: "Accept participate to trip successfully",
      metadata: await TripService.acceptParticipateToTrip({
        userId: req.user.userId,
        participateId: req.body.participateId,
        tripId: req.params.tripId,
      }),
    }).send(res);
  };
  startTrip = async (req, res) => {
    new SuccessResponse({
      message: "Start trip success fully",
      metadata: await TripService.startTrip({
        userId: req.user.userId,
        tripId: req.params.tripId,
        ...req.body,
      }),
    }).send(res);
  };
  leaveTrip = async (req, res) => {
    new SuccessResponse({
      message: "Leave trip successfully",
      metadata: await TripService.leaveTrip({
        userId: req.user.userId,
        tripId: req.params.tripId,
      }),
    }).send(res);
  }
}

module.exports = new TripController();
