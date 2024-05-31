"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const PlaceService = require("../services/place.service");

class PlaceController {
  addPlaceToTrips = async (req, res) => {
    new SuccessResponse({
      message: "successfully",
      metadata: await PlaceService.addPlaceToTrips(req.body),
    }).send(res);
  };
  addPlace = async (req, res) => {
    new CREATED({
      message: "success created",
      metadata: await PlaceService.createPlace(req.body.type, req.body),
    }).send(res);
  };
  getPlace = async (req, res) => {
    console.log(req.params);
    new SuccessResponse({
      message: "get place successfully",
      metadata: await PlaceService.getPlaceDetail(req.params),
    }).send(res);
  };
  searchPlace = async (req, res) => {
    new SuccessResponse({
      message: "search place successfully",
      metadata: await PlaceService.searchPlace(req.params),
    }).send(res);
  };
  getPlacesByProvince = async (req, res) => {
    const query = {};
    for (let key in req.query) {
      query[key] = Number(req.query[key]);
    }
    new SuccessResponse({
      message: "Get places successfully",
      metadata: await PlaceService.getPlacesByProvince({
        ...req.params,
        ...query,
      }),
    }).send(res);
  };
  getPlacesPage = async (req, res) => {
    new SuccessResponse({
      message: "Get places successfully",
      metadata: await PlaceService.getPlacesPage(),
    }).send(res);
  };
  updatePlace = async (req, res) => {
    new SuccessResponse({
      message: "Update successfully",
      metadata: await PlaceService.updatePlace(req.body),
    }).send(res);
  }
  getPlaces = async (req, res) => {
    new SuccessResponse({
      message: "Get places successfully",
      metadata: await PlaceService.getPlaces(req.body),
    }).send(res);
  }
}

module.exports = new PlaceController();
