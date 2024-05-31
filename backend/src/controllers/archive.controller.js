"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const ArchiveService = require("../services/archive.service");

class ArchiveController {
  createArchive = async (req, res) => {
    console.log(req.user);
    new CREATED({
      message: "Archive added successfully",
      metadata: await ArchiveService.createArchive({
        userId: req.user.userId,
        ...req.body,
      }),
    }).send(res);
  };
  updateArchive = async (req, res) => {
    new SuccessResponse({
      message: "Archive update successfully",
      metadata: await ArchiveService.updateArchive({
        userId: req.user.userId,
        archiveId: req.params.archiveId,
        ...req.body,
      }),
    }).send(res);
  };
  getArchiveDetail = async (req, res) => {
    new SuccessResponse({
      message: "Get archive successfully",
      metadata: await ArchiveService.getArchiveDetail({
        userId: req.user.userId,
        archiveId: req.params.archiveId,
        ...req.body,
      }),
    }).send(res);
  };
}

module.exports = new ArchiveController();
