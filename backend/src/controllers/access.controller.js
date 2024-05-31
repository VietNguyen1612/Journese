"use strict";

const { SuccessResponse, CREATED } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  sendOTP = async (req, res) => {
    new SuccessResponse({
      message: "OTP sent successfully",
      metadata: await AccessService.sendOTP(req.body),
    }).send(res);
  };
  signUp = async (req, res) => {
    new CREATED({
      message: "Sign Up successfully",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
  signIn = async (req, res) => {
    new SuccessResponse({
      message: "Sign In successfully",
      metadata: await AccessService.signIn(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
