"use strict";

const { SuccessResponse } = require("../core/success.response");
const UserService = require("../services/user.service");

class UserController {
  // admin
  getAllUser = async (req, res) => {
    new SuccessResponse({
      message: "Get all users successfully",
      metadata: await UserService.getAllUser(),
    }).send(res);
  };
  getUserDetailInfor = async (req, res) => {
    new SuccessResponse({
      message: "successfully",
      metadata: await UserService.getUserDetailInfor(req.params),
    }).send(res);
  };
  // user
  getProfile = async (req, res) => {
    new SuccessResponse({
      message: "Get profile successfully",
      metadata: await UserService.getProfile(req.params),
    }).send(res);
  };
  getFriendAndFollow = async (req, res) => {
    new SuccessResponse({
      message: "Get friends & follow successfully",
      metadata: await UserService.getUserFollow(req.params),
    }).send(res);
  };
  getFriends = async (req, res) => {
    new SuccessResponse({
      message: "",
      metadata: await UserService.getFriends(),
    }).send(res);
  };
  updateUser = async (req, res) => {
    new SuccessResponse({
      message: "User updated",
      metadata: await UserService.updateUser({
        userId: req.user.userId,
        payload: req.body,
      }),
    }).send(res);
  }
}

module.exports = new UserController();
