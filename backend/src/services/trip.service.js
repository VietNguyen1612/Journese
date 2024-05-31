"use strict";

const { BadRequestError } = require("../core/error.response");
const { Trip, TripParticipatesRequest } = require("../models/trip.model");
const { User } = require("../models/user.model");
const { Rating } = require("../models/rating.model");
const {
  returnUniqueProvinces,
  findNextDuplicate,
} = require("../repositories/trip.repository");
const { getDistanceFromLatLong } = require("../utils");
const { Types } = require("mongoose");
const { PlaceModel } = require("../models/place.model");
const { Recommendation } = require("../models/recommendation.model");
const { GroupChat } = require("../models/groupchat.model");
const GroupChatService = require("./groupchat.service");
const NotificationService = require("./notification.service");
class TripService {
  static async scheduleTrip({
    tripId,
    startDate,
    endDate,
    status,
    ...payload
  }) {
    const trip = await Trip.findOne({ _id: tripId });
    if (!trip) {
      throw new BadRequestError("Trip not existed");
    }
    const numberOfDays = Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    ) + 1;
    const placesPerDay = Math.ceil(trip.places.length / numberOfDays);

    const newPlaces = [];
    for (let i = 0; i < trip.places.length; i += placesPerDay) {
      newPlaces.push(trip.places.slice(i, i + placesPerDay));
    }
    while (newPlaces.length < numberOfDays) {
      newPlaces.push([]);
    }

