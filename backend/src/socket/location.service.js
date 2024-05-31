"use strict";

const { User } = require("../models/user.model");
const { Trip } = require("../models/trip.model");
const { PlaceModel } = require("../models/place.model");
const { Types } = require("mongoose");

/**
 * @param {import('socket.io').Server} io
 */
module.exports = function (io) {
  io.on("connection", async (socket) => {
    try {
      const userId = socket.handshake.query.userId;
      const tripId = socket.handshake.query.tripId;

      const user = await User.findById(userId).select('-password').lean();
      const trip = await Trip.findById(tripId).lean();
      socket.join(tripId);
      // const user = await User.findById(userId).lean();
      // const friends = user.attributes.friend.map((friend) => friend.toString());
      // friends.forEach((friend) => {
      //   socket.join(friend);
      // });

      // socket.on("location-sending", (location) => {
      //   friends.forEach((friend) => {
      //     socket
      //       .to(friend)
      //       .emit("location-update", location, (error, message) => {
      //         console.log(location);
      //         if (error) {
      //           console.error("Error sending location update:", error);
      //         } else {
      //           console.log("Location update acknowledged:", message);
      //         }
      //       });
      //   });
      // });
      socket.on("location-sending", (location) => {
        // const onGoingParticipates = trip.onGoingParticipates.map((participate) => participate.toString());
        // onGoingParticipates.forEach((participate) => {
        //   if(participate !== userId) socket.join(participate);
        // });
        // onGoingParticipates.forEach((participate) => {
          // if(participate !== userId) {
          socket
            .to(tripId)
            .emit("location-update", {user: user,location: location}, (error, message) => {

              if (error) {
                console.error("Error sending location update:", error);
              } else {
                console.log("Location update acknowledged:", message);
              }
            });
          // }
        // });
      });
      socket.on("pin-place", async (placeId) => {
        const place = await PlaceModel.findOne({place_id: placeId}).lean();
        // participates.forEach((participate) => {
          // if(participate !== userId) {
          socket
            .to(tripId)
            .emit("pin-place-update", place, (error, message) => {

              if (error) {
                console.error("Error sending location update:", error);
              } else {
                console.log("Location update acknowledged:", message);
              }
            });
          // }
        // });
      });
    } catch (error) {
      console.log(error);
    }
  });
};
