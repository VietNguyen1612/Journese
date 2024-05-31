const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "GroupChat";
const COLLECTION_NAME = "GroupChats";

const GroupChatSchema = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isGroupGroupChat: { type: Boolean, default: false },
    tripId: { type: Schema.Types.ObjectId, ref: "Trip" }
  },
  {
    collection: COLLECTION_NAME,
  }
);

const GroupChat = model(DOCUMENT_NAME, GroupChatSchema);

module.exports = { GroupChat };
