const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Message";
const COLLECTION_NAME = "Messages";

const MessageSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    groupChatId: { type: Schema.Types.ObjectId, ref: "GroupChat", required: true },
    // readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: COLLECTION_NAME,
  }
);

const Message = model(DOCUMENT_NAME, MessageSchema);

module.exports = { Message }
