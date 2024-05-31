const { default: mongoose } = require("mongoose");
const { Rating } = require('../models/rating.model')
const { PlaceModel } = require("../models/place.model");
const { Trip } = require("../models/trip.model");
const { User } = require("../models/user.model")
const { NotFoundError } = require("../core/error.response");
const UserFavoriteService = require("../services/userfavorite.service");
const addRating = async ({ ratings, userId }) => {
    for (let rating of ratings) {
        if (!rating.placeId) {
            return new Error('placeId is null or undefined')
        }
        if (!rating.tripId) {
            return new Error('tripId is null or undefined')
        }
        const placeExists = await PlaceModel.findOne({ place_id: rating.placeId });
        const tripExists = await Trip.findById(new mongoose.Types.ObjectId(rating.tripId));

        if (!placeExists || !tripExists) {
            return new NotFoundError('Invalid placeId, or tripId')
        }
        rating.userId = new mongoose.Types.ObjectId(userId)
        rating.tripId = new mongoose.Types.ObjectId(rating.tripId)

    }
    const userFavRes = await UserFavoriteService.addOrUpdateUserFavorite({ userId: userId, ratings })
    console.log('userFavRes', userFavRes)
    const result = await Rating.insertMany(ratings)
    return result
}

const getRatingByPlaceId = async ({ placeId }) => {
    const pipeline = [
        {
            $match:
                { placeId: placeId }
        },
        {
            $lookup: {
                from: "Users",
                localField: "userId",
                foreignField: "_id",
                as: "userId"
            }
        },
        {
            $unwind: "$userId"
        },
        {
            $lookup: {
                from: "Places",
                let: { placesId: "$placeId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$place_id", "$$placesId"],
                            },
                        },
                    },
                ],
                as: "placeId",
            },
        },
        {
            $unwind: "$placeId"
        },
        {
            $lookup: {
                from: "Trips",
                localField: "tripId",
                foreignField: "_id",
                as: "tripId"
            },
        },
        {
            $unwind: "$tripId"
        }
    ]
    const result = await Rating.aggregate(pipeline)
    return result
}


module.exports = {
    addRating,
    getRatingByPlaceId
}