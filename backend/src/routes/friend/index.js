"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const FriendController = require("../../controllers/friend.controller");
const { authentication } = require("../../auth");

const router = express.Router();
router.get("/:userId", asyncHandler(FriendController.getAllFriendsByUserId));
router.get("/nonfriend/:userId", asyncHandler(FriendController.getNonFriends));
router.get("/request/:userId", asyncHandler(FriendController.getAllFriendRequestsByUserId));
router.get("/delete/:id", asyncHandler(FriendController.deleteFriendRequest));
router.use(authentication);
router.post("/accept", asyncHandler(FriendController.acceptFriendRequest));
router.post("/requested", asyncHandler(FriendController.getAllFriendRequestedByUserId));
router.post("/send", asyncHandler(FriendController.sendFriendRequest));
router.post("/reject", asyncHandler(FriendController.rejectFriendRequest));
router.post("/remove", asyncHandler(FriendController.removeFriend));

module.exports = router;
