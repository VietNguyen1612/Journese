"use strict";

const { Types, Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Profile";

const COLLECTION_NAME = "Profiles";

const profileSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName: { type: String, required: true },
    friends: { type: [Types.ObjectId], ref: "User", default: [] },
    followers: { type: [Types.ObjectId], ref: "User", default: [] },
    address: { type: String, default: "" },
    citizen_id: { type: String, default: "" },
    gender: {
      type: String,
      enum: ["male", "female", "unknown"],
      default: "unknown",
    },
    //   geolocation: {},
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = {
  Profile: model(DOCUMENT_NAME, profileSchema),
};
