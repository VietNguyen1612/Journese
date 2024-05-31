"use strict";

const { BadRequestError } = require("../core/error.response");
const Friend = require("../models/friend.model");
const { User } = require("../models/user.model");
const { GroupChat } = require("../models/groupchat.model");
const GroupChatService = require("../services/groupchat.service")
class FriendService {
  static async sendFriendRequest({ senderId, receiveId }) {
    const sender = await User.findById(senderId);
    const receive = await User.findById(receiveId);
    if (!sender || !receive) {
      throw new BadRequestError("Error please check user");
    }
    const friendExisted = await Friend.findOne({
      receiveId,
      senderId,
    });
    if (friendExisted) {
      throw new BadRequestError("Already requested");
    }
    return await Friend.create({
      senderId,
      receiveId,
      status: "REQUESTED",
    });
  }
  static async acceptFriendRequest({ receiveId, senderId }) {
    const receive = await User.findById(receiveId);
    const sender = await User.findById(senderId);
    if (!sender || !receive) {
      throw new BadRequestError("Error please check user");
    }
    const friend = await Friend.findOneAndUpdate(
      {
        senderId,
        receiveId,
        status: { $eq: "REQUESTED" },
      },
      {
        status: "FRIEND",
      },
      { new: true }
    );
    await User.findByIdAndUpdate(friend.senderId, {
      $set: { "attributes.friend": receiveId },
    });
    await User.findByIdAndUpdate(receiveId, {
      $set: { "attributes.friend": friend.senderId },
    });
    const chat = await GroupChatService.addGroupChat({ isGroupGroupChat: false, participants: [senderId, receiveId] })
    return friend;
  }
  static async rejectFriendRequest({ receiveId, senderId }) {
    const receive = await User.findById(receiveId);
    const sender = await User.findById(senderId);
    if (!sender || !receive) {
      throw new BadRequestError("Error please check user");
    }

    const friend = await Friend.findOneAndDelete(
      {
        receiveId,
        senderId,
        status: { $eq: "REQUESTED" },
      },
      {
        new: true,
      }
    );
    if (!friend) {
      throw new BadRequestError("Not found");
    }
    return friend;
  }
  static async removeFriend({ userId1, userId2 }) {
    const result = await Friend.findOneAndDelete({
      $or: [
        { senderId: userId1, receiveId: userId2, status: "FRIEND" },
        { senderId: userId2, receiveId: userId1, status: "FRIEND" },
      ],
    });

    if (!result) {
      throw new Error("Friendship not found");
    }

    await User.findByIdAndUpdate(userId1, {
      $pull: { "attributes.friend": userId2 },
    });
    await User.findByIdAndUpdate(userId2, {
      $pull: { "attributes.friend": userId1 },
    });

    return result;
  }

  static async getAllFriendsByUserId({ userId }) {
    const friends = await Friend.find({
      $or: [
        { senderId: userId, status: 'FRIEND' },
        { receiveId: userId, status: 'FRIEND' }
      ]
    }).populate('senderId receiveId', 'firstName lastName avatarUrl');

    return friends.map(friend => friend.senderId._id.toString() === userId.toString() ? friend.receiveId : friend.senderId);
  }

  static async getAllFriendRequestedByUserId({ userId }) {
    const friends = await Friend.find({
      senderId: userId,
      status: 'REQUESTED'
    }).populate('receiveId', '_id firstName lastName avatarUrl');
    return friends
  }

  static async getAllFriendRequestsByUserId({ userId }) {
    const friends = await Friend.find({
      receiveId: userId,
      status: 'REQUESTED'
    }).populate('senderId', '_id firstName lastName avatarUrl');

    return friends
  }
  static async getNonFriends({ userId }) {
    // Get all friend relationships of the user with 'friend' or 'requested' status
    const friends = await Friend.find({
      $or: [{ senderId: userId }, { receiveId: userId }]
    });


    // Extract all friend Ids
    const friendIds = friends.map(doc =>
      doc.senderId.toString() === userId.toString() ? doc.receiveId : doc.senderId
    );

    // Add the userId to the array of friendIds
    friendIds.push(userId);

    // Get all users that are not in the friend list
    const nonFriends = await User.find({
      _id: { $nin: friendIds },
      role: 'user'
    });

    return nonFriends;
  }

  static async deleteFriendRequestById({ id }) {

    const result = await Friend.deleteOne({ _id: id });
    return result
  };
}

module.exports = FriendService;
