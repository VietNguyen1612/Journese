"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const ConfirmService = require("../services/confirm.service");

class ConfirmController {
  createConfirmTicket = async (req, res) => {
    new CREATED({
      message: "added successfully",
      metadata: await ConfirmService.createConfirmTicket({
        user: req.user.userId,
        ...req.body,
      }),
    }).send(res);
  };
  getAll = async (req, res) => {
    new SuccessResponse({
      message: "",
      metadata: await ConfirmService.getAll(),
    }).send(res);
  };
  getDetail = async (req, res) => {
    new SuccessResponse({
      message: "",
      metadata: await ConfirmService.getDetail(req.params),
    }).send(res);
  };
  approvedTicket = async (req, res) => {
    new SuccessResponse({
      message: "",
      metadata: await ConfirmService.approvedConfirmTicket(req.body),
    }).send(res);
  };
  rejectTicket = async (req, res) => {
    new SuccessResponse({
      message: "",
      metadata: await ConfirmService.rejectConfirmTicket(req.body),
    }).send(res);
  };
}

module.exports = new ConfirmController();
