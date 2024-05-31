"use strict";

const { SuccessResponse } = require("../core/success.response");
const FriendService = require("../services/friend.service");

class FriendController {
  sendFriendRequest = async (req, res) => {
    new SuccessResponse({
      message: "Sent friend request successfully",
      metadata: await FriendService.sendFriendRequest({
        senderId: req.user.userId,
        receiveId: req.body.targetId,
      }),
    }).send(res);
  };
  cancelFriendRequest = async (req, res) => {
    new SuccessResponse({
      message: "Cancel friend request successfully",
      metadata: await FriendService.rejectFriendRequest({
        receiveId: req.user.targetId,
        senderId: req.body.userId,
      }),
    }).send(res);
  };
  acceptFriendRequest = async (req, res) => {
    new SuccessResponse({
      message: "Accept request successfully",
      metadata: await FriendService.acceptFriendRequest({
        receiveId: req.user.userId,
        senderId: req.body.targetId,
      }),
    }).send(res);
  };
  rejectFriendRequest = async (req, res) => {
    new SuccessResponse({
      message: "Reject request successfully",
      metadata: await FriendService.rejectFriendRequest({
        receiveId: req.user.userId,
        senderId: req.body.targetId,
      }),
    }).send(res);
  };
  removeFriend = async (req, res) => {
    new SuccessResponse({
      message: "Remove friend successfully",
      metadata: await FriendService.removeFriend({
        userId1: req.user.userId,
        userId2: req.body.targetId,
      }),
    }).send(res);
  };
  getAllFriendsByUserId = async (req, res) => {
    new SuccessResponse({
      message: "Get all friend successfully",
      metadata: await FriendService.getAllFriendsByUserId(req.params),
    }).send(res);
  };
  getAllFriendRequestsByUserId = async (req, res) => {
    new SuccessResponse({
      message: "Get all friend request successfully",
      metadata: await FriendService.getAllFriendRequestsByUserId(req.params),
    }).send(res);
  };
  getAllFriendRequestedByUserId = async (req, res) => {
    new SuccessResponse({
      message: "Get all friend requested successfully",
      metadata: await FriendService.getAllFriendRequestedByUserId({
        userId: req.user.userId,
      }),
    }).send(res);
  }
  getNonFriends = async (req, res) => {
    new SuccessResponse({
      message: "Get all non friend request successfully",
      metadata: await FriendService.getNonFriends(req.params),
    }).send(res);
  }
  deleteFriendRequest = async (req, res) => {
    new SuccessResponse({
      message: "Delete friend request successfully",
      metadata: await FriendService.deleteFriendRequestById(req.params),
    }).send(res);
  }
}

module.exports = new FriendController();
