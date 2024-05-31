"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const RatingService = require("../services/rating.service");

class RatingController {
    addRatings = async (req, res) => {
        new SuccessResponse({
            message: "Add ratings successfully",
            metadata: await RatingService.addRating({
                ...req.body,
                userId: req.headers['x-client-id']
            }),
        }).send(res);
    }
    getRatingByPlaceId = async (req, res) => {
        new SuccessResponse({
            message: "Get ratings by placeId successfully",
            metadata: await RatingService.getRatingByPlaceId({
                ...req.params
            }),
        }).send(res);
    }
}

module.exports = new RatingController()