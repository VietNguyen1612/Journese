"use strict";
require("dotenv");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "sangtran127",
  api_key: "261637981334771",
  api_secret: process.env.CLOUDINARY_SECRET_API_KEY,
});

module.exports = cloudinary;
