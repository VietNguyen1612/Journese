"use strict";

const { Schema, model, Types } = require("mongoose");

const DOCUMENT_NAME = "Trip";
const COLLECTION_NAME = "Trips";
// TODO: them may vu track user do nua
const tripSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // moderaterUser: {
    //   type: [Schema.Types.ObjectId],
    //   ref: "User",
    //   required: true,
    // },
    title: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ["DRAFT", "IN_COMING", "ON_GOING", "FINISHED", "DELETED"],
      default: "DRAFT",
    },
    vehicle: { type: String, enum: ["bike", "car"], default: "bike" },
    provinces: { type: [String], required: true },
    places: { type: [String], required: true },
    schedule: { type: [[String]], default: [[]] },
    placeCount: { type: Number, default: 0 },
    visited: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    isDraft: { type: Boolean, default: true, select: false },
    isPublish: { type: Boolean, default: false, select: false },
    onGoingParticipates: {
      type: [Types.ObjectId],
      ref: "User",
    },
    participates: {
      type: [Types.ObjectId],
      ref: "User",
      required: true,
    },
    participates_requested: {
      type: [Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const tripParticipateRequestSchema = new Schema({
  requestUserId: { type: Types.ObjectId, ref: "User", required: true },
  // receiveUserId: { type: Types.ObjectId, ref: "User", required: true },
  tripId: { type: Types.ObjectId, ref: "Trip", required: true },
  status: {
    type: String,
    enum: ["JOINED", "REQUESTED", "REJECTED"],
    required: true,
  },
});

module.exports = {
  Trip: model(DOCUMENT_NAME, tripSchema),
  TripParticipatesRequest: model(
    "TripParticipatesRequest",
    tripParticipateRequestSchema
  ),
};
