const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const GroupChatController = require("../../controllers/groupchat.controller");
const { authentication } = require("../../auth");

const router = express.Router();

router.post("/", authentication, asyncHandler(GroupChatController.createGroupChat));
router.post("/remove", authentication, asyncHandler(GroupChatController.removeUserFromGroupChat));
router.post("/add", authentication, asyncHandler(GroupChatController.addUserToGroupChat));
router.get("/", authentication, asyncHandler(GroupChatController.getAllGroupChatByUserId));
router.get("/:groupId", asyncHandler(GroupChatController.getAllParticipants))
module.exports = router