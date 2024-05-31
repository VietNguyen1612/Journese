"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const TagService = require("../services/tag.service");

class TagController {
    searchPlaceByTags = async (req, res) => {
        new SuccessResponse({
            message: "Filter places by tag successfully",
            metadata: await TagService.searchPlaceByTags({
                ...req.body,
            }),
        }).send(res);
    }

    addNewTag = async (req, res) => {
        new CREATED({
            message: "Add new tag successfully",
            metadata: await TagService.addNewTag({
                ...req.body,
            }),
        }).send(res);
    }

    getAllTags = async (req, res) => {
        new SuccessResponse({
            message: "Get all tags successfully",
            metadata: await TagService.getAllTags(),
        }).send(res);
    }

    addTagListToPlace = async (req, res) => {
        console.log(req.params.placeId)
        new SuccessResponse({
            message: "Add tagList to place successfully",
            metadata: await TagService.addTagListToPlace({
                ...req.body,
                placeId: req.params.placeId
            }),
        }).send(res);
    }
}

module.exports = new TagController()
