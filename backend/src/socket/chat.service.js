"use strict";

const { GroupChat } = require("../models/groupchat.model");

/**
 * @param {import('socket.io').Server} io
 */
module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("connected to socket")
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });
    socket.on("joinRoom", async (roomId) => {
      const room = await GroupChat.findById(roomId);
      console.log(room);
      try {
        socket.join(roomId); // Join the specified room
        console.log(`User joined room ${roomId}`);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("sendMessage", (data) => {
      let group = data.groupChatId
      group.participants.forEach((participant) => {
        if (participant.id == data.senderId.id) return
        socket.in(participant.id).emit("receiveMessage", data)
      })
    });

    socket.on("newGroupChat", (groupChat) => {
      groupChat.participants.forEach((participant) => {
        socket.in(participant.id).emit("newGroupChat", groupChat)
      })
    });

    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });
};
