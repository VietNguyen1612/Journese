"use strict";

const { SuccessResponse } = require("../core/success.response");
const UploadService = require("../services/upload.service");

class UploadController {
  uploadFile = async (req, res) => {
    new SuccessResponse({
      message: "upload success",
      metadata: await UploadService.uploadImageFromUrl(),
    }).send(res);
  };
}

module.exports = new UploadController();
