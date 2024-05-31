"use strict";

const { UserFavorite } = require('../models/userfavorite.model')
const { Recommendation } = require('../models/recommendation.model')
const { Types } = require("mongoose");
const axios = require('axios')

class UserFavoriteService {
    static async addOrUpdateUserFavorite({ userId, ratings }) {
        let userIdObj = new Types.ObjectId(userId)
        const updatedRatings = [];
        for (let i = 0; i < ratings.length; i++) {
            const { placeId, rating } = ratings[i];
            const updatedRating = await UserFavorite.findOneAndUpdate(
                { userId: userIdObj, placeId },
                { rating },
                { upsert: true, new: true, runValidators: true },
            );
            await axios.post('https://exotic-filly-publicly.ngrok-free.app/ratings/', {
                "user_id": userIdObj,
                "place_id": placeId,
                "rating": rating
            }).then(() => {
                updatedRatings.push(updatedRating);
            })
        }
        const recommendationRes = await axios.get(`https://exotic-filly-publicly.ngrok-free.app/recommendations/${userId}`);
        const recommendations = recommendationRes.data.recommendations.map(data => data.id);
        const updatedRecommendation = await Recommendation.findOneAndUpdate(
            { userId: userIdObj },
            { $set: { places: recommendations } },
            { upsert: true, new: true, runValidators: true }
        );
        console.log('updatedRecommendation', updatedRecommendation)
        return updatedRatings;
    }
}

module.exports = UserFavoriteService