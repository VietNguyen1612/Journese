"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const NotificationService = require("../services/notification.service");

class NotificationController {
    upsertUserDeviceMapping = async (req, res) => {
        new SuccessResponse({
            message: "Upsert mapping successfully",
            metadata: await NotificationService.upsertUserDeviceMapping(req.body),
        }).send(res);
    };
    removeUserId = async (req, res) => {
        new SuccessResponse({
            message: "remove user from mapping successfully",
            metadata: await NotificationService.removeUserId(req.body),
        }).send(res);
    };
    getAllNotifications = async (req, res) => {
        new SuccessResponse({
            message: "get all notifications successfully",
            metadata: await NotificationService.getAllNotifications(req.params),
        }).send(res);
    };
}

module.exports = new NotificationController();
