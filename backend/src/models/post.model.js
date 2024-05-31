"use strict";

const { Schema, model, Types } = require("mongoose");

const DOCUMENT_NAME = "Post";
const COLLECTION_NAME = "Posts";
// TODO: them may vu track user do nua
const postSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    images: { type: Array, default: [] },
    liked: { type: [Types.ObjectId], ref: "User", default: [] },
    videos: { type: Array, default: [] },
    isPublished: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, postSchema);
