const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Rating";

const COLLECTION_NAME = "Ratings";

const ratingSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        placeId: { type: String, required: true },
        tripId: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        message: { type: String }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = {
    Rating: model(DOCUMENT_NAME, ratingSchema)
}

