const { Schema, Types, model } = require("mongoose");

const DOCUMENT_NAME = "Report";
const COLLECTION_NAME = "Reports";

const ReportSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    created: {
      type: Date,
      default: Date.now,
    },
    state: {
      type: String,
      enum: ["pending", "approve", "reject"],
      default: "pending",
    },
    type: {
      type: String,
      enum: ["User", "Place", "Trip", "Post"],
      required: true,
    },
    targetEntityId: {
      type: Types.ObjectId,
      required: true,
      refPath: "type",
    },
    images: {
      type: [String],
      default: [],
    },
    details: {
      type: String
    },
    adminComment: {
      type: String,
      default: "",
    },
  },
  {
    collection: COLLECTION_NAME,
  }
);

const Report = model(DOCUMENT_NAME, ReportSchema);

module.exports = Report;
