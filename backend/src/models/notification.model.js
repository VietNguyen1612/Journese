const { Schema, Types, model } = require("mongoose");

const DOCUMENT_NAME = "Notification";

const COLLECTION_NAME = "Notifications";

const notificationSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: "User" },
  receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  title: { type: String, required: true },
},
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const userDeviceMappingSchema = new Schema({
  receiverId: { type: Schema.Types.ObjectId, ref: "User" },
  expoToken: { type: String }
},
  {
    timestamps: true,
    collection: "UserDeviceMappings",
  }
);

module.exports = {
  Notification: model(DOCUMENT_NAME, notificationSchema),
  UserDeviceMapping: model("UserDeviceMapping", userDeviceMappingSchema)
}

