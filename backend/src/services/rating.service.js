"use strict";

const { addRating, getRatingByPlaceId } = require("../repositories/rating.repository")
const { Rating } = require('../models/rating.model')
const { Types } = require("mongoose");


class RatingService {
    static async addRating(payload) {
        return await addRating(payload)
    }

    static async getRatingByPlaceId(payload) {
        return await getRatingByPlaceId(payload)
    }
}

module.exports = RatingService