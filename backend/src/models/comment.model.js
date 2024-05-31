"use strict";

const { Schema, model, Types } = require("mongoose");

const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "Comments";
// TODO: them may vu track user do nua
const commentSchema = new Schema(
  {
    type: { type: String, required: true, enum: ["Place", "Post"] },
    entityId: { type: Types.ObjectId, required: true, refPath: "entityId" },
    userId: { type: Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    left: { type: Number, default: 0 },
    right: { type: Number, default: 0 },
    parentId: { type: Types.ObjectId, ref: DOCUMENT_NAME },
    isDeleted: { type: Boolean, default: false },
    // chua implement cai isDraft isPublish
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  Comment: model(DOCUMENT_NAME, commentSchema),
};
