

const { Schema, model, Types } = require("mongoose");

const DOCUMENT_NAME = "Advertisement";
const COLLECTION_NAME = "Advertisements";

const AdvertisementSchema = new Schema({
    userId: { type: Types.ObjectId, ref: "User", required: true },
    price: {
        type: Number,
        default: 50000
    },
    image: {
        type: String
    },
    isValid: {
        type: Boolean,
        default: false
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    isExpired: {
        type: Boolean,
        default: false
    },
    validatedAt: {
        type: Date
    },
    paidAt: {
        type: Date
    },
    expiresIn: {
        type: Number,
        default: 5
    }
},
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = {
    Advertisement: model(DOCUMENT_NAME, AdvertisementSchema),
};