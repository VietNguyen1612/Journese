const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Tag";

const COLLECTION_NAME = "Tags";

const tagSchema = new Schema(
  {
    name: { type: String, required: true },
    places: [{ type: String }],
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = {
  Tag: model(DOCUMENT_NAME, tagSchema)
}

