const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "UserFavorite";

const COLLECTION_NAME = "UserFavorites";

const userFavoriteSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        placeId: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = {
    UserFavorite: model(DOCUMENT_NAME, userFavoriteSchema)
}

