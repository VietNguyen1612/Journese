"use strict";

const cloudinary = require("../configs/cloudinary.config");

class UploadService {
  static async uploadImageFromUrl() {
    const imageUrl =
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuIGBpSqN8Z68NA-PZJjIYQNIAzJosw4YWig&usqp=CAU";
    const folderName = "user/userId";
    // const newFileName = "testdemo";
    const res = await cloudinary.uploader.upload(imageUrl, {
      folder: folderName,
    });
    return res;
  }
  static async uploadFromLocalFile({ files }) {
    if (files.length < 1) {
      return;
    }
    // const result = await cloudinary.uploader.upload();
  }
}

module.exports = UploadService;
