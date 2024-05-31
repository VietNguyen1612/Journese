"use strict";
const express = require("express");
const NotificationController = require("../../controllers/notification.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth");
const router = express.Router();

router.get("/:userId", asyncHandler(NotificationController.getAllNotifications));
router.post("/mapping/add", asyncHandler(NotificationController.upsertUserDeviceMapping));
router.patch("/mapping/remove", asyncHandler(NotificationController.removeUserId));
module.exports = router;
