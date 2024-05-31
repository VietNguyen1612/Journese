const { Schema, model, Types } = require("mongoose");

const DOCUMENT_NAME = "Block";
const COLLECTION_NAME = "Blocks";

const BlockSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    reason: { type: String },
    createdAt: { type: Date },
  },
  { collection: COLLECTION_NAME }
);

const Block = model(DOCUMENT_NAME, BlockSchema);

module.exports = Block;
