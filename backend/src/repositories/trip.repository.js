"use strict";

const { PlaceModel } = require("../models/place.model");
const { Trip } = require("../models/trip.model");

const findTripById = async (id) => await Trip.findById(id).lean();

const findDuplicate = async (places) => {
  return places.some((placeId, index) => places.indexOf(placeId) !== index);
};

const getPopulatePlaces = async (trips) => {
  return;
};

const findNextDuplicate = async (places) => {
  for (let i = 0; i < places.length; i++) {
    if (places[i] === places[i + 1]) {
      return true;
    }
  }
  return false;
};
const returnUniqueProvinces = async (places) => {
  const provinces = new Set();

  for (let i = 0; i < places.length; i++) {
    const place = await PlaceModel.findOne({ place_id: places[i] }).lean();
    provinces.add(place.city ? place.city : place.province);
  }
  return [...provinces];
};

module.exports = {
  findTripById,
  findDuplicate,
  returnUniqueProvinces,
  findNextDuplicate,
};
