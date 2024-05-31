"use strict";

const { PlaceModel } = require("../models/place.model");
const { Recommendation } = require('../models/recommendation.model')
const { Trip } = require("../models/trip.model");
const { Tag } = require("../models/tag.model");
const { default: mongoose } = require("mongoose");
const { NotFoundError } = require("../core/error.response");
const findPlaceById = async (id) => await PlaceModel.findById(id).lean();

// const getPlacesPage = async ({ limit, page, sort, find = {} }) => {
//   const skip = (page - 1) * limit;
//   const places = await PlaceModel.find().skip(skip).sort(sort).lean();
//   return places;
// };

const addPlaceToTripList = async ({ place, trips }) => {
  for (let trip of trips) {
    let tripData = await Trip.findById(trip);
    if (!tripData.places.includes(place)) {
      await Trip.findByIdAndUpdate(trip, {
        $push: { places: place },
        $inc: { placeCount: 1 },
      });
      if (tripData.status !== 'DRAFT') {
        let schedule = [...tripData.schedule];
        schedule[schedule.length - 1].push(place);
        await Trip.findByIdAndUpdate(trip, {
          schedule: schedule,
        });
      }
    }
  }
};


const getPlaceDetail = async (place_id) =>
  await PlaceModel.findOne({ place_id }).populate('tags', '_id name').lean();

const getPlaceByProvince = async ({ province, limit, page, sort = {} }) => {
  const skip = (page - 1) * limit;

  return await PlaceModel.find({ province })
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .lean();
};



const getPlaces = async ({ userId, keySearch, tags, limit = 5 }) => {
  let priorityPlaceIds = []
  if (userId !== undefined && userId !== null && userId.length !== 0) {
    const userRec = await Recommendation.findOne({ userId: new mongoose.Types.ObjectId(userId) })
    priorityPlaceIds = userRec.places
  }

  tags = tags.map(tag => new mongoose.Types.ObjectId(tag))
  const searchPattern = keySearch ? new RegExp(keySearch, 'i') : null;
  await PlaceModel.createIndexes();

  let matchCondition = {};
  if (searchPattern && tags && tags.length > 0) {
    matchCondition = {
      $and: [
        {
          $or: [
            { name: { $regex: searchPattern } },
            { place_id: { $regex: searchPattern } },
            { type: { $regex: searchPattern } },
            { _id: { $regex: searchPattern } },
            { images: { $regex: searchPattern } }
          ]
        },
        { tags: { $in: tags } }
      ]
    };
  } else if (searchPattern) {
    matchCondition = {
      $or: [
        { name: { $regex: searchPattern } },
        { place_id: { $regex: searchPattern } },
        { type: { $regex: searchPattern } },
        { _id: { $regex: searchPattern } },
        { images: { $regex: searchPattern } }
      ]
    };
  } else if (tags && tags.length > 0) {
    matchCondition = { tags: { $in: tags } };
  }

  let places = await PlaceModel.aggregate([
    {
      $match: matchCondition,
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

  // Sort the places array based on whether the place_id is in priorityPlaceIds
  places.sort((a, b) => {
    const aHasPriorityPlace = a.places.some(place => priorityPlaceIds.includes(place.place_id));
    const bHasPriorityPlace = b.places.some(place => priorityPlaceIds.includes(place.place_id));

    if (aHasPriorityPlace && !bHasPriorityPlace) {
      return -1;
    } else if (!aHasPriorityPlace && bHasPriorityPlace) {
      return 1;
    } else {
      return 0;
    }
  });

  places.forEach(province => {
    // Separate priority places and other places
    let priorityPlaces = [];
    let otherPlaces = [];
    province.places.forEach(place => {
      if (priorityPlaceIds.includes(place.place_id)) {
        priorityPlaces.push(place);
      } else {
        otherPlaces.push(place);
      }
    });

    // Shuffle other places
    otherPlaces.sort(() => Math.random() - 0.5);

    // Combine priority places and shuffled other places
    province.places = [...priorityPlaces, ...otherPlaces];

    // Limit the number of places
    province.places = province.places.slice(0, Math.min(limit, province.places.length));
  });

  // console.log(places);
  return places;
};


const getPlacesPage = async () => {
  const places = await PlaceModel.find()
  return places
};

const searchPlaceByUser = async ({ keySearch }) => {
  const searchPattern = new RegExp(keySearch, 'i');
  await PlaceModel.createIndexes();
  const places = await PlaceModel.aggregate([
    {
      $match: {
        $or: [
          { name: { $regex: searchPattern } },
          { place_id: { $regex: searchPattern } },
          { type: { $regex: searchPattern } },
          { _id: { $regex: searchPattern } },
          { images: { $regex: searchPattern } },
        ],
      },
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
  console.log(places)
  return places;
};

const updatePlace = async (payload) => {
  const { tags, place_id } = payload;

  if (!place_id) {
    throw new NotFoundError('place_id is required');
  }

  const existingPlace = await PlaceModel.findOne({ place_id: place_id });

  if (!existingPlace) {
    throw new NotFoundError('place not found');
  }

  // Get the existing tags of the place
  const existingTags = existingPlace.tags;

  const updatedPlace = await PlaceModel.findOneAndUpdate(
    { place_id: place_id },
    payload,
    { new: true }
  );

  if (!updatedPlace) {
    throw new NotFoundError('place not found');
  }

  if (tags !== undefined) {
    for (let i = 0; i < tags.length; i++) {
      const tag = await Tag.findById(tags[i]);
      if (!tag) {
        throw new Error('Invalid tags');
      } else {
        if (!tag.places.includes(place_id)) {
          tag.places.push(place_id);
          await tag.save();
        }
      }
    }
    // Remove place_id from the tags that are not in the new tags
    for (let i = 0; i < existingTags.length; i++) {
      if (!tags.includes(existingTags[i])) {
        const tag = await Tag.findById(existingTags[i]);
        if (tag) {
          const index = tag.places.indexOf(place_id);
          if (index > -1) {
            tag.places.splice(index, 1);
            await tag.save();
          }
        }
      }
    }
  }



  return updatedPlace;
}


module.exports = {
  getPlaceDetail,
  searchPlaceByUser,
  findPlaceById,
  getPlaceByProvince,
  getPlacesPage,
  addPlaceToTripList,
  updatePlace,
  getPlaces
};
