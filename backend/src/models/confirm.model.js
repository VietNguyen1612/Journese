"use strict";

const { Schema, model, Types } = require("mongoose");

const DOCUMENT_NAME = "Confirm";
const COLLECTION_NAME = "Confirms";

const confirmSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["pending", "rejected", "approved"],
      default: "pending",
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },

    email: { type: String, default: "" },
    dob: { type: String, default: "" },
    citizen_id: { type: String, default: "" },
    citizen_images: { type: [String], default: [] },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = {
  Confirm: model(DOCUMENT_NAME, confirmSchema),
};
