"use strict";
const mongoose = require('mongoose');
const { Tag } = require('../models/tag.model')
const { PlaceModel } = require('../models/place.model')
const { NotFoundError } = require("../core/error.response")
const searchPlaceByTags = async ({ tags }) => {
    const result = await PlaceModel.aggregate([
        {
            $match: {
                tags: { $in: tags }
            }
        },
        {
            $group: {
                _id: "$province",
                places: {
                    $push: {
                        name: "$name",
                        place_id: "$place_id",
                        type: "$type",
                        _id: "$_id",
                        images: "$images",
                    },
                },
            },
        },
    ]);

    return result;
}

const addNewTag = async ({ name }) => {
    const tag = new Tag({ name: name })
    const result = await tag.save()
    return result
}

const getAllTags = async () => {
    const tags = await Tag.find();
    return tags;
}

const searchTags = async (name) => {
    const tags = await Tag.find({ name: new RegExp(name, 'i') });
    return tags;
}

const deleteTags = async ({ tag }) => {
    await Place.updateMany(
        { tags: { $in: [tag] } },
        { $pull: { tags: tag } },
        { multi: true }
    );

    return await Tag.findByIdAndDelete(tag);
}

const addTagListToPlace = async ({ placeId, tags }) => {
    console.log(placeId)
    const place = await PlaceModel.findOne({ place_id: placeId });

    if (!place) {
        throw new NotFoundError("Can not find place")
    }
    let tagList = []
    for (let tagId of tags) {
        // Find the tag
        const tag = await Tag.findById(tagId);

        if (!tag) {
            throw new NotFoundError("Invalid tag id")
        }
        tagList.push(tag)
    }
    place.tags.push(...tagList.map(tag => tag._id));
    await place.save();
    tagList.forEach(async (tag) => {
        tag.places.push(placeId);
        await tag.save();
    });
    return place
}
module.exports = {
    searchPlaceByTags,
    addNewTag,
    getAllTags,
    searchTags,
    deleteTags,
    addTagListToPlace
}