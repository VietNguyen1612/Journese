"use strict";

const { Schema, model, Types } = require("mongoose");

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

const userAttribute = new Schema({
  friend: { type: [Types.ObjectId], ref: "User", default: [] },
  followers: { type: [Types.ObjectId], ref: "User", default: [] },
  citizen_id: { type: String, default: "" },
  email: { type: String, default: "" },
  citizen_images: { type: [String], default: [] },
  images: { type: [String], default: [] },
  dob: { type: String, default: "" },
  // address: {},
});

const userSchema = new Schema(
  {
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          const phonePattern =
            /^(0)(3[2-9]|5[2689]|7[06789]|8[1-689]|9[0-9])[0-9]{7}$/;
          return phonePattern.test(value);
        },
        message: "Invalid Vietnamese phone number",
      },
    },
    role: {
      type: String,
      enum: ["admin", "business", "user"],
      default: "user",
    },
    avatarUrl: {
      type: String,
      default:
        "https://res.cloudinary.com/duiireqbc/image/upload/v1712853775/ukdol6n4g5sftqmkybea.jpg",
    },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    // TODO: isActive default true for now, cause sms otp dont have yet
    isActive: { type: Boolean, default: true },
    password: { type: String, required: true },
    // hien tai an di
    attributes: { type: userAttribute, default: {} },
    isValid: { type: Boolean, default: false },
    isBlock: { type: Boolean, default: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = {
  User: model(DOCUMENT_NAME, userSchema),
  userAttribute: model("User_Attribute", userAttribute),
};
