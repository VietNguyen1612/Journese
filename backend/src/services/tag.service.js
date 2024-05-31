"use strict";

const { BadRequestError } = require("../core/error.response");
const { searchPlaceByTags, addNewTag, getAllTags, addTagListToPlace } = require("../repositories/tag.repository")
const { Tag } = require('../models/tag.model')
const { Types } = require("mongoose");


class TagService {
    static async searchPlaceByTags(payload) {
        return await searchPlaceByTags(payload)
    }

    static async addNewTag(payload) {
        return await addNewTag(payload)
    }

    static async getAllTags() {
        return await getAllTags()
    }

    static async addTagListToPlace(payload) {
        return await addTagListToPlace(payload)
    }
}

module.exports = TagService