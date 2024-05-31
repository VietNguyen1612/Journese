const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Recommendation";

const COLLECTION_NAME = "Recommendations";

const recommendationSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        places: [{ type: String }]
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = {
    Recommendation: model(DOCUMENT_NAME, recommendationSchema)
}