    const res = await Trip.findByIdAndUpdate(tripId, {
      $set: {
        startDate,
        endDate,
        schedule: newPlaces,
        status: status,
      },
    });
    return res;
  }

  static async getTripByStatus({ status, userId, page, limit }) {
    const matchStage =
      status === "IN-COMING"
        ? { $match: { status: status, isPublish: true } }
        : { $match: { status: status } };

    const pipeline = [
      matchStage,
      {
        $lookup: {
          from: "Users",
          localField: "participates",
          foreignField: "_id",
          as: "participates",
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "onGoingParticipates",
          foreignField: "_id",
          as: "onGoingParticipates",
        },
      },
      {
        $lookup: {
          from: "Places",
          localField: "places",
          foreignField: "place_id",
          as: "places",
        },
      },
      { $unwind: "$schedule" },
      {
        $lookup: {
          from: "Places",
          localField: "schedule",
          foreignField: "place_id",
          as: "schedule",
        },
      },
    ];

    // Get trip for user with recommendation
    if (userId) {
      const userRec = await Recommendation.findOne({
        userId: new Types.ObjectId(userId),
      });
      const priorityPlaceIds = userRec.places;

      const recommendedPipeline = [...pipeline];
      recommendedPipeline.push({
        $match: { "places.place_id": { $in: priorityPlaceIds } },
      });
      recommendedPipeline.push({ $sample: { size: limit - 1 } });

      const recommendedTrips = await Trip.aggregate(recommendedPipeline);
      const left = limit - recommendedTrips.length

      const unrecommendedPipeline = [...pipeline];
      unrecommendedPipeline.push({
        $match: { "places.place_id": { $nin: priorityPlaceIds } },
      });
      unrecommendedPipeline.push({ $sample: { size: left } });

      const unrecommendedTrips = await Trip.aggregate(unrecommendedPipeline);

      const trip = [...recommendedTrips, ...unrecommendedTrips];

      return trip;
    }

    // Get trip for guess without any recommendation
    else {
      pipeline.push({ $sample: { size: parseInt(limit) } });
      const trip = await Trip.aggregate(pipeline);

      return trip;
    }
  }

  static async getAllTripByUserId({ userId, status }) {
    const trip = await Trip.aggregate([
      {
        $match: {
          $or: [
            { userId: new Types.ObjectId(userId), status: { $in: status } },
            {
              participates: { $in: [new Types.ObjectId(userId)] },
              status: { $in: status },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "participates",
          foreignField: "_id",
          as: "participates",
        },
      },

      {
        $lookup: {
          from: "Users",
          localField: "onGoingParticipates",
          foreignField: "_id",
          as: "onGoingParticipates",
        },
      },
      {
        $lookup: {
          from: "Places",
          localField: "places",
          foreignField: "place_id",
          as: "places",
        },
      },
    ]);

    const tripResult = [];

    for (const i of trip) {
      const schedule = [];
      const tempTrip = i
      for (const day of i.schedule) {
        const dayPlaces = [];
        for (const placeId of day) {
          const place = await PlaceModel.findOne({ place_id: placeId })
            .populate("tags")
            .lean();
          dayPlaces.push(place);
        }
        schedule.push(dayPlaces);
      }
      tempTrip.schedule = schedule
      tripResult.push(tempTrip)
    }
    return tripResult;
  }

  // NOTE: trip owner add a user to trip
  static async addParticipateToTrip({
    tripOwnerUserId,
    tripId,
    participateId,
  }) {
    const parti = await User.findById(participateId).lean();
    if (!parti) {
      throw new BadRequestError("Person not existed");
    }
    const trip = await Trip.findOne({ userId: tripOwnerUserId, _id: tripId });
    if (!trip) {
      throw new BadRequestError("Error");
    }
    const requested = await TripParticipatesRequest.create({
      requestUserId: tripOwnerUserId,
      tripId,
      receiveId: participateId,
      status: "REQUESTED",
    });
    await Trip.findOneAndUpdate(
      { userId: tripOwnerUserId, _id: tripId },
      {
        $set: {
          participates_requested: participateId,
        },
      }
    ).lean();
    return requested;
  }
  // NOTE: user accept to the request(not the owner)
  static async userAcceptRequestToJoin({ tripId, receiveUserId }) {
    await TripParticipatesRequest.findOneAndUpdate(
      { tripId, receiveUserId },
      {
        status: "JOINED",
      }
    ).lean();
    await Trip.findByIdAndUpdate(tripId, {
      $set: {
        participates: receiveUserId,
      },
    }).lean();
  }
  // NOTE: user reject to the request(not the owner)
  static async userRejectRequestToJoin({ tripId, receiveUserId }) {
    await TripParticipatesRequest.findOneAndUpdate(
      { tripId, receiveUserId },
      {
        status: "REJECTED",
      }
    ).lean();
  }
  static async updateTrip({
    userId,
    tripId,
    participates,
    onGoingParticipates,
    places,
    ...payload
  }) {
    const filter = {
      _id: tripId,
    };

    const trip = await Trip.findOne(filter);
    if (!trip) {
      throw new BadRequestError("Trip not existed");
    }
    if (places) {
      const isDuplicate = await findNextDuplicate(places);
      if (isDuplicate) {
        throw new BadRequestError("Cannot add next duplicate place");

      }
      // if (
      //   trip.places.length > 0 &&
      //   trip.places[trip.places.length - 1].toString() === places[0]
      // ) {
      //   console.log("-----------------------------------");

      //   throw new BadRequestError("Error");
      // }
    }

    if (participates && participates.length > 0) {
      const groupChat = await GroupChat.findOne({ tripId: tripId }).lean();

      if (groupChat) {
        await GroupChat.findOneAndUpdate(
          { tripId: tripId },
          { $set: { participants: participates, name: payload.title } }
        );
      } else {
        if (payload.status && payload.status !== "DRAFT") {
          const participants = participates.filter(
            (participate) => participate !== trip.userId.toString()
          );
          await GroupChatService.addGroupChat({
            createdBy: trip.userId,
            name: trip.title,
            tripId: tripId,
            participants: participants,
            isGroupGroupChat: true,
          });
        }
      }

      await TripParticipatesRequest.findOneAndUpdate(
        {
          tripId,
          requestUserId: { $in: participates },
          status: "REQUESTED",
        },
        {
          status: "JOINED",
        }
      );
      await Trip.updateMany(
        { _id: tripId },
        {
          $pull: { participates_requested: { $in: participates } },
        }
      ).lean();
    }

    // onGoingParticipates = onGoingParticipates.map(
    //   (id) => new Types.ObjectId(id)
    // );
    const update = {
      $set: {
        ...payload,
        places: places,
        placeCount: places ? places.length : undefined,
        participates: participates,
        // onGoingParticipates: onGoingParticipates,
      },
    };
    const options = {
      new: true,
    };
    return await Trip.updateOne(filter, update, options).lean();
  }

  static async startTrip({
    userId,
    tripId,
    participates,
    onGoingParticipates,
    status
  }) {
    const filter = {
      _id: tripId,
    };
    const trip = await Trip.findOne(filter);
    if (!trip) {
      throw new BadRequestError("Trip not existed");
    }
    // Check if status changes from 'IN-COMING' to 'ON-GOING'
    if (status && trip.status === "IN-COMING" && status === "ON-GOING") {
      // Send message to all participants excluding the user ID
      for (let participant of trip.participates) {
        if (participant !== userId) {
          const sender = await User.findById(new Types.ObjectId(userId));
          const receiver = await User.findById(new Types.ObjectId(participant));
          const res = await NotificationService.addNotification({
            senderId: userId,
            receiverId: participant,
            title: trip.title,
            content: `${sender.fullName} đã bắt đầu hành trình, hãy tham gia`,
          });
        }
      }

    }

    onGoingParticipates = onGoingParticipates.map(
      (id) => new Types.ObjectId(id)
    );
    const update = {
      $set: {
        status: status,
        onGoingParticipates: onGoingParticipates,
      },
    };


    const options = {
      new: true,
    };
    return await Trip.updateOne(filter, update, options).lean();
  }

  static async getTripDetail({ tripId, userId }) {
    const trip = await Trip.findOneAndUpdate(
      { _id: tripId },
      { $inc: { viewCount: 1 } },
      {
        new: true,
      }
    );

    if (!trip) {
      throw new BadRequestError("Trip not existed");
    }

    //Check if userid in trip
    const isParticipant = trip.participates.includes(userId);
    const ratingPipeline = [
      {
        $match: { tripId: new Types.ObjectId(tripId) },
      },
      {
        $lookup: {
          from: "Users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      {
        $unwind: "$userId",
      },
      {
        $lookup: {
          from: "Places",
          let: { placesId: "$placeId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$place_id", "$$placesId"],
                },
              },
            },
          ],
          as: "placeId",
        },
      },
      {
        $unwind: "$placeId",
      },
    ];

    const ratings = await Rating.aggregate(ratingPipeline);

    const places = [];
    for (const placeId of trip.places) {
      const place = await PlaceModel.findOne({ place_id: placeId })
        .populate("tags")
        .lean();
      places.push(place);
    }

    const schedule = [];
    for (const day of trip.schedule) {
      const dayPlaces = [];
      for (const placeId of day) {
        const place = await PlaceModel.findOne({ place_id: placeId })
          .populate("tags")
          .lean();
        dayPlaces.push(place);
      }
      schedule.push(dayPlaces);
    }

    const pipline = [
      {
        $match: { _id: new Types.ObjectId(tripId) },
      },
      {
        $lookup: {
          from: "Users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      {
        $unwind: "$userId",
      },
      {
        $lookup: {
          from: "Users",
          localField: "participates",
          foreignField: "_id",
          as: "participates",
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "onGoingParticipates",
          foreignField: "_id",
          as: "onGoingParticipates",
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "participates_requested",
          foreignField: "_id",
          as: "participates_requested",
        },
      },
      {
        $project: {
          "participates.password": 0,
        },
      },
    ];
    const tripDetail = await Trip.aggregate(pipline);
    const tripResult = tripDetail[0];
    tripResult.ratings = ratings;
    tripResult.places = places;
    tripResult.schedule = schedule;

    // If the user is a participant, check if they have rated any place on this trip
    if (isParticipant) {
      const ratings = await Rating.find({ userId, tripId });
      tripResult.rated = ratings.length > 0;
    }

    let totalDistance = 0;
    for (let i = 0; i < tripResult.places.length - 1; i++) {
      totalDistance += getDistanceFromLatLong(
        tripResult.places[i].geolocation.coordinates,
        tripResult.places[i + 1].geolocation.coordinates
      );
    }
    // tripResult.totalDistance = parseFloat(totalDistance.toFixed(1));
    console.log(totalDistance + " km");

    return tripResult;
  }
  static async createTrip({
    userId,
    title,
    places,
    startDate,
    endDate,
    participates,
    ...rest
  }) {
    const isDuplicate = await findNextDuplicate(places);
    if (isDuplicate) {
      throw new BadRequestError("Duplicate next place");
    }

    if (
      new Date(startDate) < new Date() ||
      new Date() > new Date(endDate) ||
      new Date(startDate) > new Date(endDate)
    ) {
      throw new BadRequestError("Trip wrong date");
    }

    const tripParticipates =
      !participates || participates.length < 1
        ? [userId]
        : [...participates, userId];

    const provinceList = await returnUniqueProvinces(places);

    const trip = await Trip.create({
      userId,
      title,
      places,
      provinces: provinceList,
      participates: tripParticipates,
      startDate,
      placeCount: places.length,
      endDate,
      ...rest,
    });

    const groupChat = await GroupChatService.addGroupChat({
      createdBy: userId,
      name: title,
      tripId: trip._id,
      participants: tripParticipates,
      isGroupGroupChat: true,
    });

    if (!trip) {
      throw new BadRequestError("Cannot create trip");
    }
    return trip;
  }

  static async requestJoinTrip({ tripId, userId }) {
    const duplicate = await TripParticipatesRequest.findOne({
      tripId,
      requestUserId: userId,
      status: "REQUESTED",
    });
    if (duplicate) {
      throw new BadRequestError("Duplicate request");
    }

    await Trip.findOneAndUpdate(
      { _id: tripId },
      {
        $push: { participates_requested: userId },
      }
    ).lean();

    const existed = await TripParticipatesRequest.findOne({
      tripId,
      requestUserId: userId,
      status: "JOINED",
    });

    if (existed) {
      const result = await TripParticipatesRequest.findOneAndUpdate(
        {
          tripId,
          requestUserId: userId,
        },
        {
          status: "REQUESTED",
        }
      );
      return result;
    } else {
      const result = await TripParticipatesRequest.create({
        tripId,
        requestUserId: userId,
        status: "REQUESTED",
      });
      return result;
    }
  }

  static async getRequestJoinTrip({ tripId, userId }) {
    const trip = await Trip.findOne({ _id: tripId });
    if (userId !== trip.userId.toString()) {
      throw new BadRequestError("You are not owner of this trip");
    }

    const result = await TripParticipatesRequest.find({
      tripId: tripId,
      status: "REQUESTED",
    })
      .populate("requestUserId")
      .lean();
    return result;
  }

  static async getAllRequestJoinTripSended({ userId }) {
    const pipeline = [
      {
        $match: {
          requestUserId: new Types.ObjectId(userId),
          status: "REQUESTED",
        },
      },
      {
        $lookup: {
          from: "Trips",
          localField: "tripId",
          foreignField: "_id",
          as: "tripId",
        },
      },
      {
        $unwind: "$tripId",
      },
      {
        $lookup: {
          from: "Places",
          localField: "tripId.places",
          foreignField: "place_id",
          as: "tripId.places",
        },
      },
    ];
    const result = await TripParticipatesRequest.aggregate(pipeline);
    return result;
  }

  static async rejectParticipateToTrip({ userId, tripId, participateId }) {
    const parti = await User.findById(participateId).lean();
    if (!parti) {
      throw new BadRequestError("Person not existed");
    }

    const trip = await Trip.findOne({ _id: tripId });
    if (userId !== participateId && userId !== trip.userId.toString()) {
      throw new BadRequestError("You are not allow to reject this request");
    }

    const result = await TripParticipatesRequest.findOneAndDelete({
      tripId,
      requestUserId: participateId,
      status: "REQUESTED",
    });
    await Trip.findOneAndUpdate(
      { _id: tripId },
      {
        $pull: { participates_requested: participateId },
      }
    ).lean();

    return result;
  }

  static async acceptParticipateToTrip({ userId, tripId, participateId }) {
    const parti = await User.findById(participateId).lean();
    if (!parti) {
      throw new BadRequestError("Person not existed");
    }

    const trip = await Trip.findOne({ _id: tripId });
    if (userId !== trip.userId.toString()) {
      throw new BadRequestError("You are not allow to accept this request");
    }

    const result = await TripParticipatesRequest.findOneAndUpdate(
      {
        tripId,
        requestUserId: participateId,
        status: "REQUESTED",
      },
      {
        status: "JOINED",
      }
    );
    await Trip.findOneAndUpdate(
      { _id: tripId },
      {
        $pull: { participates_requested: participateId },
        $push: {
          participates: participateId,
        },
      }
    ).lean();

    const groupChat = await GroupChat.findOne({ tripId: tripId }).lean();
    if (groupChat) {
      await GroupChat.findOneAndUpdate(
        { tripId: tripId },
        { $push: { participants: participateId } }
      );
    } else {
      throw new BadRequestError("Group chat not existed");
    }

    return result;
  }

  static async leaveTrip({ userId, tripId }) {
    const trip = await Trip.findOne
      ({ _id: tripId });
    if (!trip) {
      throw new BadRequestError("Trip not existed");
    }
    if (trip.userId.toString() === userId) {
      throw new BadRequestError("Owner cannot leave trip");
    }

    const result = await Trip.findOneAndUpdate(
      { _id: tripId },
      {
        $pull: {
          participates: userId,
          onGoingParticipates: userId
        },
      }
    ).lean();

    await GroupChat.findOneAndUpdate(
      { tripId: tripId },
      {
        $pull: { participants: userId },
      }
    );
    console.log(result);
    return result;
  }
}

module.exports = TripService;
