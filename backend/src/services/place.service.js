"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const {
  PlaceModel,
  CoffeeModel,
  TourAttractionModel,
} = require("../models/place.model");
const {
  getPlaceDetail,
  searchPlaceByUser,
  getPlaceByProvince,
  getPlacesPage,
  addPlaceToTripList,
  updatePlace,
  getPlaces
} = require("../repositories/place.repository");

// Factory design pattern
class PlaceFactory {
  static placeRegistry = {};
  static registerPlaceType(type, classRef) {
    PlaceFactory.placeRegistry[type] = classRef;
  }
  static async createPlace(type, payload) {
    const placeClass = PlaceFactory.placeRegistry[type];
    if (!placeClass) {
      throw new BadRequestError("Dont have that place type");
    }
    return new placeClass(payload).createPlace();
  }
  static async getPlaceDetail({ place_id }) {
    const place = await getPlaceDetail(place_id);
    if (!place) {
      throw new BadRequestError("Place not found");
    }
    return place;
  }
  static async addPlaceToTrips(payload) {
    return await addPlaceToTripList(payload);
  }
  static async searchPlace({ keySearch }) {
    return await searchPlaceByUser({ keySearch });
  }
  static async getPlacesByProvince({ province, limit = 10, page = 1 }) {
    return {
      province,
      places: await getPlaceByProvince({ province, limit, page }),
    };
  }
  static async getPlacesPage() {
    return await getPlacesPage();
  }
  static async updatePlace(payload) {
    return await updatePlace(payload)
  }

  static async getPlaces(payload) {
    return await getPlaces(payload)
  }
}

class Place {
  constructor({
    name,
    address,
    place_id,
    type,
    province,
    geolocation,
    images,
    phone,
    website,
    city,
    operating_hours,
    facilities,
  }) {
    this.name = name;
    this.address = address;
    this.place_id = place_id;
    this.type = type;
    this.province = province;
    this.geolocation = geolocation;
    this.images = images;
    this.phone = phone;
    this.website = website;
    this.city = city;
    this.operating_hours = operating_hours;
    this.facilities = facilities;
  }
  async createPlace(_id) {
    const place = await PlaceModel.create({ ...this, _id });
    return place;
  }
}

class Coffee extends Place {
  async createPlace() {
    const coffee = await CoffeeModel.create({
      ...this.facilities,
    });
    const newPlace = super.createPlace(coffee._id);
    if (!newPlace) {
      throw new BadRequestError("Cannot create coffee");
    }
    return newPlace;
  }
}

class TouristAttraction extends Place {
  async createPlace() {
    const tourist = await TourAttractionModel.create({
      ...this.facilities,
    });
    const newPlace = super.createPlace(tourist._id);
    if (!newPlace) {
      throw new BadRequestError("Cannot create tourist");
    }
    return newPlace;
  }
}

PlaceFactory.registerPlaceType("coffee", Coffee);
PlaceFactory.registerPlaceType("tourist_attraction", TouristAttraction);

module.exports = PlaceFactory;
