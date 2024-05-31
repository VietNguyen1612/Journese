"use strict";

const { Schema, model, Types } = require("mongoose");

const DOCUMENT_NAME = "Archive";
const COLLECTION_NAME = "Archives";

const archiveSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    places: [{ type: Types.ObjectId, default: [], ref: "Place" }],
    placesNumber: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  Archive: model(DOCUMENT_NAME, archiveSchema),
};
