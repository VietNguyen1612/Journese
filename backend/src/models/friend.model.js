"use strict";

const { Schema, model, Types } = require("mongoose");

const DOCUMENT_NAME = "Friend";
const COLLECTION_NAME = "Friends";

const friendSchema = new Schema(
  {
    senderId: { type: Types.ObjectId, ref: "User", required: true },
    receiveId: { type: Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["FRIEND", "REQUESTED"], required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, friendSchema);
