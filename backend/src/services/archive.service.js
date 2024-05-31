"use strict";

const { BadRequestError } = require("../core/error.response");
const { Archive } = require("../models/archive.model");

class ArchiveService {
  static async createArchive({ title, userId, places, ...payload }) {
    const placesCheck = new Set(places);
    const archive = await Archive.create({
      title,
      userId,
      placesNumber: placesCheck.size,
      places: [...placesCheck],
      ...payload,
    });
    return archive;
  }
  static async updateArchive({ archiveId, userId, places, ...payload }) {
    const filter = {
      _id: archiveId,
      userId,
    };
    const archive = await Archive.findOne(filter).lean();

    if (!archive) {
      throw new BadRequestError("archive not existed");
    }
    const placesExist = [...new Set(places)];

    const update = {
      ...payload,
      places: places ? placesExist : undefined,
      placesNumber: places ? placesExist.length : undefined,
    };

    return await Archive.updateOne(filter, update).lean();
  }
  static async getArchiveDetail({ userId, archiveId }) {
    console.log(archiveId);
    const archive = await Archive.findOneAndUpdate(
      { _id: archiveId, userId },
      {
        new: true,
      }
    );
    if (!archive) {
      throw new BadRequestError("Archive not existed");
    }
    return archive.populate([
      {
        path: "userId",
        select: "_id phone firstName lastName avatarUrl",
      },
      {
        path: "places",
      },
    ]);
  }
}

module.exports = ArchiveService;
